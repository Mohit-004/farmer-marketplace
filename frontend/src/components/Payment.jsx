import React, { useState, useEffect } from "react";
import axios from "axios";
import { databases, DATABASE_ID, USERS_COLLECTION_ID } from "../utils/appwrite";

const Payment = ({ product, customer }) => {
  const [farmerPaymentLink, setFarmerPaymentLink] = useState(null);

  // ✅ Fetch Farmer's Razorpay Link
  useEffect(() => {
    const fetchFarmerPaymentLink = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [`equal("userId", "${product.farmerId}")`]
        );

        if (response.documents.length > 0) {
          const farmer = response.documents[0];
          setFarmerPaymentLink(farmer.razorpayLink);
        } else {
          console.error("❌ Farmer not found.");
        }
      } catch (error) {
        console.error("❌ Error fetching farmer's payment link:", error);
      }
    };

    fetchFarmerPaymentLink();
  }, [product.farmerId]);

  // ✅ Razorpay Payment Handler
  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post("http://localhost:5000/api/create-order", {
        amount: product.price * 100,   // Razorpay expects amount in paisa
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      });

      const { order } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Farmer Marketplace",
        description: `Payment for ${product.title}`,
        handler: async (response) => {
          console.log("✅ Payment Successful:", response);

          // ✅ Verify payment on backend
          await axios.post("http://localhost:5000/api/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            productId: product.$id,
            customerId: customer.$id,
            farmerId: product.farmerId,
            totalPrice: product.price
          });

          alert("✅ Payment verified and order placed!");

        },
        prefill: {
          name: customer.fullName,
          email: customer.email,
          contact: customer.phone,
        },
        theme: {
          color: "#3399cc",
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("❌ Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Payment Details</h2>

      {farmerPaymentLink ? (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold">Farmer's Payment Link:</h3>
          <a
            href={farmerPaymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {farmerPaymentLink}
          </a>
        </div>
      ) : (
        <p className="text-red-500">Farmer payment link not available.</p>
      )}

      <div className="flex space-x-4 mt-4">
        {farmerPaymentLink && (
          <button
            onClick={handlePayment}
            className="bg-green-500 text-white px-6 py-3 rounded-lg"
          >
            Proceed to Payment
          </button>
        )}
      </div>
    </div>
  );
};

export default Payment;
