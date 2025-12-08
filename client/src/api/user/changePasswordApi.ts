import api from "../api";  // axios instance

export const changePasswordApi = (currentPassword: string, newPassword: string) => {
  // Use localStorage since your login saves token there
  const token = localStorage.getItem("userToken"); 
  return api.put(
    "/auth/change-password",  // include '/auth' to match backend
    { currentPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
