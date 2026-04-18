import axios from "axios";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { getBrowserTimezone } from "@/lib/timezone";

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const tz = getBrowserTimezone();
    if (tz) {
      config.headers["x-Timezone"] = tz;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
