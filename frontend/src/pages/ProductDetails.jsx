import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { databases, DATABASE_ID, PRODUCTS_COLLECTION_ID, account } from "../utils/appwrite"; 

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await databases.getDocument(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          productId
        );
        console.log("✅ Product Details:", response);
        setProduct(response);
      } catch (error) {
        console.error("❌ Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkAuth = async () => {
      try {
        const user = await account.get();
        setIsAuthenticated(true);  
        console.log("✅ User logged in:", user);
      } catch {
        setIsAuthenticated(false); 
      }
    };

    fetchProduct();
    checkAuth();
  }, [productId]);

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">Product not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }


  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(`/place-order/${productId}`, { state: { product } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">

        <div className="flex gap-8">
          {/* Image Section */}
          <div className="w-1/2">
            <img
              src={product.fileId || "/placeholder.png"}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg shadow-md"
              onError={(e) => (e.target.src = "/placeholder.png")}
            />
          </div>

          {/* Details Section */}
          <div className="w-1/2">
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="flex gap-4">
              <p className="text-green-600 font-bold text-2xl">₹{product.price}</p>
              {product.discount > 0 && (
                <p className="text-red-500 line-through text-xl">
                  ₹{(product.price / (1 - product.discount / 100)).toFixed(2)}
                </p>
              )}
            </div>

            <p className="text-gray-700 mt-4">
              <strong>Category:</strong> {product.category}
            </p>
            <p className="text-gray-700">
              <strong>Stock:</strong> {product.quantity} units
            </p>
            <p className="text-gray-700">
              <strong>SKU:</strong> {product.sku}
            </p>
            <p className="text-gray-700">
              <strong>Rating:</strong> {product.rating || "N/A"}
            </p>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleBuyNow}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
              >
                {isAuthenticated ? "Buy Now" : "Login to Buy"}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
