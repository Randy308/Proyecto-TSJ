import axios from "axios";

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

  getRole: (id) => instance.get(`${API_PATH}/roles/${id}`),

  createRole: (roleData) => instance.post(`${API_PATH}/roles`, roleData),

  updateRole: (id, roleData) =>
    instance.put(`${API_PATH}/roles/${id}`, roleData),

  deleteRole: (id) => instance.delete(`${API_PATH}/roles/${id}`),

  getPermissions: (params = {}) =>
    instance.get(`${API_PATH}/permisos`, { params }),
};

export default RoleService;
