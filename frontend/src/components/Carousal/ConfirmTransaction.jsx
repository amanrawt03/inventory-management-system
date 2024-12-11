import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sellItemsApi } from "../../utils/routes";
import { toast } from "react-toastify";
import { resetState } from "../../slice/selectionSlice"

const ConfirmTransaction = ({ onTransactionComplete }) => {
  const dispatch = useDispatch();

  const { selectedItem, selectedSupplier, quantity } = useSelector(
    (state) => state.selection
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (selectedItem && selectedSupplier && quantity !== undefined) {
      setIsLoading(false);
    }
  }, [selectedItem, selectedSupplier, quantity]);

  const handleOnConfirm = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const payload = {
        product_id: selectedItem.product_id,
        quantity,
        supplier_id: selectedSupplier.supplier_id,
      };

      const response = await axios.post(sellItemsApi, payload);
      setSuccessMessage(response.data.message);
      toast.success("Transaction Successful");

      // Reset the Redux store and notify parent
      dispatch(resetState());
      onTransactionComplete(); // Callback to reset the slide
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-52">
        <div className="spinner-border animate-spin border-4 border-t-4 border-primary w-8 h-8 rounded-full"></div>
        <small className="mt-4">Fill all fields before proceeding</small>
      </div>
    );
  }

  return (
    <div className="transaction-confirmation bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto mt-12">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">
        {quantity} {selectedItem.product_name} sold to{" "}
        {selectedSupplier.supplier_name}
      </h4>
      <p className="text-gray-600 mb-6">
        Click the button below to confirm the transaction.
      </p>
      <button
        className="btn btn-primary w-full py-3 text-white text-lg font-semibold rounded-md transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleOnConfirm}
      >
        Confirm
      </button>
      {error && (
        <p className="text-red-600 text-center mt-4 font-semibold">{error}</p>
      )}
      {successMessage && (
        <p className="text-green-600 text-center mt-4 font-semibold">
          {successMessage}
        </p>
      )}
    </div>
  );
};

export default ConfirmTransaction;
