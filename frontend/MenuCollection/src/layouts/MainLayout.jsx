import { Link, useLocation } from "react-router-dom";

export default function MainLayout({ children }) {

  // Get the role stored after login to determine where the Home button should navigate
  let user = localStorage.getItem("role");

  // If the user is an admin go to admin dashboard, otherwise go to user dashboard
  const homePath =
    user === "Admin" ? "/admin-dashboard" : "/dashboard";

  // React Router hook used to know which page is currently open
  const location = useLocation();

  // This function returns the page title based on the current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/orders":
        return "My Orders";

      case "/menus":
        return "Browse Menus";

      case "/admin":
        return "Restaurant Analytics";

      default:
        return "";
    }
  };

  return (

    // Main wrapper for the page. Provides the background color used across the app.
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 text-gray-900">

      {/* Header contains the page title and navigation links */}
      <header className="bg-white border-b border-orange-100">

        {/* Center the header content and keep spacing consistent */}
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Displays the current page title */}
          <h1 className="text-2xl font-extrabold text-gray-800">
            🍽️ {getPageTitle()}
          </h1>

          {/* Navigation links for moving between main pages */}
          <nav className="flex items-center gap-6">

            {/* Home button redirects to the correct dashboard depending on role */}
            <Link
              to={homePath}
              className="text-base font-bold text-gray-700 hover:text-red-500"
            >
              Home
            </Link>

            {/* Orders page shows the user's previous orders */}
            <Link
              to="/orders"
              className="text-base font-bold text-gray-700 hover:text-red-500"
            >
              Orders
            </Link>

          </nav>
        </div>
      </header>

      {/* This area renders the actual page component passed into the layout */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>

    </div>
  );
}