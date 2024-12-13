import { createSlice } from "@reduxjs/toolkit";

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
      const { newOrder } = action.payload; // Destructure the new order
      const existingOrder = state.cartItems.find(
        (order) => order.product_id === newOrder.product_id
      );

      if (!existingOrder) {
        state.cartItems.push(newOrder);
        localStorage.setItem("cart", JSON.stringify(state.cartItems)); // Save updated cart to localStorage
      }
    },

    // Update existing cart item
    updateCartItem: (state, action) => {
      const updatedOrder = action.payload; // Payload contains the updated order details
      const index = state.cartItems.findIndex(
        (item) => item.product_id === updatedOrder.product_id
      );

      if (index !== -1) {
        state.cartItems[index] = { ...state.cartItems[index], ...updatedOrder };
        localStorage.setItem("cart", JSON.stringify(state.cartItems)); // Update localStorage
      } else {
        console.error("Item not found in the cart to update");
      }
    },
    removeCartItem: (state, action) => {
      const {orderId} = action.payload
      const filteredCart = state.cartItems.filter(item=>item.product_id !== orderId )
      state.cartItems = filteredCart
      localStorage.setItem("cart", JSON.stringify(state.cartItems)); 
    },

    // Clear the cart
    clearCart: (state) => {
      state.cartItems = []; // Reset cart array
      localStorage.removeItem("cart"); // Remove cart data from localStorage
    },
  },
});

// Export actions and reducer
export const { addToCart, updateCartItem, clearCart , removeCartItem} = cartSlice.actions;
export default cartSlice.reducer;
