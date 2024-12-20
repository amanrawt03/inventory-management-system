import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import DashboardCarousal from "../components/DashboardCarousal";
import {
  fetchCategories,
  fetchItems,
  fetchSuppliers,
  fetchLocations,
} from "../slice/dataSlice";

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchItems());
    dispatch(fetchSuppliers());
    dispatch(fetchLocations());
  }, [dispatch]);

  return (
    <div className="bg-base-200 min-h-screen flex justify-center items-center py-6">
      <div className="w-full lg:w-10/12 xl:w-8/12 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-4">
          Welcome to Inventory Manager!
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Effortlessly manage your inventory with ease.
        </p>

        <div className="flex justify-center">
          <DashboardCarousal />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
