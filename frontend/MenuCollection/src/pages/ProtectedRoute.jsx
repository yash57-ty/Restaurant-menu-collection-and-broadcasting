import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute({ children, allowedRole }) {

  const [checking, setChecking] = useState(true);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Simulate small delay for smoother UX
    const timer = setTimeout(() => {
      setChecking(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);


  // Show loading UI instead of blank screen
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-amber-100">
        <div className="bg-white/70 backdrop-blur-lg px-6 py-5 rounded-2xl shadow-md text-center">

          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>

          <p className="text-sm text-gray-600">
            Checking access...
          </p>

        </div>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;