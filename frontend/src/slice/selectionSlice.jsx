import { createSlice } from "@reduxjs/toolkit";

const safeParse = (key) => {
  try {
    const value = localStorage.getItem(key);
    if (value === "undefined" || value === null) {
      return null;
    }
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn(`Error parsing ${key} from localStorage`, error);
    return null;
  }
};

const initialState = {
  selectedCategory: safeParse("selectedCategory"),
  selectedLocation: safeParse("selectedLocation"),
  selectedItem: safeParse("selectedItem"),
  quantity: safeParse("quantity") || 0,
  selectedSupplier: safeParse("selectedSupplier"),
};

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      const category = action.payload;
      state.selectedCategory = category;
      if (category !== undefined) {
        localStorage.setItem("selectedCategory", JSON.stringify(category));
      }
    },
    setSelectedLocation: (state, action) => {
      const location = action.payload;
      state.selectedLocation = location;
      if (location !== undefined) {
        localStorage.setItem("selectedLocation", JSON.stringify(location));
      }
    },
    setSelectedItem: (state, action) => {
      const item = action.payload;
      state.selectedItem = item;
      if (item !== undefined) {
        localStorage.setItem("selectedItem", JSON.stringify(item));
      }
    },
    setQuantity: (state, action) => {
      const quantity = action.payload;
      state.quantity = quantity;
      if (quantity !== undefined) {
        localStorage.setItem("quantity", JSON.stringify(quantity));
      }
    },
    setSelectedSupplier: (state, action) => {
      const supplier = action.payload;
      state.selectedSupplier = supplier;
      if (supplier !== undefined) {
        localStorage.setItem("selectedSupplier", JSON.stringify(supplier));
      }
    },
    resetState: (state) => {
      Object.assign(state, {
        selectedCategory: null,
        selectedLocation: null,
        selectedItem: null,
        quantity: 0,
        selectedSupplier: null,
      });
      localStorage.removeItem("selectedCategory");
      localStorage.removeItem("selectedLocation");
      localStorage.removeItem("selectedItem");
      localStorage.removeItem("quantity");
      localStorage.removeItem("selectedSupplier");
    },
  },
});

export const {
  setSelectedCategory,
  setSelectedLocation,
  setSelectedItem,
  setQuantity,
  setSelectedSupplier,
  resetState,
} = selectionSlice.actions;

export default selectionSlice.reducer;
