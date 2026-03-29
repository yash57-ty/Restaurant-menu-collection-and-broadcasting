import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const studentName = localStorage.getItem("name");

  // Clears session data and redirects to login
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#1A1D23]">

      {/* Top navigation bar */}
      <header className="bg-white px-8 py-5 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-xl font-black">
          ADMIN <span className="text-gray-300">|</span>{" "}
          <span className="text-[#FF4757]">{studentName}</span>
        </h1>

        <button
          onClick={handleLogout}
          className="text-sm font-black uppercase tracking-widest text-red-500"
        >
          Logout
        </button>
      </header>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto p-8 md:p-12">

        {/* Section heading */}
        <div className="mb-12">
          <h2 className="text-4xl font-black tracking-tight">
            Command Center
          </h2>
          <p className="text-gray-400 mt-2">
            Manage operations and monitor growth.
          </p>
        </div>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {[
            {
              title: "Active Menu",
              desc: "Manage restaurant listings",
              icon: "🍽️",
              path: "/menus"
            },
            {
              title: "Order Logs",
              desc: "Review all transactions",
              icon: "📦",
              path: "/orders"
            },
            {
              title: "Business Intel",
              desc: "Real-time performance",
              icon: "📊",
              path: "/admin"
            }
          ].map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl cursor-pointer transition-all border border-gray-50 group"
            >
              <span className="text-4xl block mb-6 grayscale group-hover:grayscale-0 transition-all">
                {card.icon}
              </span>

              <h3 className="text-xl font-black mb-2">
                {card.title}
              </h3>

              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                {card.desc}
              </p>

              <div className="h-1.5 w-12 bg-gray-100 group-hover:bg-[#FF4757] group-hover:w-full transition-all rounded-full"></div>
            </div>
          ))}

        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;