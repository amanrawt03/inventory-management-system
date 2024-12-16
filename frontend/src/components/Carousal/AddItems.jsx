import React, { useState, useEffect } from "react";
import ItemsDropdown from "../ItemsDropdown";
import { useSelector } from "react-redux";
import AddItemsModal from "../../modals/AddItemsModal";
import { toast } from "react-toastify";
import axios from "axios";
import { fetchProductsList } from "../../utils/routes";
import PurchasedItemsModal from "../../modals/PurchasedItemsModal";

const AddItems = () => {
  const currentItem = useSelector((state) => state.selection.selectedItem);

  // State for modals
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(fetchProductsList);
        setItems(response.data.items);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    setShowOrderModal(Boolean(currentItem));
  }, [currentItem]);

  return (
    <div className="min-h-72 flex flex-col items-center justify-center bg-base-200">
      <div className="card shadow-lg w-96 bg-white p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Items</h1>

        {/* Dropdown for selecting items */}
        <ItemsDropdown key="addItems" type="Product" items={items} />

        {/* Conditional rendering of order modal */}
        {showOrderModal && currentItem && (
          <PurchasedItemsModal
            setShowOrderModal={setShowOrderModal}
            item={currentItem}
            type="Save"
          />
        )}

        <div className="divider">OR</div>
        <button
          onClick={() => setShowItemsModal(true)}
          className="btn btn-primary"
        >
          Create New Item
        </button>
      </div>

      {/* AddItemsModal with visibility control */}
      {showItemsModal && (
        <AddItemsModal setShowModal={setShowItemsModal} />
      )}
    </div>
  );
};

export default AddItems;
