import React from "react";

const SellItemsProgressBar = ({ currentSlide }) => {
  return (
    <ul className="steps">
      <li className={`step ${currentSlide >= 0 ? "step-primary" : ""}`}>Select Item</li>
      <li className={`step ${currentSlide >= 1 ? "step-primary" : ""}`}>Select Supplier</li>
      <li className={`step ${currentSlide >= 2 ? "step-primary" : ""}`}>Confirm</li>
    </ul>
  );
};

export default SellItemsProgressBar;
