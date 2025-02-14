import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://virtualacademy-1-13.onrender.com/api",
  // baseURL: " https://mountains-wonder-well-duo.trycloudflare.com/api",
   baseURL: "http://localhost:9091/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
