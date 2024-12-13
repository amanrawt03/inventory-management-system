import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../slice/cartSlice";
import { resetState } from "../../slice/selectionSlice";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import UpdateItemModal from "../../modals/UpdateItemModal";
import { removeCartItem } from "../../slice/cartSlice";
const ConfirmTransaction = ({ onTransactionComplete }) => {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currItem, setCurrItem] = useState(false);

  const handleEditOrder = (item)=>{
    setShowOrderModal(true)
    setCurrItem(item)
  }
  const handleDeleteOrder = (product_id)=>{
    dispatch(removeCartItem({orderId:product_id}))
  }
  const handlePlaceOrder = () => {
    dispatch(clearCart());
    dispatch(resetState());
    toast.success("Cart cleared successfully");
    onTransactionComplete();
  };
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-52">
        <small className="mt-4">No Items selected so far</small>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Confirm Your Order for {cartItems[0].customer_name}
      </h1>
      {cartItems.length > 0 ? (
        <>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Total Cost</th>
                <th>Total Selling</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product_id}>
                  <td>{item.product_name}</td>
                  <td >{item.quantity}</td>

                  <td>{item.cost_price}</td>
                  <td>{item.selling_price}</td>
                  <td>{item.total_cost}</td>
                  <td>{item.total_selling}</td>
                  <td>
                    <div className="flex m-2 ml-8">
                      <MdEditSquare className="mr-3" onClick={()=>handleEditOrder(item)}/>
                      <MdDelete onClick={()=>handleDeleteOrder(item.product_id)}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handlePlaceOrder} className="btn btn-primary">
            Confirm Order
          </button>
          {showOrderModal && (
            <UpdateItemModal setShowOrderModal={setShowOrderModal} item = {currItem} type={"Update"}/>
          )}
        </>
      ) : (
        <p>No items in cart</p>
      )}
    </div>
  );
};

export default ConfirmTransaction;
