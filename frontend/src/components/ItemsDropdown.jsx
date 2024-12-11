import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedCategory,
  setSelectedLocation,
  setSelectedItem,
  setSelectedSupplier,
} from "../slice/selectionSlice";

const ItemsDropdown = ({ type, items }) => {
  const dispatch = useDispatch();

  const selectedValue = useSelector((state) =>
    type === "Category"
      ? state.selection.selectedCategory
      : type === "Location"
      ? state.selection.selectedLocation
      : type === "Product"
      ? state.selection.selectedItem
      : type === "Supplier" // Add Supplier case
      ? state.selection.selectedSupplier
      : null
  );

  const handleSelection = (e) => {
    const value = e.target.value;
    const selectedItem = items.find(
      (item) =>
        (type === "Location" && item.location_name === value) ||
        (type === "Category" && item.category_name === value) ||
        (type === "Product" && item.product_name === value) ||
        (type === "Supplier" && item.supplier_name === value) // Add Supplier condition
    );
    if (type === "Category") dispatch(setSelectedCategory(selectedItem));
    if (type === "Location") dispatch(setSelectedLocation(selectedItem));
    if (type === "Product") dispatch(setSelectedItem(selectedItem));
    if (type === "Supplier") dispatch(setSelectedSupplier(selectedItem)); // Dispatch setSelectedSupplier
  };

  return (
    <div className="dropdown">
      <label className="block text-lg font-medium mb-2">{type}</label>
      <select
        value={selectedValue ? selectedValue[`${type.toLowerCase()}_name`] : ""}
        onChange={handleSelection}
        className="select select-bordered w-full"
      >
        <option value="">Choose {type}</option>
        {items.map((item) => (
          <option
            key={item[`${type.toLowerCase()}_id`]}
            value={item[`${type.toLowerCase()}_name`]}
          >
            {item[`${type.toLowerCase()}_name`]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ItemsDropdown;
