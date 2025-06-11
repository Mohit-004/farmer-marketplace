import React, { Suspense, lazy, useEffect, useState } from "react";
import { getCategories, getProducts } from "../utils/appwrite";  // ✅ Appwrite API functions
import { Link } from "react-router-dom";

// ✅ Lazy load components for performance
const Navbar = lazy(() => import("../components/Navbar"));
const Banner = lazy(() => import("../components/Banner"));
const Events = lazy(() => import("../components/Events"));

const Home = () => {
  const [categories, setCategories] = useState([]);   // ✅ Categories state
  const [products, setProducts] = useState([]);       // ✅ Products state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await getCategories();     // ✅ Fetch categories
        const productData = await getProducts();        // ✅ Fetch products

        console.log("✅ Categories fetched:", categoryData);
        console.log("✅ Products fetched:", productData);

        setCategories(categoryData);
        setProducts(productData);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
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

      {/* ✅ Categories with Horizontally Scrollable Rows */}
      <div className="mt-8">
        {categories.length > 0 ? (
          categories.map((category) => {
            
            // ✅ Filter products by `category` NAME (case-insensitive & trimmed)
            const categoryProducts = products.filter(
              (product) =>
                product.category?.toLowerCase().trim() === category.name?.toLowerCase().trim()
            );

            return (
              <div key={category.id} className="mb-12">
                <h2 className="text-3xl font-bold mb-4">{category.name}</h2>

                {categoryProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="flex gap-6">
                      {categoryProducts.map((product) => (
                        <div
                          key={product.$id}    // ✅ Use `$id` instead of `id`
                          className="min-w-[300px] border rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
                        >
                          <Link to={`/product/${product.$id}`}>   {/* ✅ Use `$id` */}
                            <img
                              src={product.image || "/placeholder.png"}   // ✅ Display image or placeholder
                              alt={product.title || "Product Image"}
                              className="w-full h-40 object-cover rounded-t-lg"
                            />
                            <h3 className="text-lg font-bold mt-2">{product.title || "Unnamed Product"}</h3>
                            <p className="text-gray-600">{product.description || "No description available"}</p>
                            <p className="text-green-600 font-bold">₹{product.price || "N/A"}</p>
                          </Link>
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
