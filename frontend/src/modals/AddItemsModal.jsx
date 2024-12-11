import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const AddItemsModal = ({ addItem }) => {
  // Fetch location and category from Redux
  const { selectedCategory, selectedLocation , selectedSupplier} = useSelector(
    (state) => state.selection
  );


  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (productName.trim() === "" || quantity <= 0) {
      alert("Product name is required, and quantity must be greater than zero.");
      return;
    }

    try {
      // Payload structure
      const payload = {
        location_name:selectedLocation.location_name,
        category_name:selectedCategory.category_name,
        product_name: productName,
        quantity: Number(quantity),
        supplier_name:selectedSupplier.supplier_name
      };

      // Send a POST request to create a new item
      const response = await axios.post(
        `http://localhost:3000/api/inventory/createItem`, // API route
        payload, // Request payload
        { withCredentials: true } // Include credentials (cookies)
      );

      // Assuming the response contains the full item object
      const itemData = response.data.item;

      // Call the parent function to update the list
      addItem(itemData);

      // Close the modal and clear the fields
      document.getElementById("add_item_modal").close();
      toast.success("Item Added Successfully")
      setProductName("");
      setQuantity(0);
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add the item. Please try again.")
    }
  };

  return (
    <dialog id="add_item_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add New Item</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            placeholder="Product Name"
            className="input input-bordered w-full mb-4"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            className="input input-bordered w-full mb-4"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Add
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => document.getElementById("add_item_modal").close()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AddItemsModal;
