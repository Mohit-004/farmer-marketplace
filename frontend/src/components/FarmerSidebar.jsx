import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaBox, FaCog, FaSignOutAlt, FaUserCircle, FaStore, FaChartLine, 
  FaChevronRight, FaChevronLeft, FaUniversity 
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative h-screen">
      <div
        className={`fixed inset-y-0 left-0 bg-blue-900 text-white z-40 transition-all duration-300 ease-in-out shadow-lg ${
          isOpen ? "w-72" : "w-16"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className={`absolute top-1/2 -right-5 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 ${
            isOpen ? "translate-x-1" : "-translate-x-1"
          }`}
        >
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>

        <div className="p-4 border-b border-blue-700">
          <h1 className="text-2xl font-bold text-center">
            {isOpen ? "Farmer Panel" : "FP"}
          </h1>
        </div>

        <nav className="mt-4">
          <Link
            to="/farmer"
            className={`flex items-center p-4 hover:bg-blue-700 transition ${
              !isOpen && "justify-center"
            }`}
          >
            <FaChartLine className="mr-3" />
            {isOpen && "Dashboard"}
          </Link>

          <Link
            to="/farmer/manage-products"
            className={`flex items-center p-4 hover:bg-blue-700 transition ${
              !isOpen && "justify-center"
            }`}
          >
            <FaBox className="mr-3" />
            {isOpen && "Products"}
          </Link>

          <Link
            to="/farmer/orders"
            className={`flex items-center p-4 hover:bg-blue-700 transition ${
              !isOpen && "justify-center"
            }`}
          >
            <FaStore className="mr-3" />
            {isOpen && "Orders"}
          </Link>

          <Link
            to="/profile"
            className={`flex items-center p-4 hover:bg-blue-700 transition ${
              !isOpen && "justify-center"
            }`}
          >
            <FaUserCircle className="mr-3" />
            {isOpen && "Profile"}
          </Link>

          <Link
            to="/settings"
            className={`flex items-center p-4 hover:bg-blue-700 transition ${
              !isOpen && "justify-center"
            }`}
          >
            <FaCog className="mr-3" />
            {isOpen && "Settings"}
          </Link>

          <Link
            to="/logout"
            className={`flex items-center p-4 hover:bg-red-700 transition ${
              !isOpen && "justify-center"
            }`}
          >
            <FaSignOutAlt className="mr-3" />
            {isOpen && "Logout"}
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
