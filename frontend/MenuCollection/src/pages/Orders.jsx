import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelQty, setCancelQty] = useState("");

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://menucollection-env.eba-3fhzuumj.eu-north-1.elasticbeanstalk.com/api/api/orders", {
        headers: {
          "X-USER-PHONE": localStorage.getItem("userPhone"),
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();

      const sortedOrders = [...data].sort(
        (a, b) => new Date(b.orderedAt) - new Date(a.orderedAt)
      );

      setOrders(sortedOrders);

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

  const totalSpent = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setCancelQty("");
    setShowCancelModal(true);
  };

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
        `http://menucollection-env.eba-3fhzuumj.eu-north-1.elasticbeanstalk.com/api/api/orders/${selectedOrder.orderId}/cancel`,
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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-amber-100">

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Your Orders 📦
          </h2>
          <p className="text-gray-500">
            Track and manage your food orders.
          </p>
        </div>

        {/* Summary */}
        {!loading && orders.length > 0 && (
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-md p-5 mb-8 grid grid-cols-2 gap-4">

            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-semibold">{orders.length}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-xl font-semibold text-orange-600">
                ₹ {totalSpent}
              </p>
            </div>

          </div>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-gray-500">Loading orders...</p>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 text-center shadow">
            <p className="text-gray-500 mb-4">
              No orders yet 🍽️
            </p>
            <button
              onClick={() => navigate("/menus")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl"
            >
              Browse Food
            </button>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-5">

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 shadow-md"
            >

              {/* Top Row */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">
                  {order.restaurantName}
                </h3>
                <span className="text-xs text-gray-500">
                  {new Date(order.orderedAt).toLocaleString()}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">

                <div>
                  <p className="text-gray-500">Quantity</p>
                  <p className="font-medium">{order.quantity}</p>
                </div>

                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="font-medium">₹ {order.pricePerItem}</p>
                </div>

                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-semibold text-orange-600">
                    ₹ {order.totalAmount}
                  </p>
                </div>

              </div>

              {/* Action */}
              <div className="flex justify-end">
                <button
                  onClick={() => openCancelModal(order)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm"
                >
                  Cancel Order
                </button>
              </div>

            </div>
          ))}

        </div>

      </div>

      {/* Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

            <h3 className="text-lg font-semibold mb-4">
              Cancel Order
            </h3>

            <p className="text-sm text-gray-500 mb-3">
              Ordered: {selectedOrder.quantity}
            </p>

            <input
              type="number"
              value={cancelQty}
              onChange={(e) => setCancelQty(e.target.value)}
              placeholder="Enter quantity"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl border hover:bg-gray-100"
              >
                Close
              </button>

              <button
                onClick={handleCancelSubmit}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl"
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