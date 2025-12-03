import { useDispatch } from "react-redux";
import Icon from "../../_components/icon/icon";
import { FillSuitHeartIcon, SuitHeartIcon } from '../../_svg';
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
        <Icon onClick={() => updateFavouriteProduct()} src={favouriteProductsID.hasOwnProperty(productID) ? SuitHeartIcon : FillSuitHeartIcon} />
    )

}

export default ManageFavouriteProduct