// src/api/user/changeEmailApi.ts

import api from "../api"; // This already auto-adds Bearer token from localStorage

// No need to manually read token — your axios interceptor does it!
export const sendOtpApi = (email: string) => {
  return api.post("/auth/email/send-otp", { email });
};

export const verifyOtpApi = (email: string, otp: string) => {
  return api.post("/auth/email/verify-otp", { email, otp });
};

export const changeEmailApi = (oldEmail: string, newEmail: string) => {
  return api.put("/auth/email/change", { oldEmail, newEmail });
};