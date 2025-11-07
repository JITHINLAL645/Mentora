import api from "./api";
import axios from "axios";

// Admin-side
export const registerMentor = async (data: FormData) => {
  return await axios.post("/api/mentors/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ FIXED: Added page and limit parameters
export const getAllMentors = async (page: number, limit: number) => {
  console.log("🌐 Making API call with page:", page, "limit:", limit);
  
  const response = await api.get("/admin/mentors", {
    params: { 
      page, 
      limit 
    }
  });
  
  console.log("🌐 API URL called:", response.config.url);
  console.log("🌐 Params sent:", response.config.params);
  
  return response;
};

export const toggleMentorApproval = async (id: string) => {
  return await api.patch(`/mentors/toggle-approval/${id}`);
};

// User-side
export const getApprovedMentors = () => api.get("/mentors/approved");

// Mentor-side
export const mentorLogin = (email: string, password: string) => {
  return api.post("/mentors/login", { email, password });
};

export const getMentorProfile = async () => {
  const token = sessionStorage.getItem("mentorToken");
  return await api.get("/mentors/mentorprofile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeMentorPassword = (data: any) => {
  const token = sessionStorage.getItem("mentorToken");
  return api.put("/mentors/change-password", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateMentorProfile = (data: any) => {
  const token = sessionStorage.getItem("mentorToken");
  return api.put("/mentors/update-profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};