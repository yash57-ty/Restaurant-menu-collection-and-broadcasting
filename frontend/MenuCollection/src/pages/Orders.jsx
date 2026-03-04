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
      const res = await fetch("http://localhost:8080/api/orders", {
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

  // open cancel modal
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
      alert("You cannot cancel more than ordered quantity");
      return;
    }

    try {
      const res = await fetch(
       `http://localhost:8080/api/orders/${selectedOrder.orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-USER-PHONE": localStorage.getItem("userPhone"),
          },
          body: JSON.stringify({
            cancelQuantity: qty,
          }),
        }
      );

      if (!res.ok) throw new Error("Cancel failed");

      alert("Order updated successfully");

      setShowCancelModal(false);
      fetchOrders();

    } catch (err) {
      console.error(err);
      alert("Error cancelling order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Your Orders
          </h2>
          <p className="text-gray-500 text-lg">
            Review your previous meals and spending history.
          </p>
        </div>

        {/* Summary */}
        {!loading && orders.length > 0 && (
          <div className="bg-white border border-orange-100 rounded-2xl shadow-md p-6 mb-10">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">
                  {orders.length}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-red-500">
                  ₹ {totalSpent}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-gray-500">
            Loading your delicious history...
          </p>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-orange-100">
            <p className="text-gray-500 text-lg">
              🍽️ You haven’t placed any orders yet.
            </p>
          </div>
        )}

        {/* Orders */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-md border border-orange-100 p-6 hover:shadow-xl transition"
            >

              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {order.restaurantName}
                </h3>

                <span className="text-sm text-gray-500">
                  {new Date(order.orderedAt).toLocaleString()}
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">
                    Quantity:
                  </span>{" "}
                  {order.quantity}
                </p>

                <p>
                  <span className="font-medium text-gray-700">
                    Price:
                  </span>{" "}
                  ₹ {order.pricePerItem}
                </p>

                <p className="font-semibold text-red-500">
                  Total: ₹ {order.totalAmount}
                </p>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => openCancelModal(order)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Cancel Order
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">

            <h3 className="text-lg font-semibold mb-3">
              Cancel Order
            </h3>

            <p className="text-sm mb-3">
              Ordered Quantity: {selectedOrder.quantity}
            </p>

            <input
              type="number"
              value={cancelQty}
              onChange={(e) => setCancelQty(e.target.value)}
              placeholder="Enter quantity to cancel"
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Close
              </button>

              <button
                onClick={handleCancelSubmit}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Confirm Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Orders;