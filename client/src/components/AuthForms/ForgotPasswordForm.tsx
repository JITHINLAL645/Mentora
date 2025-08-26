import  { useEffect, useState } from "react";
import {
  forgotPassword,
  resendOtp,
  resetPassword,
  verifyOtp,
} from "../../services/Auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendbtn, setResendbtn] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendbtn(true);
    }
  }, [timer]);

  const handleEmail = async (e) => {
    e.preventDefault();
    setEmailError("");
    setTimer(60);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address. *");
      return;
    }
    try {
      const response = await forgotPassword({ email });
      if (response) setStep(2);
              toast.success("OTP sent successfully");

    } catch (error) {
      if (error instanceof Error) {
        setEmailError(error.message);
        
      } else {
        setEmailError("Invalid email");
      }
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    setTimer(60);
    if (!otp) {
      setOtpError("Please Enter OTP");
      return;
    }
    try {
      const data = await verifyOtp({ email, otp });
      if (data && data.user.user && data.user.user.verified) {
        setStep(3);
                toast.success("OTP verified successfully");

      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      setOtpError(
        "Invalid OTP. " + (error instanceof Error ? error.message : "")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!newPassword || !passwordPattern.test(newPassword)) {
      setError(
        "Password must include uppercase, lowercase, number, special character, and 8+ characters."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await resetPassword({ email, newPassword });
      if (response) navigate("/");
    } catch (error) {
      setError("Something went wrong while resetting the password");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendotp({ email });
      setTimer(60);
      setResendbtn(false);
      setOtpError("");
      setEmailError("");
    } catch (error) {
      setError("Error in resending OTP");
    }
  };

  return (
    <div className="bg-[#F6F6F6] flex flex-col justify-center font-[Montserrat] min-h-screen p-8">
      {step === 1 && (
        <form onSubmit={handleEmail}>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">
            Reset Password
          </h1>
          <p className="text-gray-500 mb-6">
            Enter your email to receive an OTP
          </p>

          <label className="text-gray-700 font-medium">Email</label>
          {emailError && (
            <p className="text-red-600 text-sm mb-1">{emailError}</p>
          )}
          <input
            type="email"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full sm:w-36 h-12 font-bold mt-6 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Send
          </button>
          <p className="mt-4 text-center text-black">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Sign up
            </a>
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleOtp}>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">
            Enter The OTP
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            A 6-digit code has been sent to{" "}
            <b className="text-black">{email}</b>
          </p>
          <p className="text-center text-orange-500">
            {timer > 0 ? `OTP expires in ${timer}s` : "OTP expired!"}
          </p>

          <label className="text-gray-700 font-medium">OTP</label>
          {otpError && <p className="text-red-600 text-sm mb-1">{otpError}</p>}
          <input
            type="text"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Enter your OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={timer === 0}
          />

          <button
            type="submit"
            className="w-full sm:w-36 h-12 font-bold mt-6 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            disabled={timer === 0}
          >
            Verify
          </button>

          <p className="mt-6 text-center text-black">
            Didn't receive OTP?{" "}
            {resendbtn ? (
              <span
                className="text-orange-600 cursor-pointer hover:underline"
                onClick={handleResendOtp}
              >
                Resend OTP
              </span>
            ) : (
              <span className="text-gray-400 cursor-not-allowed">
                Resend OTP
              </span>
            )}
          </p>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">
            Create New Password
          </h1>
          <p className="text-gray-500 text-sm mb-6">Enter the new password</p>

          <label className="text-gray-700 font-medium">New Password</label>
          {error && <p className="text-red-600 text-sm mb-1">{error}</p>}
          <input
            type="password"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label className="text-gray-700 font-medium mt-4">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full sm:w-36 h-12 font-bold mt-6 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Change
          </button>

          <p className="mt-4 text-center text-black">
            Don't have an account?{" "}
            <span className="text-orange-600 cursor-pointer hover:underline">
              Sign up
            </span>
          </p>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
