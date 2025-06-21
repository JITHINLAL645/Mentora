// client/src/axiosInstance.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // 🔁 change if your backend URL is different
  withCredentials: true, // include cookies if needed
});

export default instance;
