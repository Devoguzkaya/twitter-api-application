import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const authHeader = localStorage.getItem('authHeader');
        if (authHeader) {
            config.headers.Authorization = authHeader;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired veya unauthorized durumunda yapılacaklar
            // Örn: localStorage.removeItem('authHeader');
            // window.location.href = '/login'; // Basit bir redirect, React Router ile daha şık yapılabilir
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
