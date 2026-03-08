import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "../components/RestaurantCard";
import ResponseModal from "../components/ResponseModal";

export function MenuPage() {

  // Used to navigate between pages
  const navigate = useNavigate();

  // Controls whether the order modal is visible
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stores the restaurant selected by the user
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Stores menu data received from backend
  const [menu, setMenu] = useState([]);

  // Prevents multiple submissions while order request is in progress
  const [submitting, setSubmitting] = useState(false);

  // Stores order success response to show confirmation
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Text entered in menu search field
  const [search, setSearch] = useState("");

  // City selected for filtering restaurants
  const [city, setCity] = useState("");

  // Stores all cities returned from backend
  const [cities, setCities] = useState([]);

  // Stores filtered cities based on user typing
  const [filteredCities, setFilteredCities] = useState([]);

  // Controls visibility of city dropdown
  const [showCityList, setShowCityList] = useState(false);


  // Fetch available cities from backend when page loads
  useEffect(() => {

    const fetchCities = async () => {

      try {
        const res = await fetch("http://localhost:8080/webhook/api/cities");
        const data = await res.json();

        setCities(data);
        setFilteredCities(data);

      } catch (err) {
        console.error("Failed to load cities");
      }

    };

    fetchCities();

  }, []);


  // Fetch menu data based on search keyword and city filter
  const fetchMenu = async (keyword = "", cityName = "") => {

    const res = await fetch(
      `http://localhost:8080/api/message?keyword=${keyword}&city=${cityName}`
    );

    const data = await res.json();

    setMenu(data);
  };


  // Debounced search so backend is not called on every keystroke
  useEffect(() => {

    const delay = setTimeout(() => {
      fetchMenu(search, city);
    }, 400);

    return () => clearTimeout(delay);

  }, [search, city]);


  // Automatically refresh menu every 4 seconds
  useEffect(() => {

    const interval = setInterval(() => {
      fetchMenu(search, city);
    }, 4000);

    return () => clearInterval(interval);

  }, [search, city]);


  // Filters city suggestions when user types
  const handleCityChange = (value) => {

    setCity(value);

    const filtered = cities.filter((c) =>
      c.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredCities(filtered);
    setShowCityList(true);
  };


  // Optimistically increase order count before backend confirms
  const applyOptimisticUpdate = (menuId, quantity) => {

    setMenu((prev) =>
      prev.map((item) =>
        item.menuId === menuId
          ? { ...item, orderCount: item.orderCount + quantity }
          : item
      )
    );

  };


  // Rollback optimistic update if backend rejects order
  const rollbackUpdate = (menuId, quantity) => {

    setMenu((prev) =>
      prev.map((item) =>
        item.menuId === menuId
          ? { ...item, orderCount: item.orderCount - quantity }
          : item
      )
    );

  };


  // Opens order modal when a restaurant is selected
  const handleSelect = (restaurant) => {

    if (restaurant.orderCount >= restaurant.limit) {
      alert("Order limit reached for this restaurant");
      return;
    }

    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);

  };


  // Sends order request to backend
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

    // Main container for menu page
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Search inputs for menu keyword and city */}
        <div className="mb-8 flex gap-6 flex-wrap">

          {/* Menu search field */}
          <div>

            <label className="font-bold text-gray-700">
              Search Menu
            </label>

            <input
              type="text"
              placeholder="Search restaurant or food"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 px-3 py-2 border rounded mt-2"
            />

          </div>


          {/* City filter input */}
          <div className="relative">

            <label className="font-bold text-gray-700">
              City
            </label>

            <input
              type="text"
              placeholder="Select city"
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              onFocus={() => setShowCityList(true)}
              className="w-56 px-3 py-2 border rounded mt-2"
            />

            {/* Dropdown showing city suggestions */}
            {showCityList && filteredCities.length > 0 && (

              <div className="absolute z-10 w-56 bg-white border mt-1 max-h-40 overflow-y-auto">

                {filteredCities.slice(0,4).map((c, index) => (

                  <div
                    key={index}
                    onClick={() => {
                      setCity(c);
                      setShowCityList(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {c}
                  </div>

                ))}

              </div>

            )}

          </div>

        </div>


        {/* Order success message */}
        {orderSuccess && (

          <div className="mb-6 p-4 bg-white border rounded">

            <h3 className="text-xl font-bold text-green-600 mb-2">
              Order Placed Successfully
            </h3>

            <p><b>Restaurant:</b> {orderSuccess.restaurantName}</p>
            <p><b>Quantity:</b> {orderSuccess.quantity}</p>
            <p><b>Total Paid:</b> ₹{orderSuccess.totalAmount}</p>
            <p className="text-sm text-gray-600">
              Ordered at {new Date(orderSuccess.orderedAt).toLocaleString()}
            </p>

          </div>

        )}


        {/* Displays restaurants in a grid */}
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


        {/* Order modal used to confirm quantity and address */}
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