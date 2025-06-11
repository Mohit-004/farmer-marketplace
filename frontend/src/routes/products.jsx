import express from "express";
import { databases, ID } from "../utils/appwrite.js";

const router = express.Router();

// ➕ Add Product
router.post("/add", async (req, res) => {
  try {
    const { 
      title, description, price, category, image, stock, 
      discount, isFeatured, rating, sku, farmer 
    } = req.body;

    const product = await databases.createDocument(
      "YOUR_DATABASE_ID",     
      "YOUR_COLLECTION_ID",    
      ID.unique(),
      {
        title, 
        description, 
        price, 
        category, 
        image, 
        stock, 
        discount, 
        isFeatured, 
        rating, 
        sku, 
        farmer,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔄 Update Product
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title, description, price, category, image, stock,
    discount, isFeatured, rating, sku, farmer
  } = req.body;

  try {
    const updatedProduct = await databases.updateDocument(
      "YOUR_DATABASE_ID",
      "YOUR_COLLECTION_ID",
      id,
      {
        title, 
        description, 
        price, 
        category, 
        image, 
        stock, 
        discount, 
        isFeatured, 
        rating, 
        sku, 
        farmer,
        updated_at: new Date().toISOString()
      }
    );

    res.status(200).json({ success: true, updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔍 Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await databases.listDocuments(
      "YOUR_DATABASE_ID",
      "YOUR_COLLECTION_ID"
    );

    res.status(200).json(products.documents);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// ❌ Delete Product
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await databases.deleteDocument(
      "YOUR_DATABASE_ID",
      "YOUR_COLLECTION_ID",
      id
    );

    res.status(200).json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
});

export default router;
