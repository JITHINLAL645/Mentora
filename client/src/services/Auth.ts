// src/services/auth.ts
import api from "../axiosInstance";
import { AxiosError } from "axios";

const BASE_URL = "/auth";

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post(`${BASE_URL}/login`, data);
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
    const response = await api.post(`${BASE_URL}/signup`, data);
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

export const forgotPassword = async ({ email }: { email: string }) => {
  try {
    const response = await api.post(`${BASE_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError).response?.data?.message || "Failed to send OTP"
    );
  }
};

export const verifyOtp = async ({ email, otp }: { email: string; otp: string }) => {
  try {
    const response = await api.post(`${BASE_URL}/verify-otp`, { email, otp });
    return { success: true, message: response.data?.message, user: response.data };
  } catch (error) {
    console.error(" OTP verification failed:", error);
    return { success: false };
  }
};

export const resetPassword = async ({ email, newPassword }: { email: string; newPassword: string }) => {
  try {
    const response = await api.post(`${BASE_URL}/reset-password`, {
      email,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError).response?.data?.message || "Failed to reset password"
    );
  }
};

export const resendOtp = async ({ email }: { email: string }) => {
  try {
    const response = await api.post(`${BASE_URL}/resend-otp`, { email });
    return response.data;
  } catch (error) {
    console.error(" Resend OTP failed:", error);
    throw new Error("Failed to resend OTP.");
  }
};

export const logout = async (userId: string) => {
  try {
    const response = await api.post(`${BASE_URL}/logout/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error(" Logout Error", error.response?.data);
    throw new Error("Logout failed");
  }
};

export const googleLogin = () => {
  window.open(`http://localhost:5000/api/auth/google`, "_self");
};
