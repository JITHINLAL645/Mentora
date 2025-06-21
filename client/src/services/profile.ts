
import api from "./api"; // Assuming this is your configured Axios instance
import { AxiosError } from "axios";

const USER_BASE_ROUTE = "/api/user";

export const getProfile = async (userId: string) => {
  try {
    const response = await api.get(`${USER_BASE_ROUTE}/users/${userId}/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to load profile");
  }
};

export const editProfile = async (userId: string, formData: any) => {
  try {
    const response = await api.put(`${USER_BASE_ROUTE}/users/${userId}/profile`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update profile");
  }
};

export const editAbout = async (userId: string, about: string) => {
  try {
    const response = await api.put(
      `${USER_BASE_ROUTE}/users/${userId}/about`,
      { about },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update about section");
  }
};

const handleApiError = (error: any, fallbackMsg: string) => {
  if (error instanceof AxiosError) {
    console.error(error?.response?.data);
    throw new Error(error.response?.data?.message || fallbackMsg);
  }
  throw new Error(fallbackMsg);
};