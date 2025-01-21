import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { fetchProductInfoApi } from "../../utils/routes";

// Function to format currency values
const formatCurrency = (amount) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lac`;
  } else {
    return `₹${amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  }
};

const ViewStocksCard = () => {
  const [showStockDetails, setShowStockDetails] = useState(false);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchProductSummary = async () => {
      try {
        const response = await axios.get(fetchProductInfoApi);
        // Add index to each item
        const indexedData = response.data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setStockData(indexedData);
      } catch (error) {
        console.error("Error fetching stock data:", error.message);
      }
    };
    fetchProductSummary();
  }, []);

  const totalStockValue = stockData.reduce(
    (sum, item) => sum + item.avgCostPrice * item.totalQuantity,
    0
  );

  return (
    <Card
      sx={{
        mb: 3,
        boxShadow: 3,
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography
              variant="h5"
              color="grey.900"
              sx={{ fontWeight: "bold" }}
            >
              View Stocks
            </Typography>
            <Typography
              variant="h4"
              color="green"
              sx={{ fontWeight: "medium", my: 1 }}
            >
              {formatCurrency(totalStockValue)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Value of Stocks
            </Typography>
          </Box>
          <Tooltip title={showStockDetails ? "Hide Details" : "Show Details"}>
            <IconButton
              onClick={() => setShowStockDetails(!showStockDetails)}
              aria-label="toggle stock details"
              sx={{
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              {showStockDetails ? <ChevronUp /> : <ChevronDown />}
            </IconButton>
          </Tooltip>
        </Box>
        <Collapse in={showStockDetails}>
          <Box mt={2}>
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      In Stock
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Cost Price
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Stock Value
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockData.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:hover": { bgcolor: "action.hover" } }}
                    >
                      <TableCell>{row.id}</TableCell>
                      <TableCell component="th" scope="row">
                        {row.productName}
                      </TableCell>
                      <TableCell align="center">
                        {row.totalQuantity.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.avgCostPrice)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.totalQuantity * row.avgCostPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ViewStocksCard;