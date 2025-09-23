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

instance.interceptors.request.use(async (config) => {
  await getCsrfToken(); // Siempre intenta obtener CSRF (solo se hará una vez)
  return config;
});

export const JurisprudenciaService = {
  searchTermino: (formData: object) =>
    instance.get("/terminos-jurisprudencias", {
      params: formData,
    }),
  busquedaRapida: (formData: object) =>
    instance.get("/buscar-descriptores", {
      params: formData,
    }),
  actualizarNodo: (formData: object) =>
    instance.get("/refrescar-nodos", {
      params: formData,
    }),
  parametrosCronologia: (formData: object) =>
    instance.get("/busqueda-parametros", {
      params: formData,
    }),
  obtenerCronologia: (formData: object) =>
    instance.post("/cronologias", formData, {
      responseType: "blob",
      withCredentials: true,
    }),
  obtenerCronologiabyIds: (formData: object) =>
    instance.post("/cronologias-ids", formData, {
      responseType: "blob",
      withCredentials: true,
    }),
  busquedaAvanzada: (params: object) =>
    instance.post("/buscar-jurisprudencia-avanzado", params, {
      withCredentials: true,
    }),

  obtenerNodos: () => instance.get("/nodos"),
  obtenerResoluciones: (formData: DatosArrayForm) =>
    instance.get("/buscar-jurisprudencias", {
      params: formData,
    }),
};
