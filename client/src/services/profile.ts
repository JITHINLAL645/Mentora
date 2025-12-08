

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