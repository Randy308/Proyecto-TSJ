import axios from "axios";
import type { FormListaX, ListaX } from "../types";

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

  getDataDepartamentos: (id:number, params:FormData) =>
    instance.get(`/magistrado-estadisticas-departamentos/${id}`, {
      params,
    }),
  obtenerCronologiabyIds: (formData:FormData) =>
    instance.post("/obtener-resoluciones-ids", formData, {
      responseType: "blob",
    }),
  buscarResoluciones: (params:FormData) =>
    instance.get("/filtrar-autos-supremos", {
      params,
    }),
  obtenerParametros: () => instance.get("/obtener-parametros-busqueda"),
  obtenerVariables: () => instance.get("/obtener-variables"),
  obtenerFechas: () => instance.get("/obtener-fechas"),
  obtenerResolucion: (id:number) => instance.get(`/resolucion/${id}`),
  obtenerPrediccion: (params:FormData) =>
    instance.get("/realizar-prediction", { params }),
  descomponerSerie: (params:FormData) => instance.get("/descomponer-serie", { params }),

  obtenerElemento: (params:FormData) => instance.get("/obtener-serie-terminos", { params }),

  realizarAnalisis: (params:FormListaX) =>
    instance.get("/obtener-estadisticas", {
      params,
    }),
  obtenerFiltrosEstadisticos: (params:FormData) =>
    instance.get("/obtener-filtros-estadisticas", {
      params,
    }),
  realizarAnalisisXY: (params:FormData) =>
    instance.get("/obtener-estadisticas-xy", {
      params,
    }),
};

export default ResolucionesService;
