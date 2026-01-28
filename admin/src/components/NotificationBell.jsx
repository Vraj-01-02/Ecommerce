import React, { useState, useEffect, useRef } from "react";
import { Bell, ShoppingBag, CreditCard, Package } from "lucide-react";
import { toast } from "react-toastify";
import useSocket from "../hooks/useSocket";
import { currency } from "../App";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Handle new order notification
  const handleNewOrder = (data) => {
    const notification = {
      id: Date.now(),
      type: "newOrder",
      title: "New Order",
      message: `Order #${data.orderNumber} placed by ${data.customer}`,
      amount: data.amount,
      timestamp: new Date(data.timestamp),
      orderId: data.orderId,
      paymentMethod: data.paymentMethod,
      read: false,
    };

    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Play notification sound
    try {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    } catch (e) {}
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

  // Handle click on notification
  const handleNotificationClick = (notif) => {
    setShowDropdown(false);
    // Navigate to orders page. If your route is /orders/:id, this works.
    // If it's just /orders, they will see the list.
    // Based on Orders.jsx using useParams(), /orders/:id is likely supported.
    navigate(`/orders/${notif.orderId}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={handleDropdownToggle}
        className="relative p-2 hover:bg-gray-100 rounded-full transition duration-200 outline-none"
      >
        <Bell size={22} className={`text-gray-600 transition-colors ${showDropdown ? 'text-indigo-600' : ''}`} />
        
        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animation-fade-in-up">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {notifications.length > 0 && (
                <button 
                  onClick={() => setNotifications([])}
                  className="text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
                >
                    Clear All
                </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Bell size={20} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`group px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer flex gap-4 items-start ${
                    !notif.read ? "bg-indigo-50/40" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    notif.paymentMethod === 'Stripe' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {notif.paymentMethod === 'Stripe' 
                        ? <CreditCard size={18} /> 
                        : <ShoppingBag size={18} />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <p className={`text-sm font-semibold truncate ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notif.title}
                        </p>
                        <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                            {formatTime(notif.timestamp)}
                        </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2 leading-snug">
                       {notif.message}
                    </p>
                    
                    {notif.amount && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                          {currency}{notif.amount}
                        </span>
                        {notif.paymentMethod && (
                             <span className="text-[10px] text-gray-500 capitalize">
                                {notif.paymentMethod}
                             </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Unread Dot */}
                  {!notif.read && (
                    <div className="shrink-0 self-center">
                        <span className="block w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-indigo-100"></span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Footer Link (Optional, maybe specific to generic 'View All') */}
          {notifications.length > 0 && (
            <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                <button 
                  onClick={() => { setShowDropdown(false); navigate('/orders'); }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    View All Orders
                </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to format time (unchanged logic, just ensuring it's cleaner)
const formatTime = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return "Yesterday";
  return date.toLocaleDateString();
};

export default NotificationBell;
