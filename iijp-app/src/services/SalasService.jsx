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

const SalasService = {
  getAllSalas: () => instance.get(`/obtener-salas`),

  getDepartamentos: (id, params) =>
    instance.get(`/magistrado-estadisticas-departamentos/${id}`, {
      params,
    }),

  getDatos: (params) => instance.get(`/obtener-datos-salas`, { params }),
  getParametros: (params) =>
    instance.get(`/obtener-parametros-salas/`, { params }),
  getStatsX: (params) => instance.get(`/estadisticas-x/`, { params }),
  getStatsXY: (params) => instance.get(`/estadisticas-xy/`, { params }),
};

export default SalasService;
