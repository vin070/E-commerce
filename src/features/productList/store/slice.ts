import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchProducts, type Product } from "./hook";

export interface initialStateType {
    filter: {
        category: string[];
        rating: number;
    },
    sortBy: string,
    loading: boolean,
    data: { total: number, data: Product[] },
    error: string,
    favouriteProductsID: { [key: number]: boolean };
    category: string[],
    imagesBlobURL: {
        [key: string]: {
            isLoading: boolean,
            URL?: string
        }
    }
}

const initialState: initialStateType = {
    filter: {
        category: [],
        rating: 0
    },
    sortBy: "ASCENDING",
    loading: false,
    data: { total: 0, data: [] },
    error: "",
    favouriteProductsID: {},
    category: [],
    imagesBlobURL: {}
}

const slice = createSlice({
    name: "productList",
    initialState: initialState,
    reducers: {
        filter: (state, { payload }: PayloadAction<{ filter: initialStateType["filter"] }>) => {
            state.filter = payload.filter
        },
        sort: (state, { payload }: PayloadAction<string>) => {
            state.sortBy = payload
        },
        manageFavourite: (state, { payload }: PayloadAction<number>) => {
            if (state.favouriteProductsID.hasOwnProperty(payload)) {
                delete state.favouriteProductsID[payload]
            } else {
                state.favouriteProductsID[payload] = true
            }
            localStorage.setItem('favouriteProductsID', Object.keys(state.favouriteProductsID).join(','))
        },
        category: (state, { payload }: PayloadAction<string[]>) => {
            const uniqueCategory = new Set([...payload, ...state.category]);
            const updatedCategory = [];
            for (let key of uniqueCategory.keys()) {
                updatedCategory.push(key)
            }
            state.category = updatedCategory;
        },
        imagesBlobURL: (state, { payload }: PayloadAction<{ imageURL: string, isLoading: boolean, blobURL?: string }>) => {
            state.imagesBlobURL = {
                ...state.imagesBlobURL, [payload.imageURL]: {
                    isLoading: payload.isLoading,
                    URL: payload.blobURL
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.fulfilled, (state, { payload }) => {
            state.data = { total: payload.total, data: [...state.data.data, ...payload.products] }
            state.loading = false
            state.error = "";
        })
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true;
        })
    }
})

export const { filter, sort, manageFavourite, category, imagesBlobURL } = slice.actions;
export const productListReducer = slice.reducer;
export const productListStateName = slice.name;