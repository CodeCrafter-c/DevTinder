import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./userSlice"

export const appStore=configureStore({
    reducer:{
        user:userReducer
    }
})
