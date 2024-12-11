import React from "react";
import Sidebar from "./LeftDrawer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="grid grid-cols-12 bg-gray-200 min-h-screen">
      {/* Sidebar */}
      <div className="col-span-2 h-screen sticky top-0 bg-white hidden lg:flex">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="col-span-12 lg:col-span-10 flex flex-col ">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
