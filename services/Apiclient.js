import axios from "axios";

const apiClient = axios.create({
  // Set your own baseURL for internal APIs if needed
  baseURL: "https://vinceup-dev.onrender.com/",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ───
apiClient.interceptors.request.use(
  (config) => {
    // Attach auth token if available
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ───
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors (401 redirect, toast, etc.)
    return Promise.reject(error);
  },
);

export default apiClient;
