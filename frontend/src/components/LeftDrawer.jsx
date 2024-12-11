import React from "react";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { FaCommentDollar } from "react-icons/fa6";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import profileImg from "../assets/profileImg.jpg";
import { useDispatch } from "react-redux";
import { resetState } from "../slice/selectionSlice";
const Sidebar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(resetState());
    window.location.href = "/"
  };
  return (
    <div className="bg-gray-800 text-white w-60 min-h-screen shadow-lg">
      {/* Profile Section */}
      <div className="flex flex-col items-center py-6 space-y-3 border-b border-gray-700">
        <div className="avatar">
          <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={profileImg} alt="Profile" />
          </div>
        </div>
        <h5 className="text-lg font-semibold">Aman</h5>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4">
        <ul className="space-y-4 px-4">
          <li>
            <Link
              to="/home"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700"
            >
              <FaHome className="text-xl" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/sellItems"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700"
            >
              <MdSell className="text-xl" />
              <span>Sell Items</span>
            </Link>
          </li>
          <li>
            <Link
              to="/addItems"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700"
            >
              <FaShoppingCart className="text-xl" />
              <span>Purchase Items</span>
            </Link>
          </li>
          <li>
            <Link to={'/transactions'}
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700"
            >
              <FaCommentDollar className="text-xl" />
              <span>Transactions</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="mt-6 border-t border-gray-700 px-4 pt-4">
        <div
          className="flex items-center gap-3 text-red-400 px-4 py-3 rounded-lg hover:bg-gray-700"
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