import axios from "axios";
console.log("env", import.meta.env.MODE);
const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "/api"
      : "https://mern-ecommerce-be-production.up.railway.app/api",
  withCredentials: true,
});

export default axiosInstance;
