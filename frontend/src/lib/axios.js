import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.mode !== "development"
      ? "http://localhost:5000/api"
      : "https://mern-ecommerce-be-production.up.railway.app/api",
  withCredentials: true,
});

export default axiosInstance;
