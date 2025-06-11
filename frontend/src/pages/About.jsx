import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const About = () => {
  const navigate = useNavigate();   

  const handleNavigate = () => {
    navigate("/categories");      
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center px-4">
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="bg-white shadow-lg rounded-2xl p-10 max-w-4xl w-full"
      >
        <h1 className="text-4xl font-extrabold text-green-600 mb-6 text-center">
          About Us
        </h1>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Welcome to the <span className="text-blue-500 font-semibold">Farmer Marketplace</span>, 
          where farmers can connect directly with buyers and sell their products efficiently.
        </p>

        <div className="flex justify-center mt-10">
          <motion.button
            onClick={handleNavigate}  // ✅ Programmatic navigation
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Explore Marketplace
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
