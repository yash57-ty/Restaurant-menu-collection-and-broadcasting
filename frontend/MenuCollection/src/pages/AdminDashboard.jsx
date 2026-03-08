import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  // React Router hook used to navigate between pages
  const navigate = useNavigate();

  // Get the admin name stored after login
  const studentName = localStorage.getItem("name");

  // Clears login data and redirects the user to login page
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (

    // Main page container with background color used across the project
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">

      {/* Header displaying admin name and logout button */}
      <header className="bg-white border-b border-orange-100">

        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">

          {/* Shows admin panel title and logged in admin name */}
          <h1 className="text-xl font-bold text-gray-800">
            Admin Panel – {studentName}
          </h1>

          {/* Logout button clears localStorage and returns to login */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded font-bold"
          >
            Logout
          </button>

        </div>
      </header>

      {/* Main dashboard content */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Dashboard title and description */}
        <div className="mb-10">

          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Admin Dashboard
          </h2>

          <p className="text-gray-600">
            Manage menus, view orders, and monitor restaurant analytics.
          </p>

        </div>

        {/* Grid containing the navigation cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card to view today's menu */}
          <section className="bg-white border rounded-xl p-6">

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Today's Menu
            </h3>

            <p className="text-gray-600 mb-4">
              View all active restaurant menus.
            </p>

            <button
              onClick={() => navigate("/menus")}
              className="bg-red-500 text-white px-5 py-2 rounded font-bold"
            >
              View Menu
            </button>

          </section>

          {/* Card to view past orders */}
          <section className="bg-white border rounded-xl p-6">

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Past Orders
            </h3>

            <p className="text-gray-600 mb-4">
              Review order history and details.
            </p>

            <button
              onClick={() => navigate("/orders")}
              className="bg-red-500 text-white px-5 py-2 rounded font-bold"
            >
              Show Orders
            </button>

          </section>

          {/* Card to view restaurant analytics */}
          <section className="bg-white border rounded-xl p-6">

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Restaurant Analytics
            </h3>

            <p className="text-gray-600 mb-4">
              View restaurant performance and revenue analytics.
            </p>

            <button
              onClick={() => navigate("/admin")}
              className="bg-red-500 text-white px-5 py-2 rounded font-bold"
            >
              View Analytics
            </button>

          </section>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;