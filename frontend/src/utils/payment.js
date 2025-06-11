import axios from "axios";

// Razorpay Config
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET;

// Create order on Razorpay
export const createRazorpayOrder = async (amount, currency = "INR") => {
  try {
    const response = await axios.post("https://api.razorpay.com/v1/orders", {
      amount: amount * 100,  // Razorpay needs amount in paise
      currency: currency,
      receipt: `receipt_${new Date().getTime()}`,
      payment_capture: 1,
    }, {
      auth: {
        username: RAZORPAY_KEY_ID,
        password: RAZORPAY_KEY_SECRET,
      }
    });

    return response.data;  // Return order details
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error);
    throw error;
  }
};
