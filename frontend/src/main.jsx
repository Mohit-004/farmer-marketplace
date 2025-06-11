import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";   // ✅ Import BrowserRouter
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>  {/* ✅ Router wraps the AuthProvider */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
