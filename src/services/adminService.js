import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Ajusta según tu configuración

const getClients = async () => {
    const response = await axios.get(`${API_URL}/admin/clients`);
    return response.data;
};

const banUser = async (userId, reason) => {
    await axios.post(`${API_URL}/admin/ban/${userId}`, { reason });
};

const unbanUser = async (userId) => {
    await axios.post(`${API_URL}/admin/unban/${userId}`);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getClients,
    banUser,
    unbanUser
};