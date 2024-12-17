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
    instance.get("/v1/search-term-jurisprudencia", {
      params: jurisprudenciaData,
    }),
  actualizarNodo: (jurisprudenciaData) =>
    instance.get("/v1/actualizar-nodo", {
      params: jurisprudenciaData,
    }),
};

export default JurisprudenciaService;
