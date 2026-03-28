// import apiClient from "@/lib/apiClient";
import apiClient from "./Apiclient";

const AUTH_BASE = "https://vinceup-dev.onrender.com/auth";

export const authApi = {
  signupMentee: (data) => apiClient.post(`${AUTH_BASE}/signup/mentee`, data),

  login: (data) => apiClient.post(`${AUTH_BASE}/login`, data),
};
