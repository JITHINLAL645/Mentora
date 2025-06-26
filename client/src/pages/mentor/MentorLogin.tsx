import React from "react";
import loginimg3 from "../../assets/loginImg3.jpg";
import Mentoralogo from "../../assets/mentoraA.png";
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mentorLogin } from "../../services/mentorService";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await mentorLogin(email, password);
      const { token, mentor } = response.data;

      localStorage.setItem("mentorToken", token);
      toast.success("Login successful");
      navigate("/mentorDashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-[1000px] h-[600px] shadow-2xl rounded-xl overflow-hidden bg-white">
        {/* Left Section with Image and Logo */}
        <div
          className="w-150 h-110 mt-25 bg-cover bg-center "
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
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-500 mb-6">Please login to continue</p>

           <form className="space-y-5" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        className="w-full px-4 py-2 border rounded-lg"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
        Login
      </button>

       <a
            href="/login"
            className="text-blue-600 text-lg hover:underline pl-32 text-shadow-indigo-500 "
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
