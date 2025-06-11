import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { databases, DATABASE_ID, PRODUCTS_COLLECTION_ID, getUserProfile } from "../utils/appwrite";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Query } from "appwrite";  // ✅ Import Query for filtering
import Sidebar from "../components/FarmerSidebar";  // ✅ Use sliding sidebar

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Fetch only current farmer's products
  useEffect(() => {
    const fetchFarmerProducts = async () => {
      setLoading(true);
      try {
        const farmer = await getUserProfile();
        const farmerId = farmer?.userId;

        if (!farmerId) {
          console.error("❌ Failed to identify farmer.");
          return;
        }

        // ✅ Filter products by farmerId
        const response = await databases.listDocuments(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          [Query.equal("farmerId", farmerId)]   // ✅ Filter by farmerId
        );

        setProducts(response.documents);

      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerProducts();
  }, []);

  // ✅ Open delete confirmation modal
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  // ✅ Handle delete product
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, deleteId);
      setProducts(products.filter((product) => product.$id !== deleteId));
      alert("✅ Product deleted successfully!");
    } catch (error) {
      console.error("❌ Failed to delete product:", error);
      alert("Failed to delete product.");
    } finally {
      setIsModalOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="flex min-h-screen ml-12">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main Content with Padding */}
      <main className="flex-1 p-8 transition-all duration-300 ml-28">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
          <Link
            to="/farmer/add-product"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 transition"
          >
            <FaPlus /> Add New Product
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Stock</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr
                      key={product.$id}
                      className={`${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"} hover:bg-gray-200 transition`}
                    >
                      <td className="p-4">{product.title}</td>
                      <td className="p-4">{product.description}</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">₹{product.price}</td>
                      <td className="p-4">{product.quantity}</td>
                      <td className="p-4 flex gap-2">
                        <Link
                          to={`/farmer/products/edit/${product.$id}`}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(product.$id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-600">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ Delete Confirmation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p>Are you sure you want to delete this product?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageProducts;
