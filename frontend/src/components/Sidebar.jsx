import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaBox, FaShoppingCart, FaCog, FaTags, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";  
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="p-5 text-3xl font-bold bg-blue-600">
        Admin Panel
      </div>

      <nav className="flex-1">
        <Link 
          to="/admin/dashboard" 
          className={`flex items-center px-5 py-3 transition duration-300 ${
            isActive("/admin/dashboard") ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
        >
          <FaTachometerAlt className="mr-3" />
          <span>Dashboard</span>
        </Link>

        <Link 
          to="/admin/users" 
          className={`flex items-center px-5 py-3 transition duration-300 ${
            isActive("/admin/users") ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
        >
          <FaUser className="mr-3" />
          <span>Manage Users</span>
        </Link>

        <Link 
          to="/admin/categories" 
          className={`flex items-center px-5 py-3 transition duration-300 ${
            isActive("/admin/categories") ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
        >
          <FaTags className="mr-3" />
          <span>Manage Categories</span>
        </Link>

        <Link 
          to="/admin/products" 
          className={`flex items-center px-5 py-3 transition duration-300 ${
            isActive("/admin/products") ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
        >
          <FaBox className="mr-3" />
          <span>Manage Products</span>
        </Link>

        <Link 
          to="/admin/orders" 
          className={`flex items-center px-5 py-3 transition duration-300 ${
            isActive("/admin/orders") ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
        >
          <FaShoppingCart className="mr-3" />
          <span>Orders</span>
        </Link>

        <Link 
          to="/admin/settings" 
          className={`flex items-center px-5 py-3 transition duration-300 ${
            isActive("/admin/settings") ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
        >
          <FaCog className="mr-3" />
          <span>Settings</span>
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-5 py-3 flex items-center justify-center transition duration-300"
      >
        <FaSignOutAlt className="mr-2" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
