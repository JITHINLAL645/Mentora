import React, { useEffect, useState } from "react";
import { verifyOtp, resendOtp } from "../../services/Auth"; 
import { useNavigate } from "react-router-dom";

const OtpVerificationForm: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [email] = useState(localStorage.getItem("email") || "");
  const [timer, setTimer] = useState(60);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Timer countdown
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); // Clear previous errors

    const response = await verifyOtp({ email, otp });

    if (response.success) {
      navigate("/");
    } else {
      setErrorMsg("Invalid or expired OTP");
    }
  };

  // Resend OTP and restart timer
  const handleResend = async () => {
    await resendOtp({ email });
    setTimer(60);
    setErrorMsg(""); 
  };

  return (
    <div className="w-full max-w-sm bg-[#f6f6f6] p-6 mx-auto mt-20 shadow rounded">
      <h2 className="text-3xl font-bold mb-2 text-left">Verify Email</h2>
      <p className="text-sm text-gray-500 mb-4 text-left">
        A 6-digit code has been sent to <b className="text-black">{email}</b>
      </p>

      <form onSubmit={handleVerify} className="space-y-5">
        <div>
          <label htmlFor="otp" className="block mb-1 font-medium">
            OTP
          </label>
          <input
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder="Enter your OTP"
          />
        </div>

        {errorMsg && (
          <p className="text-red-600 text-center text-sm">{errorMsg}</p>
        )}

        <p className="text-sm text-orange-500 text-center">
          {timer > 0 ? `OTP expires in ${timer}s` : "OTP expired"}
        </p>

        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition"
          disabled={timer === 0}
        >
          Verify OTP
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Didn't receive the OTP?{" "}
          <span
            className="text-blue-900 hover:underline cursor-pointer"
            onClick={handleResend}
          >
            Resend OTP
          </span>
        </p>
      </form>
    </div>
  );
};

export default OtpVerificationForm;
