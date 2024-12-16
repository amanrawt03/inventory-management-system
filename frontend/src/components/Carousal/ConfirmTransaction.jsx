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
  console.log(selectedCustomer)
  console.log(selectedSupplier)
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currItem, setCurrItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditOrder = (item) => {
    setShowOrderModal(true);
    setCurrItem(item);
  };

  const handleDeleteOrder = (product_id) => {
    dispatch(removeCartItem({ orderId: product_id, type })); // Ensure type is passed
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
      <div className="flex flex-col justify-center items-center h-52">
        <small className="mt-4">No items selected for this transaction</small>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Confirm {type === "sell" ? "Selling" : "Purchasing"} Order to {type === "sell"? `${selectedCustomer.customer_name}`:`${selectedSupplier.supplier_name}`}
      </h1>
      {cartItems.length > 0 && (
        <>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Cost Price</th>
                {type === "sell" && <th>Selling Price</th>}
                <th>Total Cost</th>
                {type === "sell" && <th>Total Selling</th>}
                {type === "purchase" && <th>Location</th>}
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product_id}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.cost_price}</td>
                  {type === "sell" && <td>{item.selling_price}</td>}
                  <td>{item.total_cost}</td>
                  {type === "sell" && <td>{item.total_selling}</td>}
                  {type === "purchase" && <td>{item.location}</td>}
                  <td>
                    <div className="flex m-2 ml-8">
                      <MdEditSquare
                        className="mr-3 cursor-pointer"
                        onClick={() => handleEditOrder(item)}
                      />
                      <MdDelete
                        className="cursor-pointer"
                        onClick={() => handleDeleteOrder(item.product_id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handlePlaceOrder}
            className="btn btn-primary mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : `Confirm ${type === "sell" ? "Selling" : "Purchasing"} Order`}
          </button>
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
