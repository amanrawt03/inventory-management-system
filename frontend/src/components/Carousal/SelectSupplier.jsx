import React, { useState, useEffect } from "react";
import ItemsDropdown from "../ItemsDropdown";
import AddSupplierModal from "../../modals/AddSupplierModal"; // Modal for adding a supplier
import { useSelector, useDispatch } from "react-redux";
import { setSelectedSupplier } from "../../slice/selectionSlice"; // Action to set the selected supplier

const SelectSupplier = () => {
  const dispatch = useDispatch();
  
  // Add new supplier function
  const addSupplier = (newSupplier) => {
    dispatch(setSelectedSupplier(newSupplier)); // Dispatch action to set the selected supplier
  };

  const suppliers = useSelector((state) => state.data.suppliers); // Fetch the list of suppliers from the store
  const [active, setActive] = useState(true);

  const selectedSupplier = useSelector(
    (state) => state.selection.selectedSupplier // Get selected supplier from the store
  );

  useEffect(() => {
    if (selectedSupplier !== null && selectedSupplier !== undefined) {
      setActive(false); // Disable the "Add Supplier" button when a supplier is selected
    } else {
      setActive(true); // Enable the "Add Supplier" button when no supplier is selected
    }
  }, [selectedSupplier]);

  return (
    <div className="min-h-72 flex items-center justify-center bg-base-200">
      <div className="card shadow-lg w-96 bg-white p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Select Supplier</h1>

        {/* Dropdown for selecting existing suppliers */}
        <ItemsDropdown key="selectSupplier" type="Supplier" items={suppliers} />

        <div className="divider">OR</div>

        {/* Button to open modal for adding a new supplier */}
        <button
          onClick={() =>
            document.getElementById("add_supplier_modal").showModal()
          }
          disabled={!active} // Disable the button when a supplier is already selected
          className="btn btn-primary"
        >
          Add Supplier
        </button>

        {/* Add Supplier Modal */}
        <AddSupplierModal addSupplier={addSupplier} />
      </div>
    </div>
  );
};

export default SelectSupplier;
