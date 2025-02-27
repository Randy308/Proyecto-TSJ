import axios from "axios";

const endpoint = process.env.REACT_APP_TOKEN;


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
