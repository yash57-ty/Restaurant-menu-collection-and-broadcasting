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

  // Stores delivery address entered by user
  const [address, setAddress] = useState("");

  // Stores quantity selected by user
  const [quantity, setQuantity] = useState(1);

  // Stores validation errors for inputs
  const [errors, setErrors] = useState({});


  // Reset form values every time modal opens
  useEffect(() => {

    if (isOpen) {
      setQuantity(1);
      setAddress("");
      setErrors({});
    }

  }, [isOpen]);


  // Do not render modal if it is closed
  if (!isOpen) return null;


  // Calculates total amount for the order
  const totalAmount = price * quantity;


  // Validates user input before submitting order
  const validate = () => {

    const newErrors = {};

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!quantity || isNaN(quantity)) {
      newErrors.quantity = "Quantity is required";
    }

    else if (!Number.isInteger(quantity)) {
      newErrors.quantity = "Quantity must be a whole number";
    }

    else if (quantity < 1) {
      newErrors.quantity = "Minimum quantity is 1";
    }

    else if (quantity > remainingSlots) {
      newErrors.quantity = `Maximum available is ${remainingSlots}`;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // Called when user clicks Place Order
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

    // Background overlay for modal
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">

      {/* Modal container */}
      <div className="bg-white border p-6 w-full max-w-md">

        {/* Title of the order confirmation */}
        <h3 className="text-xl font-bold mb-4">
          Confirm Order - {restaurantName}
        </h3>


        {/* Quantity input field */}
        <label className="font-bold">Quantity</label>

        <input
          type="number"
          min="1"
          max={remainingSlots}
          value={quantity}
          onChange={(e) => {

            let value = e.target.value;

            // Remove leading zeros
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
          className="w-full border px-3 py-2 mt-1 mb-2"
        />

        {/* Display quantity validation error */}
        {errors.quantity && (
          <p className="text-red-500 text-sm mb-2">
            {errors.quantity}
          </p>
        )}

        {/* Shows how many order slots remain */}
        <p className="text-sm text-gray-600 mb-3">
          Available slots: {remainingSlots}
        </p>


        {/* Address input field */}
        <label className="font-bold">Delivery Address</label>

        <textarea
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border px-3 py-2 mt-1 mb-2"
        />

        {/* Display address validation error */}
        {errors.address && (
          <p className="text-red-500 text-sm mb-2">
            {errors.address}
          </p>
        )}


        {/* Total amount calculated for the order */}
        <div className="font-bold text-red-500 mb-4">
          Total: ₹ {totalAmount}
        </div>


        {/* Buttons to cancel or confirm order */}
        <div className="flex justify-end gap-3">

          {/* Close modal */}
          <button
            onClick={onClose}
            className="px-4 py-2 border"
          >
            Cancel
          </button>

          {/* Submit order */}
          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-500 text-white font-bold"
          >
            {submitting ? "Placing..." : "Place Order"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ResponseModal;