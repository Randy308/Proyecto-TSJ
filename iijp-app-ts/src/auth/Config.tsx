import axios from "axios";
import type { Login, Register } from "../types";
const endpoint = import.meta.env.VITE_REACT_APP_BACKEND;

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
  baseURL: endpoint, // Base URL set here
});

instance.interceptors.request.use(async (config) => {
  const method = (config.method || "").toLowerCase(); // normaliza a minúscula
  if (["post", "put", "patch", "delete"].includes(method)) {
    await getCsrfToken();
  }
  return config;
});

const getCsrfToken = async () => {
  try {
    await axios.get(`${import.meta.env.VITE_REACT_APP_TOKEN}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error obteniendo CSRF token:", error);
  }
};

export default {
  getRegister: (data:Register) => instance.post(`/register`, data), // Correct path
  getLogin: (data:Login) => instance.post(`/login`, data), // Correct path
  getLogout: () => instance.post(`/logout`), // Correct path
};
