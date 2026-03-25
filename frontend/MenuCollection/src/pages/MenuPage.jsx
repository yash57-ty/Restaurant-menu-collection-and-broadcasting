import { useEffect, useState } from "react";
import RestaurantCard from "../components/RestaurantCard";
import ResponseModal from "../components/ResponseModal";

export default function MenuPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityList, setShowCityList] = useState(false);

  const BASE_URL = "/api";

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(`${BASE_URL}/webhook/api/cities`);
        const data = await res.json();
        setCities(data);
        setFilteredCities(data);
      } catch (err) {
        console.error("Failed to load cities", err);
      }
    };
    fetchCities();
  }, []);

  // Fetch menu
  const fetchMenu = async (keyword = "", cityName = "") => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/message?keyword=${keyword}&city=${cityName}`
      );
      const data = await res.json();
      setMenu(data);
    } catch (err) {
      console.error("Menu fetch failed", err);
    }
  };

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMenu(search, city);
    }, 400);
    return () => clearTimeout(delay);
  }, [search, city]);

  // Auto refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMenu(search, city);
    }, 4000);
    return () => clearInterval(interval);
  }, [search, city]);

  // City filter
  const handleCityChange = (value) => {
    setCity(value);
    const filtered = cities.filter((c) =>
      c.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCities(filtered);
    setShowCityList(true);
  };

  // Optimistic update
  const applyOptimisticUpdate = (menuId, quantity) => {
    setMenu((prev) =>
      prev.map((item) =>
        item.menuId === menuId
          ? { ...item, orderCount: item.orderCount + quantity }
          : item
      )
    );
  };

  const rollbackUpdate = (menuId, quantity) => {
    setMenu((prev) =>
      prev.map((item) =>
        item.menuId === menuId
          ? { ...item, orderCount: item.orderCount - quantity }
          : item
      )
    );
  };

  // Select restaurant
  const handleSelect = (restaurant) => {
    if (restaurant.orderCount >= restaurant.limit) {
      alert("Order limit reached for this restaurant");
      return;
    }
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  // Submit order
  const handleSubmitResponse = async (payload) => {
    if (submitting) return;

    setSubmitting(true);
    applyOptimisticUpdate(selectedRestaurant.menuId, payload.quantity);

    try {
      const res = await fetch(`${BASE_URL}/api/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-USER-PHONE": localStorage.getItem("userPhone"),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Order rejected");
      }

      const data = await res.json();
      setOrderSuccess(data);

      await fetchMenu(search, city);

      setIsModalOpen(false);
      setSelectedRestaurant(null);
    } catch (err) {
      rollbackUpdate(selectedRestaurant.menuId, payload.quantity);
      alert(err.message || "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-amber-100">

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">

        {/* 🔥 Sticky Search Bar */}
        <div className="sticky top-0 z-40 mb-6">

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md p-4 flex flex-col md:flex-row gap-4">

            {/* Search */}
            <div className="flex-1 relative">

              <input
                type="text"
                placeholder="🔍 Search food or restaurant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none transition"
              />

              {/* Clear button */}
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}

            </div>

            {/* City */}
            <div className="relative w-full md:w-64">

              <input
                type="text"
                placeholder="📍 Select city"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                onFocus={() => setShowCityList(true)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
              />

              {showCityList && filteredCities.length > 0 && (
                <div className="absolute z-10 w-full bg-white rounded-xl shadow-lg mt-2 max-h-48 overflow-y-auto">
                  {filteredCities.slice(0, 5).map((c) => (
                    <div
                      key={c}
                      onClick={() => {
                        setCity(c);
                        setShowCityList(false);
                      }}
                      className="px-4 py-2 hover:bg-orange-50 cursor-pointer"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>

        {/* 🔥 Search Result Indicator */}
        {(search || city) && (
          <p className="text-sm text-gray-600 mb-4">
            Showing results
            {search && <> for "<span className="font-semibold">{search}</span>"</>}
            {city && <> in <span className="font-semibold">{city}</span></>}
          </p>
        )}

        {/* Success Message */}
        {orderSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              ✅ Order Placed Successfully
            </h3>
            <p><b>{orderSuccess.restaurantName}</b></p>
            <p>Qty: {orderSuccess.quantity} • ₹{orderSuccess.totalAmount}</p>
            <p className="text-sm text-gray-500">
              {new Date(orderSuccess.orderedAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* 🔥 Menu Layout (will become compact after next step) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map((res) => (
            <RestaurantCard
              key={res.menuId}
              restaurant={res}
              disabled={res.orderCount >= res.limit}
              onSelect={() => handleSelect(res)}
            />
          ))}
        </div>

        {/* Modal */}
        <ResponseModal
          isOpen={isModalOpen}
          menuId={selectedRestaurant?.menuId}
          restaurantName={selectedRestaurant?.restaurantName}
          price={selectedRestaurant?.price || 0}
          remainingSlots={
            selectedRestaurant
              ? selectedRestaurant.limit - selectedRestaurant.orderCount
              : 0
          }
          submitting={submitting}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitResponse}
        />

      </div>
    </div>
  );
}