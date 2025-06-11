import { useState, useEffect } from "react";
import { databases, DATABASE_ID, CATEGORIES_COLLECTION_ID, ID } from "../utils/appwrite";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { Query } from "appwrite";  // ✅ Import Query module

const AddCategoryModal = ({ isOpen, onClose, onCategoryAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextCategoryId, setNextCategoryId] = useState(1);

  // ✅ Fetch latest category ID correctly
  useEffect(() => {
    const fetchLatestCategoryId = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          CATEGORIES_COLLECTION_ID,
          [
            Query.orderDesc("createdAt"),   // ✅ Correct Query syntax
            Query.limit(1)                  // ✅ Limit to 1 document
          ]
        );

        if (response.documents.length > 0) {
          const lastCategory = response.documents[0];
          const lastId = parseInt(lastCategory.categoryId, 10);
          setNextCategoryId(lastId + 1);    // ✅ Auto-increment ID
        } else {
          setNextCategoryId(1);             // ✅ Start at 1 if no categories exist
        }
      } catch (error) {
        console.error("❌ Failed to fetch latest category ID:", error);
        setNextCategoryId(1);               // ✅ Fallback ID
      }
    };

    fetchLatestCategoryId();
  }, []);

  const handleAddCategory = async () => {
    if (!name || !description || !image) {
      setError("❌ All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentTime = new Date().toISOString();

      await databases.createDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        ID.unique(),
        {
          categoryId: nextCategoryId.toString(),
          name,
          description,
          image,
          createdAt: currentTime,
          updatedAt: currentTime
        }
      );

      setLoading(false);
      onCategoryAdded();
      onClose();
    } catch (error) {
      console.error("❌ Error adding category:", error);
      setError("Failed to add category. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-8">

        {/* ✅ Modal Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold">Add New Category</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✖️</button>
        </div>

        {/* ✅ Form Fields */}
        <div className="mt-4">
          <label className="block font-medium">Category ID:</label>
          <input
            type="text"
            value={`CAT${nextCategoryId}`}
            readOnly
            className="w-full px-4 py-2 border rounded mt-1 bg-gray-100"
          />

          <label className="block font-medium mt-4">Category Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Fruits"
            className="w-full px-4 py-2 border rounded mt-1"
            required
          />

          <label className="block font-medium mt-4">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Fresh and organic fruits"
            className="w-full px-4 py-2 border rounded mt-1"
            required
          />

          <label className="block font-medium mt-4">Image URL:</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="e.g., https://example.com/fruits.jpg"
            className="w-full px-4 py-2 border rounded mt-1"
            required
          />

          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>

        {/* ✅ Modal Actions */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleAddCategory}
            className={`bg-blue-600 text-white px-6 py-2 rounded ml-2 flex items-center gap-2 transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
