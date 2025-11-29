import { createAsyncThunk } from "@reduxjs/toolkit";
import { category } from "./slice";

export interface fetchProductsArg {
    limit: number,
    offset: number,
    attributeName?: string
}

export interface productListRes {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface Product {
    id: number;
    title: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    thumbnail: string;
}


export const fetchProducts = createAsyncThunk(
    "products/fetch",
    async (payload: fetchProductsArg, thunkAPI) => {
        const { dispatch, signal } = thunkAPI;
        const { limit, offset, attributeName } = payload;
        try {
            let URL = `https://dummyjson.com/products?skip=${offset}&limit=${limit}`
            if (attributeName) {
                URL += `&select=${attributeName}`
            }
            const res = await fetch(URL, { signal });
            if (!res.ok) {
                return thunkAPI.rejectWithValue("Failed to fetch products");
            }
            const data: productListRes = await res.json();
            const newCategory = data.products.map((product) => product.category);
            dispatch(category(newCategory));
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue("Network error");
        }
    }
);