import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// APIs for fetching details
import {
  fetchCategoriesApi,
  fetchItemsApi,
  fetchSuppliersApi,
  fetchLocationsApi,
} from "../utils/routes";

// Async thunks for fetching data
export const fetchCategories = createAsyncThunk(
  "data/fetchCategories",
  async () => {
    const response = await axios.get(fetchCategoriesApi);
    return response.data.categories;
  }
);

export const fetchItems = createAsyncThunk("data/fetchItems", async () => {
  const response = await axios.get(fetchItemsApi);
  return response.data.items;
});

export const fetchSuppliers = createAsyncThunk(
  "data/fetchSuppliers",
  async () => {
    const response = await axios.get(fetchSuppliersApi);
    return response.data.suppliers;
  }
);

export const fetchLocations = createAsyncThunk(
  "data/fetchLocations",
  async () => {
    const response = await axios.get(fetchLocationsApi);
    return response.data.locations;
  }
);

// Slice definition
const dataSlice = createSlice({
  name: "data",
  initialState: {
    categories: [],
    items: [],
    suppliers: [],
    locations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
