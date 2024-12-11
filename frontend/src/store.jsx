import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "./slice/dataSlice";
import selectionReducer from "./slice/selectionSlice"
const store = configureStore({
  reducer: {
    data: dataSlice,
    selection : selectionReducer,
  },
});

export default store;
