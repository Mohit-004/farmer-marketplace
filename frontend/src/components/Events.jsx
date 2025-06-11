import React from "react";
import { Link } from "react-router-dom";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";

const events = [
  { id: 1, title: "Farmer's Market Day", date: "March 25, 2025", image: img1, location: "Mumbai" },
  { id: 2, title: "Organic Food Festival", date: "April 10, 2025", image: img2, location: "Pune" },
  { id: 3, title: "Agro Expo", date: "May 5, 2025", image: img3, location: "Nashik" }
];

const Events = () => {
  return (
    <div className="mb-12 px-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold">{event.title}</h2>
              <p className="text-gray-600">{event.date}</p>
              <p className="text-gray-500">{event.location}</p>
              <Link 
                to={`/event/${event.id}`} 
                className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
