import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { currency } from "../App";
import { jwtDecode } from "jwt-decode";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  IndianRupee,
} from "lucide-react";

const Dashboard = () => {
  const [role, setRole] = useState(null);

  const [data, setData] = useState({
    totalOrders: 0,
    delivered: 0,
    pending: 0,
    revenue: 0,
    recentOrders: [],
  });

  /* ================= GET ROLE FROM TOKEN ================= */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.post("/api/order/list");

        if (res.data.success) {
          const orders = res.data.orders;

          const deliveredOrders = orders.filter(
            (o) => o.status === "Delivered"
          );

          const pendingOrders = orders.filter(
            (o) => o.status !== "Delivered"
          );

          const revenue = deliveredOrders.reduce(
            (sum, o) => sum + o.amount,
            0
          );

          setData({
            totalOrders: orders.length,
            delivered: deliveredOrders.length,
            pending: pendingOrders.length,
            revenue,
            recentOrders: orders.slice(-6).reverse(),
          });
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 min-w-0 px-6 py-6 bg-linear-to-br from-indigo-50 via-white to-purple-50">

      {/* PAGE TITLE */}
      <div className="inline-block mb-10">
        <h2 className="text-2xl font-semibold text-gray-900">
          Dashboard Overview
        </h2>

        <div className="relative mt-3">
          <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full" />
          <div className="absolute top-0 h-1.5 w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-60" />
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Orders"
          value={data.totalOrders}
          icon={ShoppingBag}
          gradient="from-indigo-500 to-purple-600"
        />

        <StatCard
          title="Delivered Orders"
          value={data.delivered}
          icon={CheckCircle}
          gradient="from-emerald-500 to-green-600"
        />

        <StatCard
          title="Pending Orders"
          value={data.pending}
          icon={Clock}
          gradient="from-amber-500 to-orange-600"
        />

        {/* 🔐 REVENUE — SUPER ADMIN ONLY */}
        {role === "SuperAdmin" && (
          <StatCard
            title="Total Revenue"
            value={`${currency}${data.revenue}`}
            icon={IndianRupee}
            gradient="from-emerald-500 to-cyan-600"
          />
        )}
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Orders
          </h3>
          <span className="text-sm text-gray-500">
            Last {data.recentOrders.length} orders
          </span>
        </div>

        {data.recentOrders.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">
            No recent orders found.
          </p>
        ) : (
          <div className="divide-y">
            {data.recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {order.address.firstName}{" "}
                    {order.address.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {currency}
                    {order.amount}
                  </p>
                  <span
                    className={`inline-flex mt-1 px-3 py-1 text-xs rounded-full font-medium ${
                      order.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */

const StatCard = ({ title, value, icon: Icon, gradient }) => {
  return (
    <div
      className="
        bg-white/70 backdrop-blur-xl
        border border-white/20
        rounded-2xl p-6
        shadow-lg transition
        hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {value}
          </p>
        </div>

        <div
          className={`w-12 h-12 flex items-center justify-center rounded-xl text-white shadow-lg bg-linear-to-tr ${gradient}`}
        >
          <Icon size={24} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
