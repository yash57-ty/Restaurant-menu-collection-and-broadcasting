import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const studentName = localStorage.getItem("name");

  // Handles user logout by clearing session data and redirecting to login
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1D23]">

      {/* Top navigation bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          <h1 className="text-xl font-black tracking-tighter text-[#FF4757]">
            GOURMET.
          </h1>

          <div className="flex items-center gap-4">
            <p className="hidden md:block text-sm font-bold text-gray-500 uppercase tracking-widest">
              Hi, {studentName}
            </p>

            <button
              onClick={handleLogout}
              className="bg-[#1A1D23] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* Intro section */}
        <div className="mb-14">
          <h2 className="text-5xl font-black leading-none mb-4">
            Hungry?<br />
            <span className="text-[#FF4757]">Let's fix that.</span>
          </h2>

          <p className="text-gray-400 font-medium max-w-sm">
            The best flavors from your city, delivered to your screen.
          </p>
        </div>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

          {/* Menu navigation card */}
          <div
            onClick={() => navigate("/menus")}
            className="group cursor-pointer bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50"
          >
            <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              🍽️
            </div>

            <h3 className="text-2xl font-black mb-2 tracking-tight">
              Browse Menu
            </h3>

            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Discover curated restaurants and hidden gems nearby.
            </p>

            <button className="text-sm font-black text-[#FF4757] uppercase tracking-widest border-b-2 border-[#FF4757] pb-1">
              Explore Now
            </button>
          </div>

          {/* Orders navigation card */}
          <div
            onClick={() => navigate("/orders")}
            className="group cursor-pointer bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50"
          >
            <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              📦
            </div>

            <h3 className="text-2xl font-black mb-2 tracking-tight">
              Your Orders
            </h3>

            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Check your favorites and track your meal history.
            </p>

            <button className="text-sm font-black text-[#1A1D23] uppercase tracking-widest border-b-2 border-[#1A1D23] pb-1">
              View History
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;