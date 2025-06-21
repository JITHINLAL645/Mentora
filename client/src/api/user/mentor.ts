import instance from "../../axiosInstance"; // Using shared axios instance with credentials

// GET all approved mentors (used in user Mentor page)
export const getApprovedMentors = () => instance.get("/mentors/approved");
