import axios from "axios";
import Cookie from "cookie-universal";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const cookie = Cookie();
export const COOKIE_NAME = "auth_token";
export const COOKIE_MAX_AGE = 604800;

const getCookieOptions = () => ({
  path: "/",
  sameSite: "strict" as const,
  secure: import.meta.env.NODE_ENV === "production",
});

export const setTokenCookie = (token: string): void => {
  cookie.set(COOKIE_NAME, token, {
    ...getCookieOptions(),
    maxAge: COOKIE_MAX_AGE,
  });
};

export const getTokenCookie = (): string | null => {
  return cookie.get(COOKIE_NAME) || null;
};

export const removeTokenCookie = (): void => {
  cookie.remove(COOKIE_NAME, getCookieOptions());
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeTokenCookie();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
