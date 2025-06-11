import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";
import AdminCards from "../components/AdminCards";
import AddCategoryModal from "../components/AddCategoryModal";
import { useState, useEffect } from "react";
import { databases, DATABASE_ID, CATEGORIES_COLLECTION_ID } from "../utils/appwrite";

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await databases.listDocuments(
          DATABASE_ID,
          CATEGORIES_COLLECTION_ID
        );
        setCategories(response.documents);
      } catch (error) {
        console.error("❌ Failed to fetch categories:", error);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

 
  const handleCategoryAdded = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID
      );
      setCategories(response.documents);
    } catch (error) {
      console.error("❌ Failed to refresh categories:", error);
    }
  };

  return (
    <div className="relative min-h-screen flex">

    
   

      <div className="flex-1 transition-all duration-300 ease-in-out">

       
        <div className={`fixed top-0 w-full z-40 transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-20"}`}>
          <AdminNavbar />
        </div>

       
        <div className={`pt-16 px-4 md:px-8 transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-20"}`}>

          {/* Admin Panel Title */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>
          </div>

          {/* Admin Cards */}
          <AdminCards />

          {/* Categories Section */}
          <div className="bg-white shadow-md p-6 mt-8 rounded-lg">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">

              <h2 className="text-2xl font-bold">Categories</h2>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                + Add Category
              </button>
            </div>

           
            {loading ? (
              <p className="text-gray-500">Loading categories...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.$id}
                    className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      {category.description || "No description"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
};

export default AdminDashboard;
