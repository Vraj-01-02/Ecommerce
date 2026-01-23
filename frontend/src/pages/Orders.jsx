import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import userApi from "../utils/userApi";

const Orders = () => {
  const { currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      const res = await userApi.get("/api/order/user");

      if (res.data.success) {
        const allOrderItems = [];

        res.data.orders.forEach((order) => {
          // ❗ Stripe unpaid orders skip
          if (order.paymentMethod === "Stripe" && order.payment !== true) {
            return;
          }

          order.items.forEach((item) => {
            allOrderItems.push({
              ...item,
              status: order.status || "Order Placed",
              paymentMethod: order.paymentMethod,
              rawDate: order.date || null,
            });
          });
        });

        setOrderData(allOrderItems.reverse());
      }
    } catch (error) {
      console.error("ORDER LOAD ERROR:", error);
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return d.toDateString();
  };

  useEffect(() => {
    loadOrderData();
  }, []);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1="MY" text2="ORDERS" />
      </div>

      <div>
        {orderData.length === 0 ? (
          <p className="mt-8 text-gray-500">No orders found.</p>
        ) : (
          orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20"
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.name}
                />

                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>

                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>Qty: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>

                  <p className="mt-1">
                    Date:{" "}
                    <span className="text-gray-400">
                      {formatDate(item.rawDate)}
                    </span>
                  </p>

                  <p className="mt-1">
                    Payment:{" "}
                    <span className="text-gray-400">
                      {item.paymentMethod}
                    </span>
                  </p>
                </div>
              </div>

              <div className="md:w-1/2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>

                <button
                  onClick={loadOrderData}
                  className="border px-4 py-2 text-sm font-medium rounded-sm"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
