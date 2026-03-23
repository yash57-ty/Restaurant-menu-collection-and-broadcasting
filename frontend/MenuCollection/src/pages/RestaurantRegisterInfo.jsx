import { useNavigate } from "react-router-dom";

function RestaurantRegisterInfo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-amber-100 px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg border border-white/40 shadow-2xl rounded-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Partner With Us 🤝
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Register your restaurant and start receiving orders
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">

          {/* Phone */}
          <div className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl p-4">

            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-semibold text-gray-900">
                +91 8799525425
              </p>
            </div>

            <span className="text-orange-500 text-xl">📞</span>

          </div>

          {/* Email */}
          <div className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl p-4">

            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-semibold text-gray-900 break-all">
                harshilbhungaliya689@gmail.com
              </p>
            </div>

            <span className="text-orange-500 text-xl">✉️</span>

          </div>

        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold shadow-md transition"
          >
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default RestaurantRegisterInfo;