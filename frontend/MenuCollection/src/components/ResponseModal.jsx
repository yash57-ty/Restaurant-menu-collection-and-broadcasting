import { useState, useEffect } from "react";

function ResponseModal({
  isOpen,
  menuId,
  restaurantName,
  price,
  remainingSlots,
  submitting,
  onClose,
  onSubmit,
}) {
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setAddress("");
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAmount = price * quantity;

  const validate = () => {
    const newErrors = {};

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!quantity || isNaN(quantity)) {
      newErrors.quantity = "Quantity is required";
    } else if (!Number.isInteger(quantity)) {
      newErrors.quantity = "Must be a whole number";
    } else if (quantity < 1) {
      newErrors.quantity = "Minimum is 1";
    } else if (quantity > remainingSlots) {
      newErrors.quantity = `Max available: ${remainingSlots}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      menuId,
      address: address.trim(),
      quantity,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 z-50">

      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

        {/* Header */}
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm Order 🍽️
          </h3>
          <p className="text-sm text-gray-500">
            {restaurantName}
          </p>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            max={remainingSlots}
            value={quantity}
            onChange={(e) => {
              let value = e.target.value.replace(/^0+/, "");
              if (value === "") return setQuantity("");
              const num = Number(value);
              if (!isNaN(num)) setQuantity(num);
            }}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
          />
          {errors.quantity && (
            <p className="text-red-500 text-xs mt-1">
              {errors.quantity}
            </p>
          )}

          <p className="text-xs text-gray-500 mt-1">
            Available: {remainingSlots}
          </p>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Delivery Address
          </label>
          <textarea
            placeholder="Enter full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">
              {errors.address}
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-5">

          <div className="flex justify-between text-sm mb-1">
            <span>Price</span>
            <span>₹ {price}</span>
          </div>

          <div className="flex justify-between text-sm mb-1">
            <span>Quantity</span>
            <span>x {quantity}</span>
          </div>

          <div className="flex justify-between font-semibold text-orange-600 mt-2">
            <span>Total</span>
            <span>₹ {totalAmount}</span>
          </div>

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
          >
            {submitting ? "Placing..." : "Place Order"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ResponseModal;