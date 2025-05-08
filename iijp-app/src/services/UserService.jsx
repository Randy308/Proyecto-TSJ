import axios from "axios";

const endpoint = process.env.REACT_APP_BACKEND;

const instance = axios.create({
  baseURL: endpoint,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

const UserService = {
  getAllUsers: (token, page) =>
    instance.get("/admin/user", {
      params: { page: page },
      headers: { Authorization: `Bearer ${token}` },
    }),

  getUser: (id, token) =>
    instance.get(`/admin/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  createUser: (userData, token) =>
    instance.post("/admin/user", userData, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateUser: (id, userData, token) =>
    instance.put(`/admin/user/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  deleteUser: (id, token) =>
    instance.delete(`/admin/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

    getUnreadNotifications: (token) =>
      instance.get("/obtener-no-leidas", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    
    getAllNotifications: (token, page = 1) =>
      instance.get("/notificaciones", {
        params: { page },
        headers: { Authorization: `Bearer ${token}` },
      }),
    
    markNotificationAsRead: (id, token) =>
      instance.put(`/actualizar-notificacion/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    
};

export default UserService;
