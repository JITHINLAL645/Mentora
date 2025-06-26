import React from "react";
import loginimg2 from "../../assets/logoimg2.jpg";
import Mentoralogo from "../../assets/mentoraA.png";

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-[1000px] h-[600px] shadow-2xl rounded-xl overflow-hidden bg-white">
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

        <div className="w-1/2 flex items-center justify-center p-10 bg-[#f6f6f6]">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-sm text-gray-500 mb-6">Please sign up to get started</p>

            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 font-medium">Password</label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block mb-1 font-medium">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Confirm your password"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  className="flex-1 border border-gray-300 py-2 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5 mr-2"
                  />
                  Google
                </button>
              </div>

              <hr className="border-gray-300 my-4" />

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">Login</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
