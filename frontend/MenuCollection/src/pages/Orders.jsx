import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelQty, setCancelQty] = useState("");

  const navigate = useNavigate();

  // Fetches orders, filters invalid entries, and sorts by latest
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/api/orders", {
        headers: {
          "X-USER-PHONE": localStorage.getItem("userPhone"),
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();

      const filteredAndSortedOrders = data
        .filter(order => order.quantity > 0)
        .sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));

      setOrders(filteredAndSortedOrders);

    } catch (err) {
      console.error(err);
      alert("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Calculates total expenditure
  const totalSpent = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  // Opens cancel modal with selected order context
  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setCancelQty("");
    setShowCancelModal(true);
  };

  // Handles cancellation with strict validation
  const handleCancelSubmit = async () => {
    const qty = parseInt(cancelQty);

    if (!qty || qty <= 0) {
      alert("Enter valid quantity");
      return;
    }

    if (qty > selectedOrder.quantity) {
      alert("Cannot cancel more than ordered");
      return;
    }

    try {
      const res = await fetch(
        `/api/api/orders/${selectedOrder.orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-USER-PHONE": localStorage.getItem("userPhone"),
          },
          body: JSON.stringify({ cancelQuantity: qty }),
        }
      );

      if (!res.ok) throw new Error("Cancel failed");

      setShowCancelModal(false);
      fetchOrders();

    } catch (err) {
      console.error(err);
      alert("Error cancelling order");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-20">

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mb-12">
          <h2 className="text-4xl font-black tracking-tight mb-2">
            Order History
          </h2>
          <p className="text-gray-400 font-medium">
            Track your cravings and spending.
          </p>
        </div>

        {/* Summary */}
        {!loading && orders.length > 0 && (
          <div className="grid grid-cols-2 gap-6 mb-12">

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Total Orders
              </p>
              <p className="text-3xl font-black">
                {orders.length}
              </p>
            </div>

            <div className="bg-[#1A1D23] p-8 rounded-[2.5rem] shadow-xl shadow-gray-200">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                Total Spent
              </p>
              <p className="text-3xl font-black text-[#FF4757]">
                ₹{totalSpent}
              </p>
            </div>

          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center py-20 opacity-20">
            <div className="w-12 h-12 border-4 border-t-[#FF4757] rounded-full animate-spin mb-4"></div>
            <p className="font-black uppercase tracking-tighter text-xs">
              Syncing Orders...
            </p>
          </div>
        ) : orders.length === 0 ? (

          /* Empty state */
          <div className="bg-white rounded-[3rem] p-16 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold mb-6 italic">
              "Your order history is as empty as a clean plate."
            </p>
            <button
              onClick={() => navigate("/menus")}
              className="bg-[#FF4757] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-100 hover:scale-105 transition-all"
            >
              Explore Menu
            </button>
          </div>

        ) : (

          /* Orders list */
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 group hover:shadow-md transition-all"
              >

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">
                      {order.restaurantName}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                      {new Date(order.orderedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">
                      Paid
                    </p>
                    <p className="text-xl font-black text-[#FF4757]">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Qty
                    </p>
                    <p className="font-black text-[#1A1D23]">
                      {order.quantity}
                    </p>
                  </div>

                  <div className="h-8 w-px bg-gray-100"></div>

                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Unit Price
                    </p>
                    <p className="font-black text-[#1A1D23]">
                      ₹{order.pricePerItem}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-50">
                  <button
                    onClick={() => openCancelModal(order)}
                    className="text-[10px] font-black text-[#FF4757] uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                  >
                    Cancel Items
                  </button>
                </div>

              </div>
            ))}
          </div>

        )}

      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-[#1A1D23]/60 backdrop-blur-md z-[100] flex items-center justify-center px-4">

          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-10 shadow-2xl">

            <h3 className="text-2xl font-black mb-2">
              Cancel Order?
            </h3>

            <p className="text-sm text-gray-400 font-medium mb-8">
              Current quantity:{" "}
              <span className="text-[#1A1D23] font-black">
                {selectedOrder.quantity}
              </span>
            </p>

            <input
              type="number"
              value={cancelQty}
              onChange={(e) => setCancelQty(e.target.value)}
              placeholder="How many to cancel?"
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF4757]/20 outline-none mb-6 font-bold"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-4 font-black text-[10px] uppercase tracking-widest text-gray-400"
              >
                Discard
              </button>

              <button
                onClick={handleCancelSubmit}
                className="flex-1 bg-[#1A1D23] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl"
              >
                Confirm
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Orders;