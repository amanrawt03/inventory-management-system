import React from "react";
import AddItemsCarousal from "../components/Carousal/AddItemsCarousal";
import { Typography } from "@mui/material";
const AddItemsPage = () => {
  return (
    <div className="bg-base-200 min-h-screen flex">


      {/* Main Content */}
      <div className="flex-grow space-y-8 ml-14 mt-8">
        {/* Page Header */}

        <div className="flex justify-between">
        <Typography variant="h4" component="h1" fontWeight="bold">
          Add New Items
        </Typography>
        </div>

        <div className="border rounded-lg shadow-md bg-white p-2 w-cwid-75 min-h-cht-83 mr-8">
          <AddItemsCarousal />
        </div>
      </div>
    </div>
  );
};

export default AddItemsPage;
