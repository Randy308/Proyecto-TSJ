import axios from "axios";
import type { FiltroAnalisis, ReceivedForm } from "../types";

const endpoint = import.meta.env.VITE_REACT_APP_BACKEND;
const instance = axios.create({
  baseURL: endpoint,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

let csrfFetched = false;
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

instance.interceptors.request.use(async (config) => {
  await getCsrfToken(); // Siempre intenta obtener CSRF (solo se hará una vez)
  return config;
});

export const StatsService = {
  obtenerTerminos: (params: object) =>
    instance.get("/terminos-avanzados", {
      params,
    }),
  getStatsX: (params: object) =>
    instance.get(`estadisticas-avanzadas-x`, { params }),

  getTimeSeries: (params: object) =>
    instance.get(`series-temporales-x`, { params }),
  getMapa: (params: ReceivedForm) => instance.get(`mapas-x`, { params }),
  getMultivariable: (params: FiltroAnalisis) =>
    instance.post(`estadisticas-multivariables`, params, {
      withCredentials: true,
    }),
  getMultivariableSala: (params: FiltroAnalisis) =>
    instance.post(`estadisticas-xy`, params, { withCredentials: true }),

  getStatsXY: (params: object) =>
    instance.get(`estadisticas-avanzadas-xy/`, { params }),
  buscarTermino: (params: object) =>
    instance.get(`buscar-terminos/`, { params }),
};
