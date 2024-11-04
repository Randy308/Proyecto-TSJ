import axios from "axios";
const endpoint = process.env.REACT_APP_BACKEND;

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  baseURL: endpoint, // Base URL set here
});

export default {
  getRegister: (data) => instance.post(`/v1/auth/register`, data), // Correct path
  getLogin: (data) => instance.post(`/v1/auth/login`, data), // Correct path
  getLogout: () => instance.post(`/v1/auth/logout`), // Correct path
};

function getCookie(name) {
  const cookieArr = document.cookie.split(";");

  for (let cookie of cookieArr) {
    const [cookieName, cookieValue] = cookie.trim().split("=");

    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}
