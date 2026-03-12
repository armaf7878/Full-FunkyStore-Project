import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers:{
        "Content-Type": "application/json",
    }
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("=== AXIOS INTERCEPTOR ===");
    console.log("Request URL:", config.url);
    console.log("Token from localStorage:", token);
    
    if(token){
        config.headers.token = `Bearer ${token}`;
        console.log("Token header set:", config.headers.token);
    } else {
        console.log("WARNING: No token found!");
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("Axios Error:", error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default axiosClient;

