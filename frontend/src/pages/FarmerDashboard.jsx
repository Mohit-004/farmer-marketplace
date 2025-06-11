import React, { useState, useEffect } from "react";
import { getUserProfile } from "../utils/appwrite";
import { Link } from "react-router-dom";
import FarmerSidebar from "../components/FarmerSidebar";  

import { FaBox, FaCog, FaSignOutAlt, FaUserCircle, FaStore, FaChartLine } from "react-icons/fa";  

const FarmerDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        if (!userProfile) {
          setError("Failed to load profile.");
        } else {
          setUser(userProfile);
        }
      } catch (error) {
        console.error("❌ Error:", error);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
    
    <div className="flex min-h-screen bg-gray-100">
     
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-white shadow-md p-4 rounded-lg z-10">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          
        </div>

        {/* Welcome Section */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, {user?.name || "Farmer"} 👋
            </h2>
            <p className="text-gray-600 mt-2">
              Manage your products, view orders, and track your sales all in one place.
            </p>
          </div>
        )}

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/farmer/manage-products"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
          >
            <FaBox className="text-blue-500 text-4xl mb-4" />
            <h3 className="text-xl font-bold">Manage Products</h3>
            <p className="text-gray-600">View, edit, or delete your products.</p>
          </Link>

          <Link
            to="/farmer/orders"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
          >
            <FaStore className="text-green-500 text-4xl mb-4" />
            <h3 className="text-xl font-bold">View Orders</h3>
            <p className="text-gray-600">Check all customer orders and details.</p>
          </Link>

          <Link
            to="/profile"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
          >
            <FaUserCircle className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-xl font-bold">Profile Settings</h3>
            <p className="text-gray-600">Update your profile and settings.</p>
          </Link>

          <Link
            to="/settings"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
          >
            <FaCog className="text-purple-500 text-4xl mb-4" />
            <h3 className="text-xl font-bold">Settings</h3>
            <p className="text-gray-600">Modify your preferences.</p>
          </Link>

          <Link
            to="/logout"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
          >
            <FaSignOutAlt className="text-red-500 text-4xl mb-4" />
            <h3 className="text-xl font-bold">Logout</h3>
            <p className="text-gray-600">Sign out from your account.</p>
          </Link>
        </div>

      </main>
    </div>
    </>
  );
};

export default FarmerDashboard;
