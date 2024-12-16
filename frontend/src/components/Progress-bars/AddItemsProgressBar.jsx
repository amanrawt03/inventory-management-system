import React from "react";

const AddItemsProgressBar = ({ currentSlide }) => {
  return (
    <ul className="steps">
      <li className={`ml-4 step ${currentSlide >= 0 ? "step-primary" : ""}`}>Select Supplier</li>
      <li className={`ml-4 step ${currentSlide >= 1 ? "step-primary" : ""}`}>Add Item</li>
      <li className={`ml-4 step ${currentSlide >= 2 ? "step-primary" : ""}`}>Confirm</li>
    </ul>
  );
};

export default AddItemsProgressBar;
