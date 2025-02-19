
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

const StatsService = {
  obtenerTerminos: (params) =>
    instance.get("/obtener-terminos-avanzados", {
      params,
    }),
  getStatsX: (params) =>
    instance.get(`obtener-estadistica-avanzada-x`, { params }),
  getStatsXY: (params) =>
    instance.get(`obtener-estadistica-avanzada-xy/`, { params }),
  buscarTermino: (params) => instance.get(`buscar-terminos/`, { params }),
};

export default StatsService;