import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [showForgot, setShowForgot] = useState(false);
  const [resetPhone, setResetPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert("Invalid credentials");
        return;
      }

      const user = await res.json();

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("userPhone", user.phone);

      if (user.role === "User") {
        navigate("/dashboard", { replace: true });
      } else if (user.role === "Admin") {
        navigate("/Admin-dashboard", { replace: true });
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: resetPhone,
          newPassword: newPassword,
        }),
      });
  
      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "Failed to reset password");
        return;
      }
  
      alert("Password updated successfully ✅");
  
      setShowForgot(false);
      setResetPhone("");
      setNewPassword("");
  
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-amber-100 px-4">

      {/* Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Login to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-sm text-orange-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white py-3 rounded-xl font-semibold shadow-md transition-all duration-200"
          >
            Login
          </button>

        </form>

        {showForgot && (
        <div className="mt-6 p-4 border rounded-xl bg-white/80">
          <h3 className="text-lg font-semibold mb-3">
            Reset Password
          </h3>

          <form onSubmit={handleResetPassword} className="space-y-3">

            <input
              type="text"
              placeholder="Enter your phone"
              value={resetPhone}
              onChange={(e) => setResetPhone(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-500 text-white py-2 rounded-lg"
              >
                Update
              </button>

              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="flex-1 bg-gray-300 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

        {/* Footer */}
        <div className="text-center text-sm mt-8 text-gray-600 space-y-2">

          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-600 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>

          <p>
            Want to register your restaurant?{" "}
            <Link
              to="/restaurant-register"
              className="text-orange-600 font-semibold hover:underline"
            >
              Click here
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;