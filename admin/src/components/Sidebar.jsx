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
  ShieldCheck, // ✅ ADMIN ACTIVITY ICON
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
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition";
  const active = "bg-indigo-50 text-indigo-700";
  const inactive = "text-gray-600 hover:bg-gray-100";

  return (
    <aside className="min-h-screen bg-white border-r w-16 md:w-56 transition-all duration-200">
      <div className="flex flex-col gap-2 px-2 md:px-3 pt-6">

        {/* ================= COMMON FOR ALL ADMINS ================= */}

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${base} justify-center md:justify-start ${
              isActive ? active : inactive
            }`
          }
        >
          <LayoutDashboard size={20} />
          <span className="hidden md:inline">Dashboard</span>
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            `${base} justify-center md:justify-start ${
              isActive ? active : inactive
            }`
          }
        >
          <PlusSquare size={20} />
          <span className="hidden md:inline">Add Products</span>
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            `${base} justify-center md:justify-start ${
              isActive ? active : inactive
            }`
          }
        >
          <List size={20} />
          <span className="hidden md:inline">Products</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `${base} justify-center md:justify-start ${
              isActive ? active : inactive
            }`
          }
        >
          <ShoppingBag size={20} />
          <span className="hidden md:inline">Orders</span>
        </NavLink>

        {/* ================= SUPER ADMIN ONLY ================= */}
        {role === "SuperAdmin" && (
          <>
            <NavLink
              to="/admin/create"
              className={({ isActive }) =>
                `${base} justify-center md:justify-start ${
                  isActive ? active : inactive
                }`
              }
            >
              <UserPlus size={20} />
              <span className="hidden md:inline">Create Admin</span>
            </NavLink>

            <NavLink
              to="/admin/list"
              className={({ isActive }) =>
                `${base} justify-center md:justify-start ${
                  isActive ? active : inactive
                }`
              }
            >
              <Users size={20} />
              <span className="hidden md:inline">Admins</span>
            </NavLink>

            {/* 🔥 ADMIN ACTIVITY LOG */}
            <NavLink
              to="/admin/activity"
              className={({ isActive }) =>
                `${base} justify-center md:justify-start ${
                  isActive ? active : inactive
                }`
              }
            >
              <ShieldCheck size={20} />
              <span className="hidden md:inline">Admin Activity</span>
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
