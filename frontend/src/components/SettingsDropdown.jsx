import React, { useEffect } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { MdAddBox } from "react-icons/md";
import { useState } from "react";
import SortAlpha from "./SortAlpha";
const SettingsDropdown = ({ isSorted, setIsSorted, listType }) => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [type, setType] = useState(null);
  useEffect(() => {
    if (listType) {
      setType(listType);
    }else{
      setType(null);
    }
  });
  return (
    <div className="relative mr-3">
      <IoSettingsSharp
        className={`size-7 ml-2 transition-transform ${
          isSliderOpen ? "rotate-90" : "rotate-0"
        }`}
        onClick={() => setIsSliderOpen(!isSliderOpen)}
      />
      {isSliderOpen && (
        <div className="absolute top-10 left-0  z-10 flex flex-col bg-gray-200 text-white rounded-lg shadow-lg p-1 ">
          <SortAlpha isSorted={isSorted} setIsSorted={setIsSorted} />
          {type && (<div className="relative group btn btn-circle bg-transparent border-none hover:bg-gray-600 transition duration-200">
            <MdAddBox
              className="size-7 ml-1 cursor-pointer"
              onClick={() =>
                document.getElementById(`add_${type}_modal`).showModal()
              }
            />
          </div>)}
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
