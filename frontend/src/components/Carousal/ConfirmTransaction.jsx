import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, removeCartItem } from "../../slice/cartSlice";
import { toast } from "react-toastify";
import { MdDelete, MdEditSquare } from "react-icons/md";
import UpdateItemModal from "../../modals/UpdateItemModal";
import PurchasedItemsModal from "../../modals/PurchasedItemsModal";
import { selectCartItemsByType } from "../../slice/cartSlice";
import { clearCustomer, clearSupplier } from "../../slice/selectionSlice";
import { purchaseItemsApi, sellItemsApi } from "../../utils/routes";
import axios from "axios";

const ConfirmTransaction = ({ onTransactionComplete, type }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItemsByType(type));
  const {selectedCustomer, selectedSupplier} = useSelector(state=>state.selection)
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currItem, setCurrItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditOrder = (item) => {
    setShowOrderModal(true);
    setCurrItem(item);
  };

  const handleDeleteOrder = (product_id) => {
    dispatch(removeCartItem({ orderId: product_id, type }));
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("No items in the cart to process.");
      return;
    }
    setIsSubmitting(true); 
    try {
      if (type === "sell") {
        const response = await axios.post(sellItemsApi, { orders: cartItems });
        if (response.status === 200) {
          toast.success("Selling transaction successful!");
          dispatch(clearCart({ type }));
          dispatch(clearCustomer());
          onTransactionComplete();
        } else {
          toast.error(response.data.message || "Failed to complete the transaction.");
        }
      } else {
        const response = await axios.post(purchaseItemsApi, {orders: cartItems});
        if(response.status === 200){
          toast.success("Purchase transaction successful!");
          dispatch(clearCart({ type }));
          dispatch(clearSupplier());
          onTransactionComplete();
        }else{
          toast.error(response.data.message || "Failed to complete the transaction.");
        }
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
      toast.error("Failed to complete the transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-52 text-gray-900">
        <small className="mt-4">No items selected for this transaction</small>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Confirm {type === "sell" ? "Selling" : "Purchasing"} Order to {type === "sell" ? selectedCustomer.customer_name : selectedSupplier.supplier_name}
      </h1>
      {cartItems.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Product Name</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Cost Price</th>
                  {type === "sell" && <th className="p-3 text-left">Selling Price</th>}
                  <th className="p-3 text-left">Total Cost</th>
                  {type === "sell" && <th className="p-3 text-left">Total Selling</th>}
                  {type === "purchase" && <th className="p-3 text-left">Location</th>}
                  <th className="p-3 text-left">Options</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.product_id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">{item.product_name}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">₹{item.cost_price}</td>
                    {type === "sell" && <td className="p-3">₹{item.selling_price}</td>}
                    <td className="p-3">₹{item.total_cost}</td>
                    {type === "sell" && <td className="p-3">₹{item.total_selling}</td>}
                    {type === "purchase" && <td className="p-3">{item.location}</td>}
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <MdEditSquare
                          className="text-blue-900 hover:text-blue-700 cursor-pointer text-lg"
                          onClick={() => handleEditOrder(item)}
                        />
                        <MdDelete
                          className="text-red-800 hover:text-red-700 cursor-pointer text-lg"
                          onClick={() => handleDeleteOrder(item.product_id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handlePlaceOrder}
              className={`px-6 py-2 rounded-md text-white font-semibold transition-colors ${
                isSubmitting 
                  ? "bg-gray-500 cursor-not-allowed" 
                  : "bg-gray-900 hover:bg-gray-700"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : `Confirm ${type === "sell" ? "Selling" : "Purchasing"} Order`}
            </button>
          </div>
          {showOrderModal && (
            type === "sell" ? (
              <UpdateItemModal
                setShowOrderModal={setShowOrderModal}
                item={currItem}
                type="Update"
              />
            ) : (
              <PurchasedItemsModal
                setShowOrderModal={setShowOrderModal}
                item={currItem}
                type="Update"
              />
            )
          )}
        </>
      )}
    </div>
  );
};

export default ConfirmTransaction;