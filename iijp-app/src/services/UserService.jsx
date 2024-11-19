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
    instance.get("/v1/admin/user", {
      params: { page: page },
      headers: { Authorization: `Bearer ${token}` },
    }),

  getUser: (id, token) =>
    instance.get(`/v1/admin/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  createUser: (userData, token) =>
    instance.post("/v1/admin/user", userData, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateUser: (id, userData, token) =>
    instance.put(`/v1/admin/user/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  deleteUser: (id, token) =>
    instance.delete(`/v1/admin/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default UserService;
