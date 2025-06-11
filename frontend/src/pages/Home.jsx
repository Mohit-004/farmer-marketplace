import React, { Suspense, lazy, useEffect, useState } from "react";
import { getCategories, getProducts } from "../utils/appwrite";  // ✅ Appwrite API
import { Link } from "react-router-dom";

// ✅ Lazy load components for performance optimization
const Navbar = lazy(() => import("../components/Navbar"));
const Banner = lazy(() => import("../components/Banner"));
const Events = lazy(() => import("../components/Events"));

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await getCategories();
        const productData = await getProducts();

        console.log("✅ Categories fetched:", categoryData);
        console.log("✅ Products fetched with image URLs:", productData);

        setCategories(categoryData);
        setProducts(productData);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">

      {/* ✅ Banner */}
      <Suspense fallback={<div className="text-center p-6">Loading Banner...</div>}>
        <Banner />
      </Suspense>

      {/* ✅ Events */}
      <Suspense fallback={<div className="text-center p-6">Loading Events...</div>}>
        <Events />
      </Suspense>

      {/* ✅ Categories with Horizontal Scrollable Rows */}
      <div className="mt-8">
        {categories.length > 0 ? (
          categories.map((category) => {
            const categoryProducts = products.filter(
              (product) => product.category === category.name
            );

            return (
              <div key={category.id} className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">{category.name}</h2>

                {categoryProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="flex gap-6">
                      {categoryProducts.map((product) => (
                        <div
                          key={product.$id}
                          className="min-w-[300px] border rounded-lg shadow-lg hover:shadow-xl transition duration-300 bg-white"
                        >
                          <Link to={`/product/${product.$id}`}>
                            {/* ✅ Log Product and File ID */}
                            {console.log(`📦 Product: ${product.title}`, product)}

                            {/* ✅ Display Image using Dynamic URL */}
                            <img
                              src={product.fileId || "/placeholder.png"}   // Use dynamic URL
                              alt={product.title || "Product Image"}
                              className="w-full h-40 object-cover rounded-t-lg"
                              onError={(e) => e.target.src = "/placeholder.png"}  // Fallback to placeholder
                            />
                          </Link>

                          <div className="p-4">
                            <h3 className="text-xl font-bold">{product.title || "Unnamed Product"}</h3>
                            <p className="text-gray-600 line-clamp-2">{product.description || "No description available"}</p>
                            <p className="text-green-600 font-bold text-lg mt-2">₹{product.price || "N/A"}</p>

                            {/* ✅ View Details Button */}
                            <div className="mt-4">
                              <Link
                                to={`/product/${product.$id}`}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 italic">
                    No products available in this category.
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 italic">
            No categories available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
