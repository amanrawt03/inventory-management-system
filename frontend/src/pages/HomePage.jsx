import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchCategories,
  fetchItems,
  fetchSuppliers,
  fetchLocations,
} from "../slice/dataSlice";
import InventoryDashboard from "../components/Dashboard/InventoryDashboard";

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchItems());
    dispatch(fetchSuppliers());
    dispatch(fetchLocations());
  }, [dispatch]);

  return (
    <div className="bg-base-200 min-h-screen flex justify-center items-center py-4">
      <div className="p-6 bg-white shadow-lg rounded-lg">
          <InventoryDashboard/>
      </div>
    </div>
  );
};

export default HomePage;
