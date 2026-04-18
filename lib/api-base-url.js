const DEFAULT_API_BASE_URL = "https://vinceup-dev.onrender.com";

export function getApiBaseUrl() {
  const baseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

  return baseUrl.replace(/\/+$/, "");
}
