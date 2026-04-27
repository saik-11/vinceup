import apiClient from "./apiClient";

export const LIVEKIT_TOKEN_ENDPOINT = "/sessions/livekit/token";
export const LIVEKIT_DEFAULT_TTL_MINUTES = 120;
export const LIVEKIT_MAX_TTL_MINUTES = 720;
const LIVEKIT_MIN_TTL_MINUTES = 1;
const TOKEN_EXPIRY_BUFFER_MS = 30_000;

export class LivekitApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "LivekitApiError";
    this.status = options.status;
    this.validationErrors = options.validationErrors;
    this.isValidation = Boolean(options.validationErrors);
    this.isRetryable = Boolean(options.isRetryable);
  }
}

export function validateLivekitTokenRequest({
  room_name,
  identity,
  participant_name,
  ttl_minutes = LIVEKIT_DEFAULT_TTL_MINUTES,
}) {
  const errors = {};
  const normalizedTtl = Number(ttl_minutes);

  if (!String(room_name ?? "").trim()) {
    errors.room_name = "Room name is required";
  }

  if (!String(identity ?? "").trim()) {
    errors.identity = "Identity is required";
  }

  if (
    !Number.isInteger(normalizedTtl) ||
    normalizedTtl < LIVEKIT_MIN_TTL_MINUTES ||
    normalizedTtl > LIVEKIT_MAX_TTL_MINUTES
  ) {
    errors.ttl_minutes = `Session duration must be between ${LIVEKIT_MIN_TTL_MINUTES} and ${LIVEKIT_MAX_TTL_MINUTES} minutes`;
  }

  if (Object.keys(errors).length > 0) {
    throw new LivekitApiError(Object.values(errors).join(". "), {
      validationErrors: errors,
    });
  }

  const payload = {
    room_name: String(room_name).trim(),
    identity: String(identity).trim(),
    ttl_minutes: normalizedTtl,
  };

  const displayName = String(participant_name ?? "").trim();
  if (displayName) {
    payload.participant_name = displayName;
  }

  return payload;
}

function normalizeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  return base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
}

export function getTokenExpiryMs(token) {
  if (!token) return null;

  try {
    const payloadB64 = token.split(".")[1];
    if (!payloadB64) return null;
    const payload = JSON.parse(atob(normalizeBase64Url(payloadB64)));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token, bufferMs = TOKEN_EXPIRY_BUFFER_MS) {
  const expiresAt = getTokenExpiryMs(token);
  if (!expiresAt) return false;
  return expiresAt <= Date.now() + bufferMs;
}

export function getLivekitErrorMessage(error) {
  if (error?.isValidation) return error.message;

  const status = error?.status ?? error?.response?.status;
  if (status === 401 || status === 403) {
    return "Your session has expired. Please sign in again and retry.";
  }

  if (status === 404) {
    return "Live session token service was not found.";
  }

  if (status === 429) {
    return "Too many join attempts. Please wait a moment and try again.";
  }

  if (status && status >= 500) {
    return "Live session service is temporarily unavailable. Please try again.";
  }

  return error?.message || "Unable to prepare the live session.";
}

async function retryRequest(fn, { maxAttempts = 3 } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const status = error?.status ?? error?.response?.status;
      const isClientError = status >= 400 && status < 500;
      const canRetry = error?.isRetryable || (!error?.isValidation && !isClientError);

      if (!canRetry || attempt === maxAttempts) {
        throw error;
      }

      const backoffMs = Math.min(500 * 2 ** (attempt - 1) + Math.random() * 250, 4000);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  throw lastError;
}

function normalizeTokenResponse(data, fallback) {
  if (!data?.token || !data?.url) {
    throw new LivekitApiError("Server returned an incomplete LiveKit token response", {
      isRetryable: true,
    });
  }

  if (isTokenExpired(data.token)) {
    throw new LivekitApiError("Server returned an expired LiveKit token", {
      isRetryable: true,
    });
  }

  return {
    token: data.token,
    url: data.url,
    room_name: data.room_name ?? fallback.room_name,
    identity: data.identity ?? fallback.identity,
    requested_by: data.requested_by ?? "",
  };
}

export async function fetchLivekitToken(params, options = {}) {
  const payload = validateLivekitTokenRequest(params);

  try {
    return await retryRequest(async () => {
      const response = await apiClient.post(LIVEKIT_TOKEN_ENDPOINT, payload);
      return normalizeTokenResponse(response.data, payload);
    }, options);
  } catch (error) {
    if (error instanceof LivekitApiError) {
      throw error;
    }

    throw new LivekitApiError(getLivekitErrorMessage(error), {
      status: error?.response?.status,
    });
  }
}
