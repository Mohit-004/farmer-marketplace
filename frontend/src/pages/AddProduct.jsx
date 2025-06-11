import React, { useState, useEffect } from "react";
import { createProduct } from "../utils/appwrite";          
import { useNavigate } from "react-router-dom";
import { databases, DATABASE_ID, CATEGORIES_COLLECTION_ID } from "../utils/appwrite";
import { Query } from "appwrite";

const AddProduct = () => {
  const navigate = useNavigate();

  // ✅ Form State
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    discount: "",
    sku: "",
    isFeatured: false,
  });

  const [imageFile, setImageFile] = useState(null);         // ✅ Store image file object
  const [imagePreview, setImagePreview] = useState("");     // ✅ Image preview
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState("");

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          CATEGORIES_COLLECTION_ID,
          [Query.orderAsc("name")]
        );
        setCategories(response.documents);
      } catch (error) {
        console.error("❌ Failed to fetch categories:", error);
        setCategoryError("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  // ✅ Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle image file selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid image format. Only JPEG, PNG, JPG, and WEBP are allowed.");
        return;
      }

      setImageFile(file);   // ✅ Store the `File` object

      // ✅ Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate fields
    if (!productData.title || !productData.price || !productData.category || !imageFile) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true);

    try {
      const formattedData = {
        ...productData,
        price: parseInt(productData.price, 10),
        quantity: parseInt(productData.quantity, 10),
        discount: parseInt(productData.discount, 10),
        isFeatured: productData.isFeatured ? true : false,
      };

      // ✅ Call `createProduct()` with image file
      const newProduct = await createProduct(formattedData, imageFile);
      console.log("✅ Product Created:", newProduct);

      alert("Product added successfully!");
      navigate("/farmer/manage-products");

    } catch (error) {
      console.error("❌ Error adding product:", error);
      alert(`Failed to add product! Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input type="text" name="title" value={productData.title} onChange={handleChange} placeholder="Product Title" required className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-400" />

          <textarea name="description" value={productData.description} onChange={handleChange} placeholder="Product Description" required className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-400" />

          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="price" value={productData.price} onChange={handleChange} placeholder="Price (₹)" required className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-400" />
            <input type="number" name="quantity" value={productData.quantity} onChange={handleChange} placeholder="Stock" required className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-400" />
          </div>

          <select name="category" value={productData.category} onChange={handleChange} required className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-400">
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.$id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="space-y-2">
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-3 rounded-lg" />
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-40 h-40 object-cover rounded-lg shadow-md" />}
          </div>

          <button type="submit" className={`bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition ${loading ? "opacity-50" : ""}`} disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
