import { Client, Databases, Account, ID, Query, Permission, Role, Storage } from "appwrite";

//Fetch IDs from .env
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID;
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;
const CATEGORIES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID;
const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID;

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject(PROJECT_ID);

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);

console.log("🔥 Appwrite initialized with project:", PROJECT_ID);

const logError = (message, error) => {
    console.error(`❌ ${message}:`, error.message || error);
};


const validateSession = async () => {
    try {
        const session = await account.getSession("current");
        console.log("✅ Valid session detected:", session);
        return true;
    } catch (error) {
        console.log("⚠️ No active session found.");
        return false;
    }
};

export const getCurrentUserId = async () => {
  try {
      const session = await account.get();
      return session.$id;  //Return Farmer ID
  } catch (error) {
      console.error("❌ Failed to fetch current user:", error);
      throw error;
  }
};
  


export const createProduct = async (productData, imageFile) => {
    try {
      console.log("🔥 Uploading image:", imageFile);
  
      if (!(imageFile instanceof File)) {
        throw new Error("Invalid file format. Please select a valid image.");
      }
  
      // Upload image to Appwrite storage
      const uploadedFile = await storage.createFile(
        BUCKET_ID,
        ID.unique(),      // Generate unique ID for image
        imageFile
      );
  
      console.log("✅ Image uploaded:", uploadedFile);
  
      // Generate the image URL
      const imageUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id);
  
      console.log("🌟 Image URL:", imageUrl);
  
      // Generate unique productId
      const productId = ID.unique();
  
      // Get the current farmerId (authenticated user)
      const session = await account.get();
      const farmerId = session.$id;   // Farmer's ID from session
  
      // Create product with farmerId
      const product = await databases.createDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productId,
        {
          productId: productId,               // Add productId
          farmerId: farmerId,                 // Add farmerId
          title: productData.title,
          description: productData.description,
          price: productData.price,
          quantity: productData.quantity,
          discount: productData.discount,
          sku: productData.sku,
          category: productData.category,
          isFeatured: productData.isFeatured,
          fileId: imageUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
  
      console.log("✅ Product created:", product);
      return product;
  
    } catch (error) {
      console.error("❌ Error adding product:", error);
      throw error;
    }
  };
  

  export const getProducts = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID
      );
  
      //Generate image URLs dynamically using `fileId`
      const products = response.documents.map((product) => {
        let imageUrl = "/placeholder.png";  // Default image fallback
  
       
        if (product.fileId) {
          imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${product.fileId}/view?project=${PROJECT_ID}`;
        }
  
        return {
          ...product,
          imageUrl: imageUrl  //Store image URL dynamically
        };
      });
  
      console.log("✅ Products with dynamic image URLs:", products);
      return products;
  
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      throw error;
    }
  };
  

// Update Product
export const updateProduct = async (id, updatedData) => {
    try {
        if (!(await validateSession())) {
            throw new Error("Unauthorized: Please log in first.");
        }

        const response = await databases.updateDocument(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            id,
            {
                ...updatedData,
                updatedAt: new Date().toISOString()
            }
        );
        console.log("✅ Product updated:", response);
        return response;
    } catch (error) {
        logError("Error updating product", error);
        throw error;
    }
};

export const deleteProduct = async (id, fileId) => {
    try {
      if (!(await validateSession())) {
        throw new Error("Unauthorized: Please log in first.");
      }
  
      // Delete the image from the bucket
      if (fileId) {
        await storage.deleteFile(BUCKET_ID, fileId);
        console.log("✅ Image deleted:", fileId);
      }
  
      // Delete the product document
      await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id);
      console.log("✅ Product deleted:", id);
  
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      throw error;
    }
  };
  

//Get Categories
export const getCategories = async () => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID, 
            CATEGORIES_COLLECTION_ID,
            [Query.orderAsc("name")]
        );

        const validCategories = response.documents.map((category) => ({
            id: category.$id,
            name: category.name,
            description: category?.description || "No description available"
        }));

        console.log("✅ Categories fetched:", validCategories);
        return validCategories;
    } catch (error) {
        logError("Error fetching categories", error);
        throw error;
    }
};

// Get farmer products
export const getFarmerProducts = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID
      );
  
      console.log("✅ Products fetched from Appwrite:", response);
  
      // Ensure the correct response structure
      if (response && Array.isArray(response.documents)) {
        return response;  
      } else {
        console.warn("⚠️ Invalid or empty response structure.");
        return { documents: [] };  
      }
    } catch (error) {
      console.error("❌ Failed to fetch farmer products:", error);
      throw error;
    }
  };

// Get Farmer-Specific Orders
export const getFarmerOrders = async () => {
    try {
        // Get the current logged-in farmer's ID
        const user = await getUserProfile();
        const farmerId = user?.userId;

        if (!farmerId) {
            throw new Error("Failed to identify farmer.");
        }

        // Add the missing ORDERS_COLLECTION_ID
        const response = await databases.listDocuments(
            DATABASE_ID,
            ORDERS_COLLECTION_ID,                
            [Query.equal("farmerId", farmerId)]
        );

        console.log(`✅ Orders fetched for farmer ${farmerId}:`, response.documents);
        return response.documents;

    } catch (error) {
        console.error("❌ Error fetching farmer orders:", error);
        throw error;
    }
};



//Register User with All Attributes**
//Register User with createdAt & updatedAt**
export const registerUser = async (formData) => {
    const { name, email, password, registerType, phone, address, adharNumber } = formData;

    if (!email || !password || !name) {
        throw new Error("❌ Missing required fields.");
    }

    try {
        //Register the user in Appwrite Authentication
        const user = await account.create(ID.unique(), email, password, name);
        console.log("✅ User registered:", user);

        // Add `createdAt` and `updatedAt` fields
        const currentTime = new Date().toISOString();

        // Store User Info in Users Collection
        await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            ID.unique(),
            {
                userId: user.$id,
                email: email,
                name: name,
                registerType: registerType,   // Store the register type
                phone: phone,
                address: address,
                createdAt: currentTime,         // Added createdAt
                updatedAt: currentTime,
                password: password,      // Added updatedAt
                adharNumber: adharNumber
            }
        );

        console.log(`✅ ${registerType} registered successfully.`);
        return user;
    } catch (error) {
        console.error("❌ Registration failed:", error);
        throw error;
    }
};


// Login User with Admin Check
export const loginUser = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        const currentUser = await account.get();

        // Fetch the User's Profile from Users Collection
        const response = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal("email", currentUser.email)]
        );

        if (response.documents.length === 0) {
            throw new Error("User not found.");
        }

        const userProfile = response.documents[0];

        console.log("✅ User logged in:", userProfile);

        // Return User Data including `registerType`
        return {
            session,
            user: {
                id: currentUser.$id,
                name: currentUser.name,
                email: currentUser.email,
                registerType: userProfile.registerType  // Return registerType
            }
        };
    } catch (error) {
        console.error("❌ Error logging in:", error);
        throw error;
    }
};



// Logout User
export const logoutUser = async () => {
    try {
        await account.deleteSession("current");
        console.log("✅ User logged out.");
    } catch (error) {
        logError("Error logging out", error);
        throw error;
    }
};


// Get User Profile
export const getUserProfile = async () => {
    try {
        if (!(await validateSession())) {
            throw new Error("Unauthorized: Please log in first.");
        }

        const currentUser = await account.get();

        const response = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal("userId", currentUser.$id)]
        );

        if (response.documents.length === 0) {
            throw new Error("User profile not found.");
        }

        const userProfile = response.documents[0];
        console.log("✅ User profile fetched:", userProfile);
        return userProfile;
    } catch (error) {
        logError("Error fetching user profile", error);
        throw error;
    }
};



// Get Current Farmer ID
const getCurrentFarmerId = async () => {
  try {
    const user = await account.get();
    return user.$id;
  } catch (error) {
    console.error("❌ Failed to get current farmer:", error);
    throw error;
  }
};

//  Fetch Bank Details
// Fetch Bank Details by Farmer ID
export const getBankDetails = async (farmerId) => {
  try {
    //  Ensure farmerId is defined
    if (!farmerId) {
      throw new Error("Farmer ID is missing.");
    }

    // Use correct query syntax
    const response = await databases.listDocuments(
      DATABASE_ID,
      BANK_DETAILS,
      [Query.equal("farmerId", farmerId)]   
    );

    console.log("✅ Bank details fetched:", response.documents);

    if (response.documents.length === 0) {
      console.log("⚠️ No bank details found.");
      return null;  // Return null if no details found
    }

    return response.documents[0];

  } catch (error) {
    console.error("❌ Failed to fetch bank details:", error);
    throw error;
  }
};
//  Add Bank Details
export const addBankDetails = async (bankData) => {
  try {
    const farmerId = await getCurrentFarmerId();
    const docId = ID.unique();
    const currentTime = new Date().toISOString();

    const document = await databases.createDocument(
      DATABASE_ID,
      BANK_DETAILS,
      docId,
      {
        ...bankData,
        farmerId,
        createdAt: currentTime,
        updatedAt: currentTime,
      }
    );

    console.log("✅ Bank details added:", document);
    return document;

  } catch (error) {
    console.error("❌ Error adding bank details:", error);
    throw error;
  }
};

// Update Bank Details
export const updateBankDetails = async (id, updatedData) => {
  try {
    const currentTime = new Date().toISOString();
    
    const response = await databases.updateDocument(
      DATABASE_ID,
      BANK_DETAILS,
      id,
      {
        ...updatedData,
        updatedAt: currentTime,
      }
    );

    console.log("✅ Bank details updated:", response);
    return response;

  } catch (error) {
    console.error("❌ Error updating bank details:", error);
    throw error;
  }
};

//  Delete Bank Details
export const deleteBankDetails = async (id) => {
  try {
    await databases.deleteDocument(DATABASE_ID, BANK_DETAILS, id);
    console.log("✅ Bank details deleted:", id);

  } catch (error) {
    console.error("❌ Error deleting bank details:", error);
    throw error;
  }
};

// Fetch Orders for Current Customer (with correct attributes)
export const getCustomerOrders = async () => {
  try {
    const user = await getUserProfile();
    const customerId = user?.userId; 


    if (!customerId) {
      throw new Error("Failed to identify customer.");
    }

    // Fetch orders filtered by customerId
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.equal("customerId", customerId)]
    );

    console.log(`✅ Orders fetched for customer ${customerId}:`, response.documents);
    
    // Map orders to match your collection attributes
    const orders = response.documents.map((order) => ({
      orderId: order.orderId,
      quantity: order.quantity,
      status: order.status,
      paymentStatus: order.paymentStatus,
      products: order.products,           
      totalPrice: order.totalPrice,
      orderStatus: order.orderStatus,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    return orders;

  } catch (error) {
    console.error("❌ Error fetching customer orders:", error);
    throw error;
  }
};




export {
    client,
    databases,
    account,
    ID,
    Query,
    Permission,
    Role,
    DATABASE_ID,
    PRODUCTS_COLLECTION_ID,
    USERS_COLLECTION_ID,
    CATEGORIES_COLLECTION_ID,
    ORDERS_COLLECTION_ID,
    BUCKET_ID, 
    storage
};
