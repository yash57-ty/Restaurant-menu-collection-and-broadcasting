export function RestaurantCard({ restaurant, isSelected, onSelect, disabled }) {
  const isLimitReached = restaurant.orderCount >= restaurant.limit;
  const progress = restaurant.limit
    ? (restaurant.orderCount / restaurant.limit) * 100
    : 0;
  return (
    <div
      onClick={!disabled && !isLimitReached ? onSelect : undefined}
      className={`
        group w-full flex flex-col justify-between
        bg-white/70 backdrop-blur-lg border border-white/40
        rounded-2xl p-5 shadow-md
        transition-all duration-200
        hover:shadow-xl hover:scale-[1.02]
        ${isLimitReached || disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
    >

      {/* Restaurant name */}
      <h3 className="text-lg font-bold text-red-500 mb-2">
        {restaurant.RestaurantName}
      </h3>

      {/* Menu description sent by restaurant */}
      <pre className="whitespace-pre-wrap text-base font-medium text-gray-800 border p-3 mb-3 bg-gray-50 font-sans">
        {restaurant.message}
      </pre>

      {/* Shows how many orders are already placed */}
      <div className="flex justify-between text-sm mb-3">

        <span>
          <b>Orders:</b> {restaurant.orderCount} / {restaurant.limit}
        </span>

      </div>

      {/* Orders Progress */}
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

      {/* Price + Time */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-orange-600">
          ₹ {restaurant.price}
        </span>

        <span className="text-xs text-gray-400">
          {new Date(restaurant.createdDate).toLocaleTimeString()}
        </span>
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

    </div>
  );
}
export default RestaurantCard;