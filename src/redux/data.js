import { createSlice } from "@reduxjs/toolkit"

export const dataSlice = createSlice({
    name: "data",
    initialState: {
        products: [],
        productsMappedById: [],
        brands: [],
        brandsMappedById: [],
        collections: [],
        ending: [],
        all_messages: []
    },
    reducers: {
        setData: (state, action) => {
            return action.payload
        }
    }
})

export const getData = state => state.data
export const { setData } = dataSlice.actions
export default dataSlice.reducer