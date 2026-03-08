import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  // Used to redirect user after successful login
  const navigate = useNavigate();

  // Stores phone number and password entered in the form
  const [form, setForm] = useState({
    phone: "",
    password: ""
  });

  // Updates form state when user types in input fields
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Handles login request when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // Send login request to backend
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // If credentials are invalid show error
      if (!res.ok) {
        alert("Invalid credentials");
        return;
      }

      // Receive user data from backend
      const user = await res.json();

      // Store login information in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("userPhone", user.phone);

      // Redirect user based on role
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

    // Page container with background color used across the project
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 px-4">

      {/* Login card */}
      <div className="w-full max-w-md bg-white p-8 border rounded-xl">

        {/* Page heading */}
        <div className="text-center mb-6">

          <h2 className="text-3xl font-extrabold text-gray-800">
            Welcome Back
          </h2>

          <p className="text-gray-600">
            Login to continue
          </p>

        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Phone number input */}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />

          {/* Password input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded font-bold"
          >
            Login
          </button>

        </form>

        {/* Links for signup and restaurant registration */}
        <div className="text-center text-sm mt-6 text-gray-600">

          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-red-500 font-bold"
            >
              Sign up
            </Link>
          </p>

          <p className="mt-2">
            Want to register your restaurant?{" "}
            <Link
              to="/restaurant-register"
              className="text-red-500 font-bold"
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