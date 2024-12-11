import React, { useEffect, useState } from "react";
import ItemsDropdown from "../ItemsDropdown";
import AddLocationModal from "../../modals/AddLocationModal";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedLocation } from "../../slice/selectionSlice"; 
const SelectInventory = () => {
  const [active, setActive] = useState(true);
  const dispatch = useDispatch()
  const addLocation = (newLocation) => {
    dispatch(setSelectedLocation(newLocation));
  };
  const locations = useSelector((state) => state.data.locations);
  const selectedLocation = useSelector(
    (state) => state.selection.selectedLocation
  );

  useEffect(() => {
    if (selectedLocation !== null && selectedLocation !== undefined) {
      setActive(false);
    } else {
      setActive(true);
    }
  }, [selectedLocation]); // Ensure this runs whenever selectedLocation changes

  return (
    <div className="min-h-72 flex items-center justify-center bg-base-200">
      <div className="card shadow-lg w-96 bg-white p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Select Location</h1>

        <ItemsDropdown
          key="selectInventory"
          type="Location"
          items={locations}
        />

        <div className="divider">OR</div>

        {/* Add Location Button */}
        <button
          onClick={() =>
            document.getElementById("add_location_modal").showModal()
          }
          disabled={!active} // Disable button when active is false
          className={`btn btn-primary ${!active ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Add Location
        </button>

        {/* Add Location Modal */}
        <AddLocationModal addLocation={addLocation} />
      </div>
    </div>
  );
};

export default SelectInventory;
