import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://mern-ecommerce-be-production.up.railway.app/api",
    withCredentials:true, // send cookies to the server
})

export default axiosInstance;