import api from "./api";
import { AxiosError } from "axios";

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/auth/login", data);
    const { token, isAdmin } = response.data;

    return { token, isAdmin };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("❌ Login error:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
    throw new Error("An unexpected error occurred during login.");
  }
};

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/signup", data);
    console.log("✅ Signup response:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("❌ Signup error:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
    throw new Error("An unexpected error occurred during signup.");
  }
};

export const verifyOtp = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  try {
    const res = await api.post("/auth/verify-otp", { email, otp });
    console.log("✅ OTP verification success:", res.data);
    return { success: true };
  } catch (error) {
    console.error("❌ OTP verification failed:", error);
    return { success: false };
  }
};

export const resendOtp = async ({ email }: { email: string }) => {
  try {
    const res = await api.post("/auth/resend-otp", { email });
    console.log("🔁 OTP resent:", res.data);
  } catch (err) {
    console.error("❌ Resend OTP failed:", err);
  }
};

export const logout = async (userId: string) => {
  try {
    const res = await api.post(`/auth/logout/${userId}`);
    console.log("👋 Logged out:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ Logout Error", error.response?.data);
    throw new Error("Logout failed");
  }
};

export const googleLogin = () => {
  window.open(`http://localhost:5000/api/auth/google`, "_self");
};
