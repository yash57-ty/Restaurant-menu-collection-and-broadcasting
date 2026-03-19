import { Link, useLocation } from "react-router-dom";

export default function MainLayout({ children }) {

  const role = localStorage.getItem("role");

  const homePath =
    role === "Admin" ? "/admin-dashboard" : "/dashboard";

  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/orders":
        return "My Orders";
      case "/menus":
        return "Browse Menus";
      case "/admin":
        return "Restaurant Analytics";
      default:
        return "Dashboard";
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-amber-100 text-gray-900">

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-50">

        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

          {/* Title */}
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            🍽️ {getPageTitle()}
          </h1>

          {/* Nav */}
          <nav className="flex items-center gap-3">

            <Link
              to={homePath}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                isActive(homePath)
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              Home
            </Link>

            <Link
              to="/menus"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                isActive("/menus")
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              Menu
            </Link>

            <Link
              to="/orders"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                isActive("/orders")
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              Orders
            </Link>

          </nav>

        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {children}
      </main>

    </div>
  );
}