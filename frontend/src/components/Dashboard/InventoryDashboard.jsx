import { Typography, Container, Paper, Box, Chip } from "@mui/material";
import React from "react";
import ProfitDashboard from "./ProfitLossGraph";
import ViewStocksCard from "./ViewStocksCard";
import AnalyticsCards from "./AnalyticsCards";

const InventoryDashboard = () => {
  return (
    <Container  sx={{ py: 4, maxWidth: '60vw' }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Inventory Dashboard
        </Typography>
      </Box>

      <AnalyticsCards/>

      {/* Stock Level Chart */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography
              variant="h5"
              color="grey.900"
              sx={{ fontWeight: "bold" }}
            >
              Net Profit
            </Typography>
        <Box>
          <ProfitDashboard />
        </Box>
      </Paper>

      {/* View Stocks Card */}
      <ViewStocksCard />
    </Container>
  );
};

export default InventoryDashboard;
