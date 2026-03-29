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

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setAddress("");
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAmount = price * quantity;

  // Validates user input before submission
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

  // Handles final submission
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
    <div className="fixed inset-0 bg-[#1A1D23]/60 backdrop-blur-md flex items-center justify-center px-4 z-[100]">
      
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 border border-gray-100 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-2xl font-black tracking-tight text-[#1A1D23]">
            Finalize Order 🥡
          </h3>
          <p className="text-[#FF4757] font-bold text-sm uppercase tracking-widest mt-1">
            {restaurantName}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Quantity */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
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
              className="mt-1 w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF4757]/20 outline-none font-bold text-lg"
            />

            {errors.quantity && (
              <p className="text-[#FF4757] text-xs font-bold mt-2 ml-1">
                {errors.quantity}
              </p>
            )}

            <p className="text-xs text-gray-400 mt-1 ml-1">
              Available: {remainingSlots}
            </p>
          </div>

          {/* Address */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Delivery Address
            </label>

            <textarea
              placeholder="House no, Street, Landmark..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF4757]/20 outline-none min-h-[100px] resize-none font-medium"
            />

            {errors.address && (
              <p className="text-[#FF4757] text-xs font-bold mt-2 ml-1">
                {errors.address}
              </p>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-[#1A1D23] rounded-3xl p-6 text-white">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
              <span>Summary</span>
              <span>x{quantity || 0}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Amount</span>
              <span className="text-2xl font-black text-[#FF4757]">
                ₹{totalAmount}
              </span>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">

          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="flex-1 bg-[#FF4757] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-100 active:scale-95 transition-all"
          >
            {submitting ? "Placing..." : "Place Order"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ResponseModal;