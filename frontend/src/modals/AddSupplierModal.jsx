import React, { useState } from "react";
import axios from "axios";
import { createSupplierApi } from "../utils/routes"; // Ensure you have the correct API route
import { toast } from "react-toastify";
const AddSupplierModal = ({ addSupplier }) => {
  const [supplierName, setSupplierName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (supplierName.trim() === "" || email.trim() === "") {
      toast.error("Supplier Name and Email are required");
      return;
    }
  
    // Log the values before making the request
    console.log("Sending data to the server:", {
      supplier_name: supplierName,
      contact_email: email,
    });
  
    try {
      // Send a POST request to create a new supplier
      const response = await axios.post(
        createSupplierApi,
        { supplier_name: supplierName, contact_email: email },
        { withCredentials: true }
      );
  
      addSupplier(response.data.supplier);
      document.getElementById("add_supplier_modal").close();
      toast.success('Supplier Added Successfully');
      setSupplierName("");
      setEmail("");
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };
  

  return (
    <dialog id="add_supplier_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add New Supplier</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            placeholder="Supplier Name"
            className="input input-bordered w-full mb-4"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
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
                document.getElementById("add_supplier_modal").close()
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

export default AddSupplierModal;
