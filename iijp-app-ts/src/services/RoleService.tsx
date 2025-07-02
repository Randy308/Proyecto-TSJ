import axios from "axios";
import type { RoleData } from "../types";

const endpoint = import.meta.env.VITE_REACT_APP_BACKEND;
const API_PATH = "/admin";

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
  baseURL: endpoint,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

instance.interceptors.request.use(async (config) => {
  await getCsrfToken(); // Siempre intenta obtener CSRF (solo se hará una vez)
  return config;
});

const RoleService = {
  getAllRoles: (params = {}) =>
    instance.get(`${API_PATH}/roles`, { params }),

  getRole: (id:number) => instance.get(`${API_PATH}/roles/${id}`),

  createRole: (roleData:RoleData) => instance.post(`${API_PATH}/roles`, roleData),

  updateRole: (id:number, roleData:RoleData) =>
    instance.put(`${API_PATH}/roles/${id}`, roleData),

  deleteRole: (id:number) => instance.delete(`${API_PATH}/roles/${id}`),

  getPermissions: (params = {}) =>
    instance.get(`${API_PATH}/permisos`, { params }),
};

export default RoleService;
