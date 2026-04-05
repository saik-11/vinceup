// import apiClient from "@/lib/apiClient";
import apiClient from "./Apiclient";

// const AUTH_BASE = "https://vinceup-dev.onrender.com/auth";

export const authApi = {
  signupMentee: (data) => apiClient.post(`auth/signup/mentee`, data),
  signupMentor: (data) => apiClient.post(`auth/signup/mentor`, data),
  login: (data) => apiClient.post(`auth/login`, data),
  forgotPassword: (data) => apiClient.post(`auth/forgot-password`, data),
  resetPassword: (data) => apiClient.post(`auth/reset-password`, data),
};
