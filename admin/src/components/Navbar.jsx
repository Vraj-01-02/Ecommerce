import React, { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import { assets } from "../assets/assets";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const NavBar = ({ setToken }) => {
  const [admin, setAdmin] = useState(null);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    navigate("/login");
  };

  /* ================= FETCH ADMIN PROFILE ================= */
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

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchAdminProfile();
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
        {/* 🔔 REAL-TIME NOTIFICATIONS */}
        <NotificationBell />

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
