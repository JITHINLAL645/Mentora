import api from "../axiosInstance";
import { AxiosError } from "axios";

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/auth/login", data);
    const { token, user } = response.data;

    return { ...user, token };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(" Login error:", error.response?.data);
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
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(" Signup error:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
    throw new Error("An unexpected error occurred during signup.");
  }
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  try {
    const response = await api.post("/auth/verify-otp", data);
    return { success: true, message: response.data?.message };
  } catch (error) {
    console.error(" OTP verification failed:", error);
    return { success: false };
  }
};

export const resendOtp = async (data: { email: string }) => {
  try {
    const response = await api.post("/auth/resend-otp", data);
    return response.data;
  } catch (error) {
    console.error(" Resend OTP failed:", error);
    throw new Error("Failed to resend OTP.");
  }
};

export const logout = async (userId: string) => {
  try {
    const response = await api.post(`/auth/logout/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error(" Logout Error", error.response?.data);
    throw new Error("Logout failed");
  }
};

export const googleLogin = () => {
  window.open(`http://localhost:5000/api/auth/google`, "_self");
};