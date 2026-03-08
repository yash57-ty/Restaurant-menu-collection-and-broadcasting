import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    emial:""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Signup failed");
      return;
    }

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 px-4">

      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-orange-100">

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            🍽️ Create Account
          </h2>
          <p className="text-gray-500 text-sm">
            Join and start ordering delicious meals
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="
              w-full px-4 py-2.5
              border border-orange-200
              rounded-xl
              focus:outline-none
              focus:ring-2 focus:ring-red-300
              focus:border-red-400
              transition
            "
          />

          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="
              w-full px-4 py-2.5
              border border-orange-200
              rounded-xl
              focus:outline-none
              focus:ring-2 focus:ring-red-300
              focus:border-red-400
              transition
            "
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="
              w-full px-4 py-2.5
              border border-orange-200
              rounded-xl
              focus:outline-none
              focus:ring-2 focus:ring-red-300
              focus:border-red-400
              transition
            "
          />

          <input
            name="email"
            type="text"
            placeholder="enter email"
            onChange={handleChange}
            className="
              w-full px-4 py-2.5
              border border-orange-200
              rounded-xl
              focus:outline-none
              focus:ring-2 focus:ring-red-300
              focus:border-red-400
              transition
            "
          />

          <button
            type="submit"
            className="
              w-full
              bg-gradient-to-r from-red-500 to-amber-500
              text-white py-2.5
              rounded-xl
              font-semibold
              shadow-sm
              hover:opacity-90
              transition
            "
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm mt-6 text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 font-semibold hover:text-red-600 transition"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
