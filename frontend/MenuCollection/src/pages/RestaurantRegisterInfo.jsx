import { useNavigate } from "react-router-dom";

function RestaurantRegisterInfo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-4">

      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.06)] p-12 border border-gray-50">

        {/* Header section */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-red-50 text-[#FF4757] text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
            Partnership
          </div>

          <h2 className="text-4xl font-black text-[#1A1D23] tracking-tighter">
            Expand Your <br />Kitchen 🍽️
          </h2>

          <p className="text-gray-400 font-medium mt-4 leading-relaxed">
            Join the GOURMET network and start scaling your restaurant revenue today.
          </p>
        </div>

        {/* Contact information */}
        <div className="space-y-6">

          <div className="group bg-gray-50 p-6 rounded-[2rem] hover:bg-[#1A1D23] transition-all duration-300">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-gray-500">
              Official Line
            </p>
            <p className="text-lg font-black text-[#1A1D23] group-hover:text-white">
              +91 8799525425
            </p>
          </div>

          <div className="group bg-gray-50 p-6 rounded-[2rem] hover:bg-[#1A1D23] transition-all duration-300">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-gray-500">
              Direct Support
            </p>
            <p className="text-sm font-black text-[#1A1D23] group-hover:text-[#FF4757] break-all leading-none mt-2">
              harshilbhungaliya689@gmail.com
            </p>
          </div>

        </div>

        {/* Action */}
        <div className="mt-12">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-[#1A1D23] hover:bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
          >
            Return To Login
          </button>
        </div>

      </div>

    </div>
  );
}

export default RestaurantRegisterInfo;