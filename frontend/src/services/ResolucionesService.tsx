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

//intercepta peticiones post para agregar CSRF token
instance.interceptors.request.use((config) => {
  if (config.method === "post") {
    getCsrfToken();
  }
  return config;
});

export const ResolucionesService = {
  getStats: () => instance.get(`/historicos`),

  obtenerCronologiabyIds: (formData: object) =>
    instance.post("/resoluciones-ids", formData, {
      responseType: "blob",
      withCredentials: true,
    }),
  busquedaAvanzada: (params: object) =>
    instance.post("/buscar-resoluciones", params, { withCredentials: true }),
  buscarResoluciones: (params: object) =>
    instance.get("/filtrar-autos-supremos", {
      params,
    }),
  obtenerParametros: () => instance.get("/parametros-busqueda"),
  obtenerVariables: () => instance.get("/variables"),
  obtenerFechas: () => instance.get("/fechas"),
  obtenerResolucion: (id: number) => instance.get(`/resoluciones/${id}`),
  obtenerPrediccion: (params: FormData) =>
    instance.get("/predicciones", { params }),
  // descomponerSerie: (params:FormData) => instance.get("/descomponer-serie", { params }),

  // obtenerElemento: (params:object) => instance.get("/obtener-serie-terminos", { params }),

  realizarAnalisis: (params: Record<string, string>) =>
    instance.get("/estadisticas", {
      params,
    }),
  realizarAnalisisSala: (params: Record<string, string>) =>
    instance.get("/estadisticas-por-sala", {
      params,
    }),

  obtenerFiltrosEstadisticos: (params: Record<string, string | number>) =>
    instance.get("/filtros-estadisticas", {
      params,
    }),
  realizarAnalisisXY: (params: FormData) =>
    instance.get("/estadisticas-xy", {
      params,
    }),

  obtenerElemento: (params: object) =>
    instance.get("/obtener-serie-terminos", { params }),
};
