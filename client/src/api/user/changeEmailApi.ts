
import api from "../api"; 

export const sendOtpApi = (email: string) => {
  return api.post("/auth/email/send-otp", { email });
};

export const verifyOtpApi = (email: string, otp: string) => {
  return api.post("/auth/email/verify-otp", { email, otp });
};

export const changeEmailApi = (oldEmail: string, newEmail: string) => {
  return api.put("/auth/email/change", { oldEmail, newEmail });
};