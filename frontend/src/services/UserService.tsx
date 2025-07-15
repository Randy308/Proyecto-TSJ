import axios from "axios";
import type { CreateUser } from "../types";
const endpoint = import.meta.env.VITE_REACT_APP_BACKEND;

let csrfFetched = false;
const getCsrfToken = async () => {
  if (csrfFetched) return;
  try {
    await axios.get(`${import.meta.env.VITE_REACT_APP_TOKEN}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
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

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error(
        "Sesión expirada o no autorizada. Redirigiendo al login..."
      );
    }
    return Promise.reject(error);
  }
);

export const UserService = {
  // Usuarios
  getAllUsers: (page:number) => instance.get("/admin/user", { params: { page } }),
  getAllResolutions: (page:number) => instance.get("/admin/resolutions", { params: { page } }),
  getUser: (id:number) => instance.get(`/admin/user/${id}`),
  createUser: (userData:CreateUser) => instance.post("/admin/user", userData),
  updateUser: (id:number, userData:CreateUser) => instance.put(`/admin/user/${id}`, userData),
  deleteUser: (id:number) => instance.delete(`/admin/user/${id}`),

  // Notificaciones
  getUnreadNotifications: () => instance.get("/obtener-no-leidas"),
  getAllNotifications: (page = 1) =>
    instance.get("/notificaciones", { params: { page } }),
  markNotificationAsRead: (id:number) =>
    instance.put(`/actualizar-notificacion/${id}`),

  // Resoluciones
  getResoluciones: (page = 1) => instance.get("/resoluciones-usuario", { params: { page } }),

  subirJurisprudencia: (formData:FormData) =>
    instance.post("/subir-jurisprudencia", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  buscarNuevasResoluciones: () => instance.post("/buscar-nuevas-resoluciones"),
  realizarWebScrapping: () => instance.post("/obtener-resoluciones"),
  subirResoluciones: (formData:FormData) =>
    instance.post("/subir-resoluciones", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
