import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { sellingTransactionApi } from "../utils/routes";
import InsightsModal from "../modals/InsightsModal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceDocument from "../invoice/InvoiceComponent";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  IconButton,
  Pagination,
  CircularProgress,
  Alert,
  TableFooter,
  useTheme
} from "@mui/material";
import { Info, Download } from '@mui/icons-material';

const formatCurrency = (amount) => {
  if (amount >= 10000000) { // 1 crore = 10000000
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) { // 1 lakh = 100000
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${amount.toLocaleString()}`;
  }
};

const SellTransactionPage = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const limit = 10;

  const debouncedFetchTransactions = useCallback(
    debounce(async (search, page, sortOrder) => {
      setLoading(true);
      try {
        const response = await axios.get(sellingTransactionApi, {
          params: { search, page, limit, sortOrder },
        }, { withCredentials: true });
        setTransactions(response.data.transactions);
        setTotalPages(response.data.pagination.totalPages);
        setError("");
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchTransactions(searchTerm, currentPage, sortOrder);
    return () => debouncedFetchTransactions.cancel();
  }, [searchTerm, currentPage, sortOrder, debouncedFetchTransactions]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleViewInsights = (transactionId) => {
    setSelectedTransactionId(transactionId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={4} color="text.primary">
        Sell Transactions
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        sx={{ mb: 4, maxWidth: 400 }}
      />

      <TableContainer 
        component={Paper} 
        sx={{ 
          mb: 4,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[900], color: 'white' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[900], color: 'white' }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[900], color: 'white' }}>Total Items Sold</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[900], color: 'white' }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[900], color: 'white' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.grey[900], color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <TableRow 
                  key={transaction.sell_transaction_id}
                  sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}
                >
                  <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                  <TableCell>{transaction.customer_name}</TableCell>
                  <TableCell>{transaction.total_items_sold}</TableCell>
                  <TableCell>{formatCurrency(transaction.total_amount)}</TableCell>
                  <TableCell>
                    {new Date(transaction.transaction_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleViewInsights(transaction.sell_transaction_id)}
                      color="primary"
                    >
                      <Info sx={{color:'#222222'}}/>
                    </IconButton>
                    <PDFDownloadLink
                      document={<InvoiceDocument transaction={transaction} type="sell" />}
                      fileName={`Invoice_${transaction.sell_transaction_id}.pdf`}
                    >
                      <IconButton color="primary">
                        <Download sx={{color:'#222222'}}/>
                      </IconButton>
                    </PDFDownloadLink>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8, color: 'text.secondary', fontStyle: 'italic' }}>
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {transactions.length > 0 && transactions.length < 5 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  <Box display="flex" justifyContent="center" p={2}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </Box>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>

      {transactions.length >= 5 && (
        <Box display="flex" justifyContent="center" p={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {selectedTransactionId && (
        <InsightsModal
          typeId={selectedTransactionId}
          onClose={() => setSelectedTransactionId(null)}
          type="sell"
        />
      )}
    </Container>
  );
};

export default SellTransactionPage;