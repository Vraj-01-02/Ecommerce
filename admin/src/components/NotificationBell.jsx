import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { toast } from "react-toastify";
import useSocket from "../hooks/useSocket";
import { currency } from "../App";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle new order notification
  const handleNewOrder = (data) => {
    const notification = {
      id: Date.now(),
      type: "newOrder",
      title: "New Order Received",
      message: `Order #${data.orderNumber} from ${data.customer}`,
      amount: data.amount,
      timestamp: new Date(data.timestamp),
      read: false,
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 10)); // Keep last 10
    setUnreadCount((prev) => prev + 1);

    // Show toast notification
    toast.success(
      `🛒 New Order #${data.orderNumber} - ${currency}${data.amount}`,
      {
        position: "top-right",
        autoClose: 5000,
      }
    );

    // Play notification sound (optional)
    try {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    } catch (error) {
      // Ignore audio errors
    }
  };

  // Initialize socket
  useSocket(handleNewOrder);

  // Mark all as read when dropdown opens
  const handleDropdownToggle = () => {
    if (!showDropdown) {
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    }
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDropdown && !e.target.closest(".notification-bell")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="notification-bell relative">
      {/* Bell Icon */}
      <button
        onClick={handleDropdownToggle}
        className="relative p-2 hover:bg-gray-100 rounded-full transition"
      >
        <Bell size={24} className="text-gray-700" />
        
        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell size={40} className="mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 border-b hover:bg-gray-50 transition ${
                    !notif.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">
                        {notif.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notif.message}
                      </p>
                      {notif.amount && (
                        <p className="text-sm font-semibold text-green-600 mt-1">
                          {currency}{notif.amount}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(notif.timestamp)}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t bg-gray-50 rounded-b-lg text-center">
              <button
                onClick={() => setNotifications([])}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to format time
const formatTime = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
};

export default NotificationBell;
