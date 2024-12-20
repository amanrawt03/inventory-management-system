import React from "react";
import { MdOutlineSortByAlpha } from "react-icons/md";

const SortAlpha = ({ sortOrder, setSortOrder }) => {
  return (
    <div className="relative mb-2 flex items-center mt-2">
      <label className="btn btn-circle swap swap-rotate bg-transparent border-none">
        <input
          type="checkbox"
          checked={sortOrder === 'DESC'}
          onChange={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
        />
        <MdOutlineSortByAlpha
          className={`text-2xl transition-transform ${
            sortOrder === 'DESC' ? "rotate-180" : ""
          }`}
        />
      </label>
    </div>
  );
};

export default SortAlpha;