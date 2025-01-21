import UnreadMessagesModal from "../modals/UnreadMessagesModal";
import { fetchUnreadNotificationsApi , markAsReadApi} from "../utils/routes";
import { socket } from "../utils/socket";
import Sidebar from "./LeftDrawer";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { BsBellFill } from "react-icons/bs";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUnreadNotifs, removeNotification } from "../slice/selectionSlice";
const Layout = () => {
  const dispatch  = useDispatch()
  const [showNotifications, setShowNotifications] = useState(false);
  const user = useSelector((state) => state.selection.currentUser);
  const notifications = useSelector((state) => state.selection.unreadNotifs); 
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const result = await axios.post(fetchUnreadNotificationsApi, { user_id: user.user_id }, { withCredentials: true });
        dispatch(setUnreadNotifs(result.data.notifications))
      } catch (error) {
        console.log(error.message);
      }
    };
    if (user?.user_id) {
      fetchNotifications();
    }
  }, [user?.user_id, dispatch]);

  useEffect(() => {
    socket.connect();
    socket.on("notification", (notification) => {
      dispatch(setUnreadNotifs(notification))
    });

    return () => {
      socket.off("notification");
    };
  }, [socket]);


  const handleOnBellClick = () => {
    setShowNotifications((prev) => !prev);
  };
  
  return (
    <div className="grid grid-cols-12 bg-gray-200 min-h-screen relative">
      <div className="col-span-2 h-screen sticky top-0 bg-white hidden lg:flex">
        <Sidebar />
      </div>

      <div className="col-span-12 lg:col-span-10 flex flex-col relative">
        <div className="fixed top-6 right-6 z-50">
          <button
            className="p-3 bg-gray-100 rounded-full shadow-lg hover:bg-gray-50 transition-colors relative bell-button"
            onClick={handleOnBellClick}
          >
            <BsBellFill className="text-gray-600 text-xl" />
            {notifications?.length > 0 && (
              <div className="absolute -top-2 -right-2 flex items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {notifications?.length > 99 ? "99+" : notifications?.length}
                </span>
              </div>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-container absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
              <UnreadMessagesModal/>
            </div>
          )}
        </div>

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
