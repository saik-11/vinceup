// import apiClient from "@/lib/apiClient";
import apiClient from "./Apiclient";

const AUTH_BASE = "https://vinceup-dev.onrender.com/auth";

export const authApi = {
  signupMentee: (data) => apiClient.post(`${AUTH_BASE}/signup/mentee`, data),
  signupMentor: (data) => apiClient.post(`${AUTH_BASE}/signup/mentor`, data),
  login: (data) => apiClient.post(`${AUTH_BASE}/login`, data),
  forgotPassword: (data) => apiClient.post(`${AUTH_BASE}/forgot-password`, data),
  resetPassword: (data) => apiClient.post(`${AUTH_BASE}/reset-password`, data),
};
