import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loadingId, setLoadingId] = useState(null)

  // Fetch all orders
  const fetchAllOrders = async () => {
    if (!token) return

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      )

      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  // Update order status
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value
    setLoadingId(orderId)

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success('Order status updated')
        fetchAllOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    } finally {
      setLoadingId(null)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Orders</h3>

      {orders.map(order => (
        <div
          key={order._id}
          className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] 
          lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] 
          gap-3 items-start border-2 border-gray-300 
          p-5 md:p-8 my-3 text-xs sm:text-sm text-gray-700"
        >
          {/* Icon */}
          <img className="w-12" src={assets.parcel_icon} alt="Parcel" />

          {/* Items + Address */}
          <div>
            {order.items.map((item, idx) => (
              <p key={idx} className="py-0.5">
                {item.name} × {item.quantity} ({item.size})
              </p>
            ))}

            <p className="mt-3 mb-2 font-medium">
              {order.address.firstName} {order.address.lastName}
            </p>

            <p>{order.address.street}</p>
            <p>
              {order.address.city}, {order.address.state},{' '}
              {order.address.country} - {order.address.zipcode}
            </p>

            <p>{order.address.phone}</p>
          </div>

          {/* Meta */}
          <div>
            <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
            <p className="mt-3 ">Method: {order.paymentMethod}</p>
            <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
          </div>

          {/* Amount */}
          <p className="text-sm sm:text-[15]">
            {currency}{order.amount}
          </p>

          {/* Status */}
          <select
            value={order.status}
            disabled={loadingId === order._id}
            onChange={(e) => statusHandler(e, order._id)}
            className="p-2 font-semibold border"
          >
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  )
}

export default Orders
