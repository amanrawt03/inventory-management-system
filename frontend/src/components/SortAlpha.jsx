import React from "react";
import { MdOutlineSortByAlpha } from "react-icons/md";

const SortAlpha = ({ isSorted, setIsSorted }) => {
  return (
    <div className="relative mb-2 flex items-center mt-2">
      {/* Sorting Button */}
      <label className="btn btn-circle swap swap-rotate bg-transparent border-none">
        <input
          type="checkbox"
          checked={isSorted}
          onChange={() => setIsSorted((prev) => !prev)}
        />
        {/* Sorting Icon */}
        <MdOutlineSortByAlpha 
          className={`text-2xl transition-transform ${
            isSorted ? "rotate-180" : ""
          }`}
        />
      </label>
    </div>
  );
};

export default SortAlpha;
