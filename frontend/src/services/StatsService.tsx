import axios from "axios";
import type { FiltroAnalisis, ReceivedForm } from "../types";

const endpoint = import.meta.env.VITE_REACT_APP_BACKEND;
let csrfFetched = false;
const instance = axios.create({
  baseURL: endpoint,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

const getCsrfToken = async () => {
  if (csrfFetched) return;
  try {
    await axios.get(
      `${import.meta.env.VITE_REACT_APP_TOKEN}/sanctum/csrf-cookie`,
      {
        withCredentials: true,
      }
    );
    csrfFetched = true;
  } catch (error) {
    console.error("Error obteniendo CSRF token:", error);
  }
};

//intercepta peticiones post para agregar CSRF token
instance.interceptors.request.use((config) => {
  if (config.method === "post") {
    getCsrfToken();
  }
  return config;
});

export const StatsService = {
  obtenerTerminos: (params: object) =>
    instance.get("/obtener-terminos-avanzados", {
      params,
    }),
  getStatsX: (params: object) =>
    instance.get(`obtener-estadistica-avanzada-x`, { params }),

  getTimeSeries: (params: object) =>
    instance.get(`obtener-serie-temporal-x`, { params }),
  getMapa: (params: ReceivedForm) => instance.get(`obtener-mapa-x`, { params }),
  getMultivariable: (params: FiltroAnalisis) =>
    instance.post(`estadisticas-multivariable`, params, { withCredentials: true }),

  getStatsXY: (params: object) =>
    instance.get(`obtener-estadistica-avanzada-xy/`, { params }),
  buscarTermino: (params: object) =>
    instance.get(`buscar-terminos/`, { params }),
};
