import React, { useState } from "react";
import axios from "axios";
import { createCustomerApi } from "../utils/routes"; // Ensure you have the correct API route
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setSelectedCustomer } from "../slice/selectionSlice";

const AddCustomerModal = () => {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (customerName.trim() === "" || email.trim() === "") {
      toast.error("Customer Name and Email are required");
      return;
    }

    try {
      // Send a POST request to create a new customer
      const response = await axios.post(
        createCustomerApi,
        { customer_name: customerName, customer_email: email },
        { withCredentials: true }
      );

      dispatch(setSelectedCustomer(response.data.customer));
      document.getElementById("add_customer_modal").close();
      toast.success("Customer Added Successfully");
      setCustomerName("");
      setEmail("");
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <dialog id="add_customer_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add New Customer</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            placeholder="Customer Name"
            className="input input-bordered w-full mb-4"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Add
            </button>
            <button
              type="button"
              className="btn"
              onClick={() =>
                document.getElementById("add_customer_modal").close()
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

export default AddCustomerModal;
