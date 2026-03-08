import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Orders() {

  // Stores all orders of the logged-in user
  const [orders, setOrders] = useState([]);

  // Used to show loading message while fetching data
  const [loading, setLoading] = useState(true);

  // Controls visibility of cancel order modal
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Stores the order currently selected for cancellation
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Quantity user wants to cancel
  const [cancelQty, setCancelQty] = useState("");

  const navigate = useNavigate();


  // Fetch orders from backend
  const fetchOrders = async () => {

    try {

      const res = await fetch("http://localhost:8080/api/orders", {
        headers: {
          "X-USER-PHONE": localStorage.getItem("userPhone"),
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();

      // Sort orders so latest orders appear first
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


  // Fetch orders when the page loads
  useEffect(() => {
    fetchOrders();
  }, []);


  // Calculates total amount spent by the user
  const totalSpent = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );


  // Opens cancel modal for a selected order
  const openCancelModal = (order) => {

    setSelectedOrder(order);
    setCancelQty("");
    setShowCancelModal(true);

  };


  // Sends cancel request to backend
  const handleCancelSubmit = async () => {

    const qty = parseInt(cancelQty);

    // Validate cancel quantity
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

    // Main container for orders page
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Page title */}
        <div className="mb-8">

          <h2 className="text-3xl font-extrabold text-gray-800">
            Your Orders
          </h2>

          <p className="text-gray-600">
            View and manage your previous orders.
          </p>

        </div>


        {/* Summary showing order count and total spent */}
        {!loading && orders.length > 0 && (

          <div className="bg-white border rounded p-4 mb-8">

            <div className="grid sm:grid-cols-2 gap-4">

              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-xl font-bold">{orders.length}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Total Spent</p>
                <p className="text-xl font-bold text-red-500">
                  ₹ {totalSpent}
                </p>
              </div>

            </div>

          </div>

        )}


        {/* Loading message */}
        {loading && (
          <p className="text-gray-600">
            Loading orders...
          </p>
        )}


        {/* Message if user has not placed any orders */}
        {!loading && orders.length === 0 && (

          <div className="bg-white border p-6 text-center">

            <p className="text-gray-600">
              You have not placed any orders yet.
            </p>

          </div>

        )}


        {/* List of orders */}
        <div className="space-y-4">

          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-white border p-4"
            >

              {/* Restaurant name and order time */}
              <div className="flex justify-between mb-2">

                <h3 className="font-bold text-gray-800">
                  {order.restaurantName}
                </h3>

                <span className="text-sm text-gray-600">
                  {new Date(order.orderedAt).toLocaleString()}
                </span>

              </div>


              {/* Order details */}
              <div className="grid sm:grid-cols-3 gap-4 text-sm">

                <p>
                  <b>Quantity:</b> {order.quantity}
                </p>

                <p>
                  <b>Price:</b> ₹ {order.pricePerItem}
                </p>

                <p className="font-bold text-red-500">
                  Total: ₹ {order.totalAmount}
                </p>

              </div>


              {/* Cancel order button */}
              <div className="mt-3 flex justify-end">

                <button
                  onClick={() => openCancelModal(order)}
                  className="bg-red-500 text-white px-4 py-2 rounded font-bold"
                >
                  Cancel Order
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* Modal used for cancelling orders */}
      {showCancelModal && (

        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">

          <div className="bg-white border p-6 w-80">

            <h3 className="font-bold mb-3">
              Cancel Order
            </h3>

            <p className="text-sm mb-3">
              Ordered Quantity: {selectedOrder.quantity}
            </p>

            {/* Input for cancel quantity */}
            <input
              type="number"
              value={cancelQty}
              onChange={(e) => setCancelQty(e.target.value)}
              placeholder="Enter quantity"
              className="w-full border px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-3">

              {/* Close modal button */}
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border"
              >
                Close
              </button>

              {/* Confirm cancel button */}
              <button
                onClick={handleCancelSubmit}
                className="px-4 py-2 bg-red-500 text-white font-bold"
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