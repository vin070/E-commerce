import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import usePagination from "../../_customHook/pagination";
import throttle from "../../_functions/throttle";
import { store, useAppSelector, type AppDispatch } from "../../store/store";
import FilterProduct from "../filterProduct/filterProduct";
import MiniProductDetails from "../miniProductDetails/miniProductDetails";
import Sort from "../sorting/sorting";
import './productList.css';
import { fetchProducts, type Product, type fetchProductsArg } from './store/hook';
import { imagesBlobURL as imagesBlobURLAction } from "./store/slice";

const limit = 20

export function ProductList() {
    const useAppDispatch = useDispatch<AppDispatch>()
    const intersectionObserverRef = useRef<IntersectionObserver>(null);

    const { data: productList, sortBy, filter, loading } = useAppSelector(state => state.productList);
    const { paginationConfig, updatePaginationConfig } = usePagination(limit, productList.total)
    const [transformmedProductList, setTransformmedProductList] = useState<Product[]>([]);
    const throttleFunctionRef = useRef<any>(null);
    const productListEleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        throttleFunctionRef.current = new (throttle as any)(productListEleRef.current, 'scroll', handleOnScrollEvent)
        return () => throttleFunctionRef?.current?.destroy();
    }, [JSON.stringify(paginationConfig)])

    useEffect(() => {
        if (!loading) {
            throttleFunctionRef?.current?.updateIsCallbackExecutingStatus(false)
        }
    }, [loading])

    const callback = useCallback(async (entries: IntersectionObserverEntry[], _: IntersectionObserver) => {
        const imagesBlobURL = store.getState().productList.imagesBlobURL;
        for (let entry of entries) {
            const { isIntersecting, target } = entry;
            const imageEle = target.querySelector('img');
            const imageURL = (imageEle as HTMLImageElement).getAttribute("data-url") as any;
            if (!imagesBlobURL[imageURL]?.isLoading && !imagesBlobURL[imageURL]?.URL && isIntersecting) {
                useAppDispatch(imagesBlobURLAction({ imageURL, isLoading: true }));
                const res = await fetch(imageURL);
                const blobURL = URL.createObjectURL(await res.blob());
                useAppDispatch(imagesBlobURLAction({ imageURL, isLoading: false, blobURL: blobURL }));
                (imageEle as HTMLImageElement).src = blobURL
            } else if (imagesBlobURL[imageURL]?.URL && isIntersecting) {
                (imageEle as HTMLImageElement).src = imagesBlobURL[imageURL].URL
            }
        }
    }, [])

    useEffect(() => {
        const intersectionObserver = new IntersectionObserver(callback, { threshold: 0.1 });
        intersectionObserverRef.current = intersectionObserver;
        const productsEle = document.querySelectorAll('.product')
        productsEle.forEach(productEle => intersectionObserverRef.current?.observe(productEle))

        return () => {
            productsEle.forEach(productEle => intersectionObserverRef.current?.unobserve(productEle))
            intersectionObserverRef.current?.disconnect();
        }
    }, [JSON.stringify(transformmedProductList)])

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

    useEffect(() => {
        //Filter the product first
        const categorySize = Object.keys(filter.category).length
        const filteredProduct = productList.data.filter((product) => {
            const { rating, category } = product;
            if (rating >= filter.rating && !categorySize) {
                return true
            }
            else if (rating >= filter.rating && categorySize && filter.category[category]) {
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
        setTransformmedProductList(filteredProduct);
    }, [JSON.stringify(productList.data), JSON.stringify(filter), sortBy]);

    const handleOnScrollEvent = (ev: any) => {
        const { scrollTop, clientHeight, scrollHeight } = (ev.target as any)
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            console.log(paginationConfig)
            updatePaginationConfig(paginationConfig.offset + limit)
        }
    }

    return (
        <div id="container">
            <div id="action">
                <Sort />
                <FilterProduct />
            </div>
            <div id="productList" ref={productListEleRef}>
                {
                    transformmedProductList.map((product, i) => {
                        const { title, price, discountPercentage, rating, thumbnail } = product
                        return (
                            <div className="product" key={i} >
                                <MiniProductDetails imgageURL={thumbnail} rating={rating} />
                                <div className="title" title={title}>{title}</div>
                                <div className="priceDetails">
                                    <div className="price">
                                        <span>Rs</span>
                                        <span>{price}</span>
                                    </div>

                                    <div className="discount">(
                                        <span>{discountPercentage}</span>
                                        <span>% OFF</span>
                                        )</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}