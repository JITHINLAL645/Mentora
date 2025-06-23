import React from "react";

const ForgotPasswordDesign: React.FC = () => {
  const step = 1; 

  return (
    <div className="bg-[#F6F6F6] flex flex-col justify-center font-[Montserrat] min-h-screen p-8">
      {step === 1 && (
        <form>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">
            Reset Password
          </h1>
          <p className="text-gray-500 mb-6">
            Enter your email to receive an OTP
          </p>

          <div className="w-full flex flex-col space-y-3">
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="w-full flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <button
              type="button"
              className="w-full sm:w-36 h-12 font-bold bg-blue-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Send
            </button>
          </div>

          <p className="mt-4 text-center text-black">
            Don't have an account?{" "}
            <span className="text-orange-600 cursor-pointer hover:underline">
              Sign up
            </span>
          </p>
        </form>
      )}

      {/* {step === 2 && (
        <form>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">
            Enter The OTP
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            A 6-digit code has been sent to{" "}
            <b className="text-black">example@email.com</b>
          </p>
          <p className="text-center text-orange-500">OTP expires in 60s</p>

          <div className="w-full flex flex-col space-y-3 mt-4">
            <label className="text-gray-700 font-medium">OTP</label>
            <input
              type="text"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Enter your OTP"
            />
          </div>

          <div className="w-full flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <button
              type="button"
              className="w-full sm:w-36 h-12 font-bold bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Verify
            </button>
          </div>

          <p className="mt-6 text-center text-black">
            Didn't receive OTP?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
              Resend OTP
            </span>
          </p>
        </form>
      )}

      {step === 3 && (
        <form>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">
            Create New Password
          </h1>
          <p className="text-gray-500 text-sm mb-6">Enter the new password</p>

          <div className="w-full flex flex-col space-y-3">
            <label className="text-gray-700 font-medium">New Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Enter your new password"
            />

            <label className="text-gray-700 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Confirm your password"
            />
          </div>

          <div className="w-full flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <button
              type="button"
              className="w-full sm:w-36 h-12 font-bold bg-blue-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Change
            </button>
          </div>

          <p className="mt-4 text-center text-black">
            Don't have an account?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
              Sign up
            </span>
          </p>
        </form>
      )} */}
    </div>
  );
};

export default ForgotPasswordDesign;
