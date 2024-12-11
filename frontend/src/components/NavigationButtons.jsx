import React from 'react';

const NavigationButtons = ({ currentStep, stepsLength, handlePrevious, handleNext }) => {
  return (
    <div className="absolute left-5 right-5 top-1/2 transform -translate-y-1/2 flex justify-between w-full px-4">
      <button
        className="btn btn-circle btn-primary text-white"
        onClick={handlePrevious}
        disabled={currentStep === 0}
      >
        ❮
      </button>
      <button
        className="btn btn-circle btn-primary text-white"
        onClick={handleNext}
        disabled={currentStep === stepsLength - 1}
      >
        ❯
      </button>
    </div>
  );
};

export default NavigationButtons;
