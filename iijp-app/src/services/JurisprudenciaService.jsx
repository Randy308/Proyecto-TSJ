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

const JurisprudenciaService = {
  searchTermino: (jurisprudenciaData) =>
    instance.get("/buscar-termino-jurisprudencia", {
      params: jurisprudenciaData,
    }),
  actualizarNodo: (jurisprudenciaData) =>
    instance.get("/actualizar-nodo", {
      params: jurisprudenciaData,
    }),
  subirCSV: (token, formData) =>
    instance.post("/subir-jurisprudencia", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }),
  parametrosCronologia: (jurisprudenciaData) =>
    instance.get("/obtener-parametros-cronologia", {
      params: jurisprudenciaData,
    }),
  obtenerCronologia: (formData) =>
    instance.post("/obtener-cronologias", formData, {
      responseType: "blob",
    }),

  obtenerNodos: (jurisprudenciaData) =>
    instance.get("/obtener-nodos", {
      params: jurisprudenciaData,
    }),
};

export default JurisprudenciaService;
