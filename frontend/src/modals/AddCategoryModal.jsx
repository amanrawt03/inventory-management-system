import React, { useState } from "react";
import axios from "axios";
import { createCategoryApi } from "../utils/routes"; // Ensure you have the correct API route
import { toast } from 'react-toastify';

const AddCategoryModal = ({addCategory}) => {
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCategory.trim() === "") return;

    try { 
      // Send a POST request to create a new category
      const response = await axios.post(
        createCategoryApi, // The API route
        { category_name: newCategory }, // The payload
        { withCredentials: true } // Include credentials (cookies)
      );
      addCategory(response.data.category)
      // Close the modal and clear the input
      document.getElementById("add_category_modal").close();
      toast.success("Category Added Successfully!");
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <dialog id="add_category_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add New Category</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            placeholder="Category Name"
            className="input input-bordered w-full mb-4"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Add
            </button>
            <button
              type="button"
              className="btn"
              onClick={() =>
                document.getElementById("add_category_modal").close()
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AddCategoryModal;  