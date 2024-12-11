import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddLocationModal from "../modals/AddLocationModal";
import SettingsDropdown from '../components/SettingsDropdown'
import ReactPaginate from "react-paginate";

const LocationList = () => {
  const [locationsList, setLocationsList] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Track current page
  const itemsPerPage = 8; // Number of items per page

  const locations = useSelector((state) => state.data.locations);

  useEffect(() => {
    setLocationsList(locations);
    setFilteredLocations(locations);
  }, [locations]);

  useEffect(() => {
    if (isSorted) {
      setFilteredLocations((prevLocations) =>
        [...prevLocations].sort((a, b) =>
          a.location_name.localeCompare(b.location_name)
        )
      );
    } else {
      setFilteredLocations(locationsList); // Restore original order
    }
  }, [isSorted, locationsList]);

  useEffect(() => {
    const filtered = locationsList.filter((location) =>
      location.location_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [searchTerm, locationsList]);

  const addLocation = (newLocation) => {
    setLocationsList((prevLocations) => [...prevLocations, newLocation]);
    setSearchTerm(""); // Reset search term to show new location
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayedLocations = filteredLocations.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="bg-base-200 min-h-screen flex">
      <div className="w-full p-6 ml-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Locations List
        </h1>

        {/* Search and Sort */}
        <div className="mb-6 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search by location name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full max-w-md"
          />
        <SettingsDropdown isSorted={isSorted} setIsSorted={setIsSorted} listType={"location"}/>
          </div>

        {/* Locations Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-left">S.No</th>
                <th className="py-3 px-4 text-left">Location Name</th>
                <th className="py-3 px-4 text-left">Total Items</th>
              </tr>
            </thead>
            <tbody>
              {displayedLocations.length > 0 ? (
                displayedLocations.map((location, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200`}
                  >
                    <td className="py-3 px-4">
                      {index + 1 + currentPage * itemsPerPage}
                    </td>
                    <td className="py-3 px-4">{location.location_name}</td>
                    <td className="py-3 px-4">{location.total_items}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No locations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <ReactPaginate
          previousLabel={
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus transition-colors">
              Previous
            </button>
          }
          nextLabel={
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus transition-colors">
              Next
            </button>
          }
          breakLabel={<span className="px-2 text-gray-500">...</span>}
          pageCount={Math.ceil(filteredLocations.length / itemsPerPage)}
          onPageChange={handlePageClick}
          containerClassName="flex justify-center items-center mt-6 space-x-2"
          pageClassName="inline-block"
          pageLinkClassName="px-3 py-2 bg-white text-primary border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          activeClassName="bg-primary text-white"
          activeLinkClassName="px-3 py-2 rounded-md"
          breakClassName="inline-block"
          breakLinkClassName="px-3 py-2 text-gray-500"
        />

      </div>
    </div>
  );
};

export default LocationList;
