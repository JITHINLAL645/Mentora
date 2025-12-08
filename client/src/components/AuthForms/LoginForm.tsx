import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slice/authSlice";
import instance from "../../axiosInstance"; 
import axios from "axios";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (id === "email") setEmailError("");
    if (id === "password") setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password } = formData;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!email || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    try {
      console.log("🚀 Sending login request...");
      const res = await instance.post("/auth/login", formData);

      const userData = res.data.user;
      const token = res.data.token;

      // Save token and set axios header
      if (token) {
        localStorage.setItem("userToken", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("💾 Token saved:", token);
      }

      // Save userId and name
      localStorage.setItem("userId", userData._id);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userEmail", userData.email);

      // Update Redux state with complete user data including token
      dispatch(setUser({
        ...userData,
        token: token
      }));

      // Navigate to appropriate page
      navigate(userData.isAdmin ? "/admin/dashboard" : "/", { replace: true });
    } catch (err: any) {
      console.log("❌ Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-full max-w-sm bg-[#f6f6f6] p-6 rounded shadow">
      <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
      <p className="text-sm text-gray-500 mb-4">Please login to continue</p>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter your email"
            required
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter your password"
            required
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}

          <div className="flex justify-end mt-1">
            <a href="/forgot-password" className="text-blue-600 text-sm hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleLogin}
            className="flex-1 border border-gray-300 py-2 rounded-lg flex items-center justify-center hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
          <br />
          <a href="/mentor/login" className="text-blue-600 text-lg hover:underline">
            Login as Mentor!
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;