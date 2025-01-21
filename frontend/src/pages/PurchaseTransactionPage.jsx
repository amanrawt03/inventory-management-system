import React, { useEffect, useState } from "react";
import axios from "axios";
import { purchaseTransactionApi } from "../utils/routes";
import InsightsModal from "../modals/InsightsModal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceDocument from "../invoice/InvoiceComponent";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Pagination,
  Container,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  '& .MuiTableRow-root': {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

// Utility function to format currency in Indian format
const formatIndianCurrency = (value) => {
  const numValue = parseFloat(value);
  if (numValue >= 10000000) { // 1 crore
    const crores = (numValue / 10000000).toFixed(2);
    return `₹${crores} Cr`;
  } else if (numValue >= 100000) { // 1 lac
    const lacs = (numValue / 100000).toFixed(2);
    return `₹${lacs} L`;
  } else {
    return `₹${numValue.toLocaleString('en-IN')}`;
  }
};

const PurchaseTransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(purchaseTransactionApi, {
          params: { page: currentPage, limit: itemsPerPage },
          withCredentials: true
        });
        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage]);

  const handleViewInsights = (transactionId) => {
    setSelectedTransactionId(transactionId);
  };

  const closeModal = () => {
    setSelectedTransactionId(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
    <Container maxWidth="xl">
      <Box sx={{ py: 4, minHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary" mb={4}>
          Purchase Transactions
        </Typography>

        <StyledTableContainer component={Paper} sx={{ flex: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Supplier Name</TableCell>
                <TableCell>Total Items</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={transaction.purchase_transaction_id}>
                  <TableCell>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{transaction.supplier_name}</TableCell>
                  <TableCell>{transaction.total_items_purchased}</TableCell>
                  <TableCell>
                    {formatIndianCurrency(transaction.total_cost_price)}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.transaction_date).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewInsights(transaction.purchase_transaction_id)}
                        color="grey"
                      >
                        <InfoIcon sx={{color:'#222222'}}/>
                      </IconButton>
                      <PDFDownloadLink
                        document={<InvoiceDocument transaction={transaction} type="purchase" />}
                        fileName={`Invoice_${transaction.purchase_transaction_id}.pdf`}
                      >
                        {({ loading }) => (
                          <IconButton
                            size="small"
                            color="grey"
                            disabled={loading}
                          >
                            <DownloadIcon sx={{color:'#222222'}}/>
                          </IconButton>
                        )}
                      </PDFDownloadLink>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>

        {/* Pagination at bottom */}
        <Box
          sx={{
            mt: 3,
            mb: 2,
            display: 'flex',
            justifyContent: 'center',
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'background.default',
            py: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>

      {/* Insights Modal */}
      {selectedTransactionId && (
        <InsightsModal
          typeId={selectedTransactionId}
          onClose={closeModal}
          type="purchase"
        />
      )}
    </Container>
  );
};

export default PurchaseTransactionPage;