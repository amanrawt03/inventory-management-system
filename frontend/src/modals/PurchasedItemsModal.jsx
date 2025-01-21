import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { X, ShoppingCart, DollarSign, MapPin } from "lucide-react";
import { addToCart, updateCartItem } from "../slice/cartSlice";
import ItemsDropdown from "../components/ItemsDropdown";
import { fetchLocationsList } from "../utils/routes";
import { selectCartItemsByType } from "../slice/cartSlice";
import { clearItem } from "../slice/selectionSlice";
import { MdCurrencyRupee } from "react-icons/md";
const PurchasedItemsModal = ({ setShowOrderModal, item, type }) => {
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [locations, setLocations] = useState([]);
  const dispatch = useDispatch();
  
  const selectedSupplier = useSelector(state => state.selection.selectedSupplier);
  const selectedLocation = useSelector(
    (state) => state.selection.selectedLocation
  );
  
  const totalAvailable = type === "Update" ? item.total_available : 0;
  const cartItems = useSelector(selectCartItemsByType("purchase"));

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(fetchLocationsList,{withCredentials:true});
        setLocations(response.data.locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    };

    fetchItems();

    // If updating, prefill the fields
    if (type === "Update" && item) {
      setQuantity(item.quantity);
      setPrice(item.cost_price);
    }
  }, [type, item]);

  const handlePriceChange = (e) => {
    setPrice(Number(e.target.value));
  };

  const handleQuantityChange = (e) => {
    const enteredQuantity = Number(e.target.value);
    if (type === "Update" && enteredQuantity > totalAvailable) {
      toast.error("Quantity exceeds available stock.");
      setQuantity(totalAvailable);
    } else {
      setQuantity(Math.max(0, enteredQuantity));
    }
  };

  const handleSave = () => {
    if (!price || price <= 0) {
      toast.error("Please enter a valid cost price.");
      return;
    }

    if (!quantity || quantity <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    if (!selectedLocation) {
      toast.error("Please select a location.");
      return;
    }

    const newItem = {
      product_id: item.product_id,
      product_name: item.product_name,
      supplier_id: selectedSupplier.supplier_id,
      supplier_name:selectedSupplier.supplier_name,
      cost_price: price,
      quantity,
      total_cost: price * quantity,
      location: selectedLocation.location_name,
      location_id: selectedLocation.location_id
    };

    if (type === "Save") {
      if (
        cartItems.find(
          (order) =>
            order.product_id === newItem.product_id && order.type === "purchase" && order.location === newItem.location
        )
      ) {
        toast.error("Product already exists in cart with same location")
      } else {
        dispatch(addToCart({ newOrder: newItem, type: "purchase" }));
        toast.success(`${item.product_name} added to cart successfully!`);
      }
    } else {
      dispatch(updateCartItem({ updatedOrder: newItem, type: "purchase" }));
      toast.success(`${item.product_name} updated successfully!`);
    }
    
    dispatch(clearItem());
    setShowOrderModal(false);
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
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-900 hover:text-red-500 transition-colors"
          onClick={() => setShowOrderModal(false)}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <ShoppingCart className="w-6 h-6 text-gray-900" />
            {type} {item.product_name}
          </h2>
          <p className="text-sm text-gray-900 mt-1">Manage Inventory Item</p>
        </div>

        {/* Modal Content */}
        <div className="space-y-4">
          {/* Cost Price Input */}
          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <MdCurrencyRupee className="w-4 h-4 text-green-900" />
              Cost Price
            </label>
            <input
              type="number"
              value={price}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              placeholder="Enter cost price"
            />
          </div>

          {/* Quantity Input */}
          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-900" />
              Quantity
              {type === "Update" && (
                <span className="ml-2 text-xs text-gray-900">
                  (Available: {totalAvailable})
                </span>
              )}
            </label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full px-3 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              placeholder="Enter quantity"
            />
          </div>

          {/* Location Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-900" />
              Location
            </label>
            <ItemsDropdown type="Location" items={locations} />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              quantity <= 0 ||
              price <= 0 ||
              (type === "Update" && quantity > totalAvailable)
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

export default PurchasedItemsModal;