import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers:{
        "Content-Type":"application/json",
    }
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(!token){
        console.log("Token Not Found");
    }
    if(token){
        config.headers.token = `Bearer ${token}`;
    }
    return config;
});
export default axiosClient;

