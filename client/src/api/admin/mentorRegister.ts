// src/api/admin/mentorRegister.ts
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const registerMentor = (formData: FormData) =>
  API.post("/admin/mentors/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
