import React from "react";
import loginimg2 from "../../assets/logoimg2.jpg";
import Mentoralogo from "../../assets/mentoraA.png";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-[1000px] h-[600px] shadow-2xl rounded-xl overflow-hidden bg-white">
        {/* Left Section with Image and Logo */}
        <div
          className="w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${loginimg2})` }}
        >
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <img
              src={Mentoralogo}
              alt="Mentora Logo"
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-1/2 flex items-center justify-center p-10 bg-[#f6f6f6]">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-500 mb-6">Please login to continue</p>

            <form className="space-y-5">
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Login
              </button>

              <button
                type="button"
                className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center hover:bg-gray-100"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Login with Google
              </button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
