import axios from "axios";
import { store } from "../store";
import { logout } from "../store/slices/authSlice";

export const API_URL = import.meta.env.VITE_API_URL || "";

console.log("API_URL being used:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if ((error.response?.status === 401) && !isRedirecting) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && !currentPath.includes("/auth/callback")) {
        isRedirecting = true;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        store.dispatch(logout());
        window.location.href = "/login";
        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
