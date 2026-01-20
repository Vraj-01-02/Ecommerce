import React, { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import { assets } from "../assets/assets";
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavBar = ({ setToken }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(null); // ✅ REAL ADMIN DATA

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    navigate("/login");
  };

  /* ================= FETCH ADMIN PROFILE (🔥 MAIN FIX) ================= */

  const fetchAdminProfile = async () => {
    try {
      const { data } = await api.get("/api/admin/profile");
      if (data.success) {
        setAdmin(data.admin);
      }
    } catch (err) {
      console.error("Admin profile fetch error");
    }
  };

  /* ================= FETCH NOTIFICATIONS ================= */

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/api/notifications");
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error("Notification fetch error:", err.message);
    }
  };

  /* ================= MARK ALL READ ================= */

  const markAllRead = async () => {
    try {
      await api.put("/api/notifications/read-all");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all read error:", err.message);
    }
  };

  /* ================= SINGLE NOTIFICATION ================= */

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await api.put(`/api/notifications/${notification._id}/read`);
      }
      navigate(notification.link);
      setOpen(false);
    } catch (err) {
      console.error("Notification click error:", err.message);
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    fetchAdminProfile();      // ✅ ROLE / NAME / EMAIL
    fetchNotifications();     // 🔔 NOTIFICATIONS
  }, []);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <img
          src={assets.logo}
          alt="FABRIC Admin"
          className="h-12 md:h-14 w-auto"
        />
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-lg font-semibold">FABRIC</span>
          <span className="text-xs text-gray-500">ADMIN PANEL</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5 relative" ref={dropdownRef}>
        {/* 🔔 NOTIFICATIONS */}
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 rounded-full hover:bg-gray-100"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-12 w-80 bg-white border rounded-xl shadow-lg z-50">
            <div className="flex justify-between px-4 py-3 border-b">
              <span className="font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-indigo-600"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-gray-500 text-center">
                  No notifications
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className={`px-4 py-3 cursor-pointer border-b ${
                      !n.isRead ? "bg-indigo-50 font-medium" : ""
                    }`}
                  >
                    <p>{n.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 👤 PROFILE */}
        {admin && (
          <div
            onClick={() => navigate("/admin/profile")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 cursor-pointer"
          >
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-600 text-white">
              <User size={16} />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-medium">{admin.name}</span>
              <span className="text-[11px] text-gray-500">
                {admin.role}
              </span>
            </div>
          </div>
        )}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-full text-sm bg-indigo-600 text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default NavBar;
