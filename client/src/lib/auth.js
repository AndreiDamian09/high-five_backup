
// Fallback to localhost if the environment variable is not set
const API_BASE = import.meta.env.VITE_API_BASE_URL;
// Remove /api suffix to get base URL, then add /auth
const AUTH_BASE = API_BASE.replace(/\/api$/, "/auth");

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      errorMessage = data.error || data.message || errorMessage;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export async function authLogin(email, password) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return parseResponse(res);
}

export async function authRegister({ email, password, role, name, company_name }) {
  const res = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, role, name, company_name }),
  });
  return parseResponse(res);
}

export async function authMe() {
  const res = await fetch(`${AUTH_BASE}/me`, {
    method: "GET",
    credentials: "include",
  });
  return parseResponse(res);
}

export async function authLogout() {
  const res = await fetch(`${AUTH_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
  return parseResponse(res);
}
