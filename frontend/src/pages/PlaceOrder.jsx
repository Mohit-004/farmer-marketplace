import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { databases, DATABASE_ID, ORDERS_COLLECTION_ID, getUserProfile } from "../utils/appwrite";
import { ID } from "appwrite";

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const product = location.state?.product;

  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    quantity: 1,   
  });

  //Fetch current logged-in customer ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userProfile = await getUserProfile();
        setCustomerId(userProfile.userId);
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
      }
    };

    fetchUser();
  }, []);

  //Update total price dynamically based on quantity
  useEffect(() => {
    if (product && shippingDetails.quantity > 0) {
      setTotalPrice(product.price * shippingDetails.quantity);
    }
  }, [shippingDetails.quantity, product]);

  if (!product) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500 text-2xl">No product found for checkout.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-5 py-2 mt-4 rounded hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }


  const handleChange = (e) => {
    const { name, value } = e.target;


    const updatedValue = name === "quantity" ? Math.max(1, parseInt(value)) : value;

    setShippingDetails((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  
  const handlePlaceOrder = async () => {
    if (
      !shippingDetails.fullName ||
      !shippingDetails.email ||
      !shippingDetails.address ||
      !shippingDetails.phone ||
      !customerId
    ) {
      alert("Please fill in all shipping details.");
      return;
    }

    setLoading(true);

    const orderData = {
      orderId: ID.unique(),
      quantity: parseInt(shippingDetails.quantity),
      status: "pending",
      customerId: customerId,
      farmerId: product.farmerId,
      paymentStatus: "pending",
      products: [product.title],
      totalPrice: totalPrice,
      orderStatus: "pending",
      shippingAddress: `${shippingDetails.address}, ${shippingDetails.phone}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {

      await databases.createDocument(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        orderData.orderId,
        orderData
      );

      alert("✅ Order placed successfully!");
      navigate("/");

    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full">
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Place Your Order</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg">
            <img
              src={product.fileId || "/placeholder.png"}
              alt={product.title}
              className="w-40 h-40 object-cover rounded-lg"
              onError={(e) => (e.target.src = "/placeholder.png")}
            />
            
            <div className="mt-4 text-center">
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-gray-600 mt-1">{product.description}</p>
              <p className="text-green-600 font-bold text-xl">Price : ₹{product.price}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <form className="space-y-4">
              
              <input type="text" name="fullName" placeholder="Full Name" value={shippingDetails.fullName} onChange={handleChange} className="w-full border p-3 rounded-lg" required />

              <input type="email" name="email" placeholder="Email Address" value={shippingDetails.email} onChange={handleChange} className="w-full border p-3 rounded-lg" required />

              <input type="text" name="phone" placeholder="Phone" value={shippingDetails.phone} onChange={handleChange} className="w-full border p-3 rounded-lg" required />

              <textarea name="address" placeholder="Shipping Address" value={shippingDetails.address} onChange={handleChange} className="w-full border p-3 rounded-lg" required />

          
              <div className="flex items-center space-x-4">
                <label className="text-lg font-semibold">Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={shippingDetails.quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-20 border p-2 rounded-lg"
                  required
                />
              </div>

              <p className="text-lg font-bold">Total: ₹{totalPrice}</p>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="bg-green-500 text-white px-5 py-2 rounded-lg w-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
