import React, { useState, useEffect } from "react";

function Admin() {

  // Stores the list of restaurants received from backend
  const [restaurants, setRestaurants] = useState([]);

  // Controls whether the "Add Restaurant" modal is visible
  const [showModal, setShowModal] = useState(false);

  // Stores the selected month used for analytics filtering
  const [month, setMonth] = useState("");

  // Stores form data when admin adds a new restaurant
  const [formData, setFormData] = useState({
    name: "",
    Phone: "",
    RestaurantName: "",
    City: ""
  });

  // Current pagination page
  const [page, setPage] = useState(0);

  // Number of restaurants loaded per page
  const pageSize = 8;

  // Updates form fields when the admin types in the modal form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fetch restaurant analytics from backend with pagination and month filter
  const fetchRestaurant = async () => {
    try {

      const res = await fetch(
        `http://localhost:8080/admin/getRestaurant?page=${page}&size=${pageSize}&month=${month}`
      );

      const data = await res.json();

      setRestaurants(data);

    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  // Sends request to backend to create a new restaurant
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:8080/admin/addRestaurant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    // Close modal and refresh restaurant list
    setShowModal(false);

    setFormData({
      name: "",
      Phone: "",
      RestaurantName: "",
      City: ""
    });

    fetchRestaurant();
  };

  // Fetch restaurant data whenever page or month changes
  useEffect(() => {

    fetchRestaurant();

    // Automatically refresh analytics every 4 seconds
    const interval = setInterval(() => {
      fetchRestaurant();
    }, 4000);

    return () => clearInterval(interval);

  }, [page, month]);

  // Calculates total orders for summary cards
  const totalOrders = restaurants.reduce(
    (sum, r) => sum + r.totalOrderCount,
    0
  );

  // Calculates total revenue for summary cards
  const totalRevenue = restaurants.reduce(
    (sum, r) => sum + r.totalPrice,
    0
  );

  // Calculates total profit (each order generates ₹2)
  const totalProfit = restaurants.reduce(
    (sum, r) => sum + r.totalOrderCount * 2,
    0
  );

  return (

    // Main page container
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-8">

      {/* Month selector used to filter analytics */}
      <div className="mb-6 flex items-center gap-4">

        <label className="font-bold text-gray-700">
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

      {/* Summary analytics cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">

        <div className="bg-white p-5 rounded-xl border">
          <h3 className="text-sm text-gray-500">Total Restaurants</h3>
          <p className="text-3xl font-extrabold text-gray-800">
            {restaurants.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <h3 className="text-sm text-gray-500">
            Total Orders
          </h3>
          <p className="text-3xl font-extrabold text-gray-800">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-extrabold text-red-500">
            ₹ {totalRevenue}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <h3 className="text-sm text-gray-500">Total Profit</h3>
          <p className="text-3xl font-extrabold text-green-600">
            ₹ {totalProfit}
          </p>
        </div>

      </div>

      {/* Restaurant analytics table */}
      <div className="bg-white rounded-xl border overflow-hidden">

        <div className="p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Restaurant Performance
          </h2>
        </div>

        <table className="w-full text-left">

          <thead className="bg-orange-50 text-gray-700 text-sm font-bold">
            <tr>
              <th className="px-6 py-3">Restaurant</th>
              <th className="px-6 py-3">Orders</th>
              <th className="px-6 py-3">Revenue</th>
              <th className="px-6 py-3">Profit</th>
              <th className="px-6 py-3">Performance</th>
            </tr>
          </thead>

          <tbody>

            {restaurants.map((r, index) => (

              <tr key={index} className="border-t">

                <td className="px-6 py-3 font-bold text-gray-800">
                  {r.name}
                </td>

                <td className="px-6 py-3 font-semibold">
                  {r.totalOrderCount}
                </td>

                <td className="px-6 py-3 text-red-500 font-bold">
                  ₹ {r.totalPrice}
                </td>

                <td className="px-6 py-3 text-green-600 font-bold">
                  ₹ {r.profit}
                </td>

                <td className="px-6 py-3">
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

      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-4 mt-6">

        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          className="px-4 py-2 border rounded-lg font-semibold"
        >
          Previous
        </button>

        <span className="font-bold">
          Page {page + 1}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 border rounded-lg font-semibold"
        >
          Next
        </button>

      </div>

      {/* Button to open modal for adding a restaurant */}
      <div className="mt-10 text-right">

        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold"
        >
          Add Restaurant
        </button>

      </div>

      {/* Modal for adding new restaurant */}
      {showModal && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-xl font-bold mb-5">
              Add Restaurant
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="RestaurantName"
                placeholder="Restaurant Name"
                value={formData.RestaurantName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                name="City"
                placeholder="City"
                value={formData.City}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                name="name"
                placeholder="Owner Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                name="Phone"
                placeholder="Phone Number"
                value={formData.Phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <div className="flex justify-between mt-5">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-red-500 text-white rounded font-bold"
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