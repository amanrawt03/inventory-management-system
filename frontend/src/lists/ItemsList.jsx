import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { netProfitApi } from "../utils/routes";
import axios from 'axios'

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ItemsList = () => {
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    const loadChartData = async () => {
      const response = await axios.get(netProfitApi)
      const netProfit = response.data.netProfit
      const profit = netProfit > 0 ? netProfit : 0;
      const loss = netProfit < 0 ? Math.abs(netProfit) : 0;

      setChartData({
        labels: ["Profit", "Loss"],
        datasets: [
          {
            label: "Net Profit",
            data: [profit, loss],
            backgroundColor: ["#36A2EB", "#FF6384"], // Blue for profit, Red for loss
          },
        ],
      });
    };

    loadChartData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-center text-xl font-bold mb-4">Net Profit</h2>
      {chartData ? (
        <Pie data={chartData} />
      ) : (
        <p className="text-center text-gray-500 italic">Loading...</p>
      )}
    </div>
  );
};

export default ItemsList;
