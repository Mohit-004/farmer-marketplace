import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, logoutUser, getUserProfile } from "../utils/appwrite";  

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerType, setRegisterType] = useState(null);  
  const [loading, setLoading] = useState(true);   // ✅ Add loading state
  const navigate = useNavigate();

  // ✅ Fetch user profile on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getUserProfile();
        if (currentUser) {
          setUser(currentUser);
          setRegisterType(currentUser.registerType);
          redirectToDashboard(currentUser.registerType);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Function to redirect users based on role
  const redirectToDashboard = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "farmer":
        navigate("/farmer");
        break;
      case "customer":
        navigate("/customer");
        break;
      default:
        navigate("/login");
    }
  };

  // ✅ Login function with immediate profile update
  const login = async (email, password) => {
    try {
      const userData = await loginUser(email, password);
      
      // ✅ Immediately fetch the latest user profile after login
      const updatedUser = await getUserProfile();
      
      setUser(updatedUser);
      setRegisterType(updatedUser.registerType);  
      
      // ✅ Redirect immediately
      redirectToDashboard(updatedUser.registerType);

    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  };

  // ✅ Logout function
  const logout = async () => {
    await logoutUser();
    setUser(null);
    setRegisterType(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, registerType, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
