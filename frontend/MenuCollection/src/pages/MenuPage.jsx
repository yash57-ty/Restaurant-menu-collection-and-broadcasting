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
        console.error(err);
      }
    };
    fetchCities();
  }, []);

  const fetchMenu = async (keyword = "", cityName = "") => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/message?keyword=${keyword}&city=${cityName}`
      );
      const data = await res.json();
      setMenu(data);
    } catch (err) {
      console.error(err);
    }
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
    }, 5000);
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

  const handleSelect = (restaurant) => {
    if (restaurant.orderCount >= restaurant.limit) return;
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const handleSubmitResponse = async (payload) => {
    if (submitting) return;

    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-USER-PHONE": localStorage.getItem("userPhone"),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Order failed");

      const data = await res.json();
      setOrderSuccess(data);

      fetchMenu(search, city);

      setIsModalOpen(false);
      setSelectedRestaurant(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = (menuId) => {
    setExpandedId((prev) => (prev === menuId ? null : menuId));
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ===== HEADER ===== */}
        <h1 className="text-xl font-bold mb-4">Browse Menus</h1>

        {/* ===== SEARCH BAR ===== */}
        <div className="sticky top-3 z-40 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-2 flex gap-2">
            
            <input
              type="text"
              placeholder="Search restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 outline-none"
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              onFocus={() => setShowCityList(true)}
              className="w-32 px-3 py-2 outline-none text-red-500"
            />
          </div>

          {showCityList && filteredCities.length > 0 && (
            <div className="bg-white mt-2 rounded-xl shadow-md">
              {filteredCities.slice(0, 5).map((c) => (
                <div
                  key={c}
                  onClick={() => {
                    setCity(c);
                    setShowCityList(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUCCESS */}
        {orderSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl">
            Order placed: {orderSuccess.restaurantName}
          </div>
        )}

        {/* ===== LIST (LIKE SWIGGY) ===== */}
        <div className="space-y-4">
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