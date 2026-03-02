export function RestaurantCard({ restaurant, isSelected, onSelect, disabled }) {
  const isLimitReached = restaurant.orderCount >= restaurant.limit;

  return (
    <div
      onClick={!disabled && !isLimitReached ? onSelect : undefined}
      className={`
        w-full flex flex-col
        bg-white
        rounded-2xl p-6
        transition-all duration-300
        shadow-md hover:shadow-xl hover:scale-[1.02]
        border border-orange-100
        ${
          isLimitReached || disabled
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer"
        }
        ${
          isSelected
            ? "ring-2 ring-red-400 border-red-400"
            : ""
        }
      `}
    >
      {/* Restaurant Name */}
      <h3 className="text-xl font-bold mb-3 text-gray-800 tracking-wide">
        {restaurant.RestaurantName}
      </h3>

      {/* Menu Description */}
      <pre
        className="
          whitespace-pre-wrap
          text-gray-600 text-sm leading-relaxed
          bg-orange-50
          rounded-xl p-4 mb-4
          border border-orange-100
        "
      >
        {restaurant.message}
      </pre>

      {/* Order Count */}
      <div className="flex justify-between items-center mb-3 text-sm">
        <span className="text-gray-700 font-medium">
          Orders: {restaurant.orderCount} / {restaurant.limit}
        </span>

        {isLimitReached && (
          <span className="text-red-500 font-semibold text-xs">
            Order limit reached
          </span>
        )}
      </div>

      {/* Price + Created Date */}
      <div className="flex items-center justify-between mb-6">
        <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
          ₹ {restaurant.price}
        </span>

        <span className="text-xs text-gray-500">
          {new Date(restaurant.createdDate).toLocaleString()}
        </span>
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <button
          type="button"
          disabled={isLimitReached || disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!isLimitReached && !disabled) onSelect();
          }}
          className={`
            w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
            ${
              isLimitReached
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : isSelected
                ? "bg-red-500 text-white"
                : "bg-gradient-to-r from-red-500 to-amber-500 text-white hover:opacity-90"
            }
          `}
        >
          
          {isLimitReached
            ? "Orders Closed"
            : isSelected
            ? "✔ Selected"
            : "Select Restaurant"}

        </button>
      </div>
    </div>
  );
}

export default RestaurantCard;