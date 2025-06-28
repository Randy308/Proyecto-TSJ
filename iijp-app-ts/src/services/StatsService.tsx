import axios from "axios";

const endpoint = import.meta.env.VITE_REACT_APP_BACKEND;

const instance = axios.create({
  baseURL: endpoint,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

const StatsService = {
  obtenerTerminos: (params:FormData) =>
    instance.get("/obtener-terminos-avanzados", {
      params,
    }),
  getStatsX: (params:FormData) =>
    instance.get(`obtener-estadistica-avanzada-x`, { params }),

  getTimeSeries: (params:FormData) =>
    instance.get(`obtener-serie-temporal-x`, { params }),
  getMapa: (params:FormData) => instance.get(`obtener-mapa-x`, { params }),

  getStatsXY: (params:FormData) =>
    instance.get(`obtener-estadistica-avanzada-xy/`, { params }),
  buscarTermino: (params:FormData) => instance.get(`buscar-terminos/`, { params }),
};

export default StatsService;
