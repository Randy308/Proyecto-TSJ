import axios from "axios";
import type {
  CreateUser,
  Login,
  ResueleveFondo,
} from "../types";
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

export const AuthService = {
  getRegister: (data: CreateUser) => instance.post(`/register`, data), // Correct path
  getLogin: (data: Login) => instance.post(`/login`, data), // Correct path
  getLogout: () => instance.post(`/logout`), // Correct path
  getAuthUser: () => instance.get(`/auth-user`), // Obtener usuario autenticado
  updateProfile: (data: CreateUser) => instance.put(`/actualizar-perfil`, data), // Actualizar perfil
  subirResuelveFondo: (data: FormData) =>
    instance.post("subir-resuelve-fondo", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  saveResuelveFondo: (data: ResueleveFondo) =>
    instance.post("subir-reactiveresume", data),
  editResuelveFondo: (data: ResueleveFondo, id: number) =>
    instance.put(`resuelve-fondos/${id}`, data),
  editDecideForma: (
    grupoSala: string,
    tipo: number,
    sala_id: number,
    resuelve_fondo_id: number
    
  ) =>
    instance.put(`actualizar-forma-decisiones`, {
      sala_id,
      tipo,
      resuelve_fondo_id,
      nombre: grupoSala,
    }),
  deleteResuelveFondo: (id: number) => instance.delete(`resuelve-fondos/${id}`),
  showResuelveFondo: (id: number) => instance.get(`resuelve-fondos/${id}`),
  getResuelveFondo: () => instance.get(`resuelve-fondos`),
  getDecideForma: () => instance.get(`forma-decisiones`),
  getSalas: () => instance.get(`admin/salas`), // Obtener salas
  getGrupoSalas: () => instance.get(`admin/grupo-salas`), // Obtener grupos de salas
  getLogs: () => instance.get(`logs`), // Obtener roles
  crearGrupoSala: (nombre: string) =>
    instance.post(`admin/grupo-salas`, { nombre }), // Crear grupo de sala
  updateSala: (grupoSalaId: number, salaId: number) =>
    instance.put(`admin/salas/${salaId}`, { grupo_sala_id: grupoSalaId }), // Actualizar sala con grupo
};
