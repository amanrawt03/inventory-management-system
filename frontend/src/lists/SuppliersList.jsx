import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import AddSupplierModal from "../modals/AddSupplierModal";
import axios from "axios";
import { fetchSuppliersApi } from "../utils/routes";
import SettingsDropdown from "../components/SettingsDropdown";

const SuppliersList = () => {
  const [suppliersList, setSuppliersList] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSorted, setIsSorted] = useState(false);
  const reduxSuppliers = useSelector((state) => state.data.suppliers);

  // Fetch suppliers from API
  const fetchSuppliers = async (page) => {
    try {
      const { data } = await axios.get(fetchSuppliersApi, { params: { page } });
      setSuppliersList(data.suppliers);
      setFilteredSuppliers(data.suppliers);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers(currentPage);
    setFilteredSuppliers(reduxSuppliers);
  }, [reduxSuppliers, currentPage]);

  // Filter and sort suppliers
  useEffect(() => {
    let filtered = suppliersList.filter((supplier) =>
      supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (isSorted) {
      filtered = [...filtered].sort((a, b) =>
        a.supplier_name.localeCompare(b.supplier_name)
      );
    }
    setFilteredSuppliers(filtered);
  }, [searchTerm, suppliersList, isSorted]);

  // Add a new supplier
  const addSupplier = (newSupplier) => {
    setSuppliersList((prev) => [...prev, newSupplier]);
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
          Suppliers List
        </h1>

        {/* Search and Sort Options */}
        <div className="mb-6 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search by supplier name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full max-w-md"
          />
          <SettingsDropdown
            listType={"supplier"}
            isSorted={isSorted}
            setIsSorted={setIsSorted}
          />
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
                    <td className="py-3 px-4">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
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
                    colSpan="4"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Supplier Modal */}
        <AddSupplierModal addSupplier={addSupplier} />
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
            previousLabel={
              <span className="px-3 py-2 bg-white text-primary border rounded-md hover:bg-gray-100">
                Previous
              </span>
            }
            nextLabel={
              <span className="px-3 py-2 bg-white text-primary border rounded-md hover:bg-gray-100">
                Next
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SuppliersList;
