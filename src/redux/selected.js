import { createSlice } from "@reduxjs/toolkit";

const selectedSlice = createSlice({
    name: "selected",
    initialState: null,
    reducers: {
        setSelected: (state, action) => {
            return action.payload
        }
    }
})

export const getSelected = state => state.selected
export const { setSelected } = selectedSlice.actions
export default selectedSlice.reducer