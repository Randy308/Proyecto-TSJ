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
  descomponerSerie: (params) => instance.get("/descomponer-serie", { params }),
  subirCSV: (token, formData) =>
    instance.post("/subir-resoluciones", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }),
  obtenerElemento: (params) => instance.get("/obtener-elemento", { params }),
  buscarNuevasResoluciones: (token) =>
    instance.post(
      "/buscar-nuevas-resoluciones",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
  realizarWebScrapping: (token, formData) =>
    instance.post(
      "/obtener-resoluciones",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ), realizarAnalisis: (params) =>
      instance.get("/obtener-estadisticas", {
        params,
      }),
};

export default ResolucionesService;
