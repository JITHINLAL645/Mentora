import api from "./api";

// Admin-side
export const registerMentor = async (formData: FormData) => {
  return await api.post("/admin/mentors/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAllMentors = async () => {
  return await api.get("/admin/mentors");
};

export const toggleMentorApproval = async (id: string) => {
  return await api.patch(`/admin/mentors/${id}/toggle-approval`);
};

// User-side
export const getApprovedMentors = () => api.get("/mentors/approved");
