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

const MagistradoService = {
  getAllMagistrados: () => instance.get(`/magistrados`),
};

export default MagistradoService;
