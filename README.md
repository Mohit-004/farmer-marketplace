# 🌾 Farmer Marketplace

A modern web application that connects farmers with buyers through a digital marketplace.  
Built with **React** and powered by **Appwrite** for backend services such as authentication, database, and file storage.

---

# ✨ Features

- 👨‍🌾 Farmers can list, update, and manage their products
- 🛒 Buyers can browse, search, and place orders
- 🔐 Secure user authentication with Appwrite
- 📡 Real-time data from Appwrite Database
- 📦 Order tracking and product management
- ⚡ Fast and responsive interface using Vite + Tailwind CSS

---

# 🛠️ Tech Stack

| Technology           | Purpose                        |
|----------------------|--------------------------------|
| React + Vite         | Frontend framework             |
| Tailwind CSS         | Styling                        |
| Appwrite             | Backend (Auth, DB, Storage)    |
| React Router         | Routing                        |
| Git & GitHub         | Version control & hosting      |

---

# 📦 Getting Started

1. Clone the repository
```bash```
git clone https://github.com/Mohit-004/farmer-marketplace.git
cd farmer-marketplace

2. Install dependencies
```bash```
npm install

3. Create .env file
Create a .env file in the root of your project and add the following environment variables:

VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
VITE_APPWRITE_PRODUCTS_COLLECTION_ID=your_products_collection_id
VITE_APPWRITE_ORDERS_COLLECTION_ID=your_orders_collection_id
VITE_APPWRITE_CATEGORIES_COLLECTION_ID=your_categories_collection_id
VITE_APPWRITE_STORAGE_BUCKET_ID=your_storage_bucket_id

Replace each your_* value with the actual ID from your Appwrite project.

4. Start the development server:
npm run dev

The app will be running at: http://localhost:5173

# Appwrite Setup (Quick Guide)
Sign in to Appwrite Cloud or self-host Appwrite

Create a Project

1) Enable the following services:
  Authentication (Email/Password)

2) Database with collections:
  1) users
  2) products
  3) orders
  4) categories

3) Storage for image uploads
   
- Copy the required IDs and add them to your .env file

##Contributing
Contributions are welcome!
Feel free to fork this repository and submit a pull request.
