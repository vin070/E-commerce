import { useDispatch } from "react-redux";
import { useAppSelector, type AppDispatch, type RootState } from "../../store/store";
import { manageFavourite } from "../productList";


interface AddProductToFavouriteProp {
    productID: number,
}
function ManageFavouriteProduct({ productID }: AddProductToFavouriteProp) {
    const dispatch = useDispatch<AppDispatch>();
    const favouriteProductsID = useAppSelector((state: RootState) => state.productList.favouriteProductsID)

    const updateFavouriteProduct = () => {
        dispatch(manageFavourite(productID))
    }

    return (
        <img onClick={() => updateFavouriteProduct()} src={favouriteProductsID.hasOwnProperty(productID) ? 'assets/svg/suitHeart.svg' : 'assets/svg/fillSuitHeart.svg'} />
    )

}

export default ManageFavouriteProduct