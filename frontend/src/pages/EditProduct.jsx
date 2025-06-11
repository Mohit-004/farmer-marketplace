import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateFarmerProduct } from "../utils/farmerAPI";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [productData, setProductData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);
        setProductData(product);
        setImagePreview(product.image || "");    // ✅ Load existing image
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate("/dashboard");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateFarmerProduct(id, productData, imageFile);
      alert("Product updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product!");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ✅ Title */}
        <input
          type="text"
          name="title"
          value={productData.title || ""}
          onChange={handleChange}
          placeholder="Product Title"
          required
          className="w-full border p-2"
        />

        {/* ✅ Image Upload */}
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-4 w-40 h-40 object-cover" />
          )}
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
