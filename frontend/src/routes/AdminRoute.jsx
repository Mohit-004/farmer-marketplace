import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, registerType, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;  
  }

  if (!user || registerType != "admin") {
    console.log("❌ Unauthorized access - Redirecting to home.");
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
