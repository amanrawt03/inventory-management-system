import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import SettingsDropdown from "../components/SettingsDropdown";
import AddCategoryModal from "../modals/AddCategoryModal";

const CategoryList = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (search, page, sortOrder) => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/category/paginate`,
          {
            params: {
              search,
              page,
              limit,
              sortOrder,
            },
          }
        );
        setCategoriesList(data.categories);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error searching categories:", error);
      }
    }, 500),
    []
  );

  // Search effect
  useEffect(() => {
    debouncedSearch(searchTerm, currentPage, sortOrder);

    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, currentPage, sortOrder, debouncedSearch]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  // Add a new category
  const addCategory = (newCategory) => {
    setCategoriesList((prev) => [...prev, newCategory]);
  };

  // Pagination handlers
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="bg-base-200 min-h-screen flex flex-col">
      <div className="p-6 ml-10 flex-grow">
        <h1 className="text-4xl font-bold text-gray-800">Categories List</h1>

        {/* Search Input */}
        <div className="flex justify-between items-center mb-5 mt-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search categories..."
              className="input input-bordered w-96 max-w-xs"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
            />
          </div>
          <SettingsDropdown
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            listType="category"
          />
        </div>

        {/* Category Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-left">S.No</th>
                <th className="py-3 px-4 text-left">Category Name</th>
                <th className="py-3 px-4 text-left">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {categoriesList.length > 0 ? (
                categoriesList.map((category, index) => (
                  <tr
                    key={category.category_id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200`}
                  >
                    <td className="py-3 px-4">
                      {(currentPage - 1) * limit + index + 1}
                    </td>
                    <td className="py-3 px-4">{category.category_name}</td>
                    <td className="py-3 px-4">
                      {formatDate(category.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Category Modal */}
        <AddCategoryModal addCategory={addCategory} />
      </div>

      {/* Pagination */}
      <div className="w-full pb-6">
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="btn btn-primary"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="btn btn-primary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
