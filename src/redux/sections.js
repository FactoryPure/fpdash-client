import { createSlice } from "@reduxjs/toolkit"

export const sectionsSlice = createSlice({
    name: "sections",
    initialState: {
        product: "",
        description: "",
        checkmarks: [],
        plugs: [],
        features: [],
        specifications: { left: [], right: [] },
        packageContents: [],
        warranty: "",
        manuals: [],
        crossSells: []
    },
    reducers: {
        setSections: (state, action) => {
            state = {
                ...state,
                ...action.payload
            }
            return state
        }
    }
})

export const getSections = state => state.sections
export const { setSections } = sectionsSlice.actions
export default sectionsSlice.reducer