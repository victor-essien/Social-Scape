import { combineReducers } from "@reduxjs/toolkit";
import userSlice from './userSlice'
import postSlice from './postSlice'
import themeSlice from './theme'
import chatSlice from "./chatSlice";
const rootReducer = combineReducers({
    user: userSlice,
    posts: postSlice,
    theme: themeSlice,
    chat:  chatSlice
})

export { rootReducer };