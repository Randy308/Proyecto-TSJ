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

const ResolucionesService = {
  getStats: () => instance.get(`/obtener-historico`),

  getDataDepartamentos: (id, params) =>
    instance.get(`/magistrado-estadisticas-departamentos/${id}`, {
      params,
    }),
};

export default ResolucionesService;
