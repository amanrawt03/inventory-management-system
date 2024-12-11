import React, { useEffect, useState } from "react";
import Sidebar from "../components/LeftDrawer"; // Sidebar component
import axios from "axios"; // Axios for making API requests
import { fetchTransactionsApi } from "../utils/routes";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch transaction data from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(fetchTransactionsApi); // Replace with your correct API endpoint
        const sortedTransactions = response.data.sort((a, b) =>
          a.product_name.localeCompare(b.product_name)
        );
        setTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  // Format date into DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handle search input changes
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredTransactions(
      transactions.filter((transaction) =>
        transaction.product_name.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div className="bg-base-200 min-h-screen flex">
      <div className="w-full p-6 ml-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Transaction List
        </h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by product name..."
            className="input input-bordered w-full max-w-md"
          />
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-left">S.No</th>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Supplier</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Transaction Type</th>
                <th className="py-3 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200`}
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{transaction.product_name}</td>
                    <td className="py-3 px-4">{transaction.supplier_name}</td>
                    <td className="py-3 px-4">{transaction.quantity}</td>
                    <td className="py-3 px-4">{transaction.transaction_type}</td>
                    <td className="py-3 px-4">
                      {formatDate(transaction.transaction_date)}
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
      </div>
    </div>
  );
};

export default TransactionList;
