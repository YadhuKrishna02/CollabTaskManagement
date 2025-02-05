import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: '/api',
    timeout: 10000
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);


export default axiosInstance;
