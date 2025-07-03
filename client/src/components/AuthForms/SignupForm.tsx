import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from "../../services/Auth";
import { toast } from "sonner";


const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setGeneralError("");

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!name || !email || !password || !confirmPassword) {
      setGeneralError("All fields are required");
      return;
    }

    if (name.length < 3) {
      setNameError("Name must be at least 3 characters long");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!passwordPattern.test(password)) {
      setPasswordError("Password must include uppercase, lowercase, number, special character, and be 8+ characters.");
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
      return;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    try {
      await signup({ name, email, password });
        toast.success("OTP sent to your email."); 

      localStorage.setItem("email", email);
      navigate("/otpVerification");
    } catch (err: any) {
      setGeneralError(err.message || "Signup failed, please try again.");
    }
  };

  return (
    <div className="w-full max-w-sm bg-[#f6f6f6] p-6 rounded shadow">
      <h2 className="text-3xl font-bold mb-2 text-left">Create Account</h2>
      <p className="text-sm text-gray-500 mb-4 text-left">Please sign up to get started</p>

      {generalError && <p className="text-red-600 mb-2">{generalError}</p>}

      <form onSubmit={handleSignup} className="space-y-5">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">Full Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter your name"
          />
          {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter your email"
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter your password"
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        </div>

        <div>
          <label htmlFor="confirm-password" className="block mb-1 font-medium">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Confirm your password"
          />
          {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
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
  );
};

export default SignupForm;
