import React from "react";
import SellItemsCarousal from "../components/Carousal/SellItemsCarousal";
import { Typography } from "@mui/material";
const SellItemsPage = () => {
  return (
    <div className="bg-base-200 min-h-screen flex">


      {/* Main Content */}
      <div className="flex-grow space-y-8 ml-14 mt-8">
        <div className="flex justify-between">
        <Typography variant="h4" component="h1" fontWeight="bold">
          Sell Items
        </Typography>
        </div>

        <div className="border rounded-lg shadow-md bg-white p-2 w-cwid-75 min-h-cht-83 mr-8">
          <SellItemsCarousal />
        </div>
      </div>
    </div>
  );
};

export default SellItemsPage;
