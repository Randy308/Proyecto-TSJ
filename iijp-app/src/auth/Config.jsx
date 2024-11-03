import axios from "axios";
const endpoint = process.env.REACT_APP_BACKEND;

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withXSRFToken: true,
  withCredentials: true,
  baseURL: endpoint, // Base URL set here
});

export default {
  getRegister: (data) => instance.post(`/v1/auth/register`, data), // Correct path
  getLogin: (data) => instance.post(`/v1/auth/login`, data), // Correct path
  getLogout: () => instance.post(`/v1/logout`), // Correct path
};
