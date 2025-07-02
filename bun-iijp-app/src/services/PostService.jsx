import axios from "axios";

const endpoint = import.meta.env.VITE_REACT_APP_BACKEND;

const instance = axios.create({
  baseURL: endpoint,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const PostService = {
  getAllPosts: (token) =>
    instance.get("/admin/post", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getPost: (id, token) =>
    instance.get(`/admin/post/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createPost: (postData, token) =>
    instance.post("/admin/post", postData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }),

  updatePost: (id, postData, token) =>
    instance.put(`/admin/post/${id}`, postData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }),

  deletePost: (id, token) =>
    instance.delete(`/admin/post/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  obtenerPublicaciones: () => instance.get("/publicaciones-activas"),
};

export default PostService;
