import axios from "axios";
import type { ReceivedForm } from "../types";

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
  obtenerTerminos: (params:object) =>
    instance.get("/obtener-terminos-avanzados", {
      params,
    }),
  getStatsX: (params:object) =>
    instance.get(`obtener-estadistica-avanzada-x`, { params }),

  getTimeSeries: (params:object) =>
    instance.get(`obtener-serie-temporal-x`, { params }),
  getMapa: (params:ReceivedForm) => instance.get(`obtener-mapa-x`, { params }),

  getStatsXY: (params:object) =>
    instance.get(`obtener-estadistica-avanzada-xy/`, { params }),
  buscarTermino: (params:object) => instance.get(`buscar-terminos/`, { params }),
};

export default StatsService;
