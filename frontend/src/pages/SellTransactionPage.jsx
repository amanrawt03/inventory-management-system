import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { sellingTransactionApi } from "../utils/routes";
import InsightsModal from "../modals/InsightsModal";
import { GrDocumentDownload } from "react-icons/gr";
import { PDFDownloadLink } from "@react-pdf/renderer"; // Import PDFDownloadLink
import InvoiceDocument from "../invoice/InvoiceComponent"; // Import your InvoiceDocument component

const SellTransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Define how many items per page

  // Fetch transaction data with pagination
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(sellingTransactionApi, {
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

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const handleViewInsights = async (transactionId) => {
    setSelectedTransactionId(transactionId);
  };

  const closeModal = () => {
    setSelectedTransactionId(null);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Sell Transactions
      </h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Customer Name</th>
              <th className="px-6 py-4">Total Items Sold</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.sell_transaction_id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="px-6 py-4">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-6 py-4">{transaction.customer_name}</td>
                <td className="px-6 py-4">{transaction.total_items_sold}</td>
                <td className="px-6 py-4">${transaction.total_amount}</td>
                <td className="px-6 py-4">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </td>
                <td className="py-4">
                  <button
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
                    onClick={() =>
                      handleViewInsights(transaction.sell_transaction_id)
                    }
                  >
                    View Insights
                  </button>

                  {/* PDF Download Link */}
                  <PDFDownloadLink
                    document={
                      <InvoiceDocument transaction={transaction} type="sell" />
                    } // Pass transaction to the document
                    fileName={`Invoice_${transaction.sell_transaction_id}.pdf`}
                  >
                    <button className="px-4 ml-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition">
                      <GrDocumentDownload />
                    </button>
                  </PDFDownloadLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selling Insights Modal */}
      {selectedTransactionId && (
        <InsightsModal
          typeId={selectedTransactionId}
          onClose={closeModal}
          type="sell"
        />
      )}

      {/* Pagination */}
      <div className="w-full mt-8">
        {" "}
        {/* Add margin-top to push it down */}
        <ReactPaginate
          breakLabel={<span className="px-2 text-gray-800">...</span>}
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          forcePage={currentPage - 1}
          containerClassName="flex justify-center items-center py-4 space-x-2"
          pageClassName="inline-block"
          pageLinkClassName="px-3 py-2 bg-white text-primary border rounded-md hover:bg-gray-100 transition duration-200"
          activeClassName="bg-gray-100 text-white" // Highlight active page
          previousLabel={
            <span className="px-3 py-2 bg-white text-primary border rounded-md hover:bg-gray-100 transition duration-200">
              Previous
            </span>
          }
          nextLabel={
            <span className="px-3 py-2 bg-white text-primary border rounded-md hover:bg-gray-100 transition duration-200">
              Next
            </span>
          }
        />
      </div>
    </div>
  );
};

export default SellTransactionPage;
