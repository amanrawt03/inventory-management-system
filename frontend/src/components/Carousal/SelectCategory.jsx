import React, { useState, useEffect } from "react";
import ItemsDropdown from "../ItemsDropdown";
import AddCategoryModal from "../../modals/AddCategoryModal";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCategory } from "../../slice/selectionSlice";

const SelectCategory = () => {
  const dispatch = useDispatch();
  const addCategory = (newCategory) => {
    console.log(newCategory);
    dispatch(setSelectedCategory(newCategory));
    refresh(true)
  };
  const categories = useSelector((state) => state.data.categories);
  const [active, setActive] = useState(true);

  const selectedCategory = useSelector(
    (state) => state.selection.selectedCategory
  );

  useEffect(() => {
    if (selectedCategory !== null && selectedCategory !== undefined) {
      setActive(false);
    } else {
      setActive(true);
    }
  }, [selectedCategory]);
  return (
    <div className="min-h-72 flex items-center justify-center bg-base-200">
      <div className="card shadow-lg w-96 bg-white p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Select Category</h1>

        {/* Dropdown for existing categories */}
        <ItemsDropdown
          key="selectCategory"
          type="Category"
          items={categories}
        />
        <div className="divider">OR</div>
        {/* Button to open modal */}
        {/* Add Location Button */}
        <button
          onClick={() =>
            document.getElementById("add_category_modal").showModal()
          }
          disabled={!active} // Disable button when active is false
          className="btn btn-primary"
        >
          Add Category
        </button>

        {/* Add Location Modal */}
        <AddCategoryModal addCategory={addCategory} />
      </div>
    </div>
  );
};

export default SelectCategory;