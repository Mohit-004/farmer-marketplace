import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";

const eventData = [
  { id: 1, title: "Farmer's Market Day", date: "March 25, 2025", image: img1, location: "Mumbai", description: "A day for farmers to showcase and sell their fresh produce. Enjoy organic food, live music, and farming workshops." },
  { id: 2, title: "Organic Food Festival", date: "April 10, 2025", image: img2, location: "Pune", description: "An event celebrating organic food, sustainability, and healthy living. Taste and buy directly from local farmers." },
  { id: 3, title: "Agro Expo", date: "May 5, 2025", image: img3, location: "Nashik", description: "A large-scale expo featuring the latest in agricultural technology, equipment, and innovation." }
];

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = eventData.find((e) => e.id === parseInt(id));

  if (!event) {
    return (
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold text-red-500">Event not found</h1>
        <button 
          onClick={() => navigate("/events")}
          className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">

        {/* ✅ Event Image */}
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />

        {/* ✅ Event Details */}
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-600 mb-4"><strong>Date:</strong> {event.date}</p>
        <p className="text-gray-600 mb-4"><strong>Location:</strong> {event.location}</p>
        <p className="text-gray-700 mb-6">{event.description}</p>

        {/* ✅ Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
          >
            Go Back
          </button>

          <button
            onClick={() => alert("✅ Registered successfully!")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
