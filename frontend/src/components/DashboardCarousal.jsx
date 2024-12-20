import React from "react";
import item1 from "../assets/homeBg.jpg";
import DashboardCarItem from "./DashboardCarItem";
const DashboardCarousal = () => {
  return (
    <div className="carousel rounded-box w-cwid-35 h-96">
      
      <div className="carousel-item w-full">
        <img
          src={item1}
          className="w-full"
          alt="Tailwind CSS Carousel component"
          style={{ filter: "brightness(0.93)" }}
        />
      </div>
      <div className="carousel-item w-full">
        <DashboardCarItem itemName={"Categories"}/>
      </div>
      <div className="carousel-item w-full">
        <DashboardCarItem itemName={"Suppliers"}/>
      </div>
      <div className="carousel-item w-full">
        <DashboardCarItem itemName={"Items"}/>
      </div>
      <div className="carousel-item w-full">
        <DashboardCarItem itemName={"Locations"}/>
      </div>
    </div>
  );
};
export default DashboardCarousal;