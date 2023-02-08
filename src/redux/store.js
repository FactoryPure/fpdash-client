import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./user"
import dataReducer from "./data"
import selectedReducer from "./selected"
import sectionsReducer from "./sections"

export default configureStore({
    reducer: {
        data: dataReducer,
        user: userReducer,
        selected: selectedReducer,
        sections: sectionsReducer,
    }
})