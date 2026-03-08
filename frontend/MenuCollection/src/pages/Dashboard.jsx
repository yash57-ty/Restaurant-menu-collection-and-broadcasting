import { useNavigate } from "react-router-dom";

function Dashboard() {

  // React Router hook used to move between pages
  const navigate = useNavigate();

  // Get the logged-in user's name stored after login
  const studentName = localStorage.getItem("name");

  // Logs the user out by clearing stored login data and redirecting to login page
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (

    // Main page container with the background color used across the app
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">

      {/* Header showing welcome message and logout button */}
      <header className="bg-white border-b border-orange-100">

        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">

          {/* Displays the logged-in user's name */}
          <h1 className="text-xl font-bold text-gray-800">
            Welcome, {studentName}
          </h1>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded font-bold"
          >
            Logout
          </button>

        </div>
      </header>

      {/* Main dashboard content */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Title and short description of the dashboard */}
        <div className="mb-10">

          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Food Dashboard
          </h2>

          <p className="text-gray-600">
            View menus and manage your orders.
          </p>

        </div>

        {/* Cards used for navigation to important pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card that opens the menu page */}
          <section className="bg-white border rounded-xl p-6">

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Today's Menu
            </h3>

            <p className="text-gray-600 mb-4">
              Browse restaurants and place your order.
            </p>

            <button
              onClick={() => navigate("/menus")}
              className="bg-red-500 text-white px-5 py-2 rounded font-bold"
            >
              View Menu
            </button>

          </section>

          {/* Card that opens the orders history page */}
          <section className="bg-white border rounded-xl p-6">

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Past Orders
            </h3>

            <p className="text-gray-600 mb-4">
              See all the orders you placed earlier.
            </p>

            <button
              onClick={() => navigate("/orders")}
              className="bg-red-500 text-white px-5 py-2 rounded font-bold"
            >
              Show Orders
            </button>

          </section>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;