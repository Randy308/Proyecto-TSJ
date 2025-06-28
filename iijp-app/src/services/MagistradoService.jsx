import axios from "axios";

const endpoint = process.env.REACT_APP_BACKEND;

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

  getDepartamentos: (id, params) =>
    instance.get(`/magistrado-estadisticas-departamentos/${id}`, {
      params,
    }),

  getSerieTemporal: (id, params) =>
    instance.get(`/magistrado-serie-temporal/${id}`, { params }),
  getResumen: (id) => instance.get(`/obtener-datos-magistrado/${id}`, {}),
  getParametros: (params) =>
    instance.get(`/obtener-paramentros-magistrado/`, { params }),
  getStatsX: (params) =>
    instance.get(`/magistrado-estadisticas-x/`, { params }),
  getStatsXY: (params) =>
    instance.get(`/magistrado-estadisticas-xy/`, { params }),
  updateMagistrado: (id, data, token) =>
    instance.post(`/admin/magistrado/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default MagistradoService;
