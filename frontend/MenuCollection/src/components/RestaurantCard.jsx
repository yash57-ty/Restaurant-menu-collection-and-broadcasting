import { useState, useEffect } from "react";

export function RestaurantCard({ restaurant, isSelected, onSelect, disabled }) {

  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isLimitReached = restaurant.orderCount >= restaurant.limit;

  const progress = restaurant.limit
    ? (restaurant.orderCount / restaurant.limit) * 100
    : 0;

  const handleClick = () => {
    if (isMobile) {
      setIsExpanded(prev => !prev);
    } else {
      if (!isLimitReached && !disabled) onSelect();
    }
  };

  //  COMPACT MOBILE VIEW
  if (isMobile && !isExpanded) {
    return (
      <div
        onClick={handleClick}
        className={`
          w-full
          flex items-center justify-between
          bg-white rounded-xl px-4 py-3
          shadow-sm border border-gray-100
          active:scale-[0.98] transition
          ${isLimitReached ? "opacity-60" : "cursor-pointer"}
        `}
      >
        {/* LEFT */}
        <div className="flex-1 min-w-0">

          <h3 className="text-sm font-semibold text-gray-900 truncate">
            🍽️ {restaurant.RestaurantName}
          </h3>

          <p className="text-xs text-gray-400 mt-1">
            {restaurant.orderCount}/{restaurant.limit} orders
          </p>

        </div>

        {/* RIGHT */}
        <div className="text-right ml-3 flex-shrink-0">

          <p className="text-sm font-semibold text-orange-600">
            ₹{restaurant.price}
          </p>

          <span
            className={`text-xs font-medium ${
              isLimitReached ? "text-red-500" : "text-green-600"
            }`}
          >
            {isLimitReached ? "Closed" : "Open"}
          </span>

        </div>
      </div>
    );
  }

  // DESKTOP
  return (
    <div
      onClick={handleClick}
      className={`
        w-full
        bg-white/70 backdrop-blur-lg border border-white/40
        rounded-2xl p-5 shadow-md
        transition-all duration-200
        hover:shadow-xl
        active:scale-[0.98]
        ${isLimitReached ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
    >

      {/* HEADER */}
      <div className="flex justify-between items-start mb-3">

        <h3 className="text-lg font-semibold text-gray-900">
          🍽️ {restaurant.RestaurantName}
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            isLimitReached
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {isLimitReached ? "Closed" : "Open"}
        </span>

      </div>

      {/*  FULL DESCRIPTION (FIXED) */}
      <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">
        {restaurant.message}
      </p>

      {/* ORDERS */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>
            Orders: {restaurant.orderCount}/{restaurant.limit}
          </span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* PRICE */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-orange-600">
          ₹ {restaurant.price}
        </span>

        <span className="text-xs text-gray-400">
          {new Date(restaurant.createdDate).toLocaleTimeString()}
        </span>
      </div>

      {/* BUTTON */}
      <button
        type="button"
        disabled={isLimitReached || disabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!isLimitReached && !disabled) onSelect();
        }}
        className={`
          w-full py-2.5 rounded-xl font-semibold transition
          ${
            isLimitReached
              ? "bg-gray-300 text-gray-600"
              : isSelected
              ? "bg-green-500 text-white"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }
        `}
      >
        {isLimitReached
          ? "Orders Closed"
          : isSelected
          ? "Selected ✓"
          : "Order Now"}
      </button>

      {/* COLLAPSE BUTTON (MOBILE) */}
      {isMobile && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(false);
          }}
          className="mt-3 text-sm text-gray-500"
        >
          Close
        </button>
      )}

    </div>
  );
}

export default RestaurantCard;