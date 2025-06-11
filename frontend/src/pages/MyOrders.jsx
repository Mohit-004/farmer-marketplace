import { useEffect, useState } from "react";
import { getCustomerOrders } from "../utils/appwrite";  
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getCustomerOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-10">Loading orders...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FaShoppingCart className="mr-2" /> My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.$id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
              
              {/* Display Order Info */}
              <h2 className="text-xl font-bold text-gray-800">
                Order by: <span className="text-green-600">{order.customerName}</span>
              </h2>

              <p className="text-gray-700 mt-2">
                <strong>Product:</strong> {order.products.join(", ")}
              </p>

              <p className="text-gray-600">Quantity: {order.quantity}</p>
              <p className="text-gray-600">Total Price: ₹{order.totalPrice}</p>

              <p className="text-gray-600">Shipping Address:</p>
              <p className="text-gray-500">{order.shippingAddress}</p>

              <p className="text-gray-600 mt-2">Status: 
                <span className={`ml-2 font-bold ${order.orderStatus === "delivered" ? "text-green-600" : "text-yellow-600"}`}>
                  {order.orderStatus}
                </span>
              </p>

              <p className="text-gray-600 mt-2">
                <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </p>

              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
