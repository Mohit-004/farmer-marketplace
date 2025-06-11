import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { databases, DATABASE_ID, USERS_COLLECTION_ID, account, Query } from "../utils/appwrite";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ Validate the session first
        const session = await account.get();
        if (!session) {
          throw new Error("No active session found.");
        }

        console.log("✅ Session User ID:", session.$id);

        // 🔥 First Query: Check by `userId`
        let response = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [Query.equal("userId", session.$id)]
        );

        // ✅ Fallback: Query by `email` if userId fails
        if (response.documents.length === 0) {
          console.warn("⚠️ No profile by userId. Trying fallback by email...");
          response = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal("email", session.email)]
          );
        }

        // ✅ Handle profile display
        if (response.documents.length > 0) {
          console.log("✅ Profile found:", response.documents[0]);
          setProfile(response.documents[0]);
        } else {
          setError("Profile not found.");
        }
      } catch (error) {
        console.error("❌ Failed to fetch profile:", error);
        setError(error.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-6">

        {/* ✅ Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center h-96">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* ✅ Error Display */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-red-500 text-lg"
          >
            {error}
          </motion.div>
        )}

        {/* ✅ Profile Display */}
        {!loading && profile && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg"
            >
              <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Profile</h1>

              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 w-32">Name:</span>
                  <span className="text-gray-900">{profile.name}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 w-32">Email:</span>
                  <span className="text-gray-900">{profile.email}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 w-32">Type:</span>
                  <span className="text-gray-900">{profile.registerType || "N/A"}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Profile;
