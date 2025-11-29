import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePagination } from "../../_customHook";
import { store, type AppDispatch, type RootState } from "../../store/store";
import FilterProduct from "../filterProduct/filterProduct";
import MiniProductDetails from "../miniProductDetails/miniProductDetails";
import Sort from "../sorting/sorting";
import './productList.css';
import { fetchProducts, type fetchProductsArg } from './store/hook';
import type { initialStateType } from "./store/slice";
import { imagesBlobURL as imagesBlobURLAction } from "./store/slice";

const limit = 20

export function ProductList() {
    const useAppDispatch = useDispatch<AppDispatch>()
    const intersectionObserverRef = useRef<IntersectionObserver>(null);

    const productList = useSelector<RootState>(state => state.productList.data) as initialStateType["data"];
    const filter = useSelector<RootState>(state => state.productList.filter) as initialStateType["filter"];
    const sortBy = useSelector<RootState>(state => state.productList.sortBy) as initialStateType["sortBy"];
    // const imagesBlobURL = useSelector<RootState>(state => state.productList.imagesBlobURL) as initialStateType["imagesBlobURL"];
    const { paginationConfig, updatePaginationConfig } = usePagination(limit, productList.total)

    const callback = useCallback(async (entries: IntersectionObserverEntry[], _: IntersectionObserver) => {
        const imagesBlobURL = store.getState().productList.imagesBlobURL;
        for (let entry of entries) {
            const { isIntersecting, target } = entry;
            const imageURL = (target as HTMLImageElement).getAttribute("data-url") as any;
            if (!imagesBlobURL[imageURL]?.isLoading && !imagesBlobURL[imageURL]?.URL && isIntersecting) {
                useAppDispatch(imagesBlobURLAction({ imageURL, isLoading: true }));
                const res = await fetch(imageURL);
                const blobURL = URL.createObjectURL(await res.blob());
                useAppDispatch(imagesBlobURLAction({ imageURL, isLoading: false, blobURL: blobURL }));
                (target as HTMLImageElement).src = blobURL
            } else if (imagesBlobURL[imageURL]?.URL && isIntersecting) {
                (target as HTMLImageElement).src = imagesBlobURL[imageURL].URL
            }
        }
    }, [])

    useEffect(() => {
        const intersectionObserver = new IntersectionObserver(callback, { threshold: 0.1 });
        intersectionObserverRef.current = intersectionObserver;

        return () => {
            intersectionObserverRef.current?.disconnect();
        }
    }, [JSON.stringify(productList.data)])

    useEffect(() => {
        updatePaginationConfig(paginationConfig.offset, productList.total)
    }, [productList.total])

    //call fetch API when limit and offset changes
    useEffect(() => {
        const controller = new AbortController();
        const payload: fetchProductsArg = {
            limit,
            offset: paginationConfig.offset,
            attributeName: "id,title,category,discountPercentage,rating,thumbnail,price"
        }
        useAppDispatch(fetchProducts(payload, { signal: controller.signal }));

        return () => {
            controller.abort()
        };
    }, [paginationConfig.offset])

    const getTransformmedResult = useCallback(() => {
        //Filter the product first
        const filteredProduct = productList.data
            .filter((product) => {
                const { rating, category } = product;
                if (rating >= filter.rating && !filter.category?.length) {
                    return true
                }
                else if (rating >= filter.rating && filter.category?.length && filter.category.indexOf(category) !== -1) {
                    return true;
                }
                return false;
            });

        //Sort the product first
        filteredProduct.sort((a, b) => {
            if (sortBy === "ASCENDING") {
                return a.price - b.price
            }
            return b.price - a.price
        })
        return filteredProduct;
    }, [productList, filter, sortBy]);

    const handleOnScrollEvent = (ev: any) => {
        const { scrollTop, clientHeight, scrollHeight } = (ev.target as any)
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            updatePaginationConfig(paginationConfig.offset + limit, productList.total)
        }
    }

    return (
        <div id="container">
            <div id="action">
                <Sort />
                <FilterProduct />
            </div>
            <div id="productList" onScroll={ev => handleOnScrollEvent(ev)}>
                {
                    getTransformmedResult().map((product, i) => {
                        const { title, price, discountPercentage, rating, thumbnail } = product
                        return (
                            <div className="product" key={i}>
                                <MiniProductDetails observer={intersectionObserverRef.current} imgageURL={thumbnail} rating={rating} />
                                <div className="title" title={title}>{title}</div>
                                <div className="priceDetails">
                                    <span>Rs.{price}</span>
                                    <span>({discountPercentage}% OFF)</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}