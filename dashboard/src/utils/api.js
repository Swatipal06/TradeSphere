import axios from "axios";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3002";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Helper to retrieve token from sessionStorage (or localStorage fallback)
export const getAuthToken = () => {
  return sessionStorage.getItem("ts_token") || localStorage.getItem("ts_token");
};

// Attach JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("ts_token");
      sessionStorage.removeItem("ts_user");
      localStorage.removeItem("ts_token");
      localStorage.removeItem("ts_user");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
