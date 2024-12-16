import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart, updateCartItem } from "../slice/cartSlice";
import { clearItem } from "../slice/selectionSlice";
import { selectCartItemsByType } from "../slice/cartSlice";

const UpdateItemModal = ({ setShowOrderModal, item, type }) => {
  const [quantity, setQuantityState] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);

  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItemsByType("sell"));
  const currentCustomer = useSelector(
    (state) => state.selection.selectedCustomer
  );

  // Conditionally determine costPrice and totalAvailable
  const costPrice =
    type === "Update" && item
      ? item.cost_price
      : useSelector((state) => state.selection.costPrice);
  const totalAvailable =
    type === "Update" && item
      ? item.total_available
      : useSelector((state) => state.selection.totalAvailable);

  useEffect(() => {
    if (type === "Update" && item) {
      setQuantityState(item.quantity);
      setSellPrice(item.selling_price);
    }
  }, [type, item]);

  const handleSave = () => {
    if (!item) {
      toast.error("Please select an item first");
      return;
    }
    if (!currentCustomer) {
      toast.error("Please select a customer first");
      return;
    }

    if (quantity <= 0) {
      toast.error("Please enter a valid quantity greater than 0.");
      return;
    }

    if (sellPrice <= 0) {
      toast.error("Please enter a valid selling price.");
      return;
    }

    const cartItem = {
      product_id: item.product_id,
      product_name: item.product_name,
      customer_name: currentCustomer.customer_name,
      customer_id: currentCustomer.customer_id,
      quantity,
      cost_price: costPrice,
      selling_price: sellPrice,
      total_cost: costPrice * quantity,
      total_selling: sellPrice * quantity,
      total_available: totalAvailable,
    };
    if (type === "Save") {
      if (
        cartItems.find(
          (order) =>
            order.product_id === cartItem.product_id && order.type === "sell"
        )
      ) {
        toast.error("Product already exists in cart");
      } else {
        dispatch(addToCart({ newOrder: cartItem, type: "sell" }));
        toast.success(
          `${item.product_name} ${type}d successfully with quantity ${quantity} and selling price ${sellPrice}`
        );
      }
    } else {
      dispatch(updateCartItem({ updatedOrder: cartItem, type: "sell" }));
    }

    dispatch(clearItem());
    setShowOrderModal(false);
  };

  const handleQuantityChange = (e) => {
    const currentQuantity = Number(e.target.value);
    if (currentQuantity > totalAvailable) {
      toast.error("Quantity exceeds available stock.");
      setQuantityState(totalAvailable);
    } else {
      setQuantityState(Math.max(0, currentQuantity));
    }
  };

  const handleSellPriceChange = (e) => {
    setSellPrice(Number(e.target.value));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={() => setShowOrderModal(false)}
        >
          &times;
        </button>
        <h1 className="text-2xl font-bold text-center mb-4">{type} Item</h1>
        <div className="my-4 p-4 border border-gray-300 rounded-md">
          <h3 className="text-lg font-semibold">
            Available Stock: {totalAvailable}
          </h3>
          <h3 className="text-lg font-semibold">Enter Quantity:</h3>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="input input-bordered w-full my-2"
            placeholder="Enter quantity"
          />
          <h3 className="text-lg font-semibold">Cost Price: {costPrice}</h3>
          <h3 className="text-lg font-semibold">Enter Selling Price:</h3>
          <input
            type="number"
            value={sellPrice}
            onChange={handleSellPriceChange}
            className="input input-bordered w-full my-2"
            placeholder="Enter selling price"
          />
        </div>
        <button
          onClick={handleSave}
          className="btn btn-primary w-full"
          disabled={
            quantity <= 0 ||
            sellPrice <= 0 ||
            quantity > totalAvailable ||
            sellPrice < costPrice
          }
        >
          {type}
        </button>
      </div>
    </div>
  );
};

export default UpdateItemModal;
