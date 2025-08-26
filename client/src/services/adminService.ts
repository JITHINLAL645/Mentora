// 📁 services/adminService.ts
import api from "./api";

export const fetchMentees = async () => {
  const response = await api.get("/admin/mentees");
  return response.data.users;
};

export const fetchUserCount = async () => {
  const response = await api.get("/admin/users/count");
  return response.data;
};