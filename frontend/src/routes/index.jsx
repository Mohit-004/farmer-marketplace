import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Product from '../pages/Product';
import Cart from '../pages/Cart';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <ToastContainer />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
