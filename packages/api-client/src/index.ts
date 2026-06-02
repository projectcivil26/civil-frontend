import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.EXPO_PUBLIC_API_URL ?? "";

// Web: withCredentials sends httpOnly cookies automatically on every request.
// Mobile: override the Authorization header via setMobileTokenProvider() below.
export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true,
});

// Mobile token provider — called only when set (React Native context).
// Web leaves this null and relies on httpOnly cookies instead.
let _mobileTokenProvider: (() => Promise<string | null>) | null = null;

export function setMobileTokenProvider(fn: () => Promise<string | null>) {
  _mobileTokenProvider = fn;
}

apiClient.interceptors.request.use(async (config) => {
  if (_mobileTokenProvider) {
    const token = await _mobileTokenProvider();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global 401 handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Web: Next.js middleware + Auth.js handle the redirect via cookies.
      // Mobile: the auth store clears the session when this fires.
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
