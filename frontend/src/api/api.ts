import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/api", // Base URL for all requests
    timeout: 30000, // Request timeout in milliseconds (10 seconds)
    headers: {
        "Content-Type": "application/json", // Default content type
    },
    withCredentials: true, // Include credentials (cookies) in cross-origin requests
});

export default api;