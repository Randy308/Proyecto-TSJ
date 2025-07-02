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

const JurisprudenciaService = {
  searchTermino: (jurisprudenciaData) =>
    instance.get("/buscar-termino-jurisprudencia", {
      params: jurisprudenciaData,
    }),
  busquedaRapida: (jurisprudenciaData) =>
    instance.get("/buscar-descriptor", {
      params: jurisprudenciaData,
    }),
  actualizarNodo: (jurisprudenciaData) =>
    instance.get("/actualizar-nodo", {
      params: jurisprudenciaData,
    }),
  parametrosCronologia: (jurisprudenciaData) =>
    instance.get("/obtener-parametros-cronologia", {
      params: jurisprudenciaData,
    }),
  obtenerCronologia: (formData) =>
    instance.post("/obtener-cronologias", formData, {
      responseType: "blob",
    }),
  obtenerCronologiabyIds: (formData) =>
    instance.post("/obtener-cronologias-ids", formData, {
      responseType: "blob",
    }),

  obtenerNodos: (jurisprudenciaData) =>
    instance.get("/obtener-nodos", {
      params: jurisprudenciaData,
    }),
  obtenerResoluciones: (jurisprudenciaData) =>
    instance.get("/obtener-resoluciones-cronologia", {
      params: jurisprudenciaData,
    }),
};

export default JurisprudenciaService;
