import axios from "axios";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { getBrowserTimezone } from "@/lib/timezone";

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let cachedToken = null;
let fetchSessionPromise = null;

// Allow useAuth to proactively set or clear the token so that we don't duplicate calls
export const setApiAuthToken = (token) => {
  cachedToken = token;
};

// Returns the full session response and caches the promise to prevent duplicate concurrent hits
export const getSessionData = () => {
  if (fetchSessionPromise) return fetchSessionPromise;

  fetchSessionPromise = axios.get('/api/auth/session', {
    credentials: "include",
    cache: "no-store",
  })
    .then((res) => {
      cachedToken = res.data?.token || null;
      fetchSessionPromise = null;
      return res;
    })
    .catch((err) => {
      fetchSessionPromise = null;
      throw err;
    });

  return fetchSessionPromise;
};

// Internal method for getting just the token string
const getAuthToken = async () => {
  if (cachedToken) return cachedToken;
  try {
    const res = await getSessionData();
    return res.data?.token || null;
  } catch (err) {
    return null;
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    // 1. Timezone header
    const tz = getBrowserTimezone();
    if (tz) {
      config.headers["x-Timezone"] = tz;
    }

    // 2. Concrete Bearer Token Attachment
    // Automatically resolves token inline to prevent race conditions on ANY api call in the app
    const token = await getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
