import React, { useEffect, useState } from "react";
import axios from "axios";
import { purchaseTransactionApi } from "../utils/routes";
import InsightsModal from "../modals/InsightsModal"; // You can create a PurchaseInsightsModal similar to SellingInsightsModal
import ReactPaginate from "react-paginate";
import InvoiceDocument from "../invoice/InvoiceComponent";
import { GrDocumentDownload } from "react-icons/gr";
import { PDFDownloadLink } from "@react-pdf/renderer"; // Import PDFDownloadLink
const PurchaseTransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState(null); // For storing the selected transaction's ID for insights
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 8; // Define how many items per page

  // Fetch transaction data with pagination
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(purchaseTransactionApi, {
          params: { page: currentPage, limit: itemsPerPage }, // Include pagination parameters
        });
        setTransactions(response.data.transactions); // Assuming the data structure
        setTotalPages(response.data.totalPages); // Set total pages from response
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
    setSelectedTransactionId(transactionId); // Open modal with the selected transaction ID
  };

  const closeModal = () => {
    setSelectedTransactionId(null); // Close modal
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1); // Update current page
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
                <td className="px-6 py-3">
                  {transaction.total_items_purchased}
                </td>
                <td className="px-6 py-3">${transaction.total_cost_price}</td>
                <td className="px-6 py-3">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  <button
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-900 transition"
                    onClick={() =>
                      handleViewInsights(transaction.purchase_transaction_id)
                    } // Pass the transaction ID
                  >
                    View Insights
                  </button>

                  {/* PDF Download Link */}
                  <PDFDownloadLink
                    document={
                      <InvoiceDocument
                        transaction={transaction}
                        type="purchase"
                      />
                    } // Pass transaction to the document
                    fileName={`Invoice_${transaction.purchase_transaction_id}.pdf`}
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

      {/* Purchase Insights Modal */}
      {selectedTransactionId && (
        <InsightsModal
          typeId={selectedTransactionId}
          onClose={closeModal}
          type="purchase"
        />
      )}

      {/* Pagination */}
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
  );
};

export default PurchaseTransactionPage;
