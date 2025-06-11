import React, { useState, useEffect } from "react";
import { getFarmerOrders } from "../utils/appwrite";
import Sidebar from "../components/FarmerSidebar";  // ✅ Updated Sidebar Import
import {
  FaBox, FaUserCircle, FaMoneyBillWave, FaTruck, FaCalendarAlt, FaCheckCircle, FaTimesCircle,
} from "react-icons/fa";

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const farmerOrders = await getFarmerOrders();
        setOrders(farmerOrders);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
  };

  return (
    <div className="flex min-h-screen">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main Content */}
      <main className="flex-1 p-8 transition-all duration-300 ml-16 ">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Farmer Orders</h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Customer ID</th>
                  <th className="p-4 text-left">Products</th>
                  <th className="p-4 text-left">Quantity</th>
                  <th className="p-4 text-left">Total Price</th>
                  <th className="p-4 text-left">Payment</th>
                  <th className="p-4 text-left">Order Status</th>
                  <th className="p-4 text-left">Shipping Address</th>
                  <th className="p-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.$id} className="border-b hover:bg-gray-100 transition">
                      <td className="p-4">{order.orderId}</td>
                      <td className="p-4">{order.customerId}</td>

                      {/* ✅ Displaying products */}
                      <td className="p-4">
                        {order.products.map((product, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <FaBox className="text-blue-500" />
                            <span>{product.name} (x{product.quantity})</span>
                          </div>
                        ))}
                      </td>

                      <td className="p-4">{order.quantity}</td>
                      <td className="p-4 font-bold">₹{order.totalPrice.toFixed(2)}</td>

                      {/* ✅ Payment Status with badge */}
                      <td className="p-4">
                        {order.paymentStatus === "Paid" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded bg-green-500 text-white">
                            <FaCheckCircle className="mr-1" /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded bg-red-500 text-white">
                            <FaTimesCircle className="mr-1" /> Pending
                          </span>
                        )}
                      </td>

                      {/* ✅ Order Status */}
                      <td className="p-4">
                        {order.orderStatus === "Shipped" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded bg-blue-500 text-white">
                            <FaTruck className="mr-1" /> Shipped
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded bg-yellow-500 text-white">
                            <FaBox className="mr-1" /> Pending
                          </span>
                        )}
                      </td>

                      <td className="p-4">{order.shippingAddress}</td>
                      <td className="p-4">
                        <FaCalendarAlt className="inline text-yellow-500 mr-1" />
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default FarmerOrders;
