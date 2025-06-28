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
  searchTermino: (formData:any[]) =>
    instance.get("/buscar-termino-jurisprudencia", {
      params: formData,
    }),
  busquedaRapida: (formData:any[]) =>
    instance.get("/obtener-descriptor", {
      params: formData,
    }),
  actualizarNodo: (formData:any[]) =>
    instance.get("/actualizar-nodo", {
      params: formData,
    }),
  parametrosCronologia: (formData:any[]) =>
    instance.get("/obtener-parametros-cronologia", {
      params: formData,
    }),
  obtenerCronologia: (formData:any[]) =>
    instance.post("/obtener-cronologias", formData, {
      responseType: "blob",
    }),
  obtenerCronologiabyIds: (formData:any[]) =>
    instance.post("/obtener-cronologias-ids", formData, {
      responseType: "blob",
    }),

  obtenerNodos: () =>
    instance.get("/obtener-nodos"),
  obtenerResoluciones: (formData:any[]) =>
    instance.get("/obtener-resoluciones-cronologia", {
      params: formData,
    }),
};

export default JurisprudenciaService;
