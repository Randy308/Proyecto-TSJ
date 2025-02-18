import axios from "axios";

const endpoint = process.env.REACT_APP_BACKEND;
const API_PATH = "/admin";

const instance = axios.create({
  baseURL: endpoint,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

const RoleService = {
  getAllRoles: (token, params = {}) =>
    instance.get(`${API_PATH}/roles`, {
      params,
      headers: authHeader(token),
    }),

  getRole: (id, token) =>
    instance.get(`${API_PATH}/roles/${id}`, {
      headers: authHeader(token),
    }),

  createRole: (roleData, token) =>
    instance.post(`${API_PATH}/roles`, roleData, {
      headers: authHeader(token),
    }),

  updateRole: (id, roleData, token) =>
    instance.put(`${API_PATH}/roles/${id}`, roleData, {
      headers: authHeader(token),
    }),

  deleteRole: (id, token) =>
    instance.delete(`${API_PATH}/roles/${id}`, {
      headers: authHeader(token),
    }),

  getPermissions: (token, params = {}) =>
    instance.get(`${API_PATH}/permisos`, {
      params,
      headers: authHeader(token),
    }),
};

export default RoleService;
