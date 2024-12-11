import React from "react";

const SlidingDiv = ({ selectedItem, quantity, setQuantity, handleSave, handleClose }) => {
  return (
    <div className="mt-4 p-4 bg-black border rounded-lg shadow-md transition-transform duration-500 transform">
      <h2 className="font-medium">Item: {selectedItem.product_name}</h2>
      <div className="flex items-center justify-between mt-2">
        <span>Current Quantity: {selectedItem.total_quantity}</span>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="input input-bordered w-20"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <button className="btn btn-success" onClick={handleSave}>
          Save
        </button>
        <button className="btn btn-outline" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SlidingDiv;
