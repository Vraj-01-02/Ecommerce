import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

/* ================== STATUS HELPERS ================== */

const statusColor = {
  "Order Placed": "bg-gray-200 text-gray-700",
  Packing: "bg-yellow-200 text-yellow-800",
  Shipped: "bg-blue-200 text-blue-800",
  "Out for Delivery": "bg-purple-200 text-purple-800",
  Delivered: "bg-green-200 text-green-800",
};

const statusSteps = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

/* ================== COMPONENT ================== */

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const res = await api.post("/api/order/list");

      if (res.data.success) {
        setOrders([...res.data.orders].reverse());
      }
    } catch {
      toast.error("Failed to load orders");
    }
  };

  const statusHandler = async (e, orderId) => {
    const newStatus = e.target.value;
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;

    setLoadingId(orderId);

    try {
      const res = await api.post("/api/order/status", {
        orderId,
        status: newStatus,
      });

      if (res.data.success) {
        toast.success("Order status updated");
        fetchAllOrders();
      }
    } catch {
      toast.error("Status update failed");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="flex w-full min-w-0">
      <div className="flex-1 min-w-0 sm:px-6 pb-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl sm:text-2xl font-semibold">Orders</h2>
          <p className="text-sm text-gray-500">Total: {orders.length}</p>
        </div>

        {orders.length === 0 && (
          <p className="text-gray-500">
            No orders yet. Once customers place orders, they’ll appear here.
          </p>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-xl p-4 sm:p-6 mb-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="break-all">
                <p className="text-xs text-gray-500">Order ID</p>
                <span className="font-mono text-xs sm:text-sm">
                  {order._id}
                </span>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  statusColor[order.status]
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {statusSteps.map((step) => (
                <span
                  key={step}
                  className={`px-2 py-1 text-xs rounded-full ${
                    statusSteps.indexOf(step) <=
                    statusSteps.indexOf(order.status)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1.2fr_1fr_1fr] gap-6">
              <div>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 mb-3">
                    <img
                      src={item.images?.[0] || assets.parcel_icon}
                      className="w-12 h-12 object-cover rounded border"
                      alt={item.name}
                    />
                    <p className="text-sm">
                      {item.name} × {item.quantity} ({item.size})
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-sm space-y-1">
                <p>Items: {order.items.length}</p>
                <p>Method: {order.paymentMethod}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>

              <div className="text-sm space-y-1">
                <p className="text-lg font-semibold">
                  Total: {currency}
                  {order.amount}
                </p>
              </div>

              <div>
                <select
                  value={order.status}
                  disabled={loadingId === order._id}
                  onChange={(e) => statusHandler(e, order._id)}
                  className="w-full p-2 border rounded font-semibold"
                >
                  {statusSteps.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
