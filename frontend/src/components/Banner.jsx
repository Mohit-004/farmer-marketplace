import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Banner = () => {
  return (
    <div className="relative h-80 bg-cover bg-center mb-12 rounded-lg overflow-hidden shadow-lg"
         style={{ backgroundImage: "url('/images/banner.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
      {/* ✅ Circular Logo */}
                <Link to="/" className="flex items-center space-x-2">
                  <img 
                    src={logo} 
                    alt="Marketplace Logo" 
                    className="w-14 h-14 object-cover rounded-full border-4 border-white shadow-lg hover:shadow-xl transition"  // ✅ Styled Circular Logo
                  />
                </Link><h1 className="text-5xl text-green-900 font-bold">AgroMart</h1>
        <h1 className="text-5xl text-white font-bold">Welcome to Farmer Marketplace</h1>
        <p className="text-lg text-gray-300 mt-2">Fresh produce directly from farmers.</p>
        <Link to="/categories" className="mt-6 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition">
          Explore Marketplace
        </Link>
      </div>
    </div>
  );
};

export default Banner;
