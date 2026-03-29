import React, { useState, useEffect } from "react";

function Admin() {
  const [restaurants, setRestaurants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [month, setMonth] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    Phone: "",
    RestaurantName: "",
    City: ""
  });
  const [page, setPage] = useState(0);
  const pageSize = 8;

  // Updates form state dynamically based on input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fetches paginated restaurant data with optional month filter
  const fetchRestaurant = async () => {
    try {
      const res = await fetch(
        `/api/admin/getRestaurant?page=${page}&size=${pageSize}&month=${month}`
      );
      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  // Submits new restaurant data and refreshes list
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/admin/addRestaurant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    setShowModal(false);

    setFormData({
      name: "",
      Phone: "",
      RestaurantName: "",
      City: ""
    });

    fetchRestaurant();
  };

  // Initializes data fetching and sets periodic refresh
  useEffect(() => {
    fetchRestaurant();

    const interval = setInterval(() => {
      fetchRestaurant();
    }, 4000);

    return () => clearInterval(interval);
  }, [page, month]);

  // Aggregated metrics for dashboard insights
  const totalOrders = restaurants.reduce(
    (sum, r) => sum + r.totalOrderCount,
    0
  );

  const totalRevenue = restaurants.reduce(
    (sum, r) => sum + r.totalPrice,
    0
  );

  const totalProfit = restaurants.reduce(
    (sum, r) => sum + r.totalOrderCount * 2,
    0
  );

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-6 md:p-10 font-sans text-[#1A1D23]">

      <div className="max-w-7xl mx-auto">

        {/* Header and filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">
              Analytics Overview
            </h1>
            <p className="text-gray-400 font-medium">
              Performance tracking and data insights.
            </p>
          </div>

          <input
            type="month"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setPage(0);
            }}
            className="px-6 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#FF4757]/20 outline-none font-bold"
          />
        </div>

        {/* Summary statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Restaurants", val: restaurants.length, color: "text-[#1A1D23]" },
            { label: "Total Orders", val: totalOrders, color: "text-[#1A1D23]" },
            { label: "Revenue", val: `₹${totalRevenue}`, color: "text-[#FF4757]" },
            { label: "Profit", val: `₹${totalProfit}`, color: "text-green-500" }
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50"
            >
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                {stat.label}
              </p>
              <h2 className={`text-3xl font-black tracking-tight ${stat.color}`}>
                {stat.val}
              </h2>
            </div>
          ))}
        </div>

        {/* Performance table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
          
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-black">
              Performance Leaderboard
            </h2>

            <button
              onClick={() => setShowModal(true)}
              className="bg-[#1A1D23] text-white px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-all"
            >
              + Add Restaurant
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">

              <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Restaurant</th>
                  <th className="px-8 py-5 text-center">Orders</th>
                  <th className="px-8 py-5 text-center">Revenue</th>
                  <th className="px-8 py-5 text-center">Profit</th>
                  <th className="px-8 py-5">Market Share</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {restaurants.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50/40 transition">

                    <td className="px-8 py-6 font-bold">
                      {r.name}
                    </td>

                    <td className="px-8 py-6 text-center font-medium">
                      {r.totalOrderCount}
                    </td>

                    <td className="px-8 py-6 text-center font-black text-[#FF4757]">
                      ₹{r.totalPrice}
                    </td>

                    <td className="px-8 py-6 text-center font-black text-green-500">
                      ₹{r.profit}
                    </td>

                    <td className="px-8 py-6 min-w-[200px]">
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#FF4757] h-full"
                          style={{
                            width: totalOrders
                              ? `${(r.totalOrderCount / totalOrders) * 100}%`
                              : "0%"
                          }}
                        ></div>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>

        {/* Pagination controls */}
        <div className="flex justify-center items-center gap-6 mt-10">

          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className="px-6 py-3 rounded-xl font-bold bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition"
          >
            Previous
          </button>

          <span className="font-black text-sm">
            PAGE {page + 1}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-3 rounded-xl font-bold bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition"
          >
            Next
          </button>

        </div>

        {/* Modal for adding new restaurant */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center px-4">

            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl">

              <h2 className="text-2xl font-black mb-8">
                Add New Partner
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">

                {[
                  { name: "RestaurantName", placeholder: "Restaurant Name" },
                  { name: "City", placeholder: "City" },
                  { name: "name", placeholder: "Owner" },
                  { name: "Phone", placeholder: "Contact" }
                ].map((field) => (
                  <input
                    key={field.name}
                    type="text"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF4757]/20 outline-none"
                  />
                ))}

                <div className="flex gap-3 pt-6">

                  <button
                    type="submit"
                    className="flex-1 bg-[#FF4757] text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-100"
                  >
                    Save Listing
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 py-4 rounded-2xl font-bold text-gray-500"
                  >
                    Discard
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;