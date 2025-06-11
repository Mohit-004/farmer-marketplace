import React, { useState, useEffect } from "react";
import { createFarmerProduct, updateProduct } from "../utils/farmerAPI";
import { useNavigate, useParams } from "react-router-dom";
import { databases, DATABASE_ID, CATEGORIES_COLLECTION_ID } from "../utils/appwrite";
import { Query } from "appwrite";

const ProductForm = ({ initialData = null }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      price: "",
      image: "",
      category: "",
    }
  );

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          CATEGORIES_COLLECTION_ID,
          [
            Query.orderAsc("name")
          ]
        );

        setCategories(response.documents);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to load categories");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateProduct(id, formData);
      } else {
        await createFarmerProduct(formData);
      }
      navigate("/farmer-dashboard");
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          {id ? "Edit Product" : "Add Product"}
        </h2>

        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.$id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
