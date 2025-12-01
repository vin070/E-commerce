import { configureStore } from "@reduxjs/toolkit";
import { productListStateName, productListReducer } from "../features/productList/store/slice";
import { useSelector, type TypedUseSelectorHook } from "react-redux";

export const store = configureStore({
    reducer: {
        [productListStateName]: productListReducer
    },
    middleware: (getDefault) => getDefault()
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;