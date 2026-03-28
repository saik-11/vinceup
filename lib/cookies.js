// lib/cookies.js

const DEFAULT_OPTIONS = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
};

function serializeCookie(name, value, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  cookie += `; path=${opts.path}`;
  cookie += `; max-age=${opts.maxAge}`;
  cookie += `; SameSite=${opts.sameSite}`;
  if (opts.secure) cookie += "; Secure";
  if (opts.domain) cookie += `; domain=${opts.domain}`;
  return cookie;
}

function parseCookies() {
  if (typeof document === "undefined") return {};

  return document.cookie.split(";").reduce((acc, pair) => {
    const [rawKey, ...rest] = pair.split("=");
    const key = rawKey?.trim();
    if (key) {
      acc[decodeURIComponent(key)] = decodeURIComponent(rest.join("="));
    }
    return acc;
  }, {});
}

// ─── Public API ───

export const cookieEngine = {
  get(name) {
    return parseCookies()[name] ?? null;
  },

  getAll() {
    return parseCookies();
  },

  set(name, value, options = {}) {
    if (typeof document === "undefined") return;
    document.cookie = serializeCookie(name, value, options);
  },

  remove(name, options = {}) {
    if (typeof document === "undefined") return;
    document.cookie = serializeCookie(name, "", { ...options, maxAge: 0 });
  },

  has(name) {
    return this.get(name) !== null;
  },
};

// ─── JWT helpers (standalone, not tied to React) ───

export function decodeJwt(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function isJwtExpired(token) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 < Date.now();
}

// ─── Server-side helpers (for proxy.js) ───

export const serverCookies = {
  get(request, name) {
    return request.cookies.get(name)?.value ?? null;
  },

  has(request, name) {
    return request.cookies.has(name);
  },

  set(response, name, value, options = {}) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    response.cookies.set(name, value, opts);
    return response;
  },

  remove(response, name) {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
    return response;
  },
};
