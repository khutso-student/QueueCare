import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL_LOCAL,
  withCredentials: true,
});

console.log("API base URL:", import.meta.env.PROD ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_URL_LOCAL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export Axios instance for custom requests if needed
export default api;

// Auth functions
export const signup = async (data) => {
  const res = await api.post("/users/signup", data);
  return res.data;
};

export const login = async (data) => {
  const res = await api.post("/users/login", data);
  return res.data;
};

export const forgotPassword = async (data) => {
  const res = await api.post('/users/forgot-password', data);
  return res.data;
};

export const resetPassword = (token, newPassword) => {
  return api.post(`/users/reset-password/${token}`, { password: newPassword });
};
