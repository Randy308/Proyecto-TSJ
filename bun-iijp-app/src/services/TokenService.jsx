import axios from "axios";

const endpoint = import.meta.env.VITE_REACT_APP_TOKEN;


const instance = axios.create({
  baseURL: endpoint,
  withCredentials: true,
});

const TokenService = {
  obtenerToken: () =>
    instance.get("/sanctum/csrf-cookie", {
    }),
};

export default TokenService;
