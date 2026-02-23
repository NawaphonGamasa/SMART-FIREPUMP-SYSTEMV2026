import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

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