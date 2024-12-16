import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import AddCategoryModal from "../modals/AddCategoryModal";
import axios from "axios";
import { fetchCategoriesApi } from "../utils/routes";
import SettingsDropdown from "../components/SettingsDropdown";

const CategoryList = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSorted, setIsSorted] = useState(false); // Sorting state

  // Fetch categories from API
  const fetchCategories = async (page, searchTerm = "", sort = "") => {
    try {
      const { data } = await axios.get(fetchCategoriesApi, {
        params: { page, limit: 9, searchTerm, sort }, // Send searchTerm and sort as parameters
      });
      setCategoriesList(data.categories);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, searchTerm, isSorted ? "asc" : "desc");
  }, [currentPage, searchTerm, isSorted]); // Trigger fetch when searchTerm or sort changes

  // Search functionality
  useEffect(() => {
    let filtered = categoriesList.filter((category) =>
      category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (isSorted) {
      filtered = [...filtered].sort((a, b) =>
        a.category_name.localeCompare(b.category_name)
      );
    }
    setFilteredCategories(filtered);
  }, [searchTerm, categoriesList, isSorted]);

  // Add a new category
  const addCategory = (newCategory) => {
    setCategoriesList((prev) => [...prev, newCategory]);
    setSearchTerm(""); // Reset search
  };

  // Pagination handler
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="bg-base-200 min-h-screen flex relative">
      <div className="w-full p-6 ml-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Categories List
        </h1>

        {/* Search Filter */}
        <div className="mb-6 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search by category name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full max-w-md"
          />
          <SettingsDropdown
            listType={"category"}
            isSorted={isSorted}
            setIsSorted={setIsSorted}
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
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200`}
                  >
                    <td className="py-3 px-4">
                      {(currentPage - 1) * 10 + index + 1}
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
                    colSpan="4"
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
        <div className="absolute bottom-0 left-0 w-full">
  <ReactPaginate
    breakLabel={<span className="px-2 text-gray-800">...</span>}
    pageCount={totalPages}
    marginPagesDisplayed={1}
    pageRangeDisplayed={3}
    onPageChange={handlePageChange}
    forcePage={currentPage - 1} 
    containerClassName="flex justify-center items-center py-4 space-x-2"
    pageClassName="inline-block"
    pageLinkClassName="px-3 py-2 bg-white text-primary border rounded-md hover:bg-gray-100"
    activeClassName="bg-gray-100 text-white" // Highlight active page
    previousLabel={<span className="px-3 py-2 bg-white text-primary border rounded-md hover:bg-gray-100">Previous</span>}
    nextLabel={<span className="px-3 py-2 bg-white text-primary border rounded-md hover:bg-gray-100">Next</span>}
  />
</div>
      </div>
    </div>
  );
};

export default CategoryList;
