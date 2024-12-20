import React, { useEffect, useState } from "react";
import axios from "axios";
import { purchaseTransactionApi } from "../utils/routes";
import InsightsModal from "../modals/InsightsModal";
import ReactPaginate from "react-paginate";
import InvoiceDocument from "../invoice/InvoiceComponent";
import { FaDownload } from "react-icons/fa";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { PDFDownloadLink } from "@react-pdf/renderer";

const PurchaseTransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch transaction data with pagination
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(purchaseTransactionApi, {
          params: { page: currentPage, limit: itemsPerPage },
        });
        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  const handleViewInsights = (transactionId) => {
    setSelectedTransactionId(transactionId);
  };

  const closeModal = () => {
    setSelectedTransactionId(null);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1); // ReactPaginate uses 0-based indexing
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Purchase Transactions
      </h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Supplier Name</th>
              <th className="px-6 py-3">Total Items Purchased</th>
              <th className="px-6 py-3">Total Amount</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.purchase_transaction_id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-3">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-6 py-3">{transaction.supplier_name}</td>
                <td className="px-6 py-3">{transaction.total_items_purchased}</td>
                <td className="px-6 py-3">${transaction.total_cost_price}</td>
                <td className="px-6 py-3">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-3 flex space-x-2">
                  <button
                    className="px-4 py-2 text-xl text-gray-800 rounded-lg hover:text-gray-500 transition"
                    onClick={() => handleViewInsights(transaction.purchase_transaction_id)}
                  >
                    <BsFillInfoSquareFill />
                  </button>
                  <PDFDownloadLink
                    document={<InvoiceDocument transaction={transaction} type="purchase" />}
                    fileName={`Invoice_${transaction.purchase_transaction_id}.pdf`}
                  >
                    <button className="px-2 py-2 text-gray-900 rounded-lg hover:bg-gray-600 transition">
                      <FaDownload />
                    </button>
                  </PDFDownloadLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          containerClassName={"flex space-x-2"}
          activeClassName={"text-white bg-blue-600 px-3 py-1 rounded-lg"}
          pageClassName={"px-3 py-1 rounded-lg bg-gray-300"}
          previousClassName={"px-3 py-1 rounded-lg bg-gray-500 text-white"}
          nextClassName={"px-3 py-1 rounded-lg bg-gray-500 text-white"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </div>

      {/* Purchase Insights Modal */}
      {selectedTransactionId && (
        <InsightsModal
          typeId={selectedTransactionId}
          onClose={closeModal}
          type="purchase"
        />
      )}
    </div>
  );
};

export default PurchaseTransactionPage;
