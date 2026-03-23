import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const studentName = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-amber-100">

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">

          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            👋 Hello, <span className="text-orange-600">{studentName}</span>
          </h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow transition"
          >
            Logout
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Hero Section */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            What would you like to eat today? 🍕
          </h2>
          <p className="text-gray-500">
            Explore restaurants, order food, and track your meals easily.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Menu Card */}
          <div
            onClick={() => navigate("/menus")}
            className="cursor-pointer bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🍽️ Browse Menu
            </h3>

            <p className="text-gray-500 text-sm mb-4">
              Discover restaurants and order your favorite meals.
            </p>

            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-semibold transition">
              View Menu
            </button>
          </div>

          {/* Orders Card */}
          <div
            onClick={() => navigate("/orders")}
            className="cursor-pointer bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              📦 Your Orders
            </h3>

            <p className="text-gray-500 text-sm mb-4">
              Check your past orders and track history.
            </p>

            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-semibold transition">
              Show Orders
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;