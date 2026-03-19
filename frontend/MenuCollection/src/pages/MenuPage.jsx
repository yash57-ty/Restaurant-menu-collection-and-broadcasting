import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "../components/RestaurantCard";
import ResponseModal from "../components/ResponseModal";

export function MenuPage() {
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("http://localhost:8080/webhook/api/cities");
        const data = await res.json();
        setCities(data);
        setFilteredCities(data);
      } catch {
        console.error("Failed to load cities");
      }
    };
    fetchCities();
  }, []);

  const fetchMenu = async (keyword = "", cityName = "") => {
    const res = await fetch(
      `http://localhost:8080/api/message?keyword=${keyword}&city=${cityName}`
    );
    const data = await res.json();
    setMenu(data);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMenu(search, city);
    }, 400);
    return () => clearTimeout(delay);
  }, [search, city]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMenu(search, city);
    }, 4000);
    return () => clearInterval(interval);
  }, [search, city]);

  const handleCityChange = (value) => {
    setCity(value);
    const filtered = cities.filter((c) =>
      c.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCities(filtered);
    setShowCityList(true);
  };

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

  const handleSelect = (restaurant) => {
    if (restaurant.orderCount >= restaurant.limit) {
      alert("Order limit reached for this restaurant");
      return;
    }
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const handleSubmitResponse = async (payload) => {
    if (submitting) return;

    setSubmitting(true);
    applyOptimisticUpdate(selectedRestaurant.menuId, payload.quantity);

    try {
      const res = await fetch("http://localhost:8080/api/response", {
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
      alert(err.message || "Order limit reached");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-amber-100">

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">

        {/* Top Search Bar */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-md p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4">

          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search food or restaurant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
          />

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
                {filteredCities.slice(0, 5).map((c, index) => (
                  <div
                    key={index}
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

        {/* Success Card */}
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {menu.map((res, index) => (
            <RestaurantCard
              key={`${res.phoneNumber}-${index}`}
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
          restaurantName={selectedRestaurant?.RestaurantName}
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

export default MenuPage;