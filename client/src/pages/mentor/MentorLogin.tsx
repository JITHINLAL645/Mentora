import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mentorLogin } from "../../services/mentorService";
import { toast } from "sonner";
import loginimg3 from "../../assets/loginImg3.jpg";
import Mentoralogo from "../../assets/mentoraA.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email });
      
      const response = await mentorLogin(email, password);
      
      console.log("Login response:", response);
      console.log("Response data:", response.data);

      if (!response.data) {
        throw new Error("Invalid response from server");
      }

      const { token, mentor } = response.data;

      if (!token) {
        throw new Error("No token received from server");
      }

      if (!mentor || !mentor._id) {
        throw new Error("Invalid mentor data received");
      }

      // Clear any existing session data first
      sessionStorage.clear();

      // Store in sessionStorage
      sessionStorage.setItem("mentorToken", token);
      sessionStorage.setItem("mentorId", mentor._id);
      sessionStorage.setItem("mentorEmail", mentor.email);
      sessionStorage.setItem("userRole", "mentor");

      console.log("✅ Token stored:", sessionStorage.getItem("mentorToken"));
      console.log("✅ Mentor ID stored:", sessionStorage.getItem("mentorId"));
      console.log("✅ User Role:", sessionStorage.getItem("userRole"));

      toast.success("Login successful! Redirecting...");

      // Force a slight delay to ensure sessionStorage is committed
      setTimeout(() => {
        console.log("🚀 Navigating to /mentorDashboard");
        window.location.href = "/mentorDashboard";
      }, 800);

    } catch (error: any) {
      console.error("❌ Login error:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || "Login failed";
        toast.error(errorMessage);
        console.error("Server error:", error.response.data);
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
        console.error("No response:", error.request);
      } else {
        toast.error(error.message || "An unexpected error occurred");
        console.error("Error:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-[1000px] h-[600px] shadow-2xl rounded-xl overflow-hidden bg-white">
        {/* Left Section with Image and Logo */}
        <div
          className="w-150 h-110 mt-25 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginimg3})` }}
        >
          <div className="flex items-center relative w-10 h-10">
            <img
              src={Mentoralogo}
              alt="Mentora Logo"
              className="absolute bottom-20 left-60 scale-[6.2] object-contain"
            />
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-1/2 flex items-center justify-center p-10 bg-[#f6f6f6]">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold mb-2">Welcome Back to Mentor Login</h2>
            <p className="text-sm text-gray-500 mb-6">Please login to continue</p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              <a
                href="/login"
                className="text-blue-600 text-lg hover:underline pl-32 text-shadow-indigo-500"
              >
                Login as Mentee !
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;