import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart, updateCartItem } from "../slice/cartSlice";

const UpdateItemModal = ({ setShowOrderModal, item, type }) => {
  const [quantity, setQuantityState] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const currentCustomer = useSelector(
    (state) => state.selection.selectedCustomer
  );
  const costPrice = useSelector((state) => state.selection.costPrice);
  const totalAvailable = useSelector((state) => state.selection.totalAvailable);

  useEffect(()=>{
    if(type === "Update"){
        setQuantityState(item.quantity)
        setSellPrice(item.quantity)
    }
  }, [])
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

    // Create cart item object
    const cartItem = {
      product_id: item.product_id,
      product_name: item.product_name,
      customer_name: currentCustomer.customer_name,
      quantity,
      cost_price: costPrice,
      selling_price: sellPrice,
      total_cost: costPrice * quantity,
      total_selling: sellPrice * quantity,
    };

    if (type === "Save") {
      if (cartItems.find((order) => order.product_id === cartItem.product_id)) {
        toast.error("Product already exists in cart");
        return;
      }
      dispatch(addToCart({ newOrder: cartItem }));
    }else{
        dispatch(updateCartItem(cartItem))
    }

    // Show success toast
    toast.success(
      `${item.product_name} ${type}d to cart with quantity ${quantity} and selling price ${sellPrice}`
    );

    // Reset UI state
    setShowOrderModal(false);
    setQuantityState(0);
    setSellPrice(0);
  };

  const handleQuantityChange = (e) => {
    const currentQuantity = Number(e.target.value);
    if (currentQuantity > totalAvailable) {
      toast.error("Quantity exceeds available stock.");
      setQuantityState(totalAvailable);
    } else if (currentQuantity < 0) {
      setQuantityState(0);
    } else {
      setQuantityState(currentQuantity);
    }
  };

  const handleSellPriceChange = (e) => {
    setSellPrice(Number(e.target.value));
  };
  return (
    <div className="my-4 p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-semibold">Available: {totalAvailable}</h3>
      <h3 className="text-lg font-semibold">Enter Quantity:</h3>
      <input
        type="number"
        value={quantity}
        onChange={handleQuantityChange}
        className="input input-bordered w-full my-2"
        placeholder="Enter quantity"
      />
      <div className="my-4 p-4 border border-gray-300 rounded-md">
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
  );
};

export default UpdateItemModal;
