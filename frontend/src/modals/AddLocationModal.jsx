import React, { useState } from "react";
import axios from "axios";
import { createLocationApi } from "../utils/routes"; // Ensure you have the correct API route
import { toast } from 'react-toastify';
const AddLocationModal = ({ addLocation }) => {
  const [locationName, setLocationName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locationName.trim() === "") return;

    try {
      // Send a POST request to create a new location
      const response = await axios.post(
        createLocationApi, // The API route
        { location_name: locationName }, // The payload
        { withCredentials: true } // Include credentials (cookies)
      );
      // Assuming the response contains the full location object
      const locationData = response.data.location;

      // Call the parent function to update the list
      addLocation(locationData);  // Add the full location object

      // Close the modal and clear the input
      document.getElementById("add_location_modal").close();
      toast.success("Location Added Successfully!");
      setLocationName("");
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  return (
    <dialog id="add_location_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add New Location</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"                   
            placeholder="Location Name"
            className="input input-bordered w-full mb-4"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Add
            </button>
            <button
              type="button"
              className="btn"
              onClick={() =>
                document.getElementById("add_location_modal").close()
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AddLocationModal;
