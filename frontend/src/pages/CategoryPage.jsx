import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCategories, getProducts } from "../utils/appwrite";  // ✅ Import product fetch function

const CategoryPage = () => {
  const { slug } = useParams();  // ✅ Use slug instead of categoryName
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch category and its products
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        // 🔥 Fetch all categories
        const categories = await getCategories();

        // 🔥 Find the category by slug
        const selectedCategory = categories.find(
          (cat) => 
            cat.name.toLowerCase().replace(/ /g, "-") === slug
        );

        if (selectedCategory) {
          setCategory(selectedCategory);

          // ✅ Fetch products by category ID
          const allProducts = await getProducts();
          const filteredProducts = allProducts.filter(
            (product) => product.category === selectedCategory.name
          );

          setProducts(filteredProducts);
        } else {
          setError("Category not found.");
        }
      } catch (error) {
        console.error("❌ Error fetching category or products:", error);
        setError("Failed to load category and products.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!category) {
    return (
      <div className="text-center text-gray-600">
        No products available in this category.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">{category.name}</h1>

      {/* ✅ Display products vertically */}
      {products.length > 0 ? (
        <div className="flex flex-col gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4">
              <Link to={`/product/${product.id}`} className="flex items-center">
                <img 
                  src={product.fileId} 
                  alt={product.title} 
                  className="w-40 h-40 object-cover rounded-md mr-6" 
                />

                <div>
                  <h3 className="text-2xl font-bold">{product.title}</h3>
                  <p className="text-lg text-gray-700 mt-2">{product.description}</p>
                  <p className="text-lg font-semibold mt-2 text-green-600">₹{product.price}</p>

                  <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition">
                    View Details
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No products available in this category.</p>
      )}

      {/* ✅ Back Button */}
      <div className="mt-8">
        <Link
          to="/"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Back to Categories
        </Link>
      </div>
    </div>
  );
};

export default CategoryPage;