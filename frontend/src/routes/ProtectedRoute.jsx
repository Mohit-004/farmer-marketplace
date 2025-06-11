import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user, registerType } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }


  if (role && registerType !== role) {
    return <Navigate to="/" />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
