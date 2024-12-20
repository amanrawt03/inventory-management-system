import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { sellingTransactionApi } from "../utils/routes";
import InsightsModal from "../modals/InsightsModal";
import { FaDownload } from "react-icons/fa";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceDocument from "../invoice/InvoiceComponent";

const SellTransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const limit = 8;

  // Debounced fetch function
  const debouncedFetchTransactions = useCallback(
    debounce(async (search, page, sortOrder) => {
      setLoading(true);
      try {
        const response = await axios.get(sellingTransactionApi, {
          params: {
            search,
            page,
            limit,
            sortOrder,
          },
        });
        setTransactions(response.data.transactions);
        setTotalPages(response.data.pagination.totalPages);
        setError("");
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Search effect
  useEffect(() => {
    debouncedFetchTransactions(searchTerm, currentPage, sortOrder);

    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedFetchTransactions.cancel();
    };
  }, [searchTerm, currentPage, sortOrder, debouncedFetchTransactions]);

  // Pagination handlers
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  // Insights modal handler
  const handleViewInsights = (transactionId) => {
    setSelectedTransactionId(transactionId);
  };

  const closeModal = () => {
    setSelectedTransactionId(null);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Sell Transactions
      </h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on new search
          }}
        />
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Customer Name</th>
              <th className="px-6 py-3">Total Items Sold</th>
              <th className="px-6 py-3">Total Amount (₹)</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr
                  key={transaction.sell_transaction_id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="px-6 py-3">{transaction.customer_name}</td>
                  <td className="px-6 py-3">{transaction.total_items_sold}</td>
                  <td className="px-6 py-3">{transaction.total_amount}</td>
                  <td className="px-6 py-3">
                    {new Date(transaction.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 flex space-x-2">
                    <button
                      className="px-4 py-2 text-xl text-gray-800 rounded-lg hover:text-gray-500 transition"
                      onClick={() =>
                        handleViewInsights(transaction.sell_transaction_id)
                      }
                    >
                      <BsFillInfoSquareFill />
                    </button>
                    <PDFDownloadLink
                      document={
                        <InvoiceDocument transaction={transaction} type="sell" />
                      }
                      fileName={`Invoice_{transaction.sell_transaction_id}.pdf`}
                    >
                      <button className="px-2 py-2 text-gray-900 rounded-lg hover:bg-gray-600 transition">
                        <FaDownload />
                      </button>
                    </PDFDownloadLink>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="w-full pb-6 mt-6">
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

      {/* Selling Insights Modal */}
      {selectedTransactionId && (
        <InsightsModal
          typeId={selectedTransactionId}
          onClose={closeModal}
          type="sell"
        />
      )}
    </div>
  );
};

export default SellTransactionPage;