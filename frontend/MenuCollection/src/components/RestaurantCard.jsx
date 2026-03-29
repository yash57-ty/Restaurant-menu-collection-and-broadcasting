import { useState, useEffect } from "react";

export function RestaurantCard({ restaurant, isSelected, onSelect, disabled, isExpanded, onToggle }) {

  const [isMobile, setIsMobile] = useState(false);

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
        onToggle();
      } else {
        if (!isLimitReached && !disabled) onSelect();
      }
    };

  //  MOBILE COMPACT VIEW 
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

  //  MOBILE EXPANDED VIEW
  if (isMobile && isExpanded) {
    return (
      <div
        className="w-full bg-white rounded-2xl p-5 shadow-md border"
        onClick={handleClick}
      >

        <h3 className="text-lg font-semibold mb-2">
          🍽️ {restaurant.RestaurantName}
        </h3>

        {/* FULL DESCRIPTION */}
        <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">
          {restaurant.message}
        </p>

        <div className="flex justify-between mb-3">
          <span className="text-orange-600 font-semibold">
            ₹ {restaurant.price}
          </span>

          <span className="text-xs text-gray-500">
            {restaurant.orderCount}/{restaurant.limit}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="w-full bg-orange-500 text-white py-2 rounded-xl"
        >
          Order Now
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="w-full mt-2 text-sm text-gray-500"
        >
          Close
        </button>

      </div>
    );
  }

  //  DESKTOP
  return (
    <div
      onClick={!disabled && !isLimitReached ? onSelect : undefined}
      className={`
        w-full flex flex-col justify-between h-full
        bg-white border p-5
        ${
          isLimitReached || disabled
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer"
        }
      `}
    >
      <div>

      {/* Restaurant name */}
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {restaurant.RestaurantName}
      </h3>

      {/* ORIGINAL DESCRIPTION */}
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 border p-3 mb-3 bg-gray-50 rounded-lg">
        {restaurant.message}
      </p>

      {/* Orders */}
      <div className="flex justify-between text-sm mb-3">
        <span>
          <b>Orders:</b> {restaurant.orderCount} / {restaurant.limit}
        </span>
      </div>

      {/* Price + Time */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-red-500">
          ₹ {restaurant.price}
        </span>

        <span className="text-xs text-gray-600">
          {new Date(restaurant.createdDate).toLocaleString()}
        </span>
      </div>
      </div>

      {/* Button */}
      <button
        type="button"
        disabled={isLimitReached || disabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!isLimitReached && !disabled) onSelect();
        }}
        className={`
          w-full py-2 font-bold
          ${
            isLimitReached
              ? "bg-gray-300 text-gray-600"
              : "bg-red-500 text-white"
          }
        `}
      >
        {isLimitReached ? "Orders Closed" : "Select Restaurant"}
      </button>

    </div>
  );
}

export default RestaurantCard;