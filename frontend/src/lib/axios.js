import axios from "axios";
console.log("env", import.meta.env.MODE);
const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "/api"
      : "https://novel-jamie-be-ecommerce-f1668421.koyeb.app/api",
  withCredentials: true,
});

export default axiosInstance;
