/**
 * Get the browser's current timezone (IANA format).
 * @returns {string} e.g. "Asia/Kolkata"
 */
export function getBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

/**
 * Standalone session fetch — use only when AuthContext is unavailable.
 * AuthProvider should NOT use this; it passes session data directly.
 * @returns {Promise<{ token: string, timezone: string|null } | null>}
 */
export async function fetchAuthSession() {
  try {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.authenticated || !data.token) return null;
    return { token: data.token, timezone: data.timezone ?? null };
  } catch {
    return null;
  }
}

/**
 * Sync timezone with the server if the browser timezone differs
 * from the stored one. Caller passes session data directly — no extra fetch.
 *
 * @param {string|null}                   storedTimezone - timezone from the session
 * @param {string}                        token          - Bearer token from the session
 * @param {import("axios").AxiosInstance} apiClient      - Axios instance
 * @returns {Promise<string | null>} The new timezone if synced, null if skipped or failed
 */
export async function syncTimezoneIfChanged(storedTimezone, token, apiClient) {
  try {
    const browserTz = getBrowserTimezone();

    console.log("[tz-sync]", { browserTz, storedTimezone, match: browserTz === storedTimezone });

    if (!browserTz || browserTz === storedTimezone) return null;
    console.log(token)
    await apiClient.put(
      "/auth/timezone",
      { timezone: browserTz },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return browserTz;
  } catch (err) {
    console.warn("[tz-sync] Failed to sync timezone:", err);
    return null;
  }
}