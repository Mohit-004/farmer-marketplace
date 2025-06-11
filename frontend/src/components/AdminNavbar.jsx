import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaUser, FaBox, FaShoppingCart, FaCog, FaTags, FaSignOutAlt, 
  FaTachometerAlt, FaChevronLeft, FaChevronRight 
} from "react-icons/fa";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-2xl z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-72" : "w-20"
        }`}
      >
        <div className="flex justify-center items-center p-5 bg-blue-600">
          {isOpen ? (
            <h1 className="text-2xl font-bold text-center">Admin Panel</h1>
          ) : null}

          <button
            onClick={toggleSidebar}
            className="bg-blue-700 text-white p-2 rounded-full shadow-lg hover:bg-blue-800 transition ml-auto"
          >
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        <nav className="mt-4">
          <Link
            to="/admin/dashboard"
            className={`flex items-center p-4 hover:bg-blue-500 transition ${
              isActive("/admin/dashboard") ? "bg-blue-500" : ""
            }`}
          >
            <FaTachometerAlt className="text-xl" />
            {isOpen && <span className="ml-3 transition-opacity duration-300">Dashboard</span>}
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center p-4 hover:bg-blue-500 transition ${
              isActive("/admin/users") ? "bg-blue-500" : ""
            }`}
          >
            <FaUser className="text-xl" />
            {isOpen && <span className="ml-3 transition-opacity duration-300">Manage Users</span>}
          </Link>

          <Link
            to="/admin/categories"
            className={`flex items-center p-4 hover:bg-blue-500 transition ${
              isActive("/admin/categories") ? "bg-blue-500" : ""
            }`}
          >
            <FaTags className="text-xl" />
            {isOpen && <span className="ml-3 transition-opacity duration-300">Manage Categories</span>}
          </Link>

          <Link
            to="/admin/products"
            className={`flex items-center p-4 hover:bg-blue-500 transition ${
              isActive("/admin/products") ? "bg-blue-500" : ""
            }`}
          >
            <FaBox className="text-xl" />
            {isOpen && <span className="ml-3 transition-opacity duration-300">Manage Products</span>}
          </Link>

          <Link
            to="/admin/orders"
            className={`flex items-center p-4 hover:bg-blue-500 transition ${
              isActive("/admin/orders") ? "bg-blue-500" : ""
            }`}
          >
            <FaShoppingCart className="text-xl" />
            {isOpen && <span className="ml-3 transition-opacity duration-300">Orders</span>}
          </Link>

          <Link
            to="/admin/settings"
            className={`flex items-center p-4 hover:bg-blue-500 transition ${
              isActive("/admin/settings") ? "bg-blue-500" : ""
            }`}
          >
            <FaCog className="text-xl" />
            {isOpen && <span className="ml-3 transition-opacity duration-300">Settings</span>}
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center p-4 bg-red-600 hover:bg-red-700 transition duration-300"
        >
          <FaSignOutAlt className="text-xl" />
          {isOpen && <span className="ml-3 transition-opacity duration-300">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
