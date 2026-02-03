import React, { useEffect, useState, useCallback, useContext } from "react";
import api from "../utils/api";
import { currency } from "../App";
import { jwtDecode } from "jwt-decode";
import { AdminContext } from "../context/AdminContext";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  IndianRupee,
  Package,
  Truck,
} from "lucide-react";

const Dashboard = () => {
  const { socket } = useContext(AdminContext);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    activeOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    recentOrders: [],
    recentProducts: [],
  });

  /* ================= GET ROLE + PERMISSIONS ================= */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
      setPermissions(decoded.permissions || []);
    } catch (err) {
      console.error("Invalid token");
    }
  }, []);

  /* ================= FETCH DATA ================= */
  const fetchData = useCallback(async () => {
    if (!role) return;

    try {
      /* ================= ORDERS ================= */
      if (role === "SuperAdmin" || permissions.includes("orders")) {
        const orderRes = await api.post("/api/order/list");

        if (orderRes.data.success) {
          const orders = orderRes.data.orders;

          const pending = orders.filter(
            (o) => o.status === "Order Placed"
          );
          const active = orders.filter((o) =>
            ["Packing", "Out for Delivery"].includes(o.status)
          );
          const delivered = orders.filter(
            (o) => o.status === "Delivered"
          );

          const totalRevenue = delivered.reduce(
            (sum, o) => sum + o.amount,
            0
          );

          const todayRevenue = delivered
            .filter(
              (o) =>
                new Date(o.date).toDateString() ===
                new Date().toDateString()
            )
            .reduce((sum, o) => sum + o.amount, 0);

          setData((prev) => ({
            ...prev,
            totalOrders: orders.length,
            pendingOrders: pending.length,
            activeOrders: active.length,
            deliveredOrders: delivered.length,
            totalRevenue,
            todayRevenue,
            recentOrders: orders.slice(0, 6), // First 6 orders (already sorted newest first)
          }));
        }
      }

      /* ================= PRODUCTS ================= */
      if (
        role === "SuperAdmin" ||
        permissions.includes("products")
      ) {
        const productRes = await api.get("/api/product/list");

        if (productRes.data.success) {
          const products = productRes.data.products || [];

          setData((prev) => ({
            ...prev,
            totalProducts: products.length,
            activeProducts: products.filter((p) => p.isActive).length,
            inactiveProducts: products.filter((p) => !p.isActive).length,
            recentProducts: products.slice(0, 6), // First 6 products (already sorted newest first)
          }));
        }
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, [role, permissions]);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= REAL-TIME UPDATES ================= */
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
        fetchData();
    };

    socket.on("newOrder", handleUpdate);
    socket.on("orderStatusUpdate", handleUpdate);

    return () => {
        socket.off("newOrder", handleUpdate);
        socket.off("orderStatusUpdate", handleUpdate);
    };
  }, [socket, fetchData]);

  if (loading) return null;

  /* ================= CHECK IF PRODUCT ADMIN ================= */
  const isProductAdmin =
    permissions.length === 1 && permissions.includes("products");

  return (
    <div className="flex-1 px-3 sm:px-6 py-6 bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">
        Dashboard Overview
      </h2>

      {/* ================= PRODUCT ADMIN VIEW ================= */}
      {isProductAdmin ? (
        <>
          {/* PRODUCT STATS */}
          <ProductCards data={data} />

          {/* RECENTLY ADDED PRODUCTS */}
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 font-semibold">
              Recently Added Products
            </div>

            {data.recentProducts && data.recentProducts.length > 0 ? (
              data.recentProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex justify-between items-center px-6 py-4 border-b hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images && product.images[0] ? product.images[0] : '/placeholder.png'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.createdAt 
                          ? new Date(product.createdAt).toLocaleDateString()
                          : "Recently added"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {currency}
                      {product.price}
                    </p>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No products added yet
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* ================= REVENUE (SUPER ADMIN ONLY) ================= */}
          {role === "SuperAdmin" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard
                title="Total Revenue"
                value={`${currency}${data.totalRevenue}`}
                icon={IndianRupee}
                gradient="from-emerald-500 to-cyan-600"
              />
              <StatCard
                title="Today's Revenue"
                value={`${currency}${data.todayRevenue}`}
                icon={IndianRupee}
                gradient="from-teal-500 to-emerald-600"
              />
            </div>
          )}

          {/* ================= ORDERS (ALL ADMINS) ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Total Orders"
              value={data.totalOrders}
              icon={ShoppingBag}
              gradient="from-indigo-500 to-purple-600"
            />
            <StatCard
              title="Pending Orders"
              value={data.pendingOrders}
              icon={Clock}
              gradient="from-amber-500 to-orange-600"
            />
            <StatCard
              title="Active Orders"
              value={data.activeOrders}
              icon={Truck}
              gradient="from-blue-500 to-indigo-600"
            />
            <StatCard
              title="Delivered Orders"
              value={data.deliveredOrders}
              icon={CheckCircle}
              gradient="from-emerald-500 to-green-600"
            />
          </div>

          {/* ================= PRODUCTS (ONLY PRODUCT + SUPER ADMIN) ================= */}
          {permissions.length > 0 &&
            permissions.includes("products") &&
            role !== "SuperAdmin" && (
              <ProductCards data={data} />
            )}

          {role === "SuperAdmin" && <ProductCards data={data} />}

          {/* ================= RECENT ORDERS ================= */}
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 font-semibold">
              Recent Orders
            </div>

            {data.recentOrders.map((o) => (
              <div
                key={o._id}
                className="flex justify-between items-center px-6 py-4 border-b hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={o.items?.[0]?.images?.[0] || '/placeholder.png'}
                    alt={o.items?.[0]?.name || 'Product'}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium">
                      {o.address.firstName} {o.address.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(o.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {currency}
                    {o.amount}
                  </p>
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ================= PRODUCT CARDS ================= */
const ProductCards = ({ data }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
    <StatCard
      title="Total Products"
      value={data.totalProducts}
      icon={Package}
      gradient="from-indigo-500 to-blue-600"
    />
    <StatCard
      title="Active Products"
      value={data.activeProducts}
      icon={CheckCircle}
      gradient="from-emerald-500 to-green-600"
    />
    <StatCard
      title="Inactive Products"
      value={data.inactiveProducts}
      icon={Clock}
      gradient="from-gray-400 to-gray-600"
    />
  </div>
);

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow hover:shadow-xl transition">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl text-white bg-linear-to-tr ${gradient}`}
      >
        <Icon size={24} />
      </div>
    </div>
  </div>
);

export default Dashboard;
