import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { currency } from "../App";

const Dashboard = () => {
  const [data, setData] = useState({
    totalOrders: 0,
    delivered: 0,
    pending: 0,
    revenue: 0,
    recentOrders: [],
  });

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
    <div className="flex-1 min-w-0 px-6 py-6 bg-gray-50">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Orders" value={data.totalOrders} />
        <StatCard title="Delivered Orders" value={data.delivered} />
        <StatCard title="Pending Orders" value={data.pending} />
        <StatCard
          title="Total Revenue"
          value={`${currency}${data.revenue}`}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Orders
          </h3>
          <span className="text-sm text-gray-500">
            Last {data.recentOrders.length} orders
          </span>
        </div>

        {data.recentOrders.length === 0 ? (
          <p className="text-sm text-gray-500">
            No recent orders found.
          </p>
        ) : (
          <div className="space-y-4">
            {data.recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex justify-between items-center border-b last:border-b-0 pb-4 last:pb-0"
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
                    className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                      order.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-700"
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

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">
        {value}
      </p>
    </div>
  );
};

export default Dashboard;
