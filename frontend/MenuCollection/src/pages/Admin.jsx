import React, { useState, useEffect } from "react";

function Admin() {
  const [restaurants, setRestaurants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [month, setMonth] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    Phone: "",
    RestaurantName: "",
    City:""
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
      const res = await fetch(`http://localhost:8080/admin/getRestaurant?page=${page}&size=${pageSize}&month=${month}`);
      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:8080/admin/addRestaurant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    setShowModal(false);
    setFormData({ name: "", Phone: "", RestaurantName: "" });
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
    (sum, r) => sum + r.totalOrderCount*2,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-8">

      <div className="mb-6 flex items-center gap-4">
        <label className="font-semibold text-gray-700">
          Select Month:
        </label>

        <input
          type="month"
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            setPage(0);
          }}
          className="border rounded-lg px-3 py-2"
        />
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-12">

        <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
          <h3 className="text-sm text-gray-500 mb-2">Total Restaurants</h3>
          <p className="text-3xl font-bold text-gray-800">
            {restaurants.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
          <h3 className="text-sm text-gray-500 mb-2">
            Total Orders (This Month)
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
          <h3 className="text-sm text-gray-500 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-red-500">
            ₹ {totalRevenue}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
          <h3 className="text-sm text-gray-500 mb-2">Total Profit</h3>
          <p className="text-3xl font-bold text-red-500">
            ₹ {totalProfit}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden">

        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            Restaurant Performance
          </h2>
        </div>

        <table className="w-full text-left">
          <thead className="bg-orange-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Restaurant</th>
              <th className="px-6 py-4">Orders</th>
              <th className="px-6 py-4">Revenue</th>
              <th className="px-6 py-4">Profit</th>
              <th className="px-6 py-4">Performance</th>
            </tr>
          </thead>

          <tbody>
            {restaurants.map((r, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {r.name}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {r.totalOrderCount}
                </td>

                <td className="px-6 py-4 text-red-500 font-semibold">
                  ₹ {r.totalPrice}
                </td>

                <td className="px-6 py-4 text-green-600 font-semibold">
                  ₹ {r.profit}
                </td>

                <td className="px-6 py-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 to-amber-500 h-2 rounded-full"
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

      <div className="flex justify-center items-center gap-4 mt-6">

        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Previous
        </button>

        <span className="font-semibold">
          Page {page + 1}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Next
        </button>

      </div>

      <div className="mt-12 text-right">
        <button
        onClick={()=>setShowModal(true)} 
        className="bg-gradient-to-r from-red-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:opacity-90 transition">
          ➕ Add New Restaurant
        </button>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-8 rounded-2xl w-96 shadow-lg">

            <h2 className="text-xl font-bold mb-6">Add Restaurant</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="RestaurantName"
                placeholder="Restaurant Name"
                value={formData.RestaurantName}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="text"
                name="City"
                placeholder="City"
                value={formData.City}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="text"
                name="name"
                placeholder="Owner Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="text"
                name="Phone"
                placeholder="Phone Number"
                value={formData.Phone}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <div className="flex justify-between mt-6">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-lg"
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