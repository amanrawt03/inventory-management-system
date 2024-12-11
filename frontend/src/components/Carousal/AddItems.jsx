import React, { useState, useEffect } from "react";
import ItemsDropdown from "../ItemsDropdown";
import { useSelector, useDispatch } from "react-redux";
import AddItemsModal from "../../modals/AddItemsModal";
import { addToExisitingItem } from "../../utils/routes";
import { toast } from "react-toastify";
import axios from "axios";
import { resetState } from "../../slice/selectionSlice";

const AddItems = ({ onTransactionComplete }) => {
  const dispatch = useDispatch();

  const items = useSelector((state) => state.data.items);
  const currentItem = useSelector((state) => state.selection.selectedItem);
  const currentLoc = useSelector((state) => state.selection.selectedLocation);

  // State for quantity
  const [quantity, setQuantity] = useState(0);
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const [active, setActive] = useState(true);

  // Handle saving the item with its quantity
  const handleSave = async () => {
    try {
      if (currentItem && currentLoc) {
        const location_id = currentLoc.location_id;
        const product_id = currentItem.product_id;

        const response = await axios.post(
          addToExisitingItem,
          { location_id, product_id, quantity },
          { withCredentials: true }
        );

        console.log(response.data); // Log server response
        toast.success("Item Added Successfully"); // Show user feedback
        // Reset the Redux store and notify parent
        dispatch(resetState());
        onTransactionComplete(); // Callback to reset the slide
      } else {
        alert("Please select both a location and an item.");
      }
    } catch (error) {
      console.error("Error saving item:", error.message);
      alert("Failed to save the item. Please try again.");
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  useEffect(() => {
    if (currentItem) {
      setShowQuantityInput(true); // Show quantity input when item is selected
      setActive(false); // Disable 'Create New Item' button
    } else {
      setShowQuantityInput(false); // Hide input when no item is selected
      setActive(true); // Enable 'Create New Item' button
    }
  }, [currentItem]);

  const handleNewItemSave = (newItem) => {
    console.log("New item saved:", newItem);
  };

  return (
    <div className="min-h-72 flex flex-col items-center justify-center bg-base-200">
      <div className="card shadow-lg w-96 bg-white p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Items</h1>

        {/* Dropdown for selecting items */}
        <ItemsDropdown key="addItems" type="Product" items={items} />

        {/* Conditional rendering of quantity input */}
        {showQuantityInput && currentItem && (
          <div className="my-4 p-4 border border-gray-300 rounded-md">
            <h3 className="text-lg font-semibold">
              Enter Quantity for {currentItem.product_name}
            </h3>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="input input-bordered w-full my-2"
              min="1"
            />
            <button
              onClick={handleSave}
              className="btn btn-primary w-full"
              disabled={quantity <= 0} // Disable button for invalid quantity
            >
              Save
            </button>
          </div>
        )}

        <div className="divider">OR</div>
        <button
          onClick={() => document.getElementById("add_item_modal").showModal()}
          disabled={!active} // Disable button when 'Add Items' is active
          className={`btn btn-primary ${
            !active ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Create New Item
        </button>

        {/* Modal for creating a new item */}
        <AddItemsModal addItem={handleNewItemSave} />
      </div>
    </div>
  );
};

export default AddItems;
