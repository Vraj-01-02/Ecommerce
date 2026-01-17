import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { assets } from "../assets/assets";
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavBar = ({ setToken }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    navigate("/login");
  };

  /* ================= FETCH NOTIFICATIONS ================= */
  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/api/notification/admin");

      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  /* ================= MARK ALL READ ================= */
  const markAllRead = async () => {
    try {
      await api.put("/api/notification/read");

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <header className="w-full bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between">
      {/* LEFT : LOGO */}
      <div className="flex items-center gap-3">
        <img
          src={assets.logo}
          alt="FABRIC Admin"
          className="h-12 sm:h-14 md:h-16 w-auto object-contain"
        />
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-lg font-semibold text-gray-900">
            FABRIC
          </span>
          <span className="text-xs tracking-wide text-gray-500">
            ADMIN PANEL
          </span>
        </div>
      </div>

      {/* RIGHT : ACTIONS */}
      <div className="flex items-center gap-5">
        {/* 🔔 NOTIFICATION */}
        <button
          onClick={markAllRead}
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
        >
          <Bell size={20} className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-px rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        {/* 👤 PROFILE */}
        <div
          onClick={() => navigate("/admin/profile")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200"
        >
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-600 text-white">
            <User size={16} />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-800">
              Admin
            </span>
            <span className="text-[11px] text-gray-500">
              Super Admin
            </span>
          </div>
        </div>

        {/* 🚪 LOGOUT */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default NavBar;
