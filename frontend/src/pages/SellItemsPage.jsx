import React from "react";
import Sidebar from "../components/LeftDrawer";
import SellItemsCarousal from "../components/Carousal/SellItemsCarousal";

const SellItemsPage = () => {
  return (
    <div className="bg-base-200 min-h-screen flex">


      {/* Main Content */}
      <div className="flex-grow space-y-8 ml-14 mt-8">
        <div className="flex justify-between">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
            Sell Items
          </h1>
        </div>

        <div className="border rounded-lg shadow-md bg-white p-2 w-cwid-75 min-h-cht-83 mr-8">
          <SellItemsCarousal />
        </div>
      </div>
    </div>
  );
};

export default SellItemsPage;
