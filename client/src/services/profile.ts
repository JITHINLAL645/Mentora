// import api from './api';
// import { AxiosError } from 'axios';

// const AUTH_BASE_ROUTE = '/auth';

// export const getProfile = async (userId: string) => {
//   const response = await api.get(`${AUTH_BASE_ROUTE}/users/${userId}/profile`);
//   return response.data;
// };

// export const editProfile = async (userId: string, formData: any) => {
//   try {
//     const response = await api.patch(`${AUTH_BASE_ROUTE}/profile`, formData);
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'Failed to update profile');
//   }
// };



// const handleApiError = (error: any, fallbackMsg: string) => {
//   if (error instanceof AxiosError) {
//     console.error(error?.response?.data);
//     throw new Error(error.response?.data?.message || fallbackMsg);
//   }
//   throw new Error(fallbackMsg);
// };

import api from "./api";

// Get profile
export const getUserProfile = () => {
  const token = sessionStorage.getItem("userToken");
  return api.get("/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update profile (with image)
export const updateUserProfile = (data: FormData) => {
  const token = sessionStorage.getItem("userToken");
  return api.put("/users/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editAbout = async (userId: string, about: string) => {
  try {
    const response = await api.patch(`${AUTH_BASE_ROUTE}/profile`, { about });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to update about section');
  }
};