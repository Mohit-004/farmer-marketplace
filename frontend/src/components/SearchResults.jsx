import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { databases, DATABASE_ID, PRODUCTS_COLLECTION_ID, Query } from "../utils/appwrite";

const SearchResults = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const searchQuery = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          [

            Query.or(
              [Query.contains("title", searchQuery),        // ✅ Match in title
              Query.contains("description", searchQuery),   // ✅ Match in description
              Query.contains("category", searchQuery)]      // ✅ Match in category
            ),
            Query.limit(20)
          ]
        );

        if (response.documents.length === 0) {
          setError("No products found.");
        } else {
          setProducts(response.documents);
        }
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchProducts();
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for: <span className="text-blue-500">"{searchQuery}"</span>
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.$id} className="bg-white rounded-lg shadow-lg hover:scale-105 transition">
              <Link to={`/product/${product.$id}`}>
                <img
                  src={product.fileId || "/placeholder.png"}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => e.target.src = "/placeholder.png"}
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold">{product.title}</h2>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-green-600 font-bold">₹{product.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
