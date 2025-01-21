import NotificationItem from "../components/NotificationItem";
import { markAsReadApi } from "../utils/routes";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUnreadNotifs, removeNotification } from "../slice/selectionSlice";
const UnreadMessagesModal = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.selection.currentUser);
  const unreadNotifs = useSelector(state=>state.selection.unreadNotifs)

  const recentNotifications = unreadNotifs.slice(0, 3);

  const handleNotificationRead = async (notificationId) => {
    try {
      await axios.post(markAsReadApi, {
        notificationId,
        userId:user.user_id
      });
      dispatch(removeNotification(notificationId))
    } catch (error) {
      console.error("Error marking notification as read:", error.message);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Notifications
      </h3>

      {unreadNotifs?.length > 0 ? (
        <>
          <div className="space-y-3">
            {recentNotifications.map((notification, index) => (
              <NotificationItem
                key={notification.notification_id || index}
                notification={notification}
                onRead={handleNotificationRead}
                className={
                  index === 0 && notification.isNew ? "animate-slide-in" : ""
                }
              />
            ))}
          </div>

          <Link
            to="/notifications"
            className="flex items-center justify-center space-x-2 mt-4 py-2 w-full text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>See all notifications</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      ) : (
        <>
          <div className="py-6 text-center">
            <p className="text-gray-500 mb-4">No unread notifications</p>
          </div>
          <Link
            to="/notifications"
            className="flex items-center justify-center space-x-2 mt-2 py-2 w-full text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View all notifications</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      )}
    </div>
  );
};

export default UnreadMessagesModal;
