import React, { useState } from 'react';
import { Check, Box } from "lucide-react";
import { useDispatch } from 'react-redux';
import { removeNotification } from '../slice/selectionSlice';

const NotificationItem = ({ notification, onRead }) => {
  const [isRead, setIsRead] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const dispatch = useDispatch();

  const handleClick = async () => {
    setIsRead(true);
    
    // First animation: checkmark
    setTimeout(() => {
      setIsSliding(true);
      
      // Second animation: slide out
      setTimeout(() => {
        // Call the API to mark as read
        onRead(notification.notification_id);
        // Update Redux store
        dispatch(removeNotification(notification.notification_id));
      }, 500);
    }, 500);
  };

  return (
    <div
      className={`transform transition-all duration-500 ease-in-out ${
        isSliding ? 'translate-x-full opacity-0' : ''
      }`}
    >
      <div 
        onClick={handleClick}
        className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex-shrink-0 mt-1">
          <div className={`transform transition-all duration-500 ${isRead ? 'rotate-360' : ''}`}>
            {isRead ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Box className="h-5 w-5 text-blue-500" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 line-clamp-2">
            {notification.message}
          </p>
          {notification.timestamp && (
            <p className="text-xs text-gray-500 mt-1">
              {new Date(notification.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;