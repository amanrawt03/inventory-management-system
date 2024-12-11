import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate"; // Importing React Paginate
import { useSelector } from "react-redux";
import AddCategoryModal from "../modals/AddCategoryModal";
import SortAlpha from "../components/SortAlpha"; // Import SortAlpha component
import axios from "axios";
import { fetchCategoriesApi } from "../utils/routes";
import { MdAddBox } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import SettingsDropdown from "../components/SettingsDropdown";
const CategoryList = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const reduxCategories = useSelector((state) => state.data.categories);
  const [isSorted, setIsSorted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1); // Total pages from the API
  const [currentPage, setCurrentPage] = useState(1); // Current page state (API expects 1-based index)
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  //  Fetch categories from API
  const fetchCategories = async (page) => {
    try {
      const response = await axios.get(fetchCategoriesApi, {
        params: { page },
      });
      const { categories, totalPages } = response.data;
      setCategoriesList(categories);
      setFilteredCategories(categories);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Initial and Redux-synced data fetch
  useEffect(() => {
    fetchCategories(currentPage);
    setCategoriesList(reduxCategories);
    setFilteredCategories(reduxCategories);
  }, [reduxCategories, currentPage]);

  // Sort functionality
  useEffect(() => {
    if (isSorted) {
      setFilteredCategories((prevCategories) =>
        [...prevCategories].sort((a, b) =>
          a.category_name.localeCompare(b.category_name)
        )
      );
    } else {
      setFilteredCategories(categoriesList); // Restore original order
    }
  }, [isSorted, categoriesList]);

  // Search functionality
  useEffect(() => {
    const filtered = categoriesList.filter((category) =>
      category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categoriesList]);

  // Add a new category
  const addCategory = (newCategory) => {
    setCategoriesList((prevCategories) => [...prevCategories, newCategory]);
    setSearchTerm(""); // Reset search term to show new category
  };

  // Pagination handler
  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1; // ReactPaginate provides 0-based index
    setCurrentPage(newPage);
    fetchCategories(newPage);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-base-200 min-h-screen flex">
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
          <SettingsDropdown isSorted={isSorted} setIsSorted={setIsSorted} listType={"category"}/>
        </div>

        {/* Category Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-left">S.No</th>
                <th className="py-3 px-4 text-left">Category Name</th>
                <th className="py-3 px-4 text-left">Unique Items Available</th>
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
                    <td className="py-3 px-4">{category.unique_item_count}</td>
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
          activeLinkClassName="px-3 py-2 rounded-md"
          breakClassName="inline-block"
          breakLinkClassName="px-3 py-2 text-gray-500"
        />
      </div>
    </div>
  );
};

export default CategoryList;
