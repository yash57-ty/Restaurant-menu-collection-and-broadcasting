import { Link, useLocation } from "react-router-dom";

export default function MainLayout({ children }) {

  const role = localStorage.getItem("role");

  // Determines correct home route based on user role
  const homePath =
    role === "Admin" ? "/admin-dashboard" : "/dashboard";

  const location = useLocation();

  // Resolves dynamic page title based on route
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

  // Checks active route for navigation highlighting
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#1A1D23] font-sans">

      {/* Top navigation bar */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-[60]">
        
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Page title */}
          <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-[#FF4757] text-white p-1 rounded-lg">
              GO
            </span>
            <span className="hidden sm:inline">
              {getPageTitle().toUpperCase()}
            </span>
          </h1>

          {/* Navigation menu */}
          <nav className="flex items-center bg-gray-100 p-1.5 rounded-2xl">
            {[
              { name: "Home", path: homePath },
              { name: "Menu", path: "/menus" },
              { name: "Orders", path: "/orders" }
            ].map((nav) => (
              <Link
                key={nav.name}
                to={nav.path}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive(nav.path)
                    ? "bg-white text-[#FF4757] shadow-sm"
                    : "text-gray-400 hover:text-[#1A1D23]"
                }`}
              >
                {nav.name}
              </Link>
            ))}
          </nav>

        </div>

      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

    </div>
  );
}