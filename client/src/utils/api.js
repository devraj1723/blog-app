import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Depending on backend port
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to add token to requests
api.interceptors.request.use(
    (config) => {
        // Get token from local storage
        const token = localStorage.getItem('token');

        // If token exists, add it to headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
