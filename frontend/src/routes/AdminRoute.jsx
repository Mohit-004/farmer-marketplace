import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, registerType, loading } = useContext(AuthContext);

  // ✅ Wait until the auth state is loaded
  if (loading) {
    return <div>Loading...</div>;  // ✅ Display loader while loading
  }

  // ✅ Check if the user is logged in and has "admin" role
  if (!user || registerType != "admin") {
    console.log("❌ Unauthorized access - Redirecting to home.");
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
