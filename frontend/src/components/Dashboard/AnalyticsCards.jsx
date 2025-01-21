import {Grid2, Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import CardItem from "./CardItem";
import { Category, People, Inventory, LocationOn } from "@mui/icons-material";

const AnalyticsCards = () => {
  const { categories, items, suppliers, locations } = useSelector(
    (state) => state.data
  );
  const metrics = [
    {
      title: "Active Categories",
      value: categories?.length,
      icon: Category,
      color: "#2196f3",
    },
    {
      title: "Total Suppliers",
      value: suppliers?.length,
      icon: People,
      color: "#4caf50",
    },
    {
      title: "Unique Products",
      value: items?.length,
      icon: Inventory,
      color: "#ff9800",
    },
    {
      title: "Inventory Locations",
      value: locations?.length,
      icon: LocationOn,
      color: "#9c27b0",
    },
  ];
  return (
    <div>
      <Grid2 container spacing={3} sx={{ mb: 3 }}>
        {metrics.map((metric, index) => (
            <Box
            key={index}
            >
            <CardItem {...metric}/>
            </Box>
          ))}
      </Grid2>
    </div>
  );
};

export default AnalyticsCards;
