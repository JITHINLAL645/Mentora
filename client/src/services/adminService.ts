import axios from "axios";

export const fetchMentees = () =>
  axios.get("http://localhost:5000/api/admin/mentees").then(res => res.data.users);


export const registerMentor = async (mentorData: FormData) => {
  const response = await axios.post("/api/admin/mentors/register", mentorData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
