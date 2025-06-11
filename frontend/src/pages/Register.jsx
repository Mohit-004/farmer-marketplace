import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { registerUser } from "../utils/appwrite";

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    registerType: "farmer",  // ✅ Default to Farmer
    phone: "",
    address: "",
    adharNumber: "",          // ✅ Aadhaar number field
    razorpayLink: ""          // ✅ Razorpay.me link field (only for farmers)
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle Form Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.password || formData.password.trim() === "") {
      setError("❌ Password is required.");
      setLoading(false);
      return;
    }

    // ✅ Aadhaar validation
    if (!/^\d{12}$/.test(formData.adharNumber)) {
      setError("❌ Aadhaar number must be 12 digits.");
      setLoading(false);
      return;
    }

    // ✅ Razorpay Link validation for Farmers
    if (formData.registerType === "farmer" && !formData.razorpayLink) {
      setError("❌ Razorpay link is required for farmers.");
      setLoading(false);
      return;
    }

    try {
      await registerUser(formData);
      console.log("✅ Registration successful");
      navigate("/login");
    } catch (error) {
      console.error("❌ Registration failed:", error.message);
      setError(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg max-w-xl w-full"
        style={{ height: "90vh" }}
      >
        <div className="h-full flex flex-col justify-center p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h1>

          {error && (
            <div className="text-red-500 mb-4 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">

              {/* ✅ Name */}
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* ✅ Email */}
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* ✅ Password */}
              <div>
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* ✅ Phone */}
              <div>
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* ✅ Aadhaar Number */}
              <div className="col-span-2">
                <label className="block text-gray-700">Aadhaar Number</label>
                <input
                  type="text"
                  name="adharNumber"
                  value={formData.adharNumber}
                  onChange={handleChange}
                  placeholder="Enter 12-digit Aadhaar number"
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* ✅ Address */}
              <div className="col-span-2">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* ✅ Register Type */}
              <div className="col-span-2">
                <label className="block text-gray-700">Register Type</label>
                <select
                  name="registerType"
                  value={formData.registerType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="farmer">Farmer</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              {/* ✅ Razorpay Link (Only for Farmers) */}
              {formData.registerType === "farmer" && (
                <div className="col-span-2">
                  <label className="block text-gray-700">Razorpay.me Link</label>
                  <input
                    type="text"
                    name="razorpayLink"
                    value={formData.razorpayLink}
                    onChange={handleChange}
                    placeholder="Enter Razorpay.me link"
                    required
                    className="w-full p-2 border rounded-md"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Example: <span className="text-blue-500">https://razorpay.me/your-link</span>
                  </p>
                </div>
              )}
            </div>

            {/* ✅ Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
