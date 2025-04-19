import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getUserProfile = async (userId=1) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/profile/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo el perfil del usuario:', error);
        throw error;
    }
};
