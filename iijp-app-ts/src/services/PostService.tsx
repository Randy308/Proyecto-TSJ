import axios from "axios";

const endpoint = import.meta.env.VITE_REACT_APP_BACKEND;

const instance = axios.create({
  baseURL: endpoint,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const PostService = {
  getAllPosts: (token:string) =>
    instance.get("/admin/post", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getPost: (id:number, token:string) =>
    instance.get(`/admin/post/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createPost: (postData:FormData, token:string) =>
    instance.post("/admin/post", postData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }),

  updatePost: (id:number, postData:FormData, token:string) =>
    instance.put(`/admin/post/${id}`, postData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }),

  deletePost: (id:number, token:string) =>
    instance.delete(`/admin/post/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  obtenerPublicaciones: () => instance.get("/publicaciones-activas"),
};
