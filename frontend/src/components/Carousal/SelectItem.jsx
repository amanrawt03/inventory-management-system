import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ItemsDropdown from "../ItemsDropdown";
import { setQuantity } from "../../slice/selectionSlice"; // Import the setQuantity action

const SelectItem = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.data.items);
  const currentItem = useSelector((state) => state.selection.selectedItem);

  // State for quantity
  const [quantity, setQuantityState] = useState(0); // Renamed to avoid conflict
  const [showQuantityInput, setShowQuantityInput] = useState(false);

  // Handle saving the item with its quantity
  const handleSave = () => {
    if (!currentItem) {
      toast.error("Please select an item first");
      return;
    }

    if (quantity <= 0) {
      toast.error("Please enter a valid quantity greater than 0.");
      return;
    }

    // Dispatch quantity to the store
    dispatch(setQuantity(quantity)); // Dispatch the action to store the quantity

    // Show success toast
    toast.success(
      `${currentItem.product_name} selected with quantity ${quantity}`
    );

    // Reset UI state
    setShowQuantityInput(false);
    setQuantityState(0); // Reset quantity state after saving
  };

  const handleQuantityChange = (e) => {
    setQuantityState(Number(e.target.value));
  };

  useEffect(() => {
    if (currentItem) {
      setShowQuantityInput(true); // Show quantity input when item is selected
    } else {
      setShowQuantityInput(false); // Hide input when no item is selected
    }
  }, [currentItem]);

  return (
    <div className="min-h-72 flex flex-col items-center justify-center bg-base-200">
      <div className="card shadow-lg w-96 bg-white p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Select Item</h1>

        {/* Dropdown for selecting items */}
        <ItemsDropdown key="addItems" type="Product" items={items} />

        {/* Conditional rendering of quantity input */}
        {showQuantityInput && currentItem && (
          <div className="my-4 p-4 border border-gray-300 rounded-md">
            <h3 className="text-lg font-semibold">
              Available: {currentItem.total_quantity}
            </h3>
            <h3 className="text-lg font-semibold">
              Enter Quantity to sell {currentItem.product_name}
            </h3>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="input input-bordered w-full my-2"
              min="1"
              max={currentItem.total_quantity}
              placeholder="Enter quantity"
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
      </div>
    </div>
  );
};

export default SelectItem;
