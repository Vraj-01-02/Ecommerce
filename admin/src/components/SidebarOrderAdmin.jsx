import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingBag } from "lucide-react";

const SidebarOrderAdmin = () => {
  const base =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition";
  const active = "bg-indigo-50 text-indigo-700";
  const inactive = "text-gray-600 hover:bg-gray-100";

  const linkClass = ({ isActive }) =>
    `${base} justify-center md:justify-start ${
      isActive ? active : inactive
    }`;

  return (
    <aside className="min-h-screen bg-white border-r w-16 md:w-56 transition-all duration-200">
      <div className="flex flex-col gap-2 px-2 md:px-3 pt-6">

        {/* DASHBOARD */}
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          <span className="hidden md:inline">Dashboard</span>
        </NavLink>

        {/* ORDERS */}
        <NavLink to="/orders" className={linkClass}>
          <ShoppingBag size={20} />
          <span className="hidden md:inline">Orders</span>
        </NavLink>

      </div>
    </aside>
  );
};

export default SidebarOrderAdmin;
