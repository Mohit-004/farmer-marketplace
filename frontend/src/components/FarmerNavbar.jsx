import { React, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";  // ✅ Added navigate for redirecting
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";  // ✅ Import AuthContext

const FarmerNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();  // ✅ Navigation hook for redirection

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");  // ✅ Redirect to home after logout
    } catch (error) {
      console.error("❌ Failed to logout:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-blue-500 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        
        {/* ✅ Logo */}
        <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200 transition">
          Farmer Panel
        </Link>

        {/* ✅ Navigation Links */}
        <div className="flex items-center gap-8">
          
          {/* ✅ User Info */}
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-3xl text-white" />
            <span className="text-white font-semibold">
              {user ? user.name : "Account"}
            </span>
          </div>

          {/* ✅ Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default FarmerNavbar;
