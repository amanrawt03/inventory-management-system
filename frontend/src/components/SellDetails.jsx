import React, { useState } from 'react';

const SellDetails = ({ supplier, setSupplier, quantityToSell, setQuantityToSell }) => {
  return (
    <div>
      <label className="block text-lg font-medium mb-2">Choose Supplier</label>
      <select
        onChange={(e) => setSupplier(e.target.value)}
        className="select select-bordered w-full"
      >
        <option value="">Choose Supplier</option>
        <option value="Supplier A">Supplier A</option>
        <option value="Supplier B">Supplier B</option>
      </select>

      <label className="block text-lg font-medium mt-4 mb-2">Quantity</label>
      <input
        type="number"
        value={quantityToSell}
        onChange={(e) => setQuantityToSell(e.target.value)}
        className="input input-bordered w-full"
        placeholder="Enter quantity"
      />
    </div>
  );
};

export default SellDetails;
    