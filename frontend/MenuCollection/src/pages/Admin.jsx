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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fetchRestaurant = async () => {
    try {
      const res = await fetch(
        `http://menucollection-env.eba-3fhzuumj.eu-north-1.elasticbeanstalk.com/api/admin/getRestaurant?page=${page}&size=${pageSize}&month=${month}`
      );
      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://menucollection-env.eba-3fhzuumj.eu-north-1.elasticbeanstalk.com/api/admin/addRestaurant", {
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

  useEffect(() => {
    fetchRestaurant();

    const interval = setInterval(() => {
      fetchRestaurant();
    }, 4000);

    return () => clearInterval(interval);
  }, [page, month]);

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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-amber-100 p-4 md:p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Admin Dashboard 📊
        </h1>

        <input
          type="month"
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            setPage(0);
          }}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">

        <div className="bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow-md">
          <p className="text-sm text-gray-500">Restaurants</p>
          <h2 className="text-2xl font-bold text-gray-900">
            {restaurants.length}
          </h2>
        </div>

        <div className="bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow-md">
          <p className="text-sm text-gray-500">Orders</p>
          <h2 className="text-2xl font-bold text-gray-900">
            {totalOrders}
          </h2>
        </div>

        <div className="bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow-md">
          <p className="text-sm text-gray-500">Revenue</p>
          <h2 className="text-2xl font-bold text-orange-600">
            ₹ {totalRevenue}
          </h2>
        </div>

        <div className="bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow-md">
          <p className="text-sm text-gray-500">Profit</p>
          <h2 className="text-2xl font-bold text-green-600">
            ₹ {totalProfit}
          </h2>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-md overflow-hidden">

        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Restaurant Performance
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-orange-50 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Restaurant</th>
                <th className="px-6 py-3">Orders</th>
                <th className="px-6 py-3">Revenue</th>
                <th className="px-6 py-3">Profit</th>
                <th className="px-6 py-3">Performance</th>
              </tr>
            </thead>

            <tbody>
              {restaurants.map((r, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-orange-50 transition"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {r.name}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {r.totalOrderCount}
                  </td>

                  <td className="px-6 py-4 text-center text-orange-600 font-semibold">
                    ₹ {r.totalPrice}
                  </td>

                  <td className="px-6 py-4 text-center text-green-600 font-semibold">
                    ₹ {r.profit}
                  </td>

                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                        style={{
                          width: totalOrders
                            ? `${(r.totalOrderCount / totalOrders) * 100}%`
                            : "0%"
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">

        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          className="px-4 py-2 rounded-xl border hover:bg-gray-100 transition"
        >
          Previous
        </button>

        <span className="font-semibold text-gray-700">
          Page {page + 1}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 rounded-xl border hover:bg-gray-100 transition"
        >
          Next
        </button>

      </div>

      {/* Add Button */}
      <div className="mt-10 text-right">
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
        >
          + Add Restaurant
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Add Restaurant
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {[
                { name: "RestaurantName", placeholder: "Restaurant Name" },
                { name: "City", placeholder: "City" },
                { name: "name", placeholder: "Owner Name" },
                { name: "Phone", placeholder: "Phone Number" }
              ].map((field) => (
                <input
                  key={field.name}
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
                />
              ))}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
                >
                  Save
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;