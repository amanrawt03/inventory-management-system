import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import axios from "axios";
import { netProfitApi } from "../../utils/routes";
import { toast } from "react-toastify";
import { 
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';

ChartJS.register(ArcElement, Tooltip, Legend);

// Styled components
const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ChartWrapper = styled(Box)(({ theme }) => ({
  width: '256px',
  height: '256px',
  margin: '0 auto',
  position: 'relative',
}));

// Utility function to format currency in Indian format
const formatIndianCurrency = (value) => {
  if (value >= 10000000) { // 1 crore
    const crores = (value / 10000000).toFixed(2);
    return `₹${crores} Cr`;
  } else if (value >= 100000) { // 1 lac
    const lacs = (value / 100000).toFixed(2);
    return `₹${lacs} L`;
  } else {
    return `₹${value.toLocaleString('en-IN')}`;
  }
};

const ProfitDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const response = await axios.get(netProfitApi, { withCredentials: true });
        setData(response.data);
      } catch (error) {
        toast.error(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadChartData();
  }, []);

  if (loading) {
    return (
      <Card sx={{ maxWidth: 'xl', mx: 'auto', p: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card sx={{ maxWidth: 'xl', mx: 'auto', p: 3 }}>
        <Typography variant="body1" color="text.secondary" align="center" fontStyle="italic">
          No data available
        </Typography>
      </Card>
    );
  }

  const { netProfit, totalRevenue, totalCost } = data;
  const isProfit = netProfit >= 0;

  const chartData = {
    labels: ["Revenue", "Cost"],
    datasets: [
      {
        data: [totalRevenue, totalCost],
        backgroundColor: [theme.palette.success.main, theme.palette.error.main],
        hoverBackgroundColor: [theme.palette.success.dark, theme.palette.error.dark],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${context.label}: ${formatIndianCurrency(value)}`;
          },
        },
      },
      legend: {
        position: 'bottom',
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Card sx={{ width: '100%', p: 2 }}>
      <CardContent>
        <Box display="flex" flexDirection="column" gap={4}>
          <ChartWrapper>
            <Pie data={chartData} options={options} />
          </ChartWrapper>

          <Grid container spacing={2}>
            {/* Revenue Card */}
            <Grid item xs={12} md={4}>
              <StatsCard>
                <Typography variant="subtitle2" color="text.secondary" align="center" gutterBottom>
                  Revenue
                </Typography>
                <Typography 
                  variant="h6" 
                  color="success.main" 
                  align="center" 
                  fontWeight="bold"
                >
                  {formatIndianCurrency(totalRevenue)}
                </Typography>
              </StatsCard>
            </Grid>

            {/* Cost Card */}
            <Grid item xs={12} md={4}>
              <StatsCard>
                <Typography variant="subtitle2" color="text.secondary" align="center" gutterBottom>
                  Cost
                </Typography>
                <Typography 
                  variant="h6" 
                  color="error.main" 
                  align="center" 
                  fontWeight="bold"
                >
                  {formatIndianCurrency(totalCost)}
                </Typography>
              </StatsCard>
            </Grid>

            {/* Net Profit Card */}
            <Grid item xs={12} md={4}>
              <StatsCard>
                <Typography variant="subtitle2" color="text.secondary" align="center" gutterBottom>
                  Net Profit
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                  {isProfit ? (
                    <ArrowUpIcon color={theme.palette.success.main} size={20} />
                  ) : (
                    <ArrowDownIcon color={theme.palette.error.main} size={20} />
                  )}
                  <Typography
                    variant="h6"
                    color={isProfit ? "success.main" : "error.main"}
                    fontWeight="bold"
                  >
                    {formatIndianCurrency(Math.abs(netProfit))}
                  </Typography>
                </Box>
              </StatsCard>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfitDashboard;