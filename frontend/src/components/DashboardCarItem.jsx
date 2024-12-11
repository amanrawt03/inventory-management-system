import React, { useEffect, useState } from "react";
import categoryImg from "../assets/1.png";
import suppliersImg from "../assets/2.png";
import itemsImg from "../assets/3.png";
import locationsImg from "../assets/4.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardCarItem = ({ itemName }) => {
  const [image, setImg] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const navigate = useNavigate();

  // Accessing Redux state
  const { categories, items, suppliers, locations, loading } = useSelector(
    (state) => state.data
  );

  // console.log(items); 

  useEffect(() => {
    if (itemName) {
      switch (itemName) {
        case "Categories":
          setImg(categoryImg);
          setTotalQuantity(categories ? categories.length : 0); // Check if categories is defined
          break;
        case "Suppliers":
          setImg(suppliersImg);
          setTotalQuantity(suppliers ? suppliers.length : 0); // Check if suppliers is defined
          break;
        case "Items":
          setImg(itemsImg);
          setTotalQuantity(items ? items.length : 0); // Check if items is defined
          break;
        case "Locations":
          setImg(locationsImg);
          setTotalQuantity(locations ? locations.length : 0); // Check if locations is defined
          break;
        default:
          setImg(null);
          setTotalQuantity(0);
      }
    }
  }, [itemName, categories, suppliers, items, locations]);

  const handleOnClick = () => {
    navigate(`/list/${itemName}`);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state if data is not available
  }

  return (
    <div className="card bg-base-200 w-full h-96 shadow-lg rounded-lg flex flex-col justify-between">
      {/* Dynamic Image */}
      <figure className="h-1/2">
        <img
          src={image}
          alt={itemName}
          className="w-full h-full object-contain rounded-t-lg"
        />
      </figure>
      {/* Card Content */}
      <div className="card-body p-4">
        <h2 className="card-title text-xl font-semibold ml-6">
          {totalQuantity} {itemName}
        </h2>
        <div className="card-actions mt-4 justify-center">
          <button
            className="btn btn-primary rounded-md"
            onClick={handleOnClick}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCarItem;
