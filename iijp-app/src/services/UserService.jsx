import axios from "axios";
import Cookies from "js-cookie";
const endpoint = process.env.REACT_APP_BACKEND;
const API_PATH = "/admin";

let csrfFetched = false;
const getCsrfToken = async () => {
  if (csrfFetched) return;
  try {
    await axios.get(`${process.env.REACT_APP_TOKEN}/sanctum/csrf-cookie`, {
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

const UserService = {
  // Usuarios
  getAllUsers: (page) => instance.get("/admin/user", { params: { page } }),
  getAllResolutions: (page) => instance.get("/admin/resolutions", { params: { page } }),
  getUser: (id) => instance.get(`/admin/user/${id}`),
  createUser: (userData) => instance.post("/admin/user", userData),
  updateUser: (id, userData) => instance.put(`/admin/user/${id}`, userData),
  deleteUser: (id) => instance.delete(`/admin/user/${id}`),

  // Notificaciones
  getUnreadNotifications: () => instance.get("/obtener-no-leidas"),
  getAllNotifications: (page = 1) =>
    instance.get("/notificaciones", { params: { page } }),
  markNotificationAsRead: (id) =>
    instance.put(`/actualizar-notificacion/${id}`),

  // Resoluciones
  getResoluciones: (page = 1) =>
    instance.get("/resoluciones-usuario", { params: { page } }),

  subirJurisprudencia: (formData) =>
    instance.post("/subir-jurisprudencia", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  buscarNuevasResoluciones: () => instance.post("/buscar-nuevas-resoluciones"),
  realizarWebScrapping: () => instance.post("/obtener-resoluciones"),
  subirResoluciones: (formData) =>
    instance.post("/subir-resoluciones", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default UserService;
