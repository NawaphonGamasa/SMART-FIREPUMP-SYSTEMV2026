import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000/api';
const hostname = window.location.hostname;
const API_BASE_URL = `http://${hostname}:3000/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('username');

            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const loginUser = async (username, password) => {
    try {
        const response = await api.post('/login', { username, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
// ✅ เปลี่ยนเป็นดึงข้อมูล Fire Pump
export const getFirePumpDashboard = async () => {
    try {
        const response = await api.get('/dashboard');
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const getDailyReport = async (startDate, endDate) => {
    try {
        // ส่ง query param: ?start=2023-10-01&end=2023-10-03
        const response = await api.get(`/report?start=${startDate}&end=${endDate}`);
        return response.data;
    } catch (error) {
        console.error('API Report Error:', error);
        throw error;
    }
};

export default api;