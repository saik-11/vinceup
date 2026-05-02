import axios from "axios";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { getBrowserTimezone } from "@/lib/timezone";
import { authStorage } from "@/lib/auth/authStorage";
import { authHelpers } from "@/lib/auth/authHelpers";

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let cachedToken = null;

// Allow useAuth to proactively set or clear the token so that we don't duplicate calls
export const setApiAuthToken = (token) => {
  cachedToken = token;
};

// Returns the full session response and caches the promise to prevent duplicate concurrent hits
export const getSessionData = async () => {
  const token = authStorage.getToken();
  if (!token) return { data: { authenticated: false } };

  try {
    const res = await apiClient.get("auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: { authenticated: true, token, user: res.data?.user || res.data } };
  } catch (e) {
    return { data: { authenticated: false } };
  }
};

const getAuthToken = () => {
  if (cachedToken) return cachedToken;
  const t = authStorage.getToken();
  if (t) cachedToken = t;
  return t;
};

apiClient.interceptors.request.use(
  async (config) => {
    const tz = getBrowserTimezone();
    if (tz) {
      config.headers["x-Timezone"] = tz;
    }
    const token = await getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── 401 → auto-logout ───────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? "";

    // Skip the logout redirect for auth/me — getSessionData() handles that path itself
    const isAuthCheck = requestUrl.includes("auth/me");

    if (status === 401 && !isAuthCheck) {
      // Clear all stored auth state
      authHelpers.logoutUser();
      cachedToken = null;

      // Redirect to login (window is available because this runs in the browser only)
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

