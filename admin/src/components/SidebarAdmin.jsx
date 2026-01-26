import React from "react";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  LayoutDashboard,
  PlusSquare,
  List,
  ShoppingBag,
  UserPlus,
  Users,
  ShieldCheck,
} from "lucide-react";

const Sidebar = () => {
  const token = localStorage.getItem("adminToken");

  // 🔐 If no token, do not render sidebar
  if (!token) return null;

  let role = null;

  try {
    const decoded = jwtDecode(token);
    role = decoded.role;
  } catch (error) {
    console.error("Invalid admin token");
    return null;
  }

  const base =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden";
  const active = "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm";
  const inactive = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <aside className="min-h-screen bg-white border-r border-gray-200 w-16 md:w-64 transition-all duration-300 shadow-sm">
      <div className="flex flex-col gap-2 px-2 md:px-4 pt-6">

        {/* ================= COMMON FOR ALL ADMINS ================= */}

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${base} justify-center md:justify-start ${
              isActive ? active : inactive
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-600 to-purple-600 rounded-r-full"></div>
              )}
              <LayoutDashboard size={20} className={isActive ? "text-indigo-600" : ""} />
              <span className="hidden md:inline">Dashboard</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            `${base} justify-center md:justify-start ${
              isActive ? active : inactive
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-600 to-purple-600 rounded-r-full"></div>
              )}
              <PlusSquare size={20} className={isActive ? "text-indigo-600" : ""} />
              <span className="hidden md:inline">Add Products</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            `${base} justify-center md:justify-start ${
              isActive ? active : inactive
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-600 to-purple-600 rounded-r-full"></div>
              )}
              <List size={20} className={isActive ? "text-indigo-600" : ""} />
              <span className="hidden md:inline">Products</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `${base} justify-center md:justify-start ${
              isActive ? active : inactive
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-600 to-purple-600 rounded-r-full"></div>
              )}
              <ShoppingBag size={20} className={isActive ? "text-indigo-600" : ""} />
              <span className="hidden md:inline">Orders</span>
            </>
          )}
        </NavLink>

        {/* ================= SUPER ADMIN ONLY ================= */}
        {role === "SuperAdmin" && (
          <>
            <div className="hidden md:block h-px bg-gray-200 my-2"></div>
            
            <NavLink
              to="/admin/create"
              className={({ isActive }) =>
                `${base} justify-center md:justify-start ${
                  isActive ? active : inactive
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-600 to-purple-600 rounded-r-full"></div>
                  )}
                  <UserPlus size={20} className={isActive ? "text-indigo-600" : ""} />
                  <span className="hidden md:inline">Create Admin</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/list"
              className={({ isActive }) =>
                `${base} justify-center md:justify-start ${
                  isActive ? active : inactive
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-600 to-purple-600 rounded-r-full"></div>
                  )}
                  <Users size={20} className={isActive ? "text-indigo-600" : ""} />
                  <span className="hidden md:inline">Admins</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/activity"
              className={({ isActive }) =>
                `${base} justify-center md:justify-start ${
                  isActive ? active : inactive
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-600 to-purple-600 rounded-r-full"></div>
                  )}
                  <ShieldCheck size={20} className={isActive ? "text-indigo-600" : ""} />
                  <span className="hidden md:inline">Admin Activity</span>
                </>
              )}
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
