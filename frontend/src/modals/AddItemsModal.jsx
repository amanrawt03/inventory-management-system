import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ItemsDropdown from "../components/ItemsDropdown";
import { addNewProductApi, fetchCategoriesList } from "../utils/routes";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearCategory } from "../slice/selectionSlice";
const AddItemsModal = ({ setShowModal }) => {
  const dispatch = useDispatch()
  const selectedCategory = useSelector(state=>state.selection.selectedCategory)
  const [productName, setProductName] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(fetchCategoriesList);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    };

    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category.");
      return;
    }

    if (!productName.trim()) {
      toast.error("Please enter a valid product name.");
      return;
    }

    try {
      await axios.post(addNewProductApi, {
        category_id: selectedCategory.category_id,
        product_name: productName.trim(),
      });
      toast.success(`Product "${productName}" added successfully!`);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(`Failed to add product. ${error.message}`);
    }
    dispatch(clearCategory())
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={() => setShowModal(false)}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-center mb-4">Add New Product</h2>
        <div className="my-4 p-4 border border-gray-300 rounded-md">
          <ItemsDropdown
            type="Category"
            items={categories}
          />

          <h3 className="text-lg font-semibold mt-4">Product Name:</h3>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="input input-bordered w-full my-2"
            placeholder="Enter product name"
          />

          <button
            onClick={handleSave}
            className="btn btn-primary w-full mt-4"
            disabled={!selectedCategory || !productName.trim()}
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemsModal;
