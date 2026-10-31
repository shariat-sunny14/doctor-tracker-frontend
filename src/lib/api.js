import axios from "axios";

/**
 * All requests go to /api/* on the SAME origin; next.config.mjs rewrites them to the Express API.
 * Authentication is an HttpOnly cookie, so no token is ever stored in (or readable from) JavaScript.
 */
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 60_000, // free-tier hosts can take ~30-60s to wake up
});

let signingOut = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url || "";
    const isAuthForm = url.startsWith("/auth/login") || url.startsWith("/auth/logout");

    // Session expired / revoked: clear the stale cookie, then go to the login page.
    if (error.response?.status === 401 && !isAuthForm && typeof window !== "undefined" && !signingOut) {
      signingOut = true;
      try {
        await axios.post("/api/auth/logout");
      } catch {
        /* the redirect below still happens */
      }
      window.location.assign("/login?expired=1");
    }
    return Promise.reject(error);
  }
);

export default api;
