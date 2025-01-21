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
  currentUser: safeParse("currentUser"),
  selectedCategory: safeParse("selectedCategory"),
  selectedLocation: safeParse("selectedLocation"),
  selectedItem: safeParse("selectedItem"),
  quantity: safeParse("quantity") || 0,
  selectedSupplier: safeParse("selectedSupplier"),
  selectedCustomer: safeParse("selectedCustomer"),
  costPrice: safeParse("costPrice") || 0,
  totalAvailable: safeParse("totalAvailable") || 0,
  profile_image:safeParse("profile_image"),
  unreadNotifs:safeParse("unreadNotifs") || [],
};

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      const user = action.payload;
      state.currentUser = user;
      if (user !== undefined) {
        localStorage.setItem("currentUser", JSON.stringify(user));
      }
    },
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
    setProfileImage: (state, action) => {
      const img = action.payload;
      state.profile_image = img;
      if (img !== undefined) {
        localStorage.setItem("profile_image", JSON.stringify(img));
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
    setUnreadNotifs: (state, action) => {
      // Handle both array and single notification updates
      if (Array.isArray(action.payload)) {
        state.unreadNotifs = action.payload;
      } else if (action.payload) {
        state.unreadNotifs = [action.payload, ...state.unreadNotifs];
      }
      localStorage.setItem("unreadNotifs", JSON.stringify(state.unreadNotifs));
    },
    removeNotification: (state, action) => {
      state.unreadNotifs = state.unreadNotifs.filter(
        (notif) => notif.notification_id !== action.payload
      );
      localStorage.setItem("unreadNotifs", JSON.stringify(state.unreadNotifs));
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
        currentUser:null,
        selectedCategory: null,
        selectedLocation: null,
        selectedItem: null,
        quantity: 0,
        selectedSupplier: null,
        selectedCustomer: null,
        costPrice: 0,
        profile_image: null,
        unreadNotifs: []
      });
      localStorage.removeItem("currentUser");
      localStorage.removeItem("selectedCategory");
      localStorage.removeItem("selectedLocation");
      localStorage.removeItem("selectedItem");
      localStorage.removeItem("quantity");
      localStorage.removeItem("selectedSupplier");
      localStorage.removeItem("selectedCustomer");
      localStorage.removeItem("costPrice");
      localStorage.removeItem("totalAvailable");
      localStorage.removeItem("profile_image");
      localStorage.removeItem("unreadNotifs");
    },
  },
});

export const {
  setProfileImage,
  setCurrentUser,
  setSelectedCategory,
  setSelectedLocation,
  setSelectedItem,
  setQuantity,  
  setCostPrice,
  setSelectedSupplier,
  setSelectedCustomer,
  setTotalAvailable,
  setUnreadNotifs,
  removeNotification,
  resetState,
  clearItem,
  clearCustomer,
  clearSupplier,
  clearLocation,
  clearCategory
} = selectionSlice.actions;

export default selectionSlice.reducer;
