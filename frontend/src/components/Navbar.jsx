import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaSignOutAlt, FaHome, FaInfoCircle, FaList, FaCaretDown, FaSearch, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getCategories } from "../utils/appwrite";
import logo from "../assets/logo.jpg";

const Navbar = () => {
  const { user, logout, registerType } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        const validCategories = fetchedCategories
          .filter((category) => category?.id && category?.name)
          .map((category) => ({
            id: category.id || category.$id,
            name: category.name,
          }));

        setCategories(validCategories);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        categoryRef.current && !categoryRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-green-600 to-blue-500 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt="Marketplace Logo" 
              className="w-14 h-14 object-cover rounded-full border-4 border-white shadow-lg hover:shadow-xl transition"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="flex items-center text-lg text-white hover:text-yellow-300 transition">
              <FaHome className="mr-1" /> Home
            </Link>
            <Link to="/about" className="flex items-center text-lg text-white hover:text-yellow-300 transition">
              <FaInfoCircle className="mr-1" /> About
            </Link>

            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center text-lg text-white hover:text-yellow-300 transition"
              >
                <FaList className="mr-1" /> Categories
                <FaCaretDown className="ml-1" />
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bg-white shadow-lg rounded-md mt-2 w-56 z-10"
                  >
                    {loading ? (
                      <div className="text-center p-4">Loading...</div>
                    ) : error ? (
                      <div className="text-center p-4 text-red-500">{error}</div>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.name.toLowerCase()}`}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <div className="text-center p-4">No categories available</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative w-1/3">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 pr-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-400"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </form>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="text-white hover:text-yellow-300 transition">
            <FaShoppingCart className="text-2xl" />
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition"
            >
              <FaUser className="text-xl mr-2" />
              {user ? <span>{user.name}</span> : <span>Account</span>}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-3 text-gray-800"
                >
                  {user ? (
                    <>
                      <p className="px-4 py-2 text-gray-600 font-semibold">Welcome, {user.name}</p>
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 transition">
                        Profile
                      </Link>

                      {registerType === "customer" && (
                        <Link to="/my-orders" className="block px-4 py-2 hover:bg-gray-100 transition">
                          My Orders
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 transition"
                      >
                        <FaSignOutAlt className="mr-2" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 transition">Login</Link>
                      <Link to="/register" className="block px-4 py-2 hover:bg-gray-100 transition">Register</Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
