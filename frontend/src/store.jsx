import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "./slice/dataSlice";
import selectionReducer from "./slice/selectionSlice"
import cartReducer from './slice/cartSlice'
const store = configureStore({
  reducer: {
    data: dataSlice,
    selection : selectionReducer,
    cart:cartReducer
  },
});

export default store;
