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

const MagistradoService = {
  getAllMagistrados: () => instance.get(`/magistrados`),

  getDepartamentos: (id:number, params:FormData) =>
    instance.get(`/magistrado-estadisticas-departamentos/${id}`, {
      params,
    }),

  getSerieTemporal: (id:number, params:FormData) =>
    instance.get(`/magistrado-serie-temporal/${id}`, { params }),
  getResumen: (id:number) => instance.get(`/obtener-datos-magistrado/${id}`, {}),
  getParametros: (params:FormData) =>
    instance.get(`/obtener-paramentros-magistrado/`, { params }),
  getStatsX: (params:FormData) =>
    instance.get(`/magistrado-estadisticas-x/`, { params }),
  getStatsXY: (params:FormData) =>
    instance.get(`/magistrado-estadisticas-xy/`, { params }),
  updateMagistrado: (id:number, data:FormData, token:string) =>
    instance.post(`/admin/magistrado/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default MagistradoService;
