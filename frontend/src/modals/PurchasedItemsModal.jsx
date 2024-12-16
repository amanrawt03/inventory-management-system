import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart, updateCartItem } from "../slice/cartSlice"; // Adjust the path as per your slice structure.
import ItemsDropdown from "../components/ItemsDropdown";
import { fetchLocationsList } from "../utils/routes";
import { selectCartItemsByType } from "../slice/cartSlice";
import { clearItem, clearLocation } from "../slice/selectionSlice";
const PurchasedItemsModal = ({ setShowOrderModal, item, type }) => {
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [locations, setLocations] = useState([]);
  const dispatch = useDispatch();
  const selectedSupplier = useSelector(state=>state.selection.selectedSupplier)
  const selectedLocation = useSelector(
    (state) => state.selection.selectedLocation
  );
  const totalAvailable = type === "Update" ? item.total_available : 0;
  const cartItems = useSelector(selectCartItemsByType("purchase"));
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(fetchLocationsList);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={() => setShowOrderModal(false)}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-center mb-4">
          {type} {item.product_name} in Inventory
        </h2>
        <div className="my-4 p-4 border border-gray-300 rounded-md">
          <h3 className="text-lg font-semibold">Enter Cost Price:</h3>
          <input
            type="number"
            value={price}
            onChange={handlePriceChange}
            className="input input-bordered w-full my-2"
            placeholder="Enter cost price"
          />

          <h3 className="text-lg font-semibold">Enter Quantity:</h3>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="input input-bordered w-full my-2"
            placeholder="Enter quantity"
          />
            <ItemsDropdown type="Location" items={locations} />

          <button
            onClick={handleSave}
            className="btn btn-primary w-full mt-4"
            disabled={
              quantity <= 0 ||
              price <= 0 ||
              (type === "Update" && quantity > totalAvailable)
            }
          >
            {type}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasedItemsModal;
