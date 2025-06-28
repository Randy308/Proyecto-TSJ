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

const SalasService = {
  getAllSalas: () => instance.get(`/obtener-salas`),

  getDepartamentos: (id:number, params:FormData) =>
    instance.get(`/magistrado-estadisticas-departamentos/${id}`, {
      params,
    }),

  getDatos: (params:FormData) => instance.get(`/obtener-datos-salas`, { params }),
  getParametros: (params:FormData) =>
    instance.get(`/obtener-parametros-salas/`, { params }),
  getStatsX: (params:FormData) => instance.get(`/estadisticas-x/`, { params }),
  getStatsXY: (params:FormData) => instance.get(`/estadisticas-xy/`, { params }),
};

export default SalasService;
