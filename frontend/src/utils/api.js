import axios from 'axios';

// Create axios instance with base configuration for ML API calls
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
