import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import Navbar from "./components/Navbar";
import SidebarAdmin from "./components/SidebarAdmin";
import SidebarOrderAdmin from "./components/SidebarOrderAdmin";
import SidebarProductAdmin from "./components/SidebarProductAdmin";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import AdminProfile from "./pages/Adminprofile";
import CreateAdmin from "./pages/CreateAdmin";
import AdminList from "./pages/AdminList";
import AdminActivity from "./pages/AdminActivity";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹";

const App = () => {
  const [token, setToken] = useState(() =>
    localStorage.getItem("adminToken")
  );

  const [permissions, setPermissions] = useState([]);

  /* ================= TOKEN HANDLING ================= */
  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);

      try {
        const decoded = jwtDecode(token);
        setPermissions(decoded.permissions || []);
      } catch (err) {
        console.error("Invalid token");
        setPermissions([]);
      }
    } else {
      localStorage.removeItem("adminToken");
      setPermissions([]);
    }
  }, [token]);

  /* ================= SIDEBAR DECISION =================
     Order Admin    -> permissions = ["orders"]
     Product Admin  -> permissions = ["products"]
     Others         -> Admin sidebar
  */
  const isOrderAdmin =
    permissions.length === 1 && permissions.includes("orders");
  const isProductAdmin =
    permissions.length === 1 && permissions.includes("products");

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setToken={setToken} />
            )
          }
        />

        {/* ================= PROTECTED ================= */}
        <Route
          path="/*"
          element={
            token ? (
              <>
                <Navbar setToken={setToken} />
                <hr />

                <div className="flex w-full">
                  {/* 🔥 SIDEBAR SWITCH */}
                  {isOrderAdmin ? (
                    <SidebarOrderAdmin />
                  ) : isProductAdmin ? (
                    <SidebarProductAdmin />
                  ) : (
                    <SidebarAdmin />
                  )}

                  <div className="flex-1 mx-8 my-8">
                    <Routes>

                      {/* DEFAULT */}
                      <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                      />

                      {/* DASHBOARD */}
                      <Route path="/dashboard" element={<Dashboard />} />

                      {/* PRODUCTS (ADMIN / PRODUCT ADMIN) */}
                      <Route
                        path="/add"
                        element={
                          <ProtectedRoute requiredPermission="products">
                            <Add />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/list"
                        element={
                          <ProtectedRoute requiredPermission="products">
                            <List />
                          </ProtectedRoute>
                        }
                      />

                      {/* ORDERS (ORDER ADMIN + OTHERS) */}
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute requiredPermission="orders">
                            <Orders />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders/:id"
                        element={
                          <ProtectedRoute requiredPermission="orders">
                            <Orders />
                          </ProtectedRoute>
                        }
                      />

                      {/* PROFILE */}
                      <Route
                        path="/admin/profile"
                        element={<AdminProfile />}
                      />

                      {/* 👑 SUPER ADMIN ONLY */}
                      <Route
                        path="/admin/create"
                        element={
                          <ProtectedRoute>
                            <CreateAdmin />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/list"
                        element={
                          <ProtectedRoute>
                            <AdminList />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/activity"
                        element={
                          <ProtectedRoute>
                            <AdminActivity />
                          </ProtectedRoute>
                        }
                      />

                      {/* FALLBACK */}
                      <Route
                        path="*"
                        element={<Navigate to="/dashboard" replace />}
                      />
                    </Routes>
                  </div>
                </div>
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
