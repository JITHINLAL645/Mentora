import axios from "axios";
const token=localStorage.getItem("userToken")
const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers:{authorization:`Bearer ${token}`}
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;