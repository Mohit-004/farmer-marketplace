import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProducts } from "../utils/appwrite";   // ✅ Import Appwrite function

const Categories = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // ✅ Fetch products based on the selected category
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                const allProducts = await getProducts();
                
                // ✅ Filter products by category name (case-insensitive)
                const filteredProducts = allProducts.filter(
                    (product) => product.category?.toLowerCase() === categoryName?.toLowerCase()
                );

                if (filteredProducts.length === 0) {
                    setError(`No products found for ${categoryName}`);
                } else {
                    setProducts(filteredProducts);
                }
            } catch (error) {
                console.error("❌ Error fetching products:", error);
                setError("Failed to load products.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [categoryName]);

    // ✅ Display loading spinner while fetching data
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    // ✅ Display error message if no products found
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-3xl font-bold text-red-500">{error}</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold mb-8">{categoryName}</h1>

            {/* ✅ Horizontal Scroll Section */}
            <div className="flex overflow-x-auto space-x-6 p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {products.map((product) => (
                    <div
                        key={product.$id}
                        className="bg-white rounded-lg shadow-md min-w-[280px] hover:shadow-lg transition"
                    >
                        <Link to={`/product/${product.$id}`}>
                            <img
                                src={product.image || "https://via.placeholder.com/300"}
                                alt={product.title}
                                className="w-full h-56 object-cover rounded-t-lg"
                            />
                        </Link>

                        <div className="p-4">
                            <h3 className="text-xl font-bold">{product.title}</h3>
                            <p className="text-lg font-semibold mt-2 text-green-600">₹{product.price}</p>

                            <Link to={`/product/${product.$id}`}>
                                <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
                                    View Details
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

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

export default Categories;
