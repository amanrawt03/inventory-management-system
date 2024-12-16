import React, { useState, useEffect } from "react";
import ItemsDropdown from "../ItemsDropdown";
import AddCustomerModal from "../../modals/AddCustomerModal"; // Modal for adding a customer
import { useSelector } from "react-redux";
import { setSelectedCustomer } from "../../slice/selectionSlice"; // Action to set the selected customer
import { fetchCustomersList } from "../../utils/routes";

import axios from "axios";
const SelectCustomer = () => {
  const [customers,setCustomers] = useState([])
  useEffect(()=>{
    async function fetchData(){
      const response = await axios.get(fetchCustomersList)
    setCustomers(response.data.customers)
    }
    fetchData()
  })  
  // Add new customer function
  const addCustomer = (newCustomer) => {
    dispatch(setSelectedCustomer(newCustomer)); 
  };

  const [active, setActive] = useState(true);

  const selectedCustomer = useSelector(
    (state) => state.selection.selectedCustomer // Get selected customer from the store
  );

  useEffect(() => {
    if (selectedCustomer !== null && selectedCustomer !== undefined) {
      setActive(false); // Disable the "Add Customer" button when a customer is selected
    } else {
      setActive(true); // Enable the "Add Customer" button when no customer is selected
    }
  }, [selectedCustomer]);

  return (
    <div className="min-h-72 flex items-center justify-center bg-base-200">
      <div className="card shadow-lg w-96 bg-white p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Select Customer</h1>

        {/* Dropdown for selecting existing customers */}
        <ItemsDropdown key="selectCustomer" type="Customer" items={customers} />

        <div className="divider">OR</div>

        {/* Button to open modal for adding a new customer */}
        <button
          onClick={() =>
            document.getElementById("add_customer_modal").showModal()
          }
          disabled={!active} // Disable the button when a customer is already selected
          className="btn btn-primary"
        >
          Add Customer
        </button>

        {/* Add Customer Modal */}
        <AddCustomerModal />
      </div>
    </div>
  );
};

export default SelectCustomer;
