import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../store/store";
import { manageFavourite } from "../productList";
import { type RootState } from "../../store/store";


interface AddProductToFavouriteProp {
    productID: number,
}
function ManageFavouriteProduct({ productID }: AddProductToFavouriteProp) {
    const dispatch = useDispatch<AppDispatch>();
    //TODO: Fix any data type 
    const favouriteProductsID: any = useSelector<RootState>((state: RootState) => state.productList.favouriteProductsID)

    const updateFavouriteProduct = () => {
        dispatch(manageFavourite(productID))
    }

    return (
        <img onClick={() => updateFavouriteProduct()} src={favouriteProductsID.hasOwnProperty(productID) ? 'src/_assets/svg/suitHeart.svg' : 'src/_assets/svg/fillSuitHeart.svg'} />
    )

}

export default ManageFavouriteProduct