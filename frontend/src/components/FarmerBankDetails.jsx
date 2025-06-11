import React, { useState, useEffect } from "react";
import { databases, DATABASE_ID, FARMER_BANK_COLLECTION_ID } from "../utils/appwrite";
import { ID } from "appwrite";
import { useNavigate } from "react-router-dom";

const FarmerBankDetails = () => {
  const navigate = useNavigate();

  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const farmerId = localStorage.getItem("farmerId");

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          FARMER_BANK_COLLECTION_ID,
          [`equal("farmerId", "${farmerId}")`]
        );

        if (response.documents.length > 0) {
          const details = response.documents[0];
          setBankDetails({
            accountNumber: details.accountNumber,
            ifscCode: details.ifscCode,
            upiId: details.upiId,
            name: details.name,
          });
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
      }
    };

    fetchBankDetails();
  }, [farmerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await databases.createDocument(
        DATABASE_ID,
        FARMER_BANK_COLLECTION_ID,
        ID.unique(),
        {
          farmerId,
          ...bankDetails,
        }
      );

      alert("Bank details saved successfully!");
      navigate("/farmer/dashboard");

    } catch (error) {
      console.error("Error saving bank details:", error);
      alert("Failed to save bank details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6">Add Bank Details</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={bankDetails.name}
            onChange={handleChange}
            placeholder="Farmer Name"
            required
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="accountNumber"
            value={bankDetails.accountNumber}
            onChange={handleChange}
            placeholder="Account Number"
            required
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="ifscCode"
            value={bankDetails.ifscCode}
            onChange={handleChange}
            placeholder="IFSC Code"
            required
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="upiId"
            value={bankDetails.upiId}
            onChange={handleChange}
            placeholder="UPI ID"
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white w-full p-3 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Bank Details"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerBankDetails;
