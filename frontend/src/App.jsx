import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import CategoryPage from "./pages/CategoryPage";
import AdminDashboard from "./pages/AdminDashboard"; 
import FarmerDashboard from "./pages/FarmerDashboard";  
import ManageUsers from "./pages/ManageUsers";        
import AdminRoute from "./routes/AdminRoute";          
import ManageProducts from "./pages/ManageProducts";   
import FarmerOrders from "./pages/FarmerOrders";
import PlaceOrder from "./pages/PlaceOrder";
import Payment from "./components/Payment";    
import MyOrders from "./pages/MyOrders"; 
import EventDetails from "./components/EventDetails";
import SearchResults from "./components/SearchResults";


// ✅ Import the FarmerNavbar
import FarmerNavbar from "./components/FarmerNavbar";  

const App = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();  

  // ✅ Check if the current route is for admin or farmer
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isFarmerRoute = location.pathname.startsWith("/farmer");

  return (
    <>
      <div className="min-h-screen flex flex-col">

        {/* ✅ Conditional Navbar Rendering */}
        {!isAdminRoute && !isFarmerRoute && <Navbar />}      {/* Default Navbar */}
        {isFarmerRoute && <FarmerNavbar />}                   {/* Farmer Navbar */}

        <div className="flex-1">
          <Routes>

            {/* ✅ Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />

            {/* ✅ Product Routes */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/search" element={<SearchResults />} /> 
            


            {/* ✅ Protected Routes */}
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />

            {/* ✅ Farmer Routes */}
            <Route path="/farmer" element={<FarmerDashboard />} />
            <Route path="/farmer/manage-products" element={<ManageProducts />} />  
            
            <Route path="/farmer/orders" element={<FarmerOrders />} />
            <Route path="/farmer/add-product" element={<AddProduct />} />
            <Route path="/place-order/:productId" element={<PlaceOrder />} /> 

            {/* ✅ Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <ManageUsers />
                </AdminRoute>
              }
            />

            {/* ✅ Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* ✅ Show Footer only on public routes */}
        {!isAdminRoute && !isFarmerRoute && <Footer />}  
      </div>
    </>
  );
};

export default App;
