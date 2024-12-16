import React, { useState } from "react";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { FaCommentDollar } from "react-icons/fa6";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import profileImg from "../assets/profileImg.jpg";
import { useDispatch } from "react-redux";
import { resetState } from "../slice/selectionSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(resetState());
    window.location.href = "/";
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleTransactionNavigation = (transactionType) => {
    if (transactionType === "sell") {
      navigate("/sellTransactions");
    } else if (transactionType === "purchase") {
      navigate("/purchaseTransactions");
    }
  };

  return (
    <div className="bg-gray-900 text-gray-300 w-60 min-h-screen shadow-lg">
      {/* Profile Section */}
      <div className="flex flex-col items-center py-6 space-y-3 border-b border-gray-700">
        <div className="avatar">
          <div className="w-20 rounded-full ring ring-primary ring-offset-gray-900 ring-offset-2">
            <img src={profileImg} alt="Profile" />
          </div>
        </div>
        <h5 className="text-lg font-semibold text-white">Aman</h5>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4">
        <ul className="space-y-4 px-4">
          <li>
            <Link
              to="/home"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              <FaHome className="text-xl text-gray-400" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/sellItems"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              <MdSell className="text-xl text-gray-400" />
              <span>Sell Items</span>
            </Link>
          </li>
          <li>
            <Link
              to="/addItems"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              <FaShoppingCart className="text-xl text-gray-400" />
              <span>Purchase Items</span>
            </Link>
          </li>
          <li>
            <div
              onClick={toggleDropdown}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition cursor-pointer"
            >
              <FaCommentDollar className="text-xl text-gray-400" />
              <span>Transactions</span>
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="mt-2 ml-8 space-y-1">
                <div
                  onClick={() => handleTransactionNavigation("sell")}
                  className="cursor-pointer px-4 py-1 bg-gray-800 hover:bg-gray-600 rounded-md transition"
                >
                  Sell Transaction
                </div>
                <div
                  onClick={() => handleTransactionNavigation("purchase")}
                  className="cursor-pointer px-4 py-1 bg-gray-800 hover:bg-gray-600 rounded-md transition"
                >
                  Purchase Transaction
                </div>
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="mt-6 border-t border-gray-700 px-4 pt-4">
        <div
          className="flex items-center gap-3 text-red-400 px-4 py-3 rounded-lg hover:bg-gray-800 transition cursor-pointer"
          onClick={handleLogout}
        >
          <RiLogoutBoxRFill className="text-xl" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
