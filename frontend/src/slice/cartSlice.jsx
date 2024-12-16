import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
// Load cart from localStorage if available
const cartInLocalStorage = localStorage.getItem("cart");
const initialState = {
  cartItems: cartInLocalStorage ? JSON.parse(cartInLocalStorage) : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action) => {
      const { newOrder, type } = action.payload; // Destructure new order and type
    
      let existingOrder;
    
      if (type === "purchase") {
        // Check for existing order with matching product_id, type, and location
        existingOrder = state.cartItems.find(
          (order) =>
            order.product_id === newOrder.product_id &&
            order.type === type &&
            order.location === newOrder.location
        );
      } else if (type === "sell") {
        // Check for existing order with matching product_id and type only
        existingOrder = state.cartItems.find(
          (order) =>
            order.product_id === newOrder.product_id &&
            order.type === type
        );
      }
    
      if (!existingOrder) {
        // Add the new order if it doesn't already exist
        state.cartItems.push({ ...newOrder, type });
        localStorage.setItem("cart", JSON.stringify(state.cartItems)); // Save updated cart to localStorage
      } else {
        console.error("Product already exists in the cart");
      }
    },
    
    
    // Update existing cart item
      updateCartItem: (state, action) => {
      const { updatedOrder, type } = action.payload; // Include type
      const index = state.cartItems.findIndex(
        (item) =>
          item.product_id === updatedOrder.product_id && item.type === type
      );

      if (index !== -1) {
        state.cartItems[index] = { ...state.cartItems[index], ...updatedOrder };
        localStorage.setItem("cart", JSON.stringify(state.cartItems)); // Update localStorage
      } else {
        console.error("Item not found in the cart to update");
      }
    },

    // Remove item from cart
    removeCartItem: (state, action) => {
      const { orderId, type } = action.payload; // Include type
      state.cartItems = state.cartItems.filter(
        (item) => !(item.product_id === orderId && item.type === type)
      );
      localStorage.setItem("cart", JSON.stringify(state.cartItems)); // Update localStorage
    },

    // Clear the cart for a specific type
    clearCart: (state, action) => {
      const { type } = action.payload; 
      state.cartItems = state.cartItems.filter((item) => item.type !== type);
      localStorage.setItem("cart", JSON.stringify(state.cartItems)); // Update localStorage
    },
  },
});

export const selectCartItemsByType = (type) =>
  createSelector(
    (state) => state.cart.cartItems, // Input selector
    (cartItems) => cartItems.filter((item) => item.type === type) // Output selector
  );

// Export actions and reducer
export const { addToCart, updateCartItem, removeCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
