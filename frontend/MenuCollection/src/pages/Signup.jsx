import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {

  // Used to redirect user after successful signup
  const navigate = useNavigate();

  // Stores form inputs entered by the user
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    emial: ""
  });

  // Updates form state whenever user types in input fields
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


  // Sends signup request to backend
  const handleSubmit = async (e) => {

    e.preventDefault();

    const res = await fetch("http://localhost:8080/auth/signup", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(form),

    });

    // If backend returns error show alert
    if (!res.ok) {
      alert("Signup failed");
      return;
    }

    // Redirect user to login page after successful signup
    navigate("/login");

  };

  return (

    // Page container used to center signup card
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 px-4">

      {/* Signup card */}
      <div className="w-full max-w-md bg-white p-8 border">

        {/* Page heading */}
        <div className="text-center mb-6">

          <h2 className="text-3xl font-extrabold text-gray-800">
            Create Account
          </h2>

          <p className="text-gray-600">
            Sign up to start ordering food
          </p>

        </div>


        {/* Signup form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* User full name */}
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />

          {/* User phone number */}
          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />

          {/* User password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />

          {/* User email */}
          <input
            name="email"
            type="text"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />

          {/* Signup button */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded font-bold"
          >
            Create Account
          </button>

        </form>


        {/* Link to login page if user already has account */}
        <p className="text-center text-sm mt-6 text-gray-600">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-red-500 font-bold"
          >
            Login
          </Link>

        </p>

      </div>
    </div>
  );
}

export default Signup;