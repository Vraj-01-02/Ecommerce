import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { Search, User, ShoppingCart, Menu, ChevronLeft, LogOut } from "lucide-react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const {
    setShowSearch,
    getCartCount,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between py-4 px-4 sm:px-6 font-medium border-b bg-white relative z-50">
      <Link to="/" className="flex items-center gap-3">
        <img
          src={assets.logo}
          alt="FABRIC logo"
          className="w-12 h-12 object-contain"
        />
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-xl font-bold tracking-wide text-gray-900">
            FABRIC
          </span>
          <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">
            Official Store
          </span>
        </div>
      </Link>

      <ul className="hidden sm:flex gap-8 text-sm text-gray-700">
        {["/", "/collection", "/about", "/contact"].map((path, i) => (
          <NavLink
            key={i}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-indigo-600" : "hover:text-indigo-600"
              }`
            }
          >
            <p className="tracking-wide">
              {path === "/" ? "HOME" : path.replace("/", "").toUpperCase()}
            </p>
            <hr
              className={`w-2/4 border-none h-[2px] bg-indigo-600 ${
                window.location.pathname === path ? "block" : "hidden"
              }`}
            />
          </NavLink>
        ))}
      </ul>

      <div className="flex items-center gap-6">
        {/* Search Icon */}
        <Search
          onClick={() => setShowSearch(true)}
          className="w-6 h-6 cursor-pointer text-gray-700 hover:text-indigo-600 transition-colors"
        />

        {/* Profile Icon */}
        <div className="group relative">
          <User
            onClick={() => !token && navigate("/login")}
            className="w-6 h-6 cursor-pointer text-gray-700 hover:text-indigo-600 transition-colors"
          />

          {token && (
            <div className="hidden group-hover:block absolute right-0 pt-4 z-10">
              <div className="flex flex-col w-48 py-2 bg-white rounded-lg shadow-xl border border-gray-200">
                <p
                  onClick={() => navigate("/profile")}
                  className="px-4 py-3 cursor-pointer hover:bg-indigo-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-indigo-600"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">My Profile</span>
                </p>
                <p
                  onClick={() => navigate("/orders")}
                  className="px-4 py-3 cursor-pointer hover:bg-indigo-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-indigo-600"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="font-medium">Orders</span>
                </p>
                <hr className="my-1" />
                <p
                  onClick={logout}
                  className="px-4 py-3 cursor-pointer hover:bg-red-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative group">
          <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-indigo-600 transition-colors" />
          {getCartCount() > 0 && (
            <span className="absolute -right-1 -bottom-1 w-4 text-center leading-4 bg-indigo-600 text-white aspect-square rounded-full text-[8px] flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </Link>

        {/* Mobile Menu Icon */}
        <Menu
          onClick={() => setVisible(true)}
          className="w-6 h-6 cursor-pointer text-gray-700 sm:hidden hover:text-indigo-600 transition-colors"
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 bg-white transition-all duration-300 ${
          visible ? "w-full" : "w-0"
        } overflow-hidden z-50`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer border-b hover:bg-gray-50"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
            <p className="font-medium">Back</p>
          </div>

          {["/", "/collection", "/about", "/contact"].map((path, i) => (
            <NavLink
              key={i}
              to={path}
              onClick={() => setVisible(false)}
              className="py-3 pl-6 border-b hover:bg-gray-50 transition-colors uppercase text-sm font-medium tracking-wide"
            >
              {path === "/" ? "HOME" : path.replace("/", "").toUpperCase()}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
