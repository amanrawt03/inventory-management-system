import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedCategory,
  setSelectedLocation,
  setSelectedItem,
  setSelectedSupplier,
  setSelectedCustomer,
  setCostPrice,
  setTotalAvailable
} from "../slice/selectionSlice";
import { fetchCostPriceApi } from "../utils/routes";
import axios from 'axios'
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
      : type === "Customer"
      ? state.selection.selectedCustomer
      :null 
  );

  const handleSelection = async (e) => {
    const value = e.target.value;
    const selectedItem = items.find(
      (item) =>
        (type === "Location" && item.location_name === value) ||
        (type === "Category" && item.category_name === value) ||
        (type === "Product" && item.product_name === value) ||
        (type === "Supplier" && item.supplier_name === value) ||
        (type === "Customer" && item.customer_name === value)
    );
  
    if (type === "Category") dispatch(setSelectedCategory(selectedItem));
    if (type === "Location") dispatch(setSelectedLocation(selectedItem));
    if (type === "Product") {
      dispatch(setSelectedItem(selectedItem));
      try {
        const response = await axios.post(fetchCostPriceApi, { product_id: selectedItem.product_id }, { withCredentials: true });
        const { costPrice, totalAvailable } = response.data; 
        if (response.status === 200) {
          dispatch(setCostPrice(costPrice)); 
          dispatch(setTotalAvailable(totalAvailable)); 
        } else {
          console.error(`Error: ${response.error}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    if (type === "Supplier") dispatch(setSelectedSupplier(selectedItem));
    if (type === "Customer") dispatch(setSelectedCustomer(selectedItem));
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
