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

export const getAllMentors = async () => {
  return await api.get("/admin/mentors");
};

export const toggleMentorApproval = async (id: string) => {
  return await api.patch(`/mentors/toggle-approval/${id}`);
};

// User-side
export const getApprovedMentors = () => api.get("/mentors/approved");

//mentor-side

export const mentorLogin = (email: string, password: string) => {
  return api.post("/mentors/login", { email, password });
};

export const getMentorProfile = async () => {
  const token = sessionStorage.getItem("mentorToken"); // ✅ sessionStorage if you stored it there
  return await api.get("/mentors/mentorprofile", {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Important
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



