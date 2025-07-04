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

const ResolucionesService = {
  getStats: () => instance.get(`/obtener-historico`),

  getDataDepartamentos: (id, params) =>
    instance.get(`/magistrado-estadisticas-departamentos/${id}`, {
      params,
    }),

  buscarResoluciones: (params) =>
    instance.get("/filtrar-autos-supremos", {
      params,
    }),
  obtenerParametros: () => instance.get("/obtener-parametros-busqueda"),
  obtenerVariables: () => instance.get("/obtener-variables"),
  obtenerFechas: () => instance.get("/obtener-fechas"),
  obtenerResolucion: (id) => instance.get(`/resolucion/${id}`),
  obtenerPrediccion: (params) =>
    instance.get("/realizar-prediction", { params }),
  obtenerCronologiabyIds: (formData) =>
    instance.post("/obtener-resoluciones-ids", formData, {
      responseType: "blob",
    }),
  descomponerSerie: (params) => instance.get("/descomponer-serie", { params }),

  obtenerElemento: (params) =>
    instance.get("/obtener-serie-terminos", { params }),

  realizarAnalisis: (params) =>
    instance.get("/obtener-estadisticas", {
      params,
    }),
  obtenerFiltrosEstadisticos: (params) =>
    instance.get("/obtener-filtros-estadisticas", {
      params,
    }),
  realizarAnalisisXY: (params) =>
    instance.get("/obtener-estadisticas-xy", {
      params,
    }),
};

export default ResolucionesService;
