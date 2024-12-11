import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddSupplierModal from "../modals/AddSupplierModal";
import { fetchSuppliersApi } from "../utils/routes";
import axios from "axios";
import ReactPaginate from "react-paginate"; // Importing React Paginate
import SettingsDropdown from '../components/SettingsDropdown'
const SuppliersList = () => {
  const [suppliersList, setSuppliersList] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const suppliers = useSelector((state) => state.data.suppliers);
  const [isSorted, setIsSorted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1); // Total pages from the API
  const [currentPage, setCurrentPage] = useState(1); // Current page state (API expects 1-based index)

  // Fetch suppliers from API
  const fetchSuppliers = async (page = 1) => {
    try {
      const response = await axios.get(fetchSuppliersApi, {
        params: { page },
      });
      const { suppliers, totalPages } = response.data;
      setSuppliersList(suppliers);
      setFilteredSuppliers(suppliers);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setSuppliersList(suppliers);
    setFilteredSuppliers(suppliers);
  }, [suppliers]);

  useEffect(() => {
    if (isSorted) {
      setFilteredSuppliers((prevItems) =>
        [...prevItems].sort((a, b) =>
          a.supplier_name.localeCompare(b.supplier_name)
        )
      );
    } else {
      setFilteredSuppliers(suppliersList); // Restore original order
    }
  }, [isSorted, suppliersList]);

  useEffect(() => {
    const filtered = suppliersList.filter((supplier) =>
      supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  }, [searchTerm, suppliersList]);

  const addSupplier = (newSupplier) => {
    setSuppliersList((prevItems) => [...prevItems, newSupplier]);
    setSearchTerm(""); // Reset search term after adding
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1); // ReactPaginate is 0-indexed, so we add 1
  };

  return (
    <div className="bg-base-200 min-h-screen flex">
      <div className="w-full p-6 ml-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Suppliers List</h1>

        {/* Search and Sort Options */}
        <div className="mb-6 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search by supplier name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full max-w-md"
          />
          <SettingsDropdown isSorted={isSorted} setIsSorted={setIsSorted} listType={"supplier"}/>
        </div>

        {/* Supplier Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-left">S.No</th>
                <th className="py-3 px-4 text-left">Supplier Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Member Since</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200`}
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{supplier.supplier_name}</td>
                    <td className="py-3 px-4">{supplier.contact_email}</td>
                    <td className="py-3 px-4">
                      {formatDate(supplier.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No suppliers found.
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
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          containerClassName="flex justify-center items-center bottom-0 left-0 w-full bg-base-100 py-4 shadow-md space-x-2"
          pageClassName="inline-block"
          pageLinkClassName="px-3 py-2 bg-white text-primary border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          activeClassName="bg-primary text-white"
          activeLinkClassName="px-3 py-2 rounded-md"
        />
      </div>
    </div>
  );
};

export default SuppliersList;
