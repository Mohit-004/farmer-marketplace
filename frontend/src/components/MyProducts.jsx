import React, { useState, useEffect } from "react";
import { getFarmerProducts } from "../utils/appwrite";
import { Link } from "react-router-dom";

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const farmerProducts = await getFarmerProducts();
                setProducts(farmerProducts);
            } catch (error) {
                console.error("❌ Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">My Products</h1>

            {products.length === 0 ? (
                <p className="text-gray-500">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.$id} className="border rounded-lg shadow-lg p-4">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-48 object-cover mb-4"
                            />
                            <h2 className="text-xl font-bold">{product.title}</h2>
                            <p className="text-gray-700">{product.description}</p>
                            <p className="text-green-600 font-bold">₹{product.price}</p>
                            <p className="text-sm text-gray-500">Stock: {product.quantity}</p>

                            <div className="flex justify-between items-center mt-4">
                                <Link
                                    to={`/edit-product/${product.$id}`}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Edit
                                </Link>
                                <Link
                                    to={`/delete-product/${product.$id}`}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Delete
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProducts;
