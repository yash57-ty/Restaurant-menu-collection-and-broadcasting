import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    email: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
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
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-4 py-10 text-[#1A1D23]">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.05)] p-10">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black mb-2 tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-400 font-medium">
            Join our foodie community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {["name", "phone", "email", "password"].map((field) => (
            <input
              key={field}
              name={field}
              type={
                field === "password"
                  ? "password"
                  : field === "email"
                  ? "email"
                  : "text"
              }
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF4757]/20 transition-all outline-none"
            />
          ))}

          <button
            type="submit"
            className="w-full bg-[#FF4757] hover:bg-[#ff3041] text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-red-100 active:scale-95 transition-all mt-4"
          >
            Create Account
          </button>

        </form>

        <p className="text-center mt-10 text-gray-500 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#1A1D23] font-black underline underline-offset-4"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;