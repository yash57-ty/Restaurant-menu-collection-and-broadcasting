import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
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
      const res = await fetch("http://menucollection-env.eba-3fhzuumj.eu-north-1.elasticbeanstalk.com/auth/login", {
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

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white py-3 rounded-xl font-semibold shadow-md transition-all duration-200"
          >
            Login
          </button>

        </form>

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