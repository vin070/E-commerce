import { configureStore } from "@reduxjs/toolkit";
import { productListStateName, productListReducer } from "../features/productList/store/slice";

export const store = configureStore({
    reducer: {
        [productListStateName]: productListReducer
    },
    middleware: (getDefault) => getDefault()
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;