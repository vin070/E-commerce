import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Slider from "react-slick"
import Modal from "../../_components/modal"
import { type AppDispatch, type RootState } from "../../store/store"
import { filter } from "../productList"
import './filterProduct.css'
import { Range } from "react-range";



const filterType = [
    { text: 'Category', value: 'CATEGORY' },
    { text: 'Rating', value: 'RATING' },
]

function FilterProduct() {
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [filterDetails, setFilterDetails] = useState<{
        category: { [key: string]: boolean };
        rating: number;
    }>({
        category: {},
        rating: 0
    })

    const [selectedFilter, setSelectedFilter] = useState<string>(filterType[0].value);
    const dispatch = useDispatch<AppDispatch>()
    const categories = useSelector<RootState>(state => state.productList.category) as string[];

    const closeModal = (showFilter: boolean) => {
        setShowFilter(showFilter)
    }

    const updateSelectedTypeFilter = (ev: any) => {
        setSelectedFilter((ev as any).target.getAttribute('data-value'))
    }

    const updateCategoryFilter = (category: string, isSelected: boolean) => {
        if (isSelected) {
            filterDetails.category[category] = true;
        } else {
            delete filterDetails.category[category]
        }
        setFilterDetails({ ...filterDetails })
    }

    const updateRatingFilter = (rating: number[]) => {
        setFilterDetails({ ...filterDetails, rating: rating[0] })
    }

    const handleSubmit = () => {
        dispatch(filter({ filter: { category: Object.keys(filterDetails.category), rating: filterDetails.rating } }))
        closeModal(false)
    }

    const CategoryUI = () => {
        return (
            <div id="categoryContainer">
                {
                    categories.map((category, i) => {
                        return (
                            <div className="category" key={i}>
                                <input checked={Boolean(filterDetails.category[category])} type="checkbox" id={i.toString()} onChange={(ev) => updateCategoryFilter(category, (ev.target as HTMLInputElement).checked)} />
                                <label htmlFor={i.toString()}>{category}</label>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const RatingUI = () => {
        return (
            <Range
                label="Select your value"
                min={0}
                max={window.config.maxRating}
                values={[filterDetails.rating]}
                onChange={(values) => updateRatingFilter(values)}
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: "6px",
                            width: "100%",
                            backgroundColor: "#ccc",
                        }}
                    >
                        {children}
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div
                        {...props}
                        key={props.key}
                        style={{
                            ...props.style,
                            height: "20px",
                            width: "20px",
                            backgroundColor: "#999",
                        }}
                    />
                )}
            />
        );
    };


    const FilterUI = () => {
        return (
            <div id="filterContainer">
                <div onClick={(ev) => updateSelectedTypeFilter(ev)}>
                    {
                        filterType.map(type => {
                            const { text, value } = type
                            return <div data-value={value} key={value} style={{ backgroundColor: selectedFilter === value ? 'gray' : "unset" }}>{text}</div>
                        })
                    }
                </div>
                <div>
                    {selectedFilter === "CATEGORY" && <CategoryUI />}
                    {selectedFilter === "RATING" && <RatingUI />}
                </div>
            </div>
        )
    }

    return (
        <>
            <button className="btn-success" onClick={() => closeModal(!showFilter)}>
                <img src="src/_assets/svg/funnel.svg" alt="Filter" />
                <span>Filter</span>
            </button>

            {showFilter && <Modal
                style={{ top: "56px", right: "40px", transform: "none", width: "300px", left: "unset" }}
                container={document.getElementById('portal-root')}
                heading="Filter product"
                cancelCallback={() => closeModal(false)}
                submitCallback={() => handleSubmit()}
            >
                <FilterUI />
            </Modal>}
        </>
    )
}

export default FilterProduct;