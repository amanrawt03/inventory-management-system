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
  selectedCustomer: safeParse("selectedCustomer"),
  costPrice: safeParse("costPrice") || 0,
  totalAvailable: safeParse("totalAvailable") || 0,
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
    setCostPrice: (state, action) => {
      const costPrice = Number(action.payload);
      state.costPrice = costPrice;
      if (costPrice !== undefined) {
        localStorage.setItem("costPrice", JSON.stringify(costPrice));
      }
    },
    setTotalAvailable: (state, action) => {
      const totalAvailable = Number(action.payload);
      state.totalAvailable = totalAvailable;
      if (totalAvailable !== undefined) {
        localStorage.setItem("totalAvailable", JSON.stringify(totalAvailable));
      }
    },
    setSelectedSupplier: (state, action) => {
      const supplier = action.payload;
      state.selectedSupplier = supplier;
      if (supplier !== undefined) {
        localStorage.setItem("selectedSupplier", JSON.stringify(supplier));
      }
    },
    setSelectedCustomer: (state, action) => {
      const customer = action.payload;
      state.selectedCustomer = customer;
      if (customer !== undefined) {
        localStorage.setItem("selectedCustomer", JSON.stringify(customer));
      }
    },
    clearItem: (state) => {
      Object.assign(state, {
        selectedItem: null,
      });
      localStorage.removeItem("selectedItem");
    },
    clearCustomer: (state) => {
      Object.assign(state, {
        selectedCustomer: null,
      });
      localStorage.removeItem("selectedCustomer");
    },
    clearSupplier: (state) => {
      Object.assign(state, {
        selectedSupplier: null,
      });
      localStorage.removeItem("selectedSupplier");
    },
    clearLocation: (state) => {
      Object.assign(state, {
        selectedLocation: null,
      });
      localStorage.removeItem("selectedLocation");
    },
    clearCategory: (state) => {
      Object.assign(state, {
        selectedCategory: null,
      });
      localStorage.removeItem("selectedCategory");
    },
    resetState: (state) => {
      Object.assign(state, {
        selectedCategory: null,
        selectedLocation: null,
        selectedItem: null,
        quantity: 0,
        selectedSupplier: null,
        selectedCustomer: null,
        costPrice: 0,
      });
      localStorage.removeItem("selectedCategory");
      localStorage.removeItem("selectedLocation");
      localStorage.removeItem("selectedItem");
      localStorage.removeItem("quantity");
      localStorage.removeItem("selectedSupplier");
      localStorage.removeItem("selectedCustomer");
      localStorage.removeItem("costPrice");
      localStorage.removeItem("totalAvailable");
    },
  },
});

export const {
  setSelectedCategory,
  setSelectedLocation,
  setSelectedItem,
  setQuantity,  
  setCostPrice,
  setSelectedSupplier,
  setSelectedCustomer,
  setTotalAvailable,
  resetState,
  clearItem,
  clearCustomer,
  clearSupplier,
  clearLocation,
  clearCategory
} = selectionSlice.actions;

export default selectionSlice.reducer;
