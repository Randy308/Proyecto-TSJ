import axios from "axios";

const endpoint = import.meta.env.VITE_REACT_APP_BACKEND;


const instance = axios.create({
  baseURL: endpoint,
  withCredentials: true,
});

export const TokenService = {
  obtenerToken: () =>
    instance.get("/sanctum/csrf-cookie", {
    }),
};
