import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlusSquare, List } from "lucide-react";

const SidebarProductAdmin = () => {
  const base =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden";
  const active = "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm";
  const inactive = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <aside className="min-h-screen bg-white border-r border-gray-200 w-16 md:w-64 transition-all duration-300 shadow-sm">
      <div className="flex flex-col gap-2 px-2 md:px-4 pt-6">

        {/* DASHBOARD */}
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
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-r-full"></div>
              )}
              <LayoutDashboard size={20} className={isActive ? "text-indigo-600" : ""} />
              <span className="hidden md:inline">Dashboard</span>
            </>
          )}
        </NavLink>

        {/* ADD PRODUCTS */}
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
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-r-full"></div>
              )}
              <PlusSquare size={20} className={isActive ? "text-indigo-600" : ""} />
              <span className="hidden md:inline">Add Products</span>
            </>
          )}
        </NavLink>

        {/* PRODUCTS LIST */}
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
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-r-full"></div>
              )}
              <List size={20} className={isActive ? "text-indigo-600" : ""} />
              <span className="hidden md:inline">Products</span>
            </>
          )}
        </NavLink>

      </div>
    </aside>
  );
};

export default SidebarProductAdmin;
