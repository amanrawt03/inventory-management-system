import { resetState } from "../slice/selectionSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaShoppingCart,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const user = useSelector((state) => state.selection.currentUser);
  const profile_image = useSelector((state) => state.selection.profile_image);
  let image;
  if(!profile_image)image = user.profile_image;
  else image = profile_image

  useEffect(() => {
      image = profile_image;
  }, [profile_image]);
  console.log(profile_image)        
  // console.log(user.profile_image)
  const handleLogout = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(resetState());
      window.location.href = "/";
    } catch (error) {
      toast.error(`Error: ${error?.error.message}`);
    }
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const menuItems = [
    {
      icon: <FaHome className="text-lg text-gray-400" />,
      label: "Dashboard",
      path: "/home",
    },
    {
      icon: <MdSell className="text-lg text-gray-400" />,
      label: "Sales",
      path: "/sellItems",
    },
    {
      icon: <FaShoppingCart className="text-lg text-gray-400" />,
      label: "Inventory",
      path: "/addItems",
    },
    {
      icon: <TbReportAnalytics className="text-lg text-gray-400" />,
      label: "Transactions",
      dropdown: [
        {
          label: "Sales Log",
          path: "/sellTransactions",
        },
        {
          label: "Purchase Log",
          path: "/purchaseTransactions",
        },
      ],
    },
  ];
  return (
    <div className="bg-gray-900 text-gray-300 w-56 min-h-screen shadow-xl">
      {/* Profile Section */}
      <div className="flex flex-col items-center py-6 border-b border-gray-700">
        <div className="avatar mb-3">
          <div className="w-16 rounded-full ring ring-primary ring-offset-gray-900 ring-offset-2">
            <img
              src={image}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        </div>
        <h5 className="text-base font-medium text-white">Hi, {user.name}</h5>
        <Link to={"/profile"} className="text-sm mt-1 text-blue-700">
          View My Info{" "}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 px-2">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-1 py-1.5">
            {item.dropdown ? (
              <div>
                <div
                  onClick={() => toggleDropdown(item.label)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {activeDropdown === item.label ? (
                    <FaChevronUp className="text-xs text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-xs text-gray-400" />
                  )}
                </div>

                {activeDropdown === item.label && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.dropdown.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        onClick={() => navigateTo(subItem.path)}
                        className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-800 cursor-pointer transition"
                      >
                        {subItem.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition"
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700">
        <div
          className="flex items-center space-x-3 text-red-400 px-4 py-3 hover:bg-gray-800 transition cursor-pointer"
          onClick={handleLogout}
        >
          <RiLogoutBoxRFill className="text-lg" />
          <span className="text-sm">Sign Out</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
