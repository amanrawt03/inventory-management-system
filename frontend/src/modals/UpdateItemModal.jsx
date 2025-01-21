import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { X, ShoppingCart, DollarSign, Package, User } from "lucide-react";
import { addToCart, updateCartItem } from "../slice/cartSlice";
import { clearItem } from "../slice/selectionSlice";
import { selectCartItemsByType } from "../slice/cartSlice";
import { useInventoryStock } from "../hooks/useInventoryStock";
import { MdCurrencyRupee } from "react-icons/md";
const UpdateItemModal = ({ setShowOrderModal, item, type }) => {
  const [quantity, setQuantityState] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);

  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItemsByType("sell"));
  const currentCustomer = useSelector((state) => state.selection.selectedCustomer);

  const costPrice = type === "Update" && item
    ? item.cost_price
    : useSelector((state) => state.selection.costPrice);

  const { realTimeStock, connectionStatus } = useInventoryStock(item.product_id);

  const totalAvailable = type === "Update" && item
    ? item.total_available
    : connectionStatus === "connecting"
    ? "Loading..."
    : connectionStatus === "failed"
    ? "Unavailable"
    : realTimeStock ?? 0;

  useEffect(() => {
    if (type === "Update" && item) {
      setQuantityState(item.quantity);
      setSellPrice(item.selling_price);
    }
  }, [type, item]);

  const handleQuantityChange = (newQuantity) => {
    const currentQuantity = Math.min(Number(newQuantity), totalAvailable);
    if (currentQuantity < Number(newQuantity)) {
      toast.error("Quantity exceeds available stock.");
    }
    setQuantityState(Math.max(0, currentQuantity));
  };

  const handlePriceChange = (e) => {
    const newPrice = Number(e.target.value);
    setSellPrice(Math.max(0, newPrice));
  };

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
    if (quantity > totalAvailable) {
      toast.error("Quantity exceeds available stock.");
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
      profit: (sellPrice - costPrice) * quantity,
    };

    try {
      if (type === "Save") {
        const existingItem = cartItems.find(
          (order) => order.product_id === cartItem.product_id && order.type === "sell"
        );

        if (existingItem) {
          toast.error("Product already exists in cart");
          return;
        }

        dispatch(addToCart({ newOrder: cartItem, type: "sell" }));
        toast.success(`Added ${quantity} ${item.product_name} to cart`);
      } else {
        dispatch(updateCartItem({ updatedOrder: cartItem, type: "sell" }));
        toast.success(`Updated ${item.product_name} quantity to ${quantity}`);
      }

      dispatch(clearItem());
      setShowOrderModal(false);
    } catch (error) {
      toast.error("Error saving item to cart");
      console.error("Cart operation error:", error);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={() => setShowOrderModal(false)}
    >
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-900 hover:text-red-500 transition-colors"
          onClick={() => setShowOrderModal(false)}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <ShoppingCart className="w-6 h-6 text-gray-900" />
            {type} {item.product_name}
          </h2>
          <p className="text-sm text-gray-900 mt-1">Update Sale Item</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-900" />
              Available Stock
            </label>
            <div className="w-full px-3 py-2 border border-gray-800 rounded-lg bg-gray-50">
              {totalAvailable}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-900" />
              Customer
            </label>
            <div className="w-full px-3 py-2 border border-gray-800 rounded-lg bg-gray-50">
              {currentCustomer?.customer_name || "No customer selected"}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-900" />
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <MdCurrencyRupee className="w-4 h-4 text-green-900" />
              Cost Price
            </label>
            <div className="w-full px-3 py-2 border border-gray-800 rounded-lg bg-gray-50">
              {costPrice}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <MdCurrencyRupee className="w-4 h-4 text-green-900" />
              Selling Price
            </label>
            <input
              type="number"
              value={sellPrice}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              placeholder="Enter selling price"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              quantity <= 0 ||
              sellPrice <= 0 ||
              quantity > totalAvailable ||
              !currentCustomer ||
              connectionStatus === "failed"
            }
          >
            <ShoppingCart className="w-5 h-5" />
            {type} Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateItemModal;
