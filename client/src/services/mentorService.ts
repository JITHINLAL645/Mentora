import api from "./api";

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
