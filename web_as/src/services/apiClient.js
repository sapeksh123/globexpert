import axios from "axios";

const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:5000/api";
  }

  return "https://globexpert.onrender.com/api";
};

const BASE_URL = resolveBaseUrl();

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ge_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || `Request failed with status ${error.response.status}`;
      error.normalizedMessage = message;
      return Promise.reject(error);
    }

    if (error.code === "ECONNABORTED") {
      error.normalizedMessage = "Request timed out. Please try again.";
      return Promise.reject(error);
    }

    error.normalizedMessage = "Unable to reach backend. Verify API URL and backend server status.";
    return Promise.reject(error);
  }
);

export default apiClient;
