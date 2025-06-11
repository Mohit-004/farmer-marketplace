import { FaUser, FaBox, FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { databases, DATABASE_ID, USERS_COLLECTION_ID } from "../utils/appwrite";
import { Query } from "appwrite";

const AdminCards = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [farmerCount, setFarmerCount] = useState(0);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID);
        const users = response.documents;

        const customers = users.filter((user) => user.registerType === "customer");
        const farmers = users.filter((user) => user.registerType === "farmer");

        setTotalUsers(users.length);
        setCustomerCount(customers.length);
        setFarmerCount(farmers.length);
      } catch (error) {
        console.error("❌ Failed to fetch user counts:", error);
      }
    };

    fetchUserCounts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex items-center">
        <FaUser className="text-3xl mr-4" />
        <div>
          <h2 className="text-2xl font-bold">{totalUsers - 1}</h2>
          <p>Total Users</p>
        </div>
      </div>

      <div className="bg-green-500 text-white p-6 rounded-lg shadow-md flex items-center">
        <FaBox className="text-3xl mr-4" />
        <div>
          <h2 className="text-2xl font-bold">{customerCount}</h2>
          <p>Customers</p>
        </div>
      </div>

      <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md flex items-center">
        <FaShoppingCart className="text-3xl mr-4" />
        <div>
          <h2 className="text-2xl font-bold">{farmerCount}</h2>
          <p>Farmers</p>
        </div>
      </div>
    </div>
  );
};

export default AdminCards;
