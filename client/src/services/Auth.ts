// ✅ src/services/auth.ts
import api from "./api";
import { AxiosError } from "axios";

// ✅ Login Function
export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/auth/login", data);

    // Ensure isAdmin is part of the response
    const { token, isAdmin } = response.data;

    return { token, isAdmin };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
    throw new Error("An unexpected error occurred during login.");
  }
};

// ✅ Signup Function
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
      throw new Error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
    throw new Error("An unexpected error occurred during signup.");
  }
};

// ✅ OTP Verification
export const verifyOtp = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  try {
    await api.post("/auth/verify-otp", { email, otp });
    return { success: true };
  } catch {
    return { success: false };
  }
};

// ✅ Resend OTP
export const resendOtp = async ({ email }: { email: string }) => {
  try {
    await api.post("/auth/resend-otp", { email });
  } catch (err) {
    console.error("Resend OTP failed:", err);
  }
};

// ✅ Logout
export const logout = async (userId: string) => {
  try {
    const res = await api.post(`/auth/logout/${userId}`);
    return res.data;
  } catch (error: any) {
    console.error("Logout Error", error.response?.data);
    throw new Error("Logout failed");
  }
};

// ✅ Google Login Handler (if you integrate it)
export const googleLogin = () => {
  window.open(`http://localhost:5000/api/auth/google`, "_self");
};
