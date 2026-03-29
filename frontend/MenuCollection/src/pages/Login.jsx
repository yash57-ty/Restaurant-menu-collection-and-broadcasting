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
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-4 font-sans text-[#1A1D23]">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-10 border border-gray-100">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black tracking-tight mb-2">Welcome</h2>
          <p className="text-gray-400 font-medium">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF4757]/20 outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF4757]/20 outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-sm font-bold text-[#FF4757] hover:opacity-70"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1A1D23] hover:bg-black text-white py-5 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-all"
          >
            Login
          </button>

        </form>

        {showForgot && (
          <div className="mt-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Reset Password</h3>

            <form onSubmit={handleResetPassword} className="space-y-3">

              <input
                type="text"
                placeholder="Phone"
                value={resetPhone}
                onChange={(e) => setResetPhone(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-green-400"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-green-400"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold"
                >
                  Update
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="flex-1 bg-gray-200 py-3 rounded-xl font-bold text-gray-600"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-50 text-center space-y-3">
          
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#FF4757] font-bold">
              Sign up
            </Link>
          </p>

          <p className="text-xs text-gray-400">
            Own a restaurant?{" "}
            <Link to="/restaurant-register" className="text-[#1A1D23] font-bold">
              Register here
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;