import React, { useEffect, useState } from "react";
import SortAlpha from "../components/SortAlpha";
import ReactPaginate from "react-paginate"; // Importing React Paginate
import axios from "axios";
import { fetchItemsApi } from "../utils/routes";
const ItemsList = () => {
  const [itemsList, setItemsList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page state (API expects 1-based index)
  const [isSorted, setIsSorted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1); // Total pages from the API

  // Fetch items from API
  const fetchItems = async (page) => {
    try {
      const response = await axios.get(fetchItemsApi, {
        params: { page },
      });
      const { items, totalPages } = response.data;
      setItemsList(items);
      setFilteredItems(items);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Fetch items when the component mounts or currentPage changes
  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (isSorted) {
      setFilteredItems((prevItems) =>
        [...prevItems].sort((a, b) =>
          a.product_name.localeCompare(b.product_name)
        )
      );
    } else {
      setFilteredItems(itemsList); // Restore the original order
    }
  }, [isSorted, itemsList]);

  useEffect(() => {
    const filtered = itemsList.filter((item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, itemsList]);

  // Handle page change
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1); // ReactPaginate uses 0-based index, API uses 1-based
  };

  return (
    <div className="bg-base-200 min-h-screen flex">
      <div className="w-full p-6 ml-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Items List</h1>

        {/* Search Filter */}
        <div className="mb-6 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search by item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full max-w-md"
          />
          <SortAlpha isSorted={isSorted} setIsSorted={setIsSorted} />
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg min-h-96">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-left">S.No</th>
                <th className="py-3 px-4 text-left">Item Name</th>
                <th className="py-3 px-4 text-left">Total Item Count</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200`}
                  >
                    <td className="py-3 px-4">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="py-3 px-4">{item.product_name}</td>
                    <td className="py-3 px-4">{item.total_quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          containerClassName="flex justify-center items-center bottom-0 left-0 w-full bg-base-100 py-4 shadow-md space-x-2"
          pageClassName="inline-block"
          pageLinkClassName="px-3 py-2 bg-white text-primary border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          activeClassName="bg-primary text-white"
          activeLinkClassName="bg-primary text-white rounded-md"
        />
      </div>
    </div>
  );
};

export default ItemsList;
