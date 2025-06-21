import axios from "axios";
// import api from "../utils/api";

export const fetchMentees = () =>
  axios.get("http://localhost:5000/api/admin/mentees").then(res => res.data.users);


export const registerMentor = async (mentorData: FormData) => {
  const response = await axios.post("/api/admin/mentors/register", mentorData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};



// export const getAllMentors = async () => {
//   return await api.get("/admin/mentors");
// };

// export const toggleMentorApproval = async (mentorId: string) => {
//   return await api.patch(`/admin/mentors/${mentorId}/toggle-approval`);
// };