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
  const [expandedId, setExpandedId] = useState(null);

  const BASE_URL = "/api";

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

  // Fetch menu data with optional filters
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

  // Debounced search execution
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMenu(search, city);
    }, 400);
    return () => clearTimeout(delay);
  }, [search, city]);

  // Periodic refresh for near real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMenu(search, city);
    }, 4000);
    return () => clearInterval(interval);
  }, [search, city]);

  // Filters city suggestions dynamically
  const handleCityChange = (value) => {
    setCity(value);
    const filtered = cities.filter((c) =>
      c.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCities(filtered);
    setShowCityList(true);
  };

  // Applies optimistic UI update before API confirmation
  const applyOptimisticUpdate = (menuId, quantity) => {
    setMenu((prev) =>
      prev.map((item) =>
        item.menuId === menuId
          ? { ...item, orderCount: item.orderCount + quantity }
          : item
      )
    );
  };

  // Rolls back optimistic update on failure
  const rollbackUpdate = (menuId, quantity) => {
    setMenu((prev) =>
      prev.map((item) =>
        item.menuId === menuId
          ? { ...item, orderCount: item.orderCount - quantity }
          : item
      )
    );
  };

  // Handles restaurant selection with validation
  const handleSelect = (restaurant) => {
    if (restaurant.orderCount >= restaurant.limit) {
      alert("Order limit reached for this restaurant");
      return;
    }
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  // Submits order response with optimistic update strategy
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

  // Toggles mobile card expansion
  const handleToggle = (menuId) => {
    setExpandedId((prev) => (prev === menuId ? null : menuId));
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1D23]">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Search and filter controls */}
        <div className="sticky top-6 z-40 mb-12">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-3 flex flex-col md:flex-row gap-2 border border-white">
            
            <input
              type="text"
              placeholder="🔍 Search restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent px-6 py-3 border-none focus:ring-0 font-bold placeholder:text-gray-300"
            />

            <div className="h-8 w-px bg-gray-100 hidden md:block self-center mx-2"></div>

            <div className="relative md:w-64">
              <input
                type="text"
                placeholder="📍 Select city"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                onFocus={() => setShowCityList(true)}
                className="w-full bg-transparent px-6 py-3 border-none focus:ring-0 font-black text-[#FF4757]"
              />

              {showCityList && filteredCities.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-4 bg-white rounded-3xl shadow-2xl border border-gray-50 overflow-hidden">
                  {filteredCities.slice(0, 5).map((c) => (
                    <div
                      key={c}
                      onClick={() => {
                        setCity(c);
                        setShowCityList(false);
                      }}
                      className="px-6 py-4 hover:bg-red-50 cursor-pointer font-bold transition-colors"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Success feedback after order */}
        {orderSuccess && (
          <div className="mb-10 bg-green-50 rounded-[2rem] p-8 border border-green-100 flex justify-between items-center animate-pulse">
            <div>
              <h3 className="text-xl font-black text-green-700">
                Order Placed! 🚀
              </h3>
              <p className="text-green-600 font-medium">
                {orderSuccess.restaurantName} • Qty: {orderSuccess.quantity}
              </p>
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              className="text-green-400 font-black"
            >
              CLOSE
            </button>
          </div>
        )}

        {/* Restaurant listing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menu.map((res) => (
            <RestaurantCard
              key={res.menuId}
              restaurant={res}
              disabled={res.orderCount >= res.limit}
              onSelect={() => handleSelect(res)}
              isExpanded={expandedId === res.menuId}
              onToggle={() => handleToggle(res.menuId)}
            />
          ))}
        </div>

        {/* Order modal */}
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