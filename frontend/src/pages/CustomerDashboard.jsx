import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) {
        navigate("/");
        return null;
    }

    return (
        <div className="min-h-screen bg-blue-100 p-8">
            <h1 className="text-3xl font-bold mb-4">Customer Dashboard</h1>
            <p>Welcome, {user.name}</p>
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Logout
            </button>
        </div>
    );
};

export default CustomerDashboard;
