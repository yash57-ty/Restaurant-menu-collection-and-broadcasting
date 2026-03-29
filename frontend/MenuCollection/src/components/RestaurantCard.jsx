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

  const handleClick = () => {
    if (isMobile) {
      onToggle();
    } else {
      if (!isLimitReached && !disabled) onSelect();
    }
  };

  // Compact mobile card (collapsed state)
  if (isMobile && !isExpanded) {
    return (
      <div
        onClick={handleClick}
        className={`w-full flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100 transition active:scale-[0.98] ${
          isLimitReached ? "opacity-60" : "cursor-pointer"
        }`}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-[#1A1D23] truncate">
            🍽️ {restaurant.RestaurantName}
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            {restaurant.orderCount}/{restaurant.limit} orders
          </p>
        </div>

        <div className="text-right ml-3 flex-shrink-0">
          <p className="text-sm font-bold text-[#FF4757]">
            ₹{restaurant.price}
          </p>
          <span
            className={`text-xs font-bold ${
              isLimitReached ? "text-red-500" : "text-green-600"
            }`}
          >
            {isLimitReached ? "Closed" : "Open"}
          </span>
        </div>
      </div>
    );
  }

  // Expanded mobile card (detailed view)
  if (isMobile && isExpanded) {
    return (
      <div
        className="w-full bg-white rounded-[2rem] p-6 shadow-md border border-gray-50"
        onClick={handleClick}
      >
        <h3 className="text-lg font-black mb-3 tracking-tight">
          🍽️ {restaurant.RestaurantName}
        </h3>

        <p className="text-sm text-gray-600 mb-5 whitespace-pre-wrap leading-relaxed">
          {restaurant.message}
        </p>

        <div className="flex justify-between mb-4">
          <span className="text-[#FF4757] font-bold">
            ₹ {restaurant.price}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            {restaurant.orderCount}/{restaurant.limit}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isLimitReached && !disabled) onSelect();
          }}
          className={`w-full py-3 rounded-2xl font-bold transition ${
            isLimitReached
              ? "bg-gray-200 text-gray-400"
              : "bg-[#FF4757] text-white hover:bg-[#ff3041] shadow-lg shadow-red-100"
          }`}
        >
          {isLimitReached ? "Closed" : "Order Now"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="w-full mt-3 text-sm font-bold text-gray-400"
        >
          Close
        </button>
      </div>
    );
  }

  // Desktop card layout
  return (
    <div
      onClick={!disabled && !isLimitReached ? onSelect : undefined}
      className={`relative bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col p-8 ${
        isLimitReached || disabled
          ? "opacity-60 grayscale cursor-not-allowed"
          : "cursor-pointer active:scale-95"
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="bg-[#1A1D23] text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
          {restaurant.City || "HOT"}
        </div>

        <p className="text-[10px] font-black uppercase tracking-widest text-[#FF4757]">
          {restaurant.orderCount}/{restaurant.limit} CLAIMED
        </p>
      </div>

      <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase">
        {restaurant.RestaurantName}
      </h3>

      <div className="bg-gray-50 rounded-2xl p-5 mb-6">
        <p className="text-sm text-gray-500 leading-relaxed italic line-clamp-4">
          "{restaurant.message}"
        </p>
      </div>

      <div className="flex justify-between items-end mt-auto">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Price Per Box
          </p>
          <p className="text-3xl font-black text-[#1A1D23]">
            ₹{restaurant.price}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isLimitReached && !disabled) onSelect();
          }}
          className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all ${
            isLimitReached
              ? "bg-gray-100 text-gray-400"
              : "bg-[#FF4757] text-white hover:bg-[#ff3041] shadow-red-100"
          }`}
        >
          {isLimitReached ? "Closed" : "Select"}
        </button>
      </div>
    </div>
  );
}

export default RestaurantCard;