import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../slice/selectionSlice";
import {
  ArrowDownward as ArrowDown,
  ArrowUpward as ArrowUp,
  AttachMoney as DollarSign,
  ShowChart as LineChart,
  People as Users,
  CheckCircle as Check,
  FilterList as Filter,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Container,
  Paper,
  Select,
  MenuItem,
  IconButton,
  Button,
  CircularProgress,
  FormControl,
  Card,
  CardContent,
  Stack,
  Pagination,
  Divider,
} from '@mui/material';
import axios from "axios";
import { fetchNotificationsApi, markAsReadApi } from "../utils/routes";

const ITEMS_PER_PAGE = 6;

const NotificationTypeIcons = {
  "Transaction Update": <DollarSign color="primary" />,
  "Stock Alert": <LineChart color="primary" />,
  "Entity Addition": <Users color="primary" />,
};

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.selection.currentUser);
  
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(fetchNotificationsApi, {
        params: {
          userId: currentUser.user_id,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          type: selectedType === "all" ? undefined : selectedType,
          sort: sortOrder,
        },
      });
      
      setUnreadNotifications(response.data.unread_notifications);
      setReadNotifications(response.data.read_notifications.data);
      setTotalPages(response.data.read_notifications.total_pages);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser?.user_id) {
      fetchNotifications();
    }
  }, [currentUser?.user_id, currentPage, selectedType, sortOrder]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(markAsReadApi, {
        notificationId,
        userId: currentUser.user_id,
      });
      
      dispatch(removeNotification(notificationId));
      setUnreadNotifications(prev => 
        prev.filter(n => n.notification_id !== notificationId)
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const renderNotificationSection = (title, notifications, isUnread = false) => {
    if (!notifications.length) return null;
    
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Stack spacing={2}>
          {notifications.map((notification) => (
            <Card
              key={notification.notification_id}
              sx={{
                bgcolor: isUnread ? 'primary.50' : 'background.paper',
              }}
              elevation={1}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ mr: 2 }}>
                    {NotificationTypeIcons[notification.type]}
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" color="text.primary">
                        {notification.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.timestamp).toLocaleString()}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {notification.message}
                    </Typography>
                  </Box>

                  {isUnread && (
                    <IconButton
                      onClick={() => markAsRead(notification.notification_id)}
                      size="small"
                      color="success"
                      sx={{ ml: 1 }}
                    >
                      <Check />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Notifications
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small">
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              displayEmpty
              startAdornment={<Filter sx={{ mr: 1 }} />}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="Transaction Update">Transaction Updates</MenuItem>
              <MenuItem value="Stock Alert">Stock Alerts</MenuItem>
              <MenuItem value="Entity Addition">Entity Additions</MenuItem>
            </Select>
          </FormControl>

          <Button
            startIcon={sortOrder === "desc" ? <ArrowDown /> : <ArrowUp />}
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            variant="outlined"
            size="small"
          >
            Date
          </Button>
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {renderNotificationSection("Unread", unreadNotifications, true)}
          {renderNotificationSection("Read", readNotifications, false)}
        </>
      )}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default NotificationsPage;