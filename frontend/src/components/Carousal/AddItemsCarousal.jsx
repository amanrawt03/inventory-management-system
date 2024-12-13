import React, { useState } from "react";
import AddItems from "./AddItems";
import SelectCategory from "./SelectCategory";
import SelectInventory from "./SelectInventory";
import AddItemsProgressBar from "../Progress-bars/AddItemsProgressBar";
import SelectSupplier from "./SelectSupplier";
const AddItemsCarousal = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    <SelectInventory key="selectInventory" />,
    // <SelectCategory key="selectCategory" />,
    <SelectSupplier key="selectSupplier" />,
    <AddItems
      key="addItems"
      onTransactionComplete={() => setCurrentSlide(0)} // Reset slide
    />,
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="mb-4 ml-cust-46 w-96 h-16">
        <AddItemsProgressBar currentSlide={currentSlide} />
      </div>

      {/* Carousel Content */}
      <div className="p-6 border rounded-lg bg-gray-100">
        {slides[currentSlide]}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentSlide === 0}
          className={`btn btn-outline btn-primary ${
            currentSlide === 0 && "opacity-50 cursor-not-allowed"
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1}
          className={`btn btn-primary pb-2  ${
            currentSlide === slides.length - 1 &&
            "opacity-50 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AddItemsCarousal;
