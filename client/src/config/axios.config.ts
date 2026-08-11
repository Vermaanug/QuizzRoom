import axios from "axios";
import URLS from "./constant/URLS";

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

const apiRequestGlobal = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const apiRequestForm = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

apiRequestGlobal.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes(URLS.LOGIN)) {
      window.location.assign("/auth/login");
    }
    return Promise.reject(error);
  },
);

export default apiRequestGlobal;
