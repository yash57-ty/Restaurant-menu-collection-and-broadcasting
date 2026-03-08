import { useNavigate } from "react-router-dom";

function RestaurantRegisterInfo() {

  // Used to navigate back to login page
  const navigate = useNavigate();

  return (

    // Main container used to center the content vertically and horizontally
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 px-4">

      {/* Card containing registration information */}
      <div className="w-full max-w-md bg-white p-8 border">

        {/* Page title and short description */}
        <div className="text-center mb-6">

          <h2 className="text-3xl font-extrabold text-gray-800">
            Restaurant Registration
          </h2>

          <p className="text-gray-600">
            Contact us to register your restaurant.
          </p>

        </div>


        {/* Contact details for restaurant registration */}
        <div className="space-y-4 text-sm text-gray-700">

          {/* Phone contact */}
          <div className="border p-4">

            <p className="font-bold text-gray-800">
              Phone Number
            </p>

            <p className="text-red-500 font-bold">
              +91 8799525425
            </p>

          </div>


          {/* Email contact */}
          <div className="border p-4">

            <p className="font-bold text-gray-800">
              Email Address
            </p>

            <p className="text-red-500 font-bold">
              harshilbhungaliya689@gmail.com
            </p>

          </div>

        </div>


        {/* Button to return to login page */}
        <div className="mt-6 text-center">

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-red-500 text-white rounded font-bold"
          >
            Back to Login
          </button>

        </div>

      </div>
    </div>
  );
}

export default RestaurantRegisterInfo;