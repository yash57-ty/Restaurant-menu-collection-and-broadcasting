export function RestaurantCard({ restaurant, isSelected, onSelect, disabled }) {

  // Check if restaurant has reached its order limit
  const isLimitReached = restaurant.orderCount >= restaurant.limit;

  return (

    // Main card container showing restaurant and menu information
    <div
      onClick={!disabled && !isLimitReached ? onSelect : undefined}
      className={`
        w-full flex flex-col
        bg-white border p-5
        ${
          isLimitReached || disabled
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer"
        }
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

        {/* Message shown when order limit is reached */}
        {isLimitReached && (
          <span className="text-red-500 font-bold">
            Orders Closed
          </span>
        )}

      </div>


      {/* Price and menu creation time */}
      <div className="flex justify-between items-center mb-4">

        <span className="font-bold text-red-500">
          ₹ {restaurant.price}
        </span>

        <span className="text-xs text-gray-600">
          {new Date(restaurant.createdDate).toLocaleString()}
        </span>

      </div>


      {/* Button used to select restaurant for placing order */}
      <button
        type="button"
        disabled={isLimitReached || disabled}
        onClick={(e) => {

          e.stopPropagation();

          if (!isLimitReached && !disabled) {
            onSelect();
          }

        }}
        className={`
          w-full py-2 font-bold
          ${
            isLimitReached
              ? "bg-gray-300 text-gray-600"
              : isSelected
              ? "bg-red-500 text-white"
              : "bg-red-500 text-white"
          }
        `}
      >

        {isLimitReached
          ? "Orders Closed"
          : isSelected
          ? "Selected"
          : "Select Restaurant"}

      </button>

    </div>
  );
}

export default RestaurantCard;