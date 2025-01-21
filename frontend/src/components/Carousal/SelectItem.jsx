import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ItemsDropdown from "../ItemsDropdown";
import UpdateItemModal from "../../modals/UpdateItemModal";
import axios from "axios";
import { fetchProductsList } from "../../utils/routes";
const SelectItem = () => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [items, setItems] = useState([]);
  const currentItem  = useSelector(state=>state.selection.selectedItem)
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(fetchProductsList, {withCredentials:true});
      setItems(response.data.items);
    }
    fetchData();
  }, []);
  useEffect(() => {
    if(currentItem)setShowOrderModal(true);
  }, [currentItem]);

  return (
    <div
      id="select_item_modal"
      className="min-h-72 flex flex-col items-center justify-center bg-base-200"
    >
      <div className="card shadow-lg w-96 bg-white p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Select Item</h1>
        <ItemsDropdown key="addItems" type="Product" items={items} />
        {showOrderModal && currentItem && (
          <UpdateItemModal
            setShowOrderModal={setShowOrderModal}
            item={currentItem}
            type={"Save"}
          />
        )}
      </div>    
    </div>
  );
};

export default SelectItem;
