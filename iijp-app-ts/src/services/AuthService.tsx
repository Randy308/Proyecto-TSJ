import axios from "axios";
import type { CreateUser, Login } from "../types";
const endpoint = import.meta.env.VITE_REACT_APP_BACKEND;

let csrfFetched = false;
const getCsrfToken = async () => {
  if (csrfFetched) return;
  try {
    await axios.get(
      `${import.meta.env.VITE_REACT_APP_TOKEN}/sanctum/csrf-cookie`,
      {
        withCredentials: true,
      }
    );
    csrfFetched = true;
  } catch (error) {
    console.error("Error obteniendo CSRF token:", error);
  }
};

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
  baseURL: endpoint,
});

instance.interceptors.request.use(async (config) => {
  await getCsrfToken(); // Siempre intenta obtener CSRF (solo se hará una vez)
  return config;
});

// instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       console.error(
//         "Sesión expirada o no autorizada. Redirigiendo al login..."
//       );
//     }
//     return Promise.reject(error);
//   }
// );

export const AuthService = {
  getRegister: (data: CreateUser) => instance.post(`/register`, data), // Correct path
  getLogin: (data: Login) => instance.post(`/login`, data), // Correct path
  getLogout: () => instance.post(`/logout`), // Correct path
  getAuthUser: () => instance.get(`/auth-user`), // Obtener usuario autenticado
};
