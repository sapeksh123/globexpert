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
  console.debug(`[API] ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.debug(`[API] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || `Request failed with status ${error.response.status}`;
      error.normalizedMessage = message;
      console.error(`[API Error] ${error.response.status} - ${message}`);
      return Promise.reject(error);
    }

    if (error.code === "ECONNABORTED") {
      error.normalizedMessage = "Request timed out. Please try again.";
      console.error(`[API Error] Timeout - ${error.config.url}`);
      return Promise.reject(error);
    }

    error.normalizedMessage = "Unable to reach backend. Verify API URL and backend server status.";
    console.error(`[API Error] Network - ${error.message}`);
    return Promise.reject(error);
  }
);

export default apiClient;
