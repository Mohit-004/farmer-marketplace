import { useState, useEffect } from "react";
import { databases, DATABASE_ID, USERS_COLLECTION_ID } from "../utils/appwrite";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch users from Appwrite
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID
        );
        setUsers(response.documents);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Delete user function
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await databases.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, userId);
      setUsers(users.filter((user) => user.$id !== userId));
      console.log(`✅ User ${userId} deleted successfully.`);
    } catch (error) {
      console.error("❌ Failed to delete user:", error);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="flex h-screen">
      
      

      <div className="flex-1 bg-gray-100">
        
        {/* ✅ Admin Navbar */}
        <AdminNavbar />

        <div className="p-8">

          <h2 className="text-3xl font-bold mb-4">Manage Users</h2>

          {loading ? (
            <p className="text-gray-500">Loading users...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-6">

              {/* ✅ Table */}
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-200 text-gray-600">
                  <tr>
                    <th className="p-4">#</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Created At</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.$id} className="border-b">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.registerType}</td>
                      <td className="p-4">{new Date(user.$createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button
                          className="text-blue-500 hover:text-blue-700 mx-2"
                          onClick={() => alert(`Edit ${user.name}`)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 mx-2"
                          onClick={() => handleDelete(user.$id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
