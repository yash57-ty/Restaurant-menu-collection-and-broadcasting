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
        console.log(data)
      } catch (err) {
        console.error("Failed to load cities");
      }
    };

    fetchCities();
  }, []);

  // 🔎 Backend Connected Fetch
  const fetchMenu = async (keyword = "", cityName = "") => {
    const res = await fetch(
      `http://localhost:8080/api/message?keyword=${keyword}&city=${cityName}`
    );
    const data = await res.json();
    setMenu(data);
  };

  // 🔎 Search + City debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMenu(search, city);
    }, 400);

    return () => clearTimeout(delay);
  }, [search, city]);

  // 🔄 Auto refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMenu(search, city);
    }, 4000);

    return () => clearInterval(interval);
  }, [search, city]);

  // 🔎 City Search Logic
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* 🔎 Search Section */}
        <div className="mb-10 flex gap-6 flex-wrap">

          {/* Menu Search */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Search Menus
            </h3>

            <input
              type="text"
              placeholder="Search restaurant or menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72 px-4 py-2 rounded-xl border border-gray-300 shadow-sm
              focus:ring-2 focus:ring-orange-400 focus:border-orange-400
              outline-none transition"
            />
          </div>

          {/* City Autocomplete */}
          <div className="relative">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Filter by City
            </h3>

            <input
              type="text"
              placeholder="Search city..."
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              onFocus={() => setShowCityList(true)}
              className="w-60 px-4 py-2 rounded-xl border border-gray-300 shadow-sm
              focus:ring-2 focus:ring-orange-400 focus:border-orange-400
              outline-none transition"
            />

           {showCityList && filteredCities.length > 0 && (
  <div className="absolute z-10 w-60 bg-white border rounded-xl shadow-md mt-1 max-h-40 overflow-y-auto">

    {filteredCities.slice(0,4).map((c, index) => (
      <div
        key={index}
        onClick={() => {
          setCity(c);
          setShowCityList(false);
        }}
        className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
      >
        {c}
      </div>
    ))}

  </div>
)}
          </div>

        </div>

        {/* Success Banner */}
        {orderSuccess && (
          <div className="mb-8 p-6 bg-white border border-amber-200 rounded-2xl shadow-md">
            <h3 className="text-2xl font-bold text-amber-600 mb-4">
              🍽️ Order Placed Successfully!
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
              <p>
                <span className="font-semibold">Restaurant:</span>{" "}
                {orderSuccess.restaurantName}
              </p>

              <p>
                <span className="font-semibold">Quantity:</span>{" "}
                {orderSuccess.quantity}
              </p>

              <p>
                <span className="font-semibold">Total Paid:</span>{" "}
                ₹{orderSuccess.totalAmount}
              </p>

              <p className="text-sm text-gray-500">
                Ordered at:{" "}
                {new Date(orderSuccess.orderedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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