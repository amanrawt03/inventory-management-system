import React from "react";

const AddItemsProgressBar = ({ currentSlide }) => {
  return (
    <ul className="steps">
      <li className={`ml-4 step ${currentSlide >= 0 ? "step-primary" : ""}`}>Location</li>
      {/* <li className={`ml-4 step ${currentSlide >= 1 ? "step-primary" : ""}`}>Category</li> */}
      <li className={`ml-4 step ${currentSlide >= 1 ? "step-primary" : ""}`}>Supplier</li>
      <li className={`ml-4 step ${currentSlide >= 2 ? "step-primary" : ""}`}>Add Item</li>
    </ul>
  );
};

export default AddItemsProgressBar;
