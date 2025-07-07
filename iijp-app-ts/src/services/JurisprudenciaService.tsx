import axios from "axios";
import type { DatosArrayForm } from "../types";

const endpoint = import.meta.env.VITE_REACT_APP_BACKEND;

const instance = axios.create({
  baseURL: endpoint,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

const JurisprudenciaService = {
  searchTermino: (formData:object) =>
    instance.get("/buscar-termino-jurisprudencia", {
      params: formData,
    }),
  busquedaRapida: (formData:object) =>
    instance.get("/buscar-descriptor", {
      params: formData,
    }),
  actualizarNodo: (formData:object) =>
    instance.get("/actualizar-nodo", {
      params: formData,
    }),
  parametrosCronologia: (formData:object) =>
    instance.get("/obtener-parametros-cronologia", {
      params: formData,
    }),
  obtenerCronologia: (formData:object) =>
    instance.post("/obtener-cronologias", formData, {
      responseType: "blob",
    }),
  obtenerCronologiabyIds: (formData:object) =>
    instance.post("/obtener-cronologias-ids", formData, {
      responseType: "blob",
    }),

  obtenerNodos: () =>
    instance.get("/obtener-nodos"),
  obtenerResoluciones: (formData:DatosArrayForm) =>
    instance.get("/obtener-resoluciones-cronologia", {
      params: formData,
    }),
};

export default JurisprudenciaService;
