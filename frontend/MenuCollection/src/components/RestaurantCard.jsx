import { ChevronDown, ChevronUp } from "lucide-react";

export default function RestaurantCard({
  restaurant,
  onSelect,
  disabled,
  isExpanded,
  onToggle,
}) {
  const isLimitReached = restaurant.orderCount >= restaurant.limit;

  return (
    <div
      className={`bg-white border border-gray-100 rounded-2xl transition-all duration-300 ${
        isExpanded ? "shadow-xl" : "hover:shadow-md"
      }`}
    >
      {/* ===== TOP ROW (LIKE SWIGGY LIST) ===== */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between px-4 py-4 cursor-pointer"
      >
        {/* LEFT */}
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-sm sm:text-lg font-semibold truncate">
            🍽️ {restaurant.RestaurantName}
          </h3>

          <p className="text-xs text-gray-400 mt-1">
            {restaurant.orderCount}/{restaurant.limit} orders
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm sm:text-lg font-bold text-[#FF4757]">
              ₹{restaurant.price}
            </p>

            <p
              className={`text-xs font-medium ${
                isLimitReached ? "text-red-500" : "text-green-600"
              }`}
            >
              {isLimitReached ? "Closed" : "Open"}
            </p>
          </div>

          {isExpanded ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>
      </div>

      {/* ===== EXPANDED SECTION ===== */}
      {isExpanded && (
        <div className="px-5 pb-5 animate-fadeIn">
          <div className="h-px bg-gray-100 mb-4" />

          {/* MENU TEXT */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              {restaurant.message}
            </p>
          </div>

          {/* BOTTOM */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase">Price</p>
              <p className="text-lg font-bold">₹{restaurant.price}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isLimitReached && !disabled) onSelect();
              }}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                isLimitReached
                  ? "bg-gray-200 text-gray-400"
                  : "bg-[#FF4757] text-white hover:bg-[#ff2e43]"
              }`}
            >
              {isLimitReached ? "Closed" : "Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}