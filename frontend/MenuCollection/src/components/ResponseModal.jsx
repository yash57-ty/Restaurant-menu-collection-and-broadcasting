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
      newErrors.quantity = "Quantity must be a whole number";
    } else if (quantity < 1) {
      newErrors.quantity = "Minimum quantity is 1";
    } else if (quantity > remainingSlots) {
      newErrors.quantity = `Maximum available is ${remainingSlots}`;
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">

        <h3 className="text-2xl font-bold mb-4">
          Confirm Order – {restaurantName}
        </h3>

        {/* Quantity Input */}
        <label className="block font-semibold mb-1">Quantity</label>
        <input
          type="number"
          min="1"
          max={remainingSlots}
          value={quantity}
          onChange={(e) => {
            let value = e.target.value;

            value = value.replace(/^0+/, "");

            if (value === "") {
              setQuantity("");
              return;
            }

           const num = Number(value);

          if (!isNaN(num)) {
            setQuantity(num);
          }
          }}
        className="w-full border p-2 mb-1 rounded"
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm mb-3">{errors.quantity}</p>
        )}

        <p className="text-sm text-gray-500 mb-4">
          Available slots: {remainingSlots}
        </p>

        {/* Address Input */}
        <label className="block font-semibold mb-1">Delivery Address</label>
        <textarea
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 mb-1 rounded"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mb-3">{errors.address}</p>
        )}

        {/* Total */}
        <div className="mb-4 font-bold text-red-500">
          Total: ₹ {totalAmount}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResponseModal;