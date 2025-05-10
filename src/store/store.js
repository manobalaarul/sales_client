import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import categoryReducer from "./categorySlice";
import profileReducer from "./profileSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
    profile: profileReducer,
  },
});
