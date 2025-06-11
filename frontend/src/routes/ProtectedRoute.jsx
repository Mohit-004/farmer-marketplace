import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user, registerType } = useContext(AuthContext);

  // ✅ Redirect to login if no user is found
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ Redirect if user role does not match
  if (role && registerType !== role) {
    return <Navigate to="/" />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
