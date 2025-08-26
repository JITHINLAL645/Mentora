import instance from "../../axiosInstance"; 

export const getApprovedMentors = () => instance.get("/mentors/approved");
