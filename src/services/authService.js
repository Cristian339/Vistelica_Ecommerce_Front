
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await axios.post(`${API_URL}/user`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error obteniendo usuario:", error);
        localStorage.removeItem('token'); // Limpiamos token si hay error
        return null;
    }
};


export const isAdmin = async () => {
    const user = await getCurrentUser();
    return user?.role === 0;
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.removeItem('sessionId'); // Limpiar sessionId de guest
            localStorage.removeItem('sessionInitialized'); // Permitir reinicialización si needed
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};


export const checkEmailAvailability = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/check-email`, { email });
        return response.data;
    } catch (error) {
        console.error("Error verificando email:", error);
        throw error;
    }
};

export const checkPhoneAvailability = async (phone) => {
    try {
        const response = await axios.post(`${API_URL}/check-phone`, { phone });
        return response.data;
    } catch (error) {
        console.error("Error verificando teléfono:", error);
        throw error;
    }
};