import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// services/profileService.js
export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // Devuelve los datos del perfil
    } catch (error) {
        console.error('Error fetching user profile:', error.response || error);
        throw error; // Asegúrate de manejar el error en el componente
    }
};
// Modificar perfil del usuario
export const updateUserProfile = async (profileData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/profile`, profileData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data; // Devuelve el perfil actualizado
    } catch (error) {
        console.error('Error updating user profile:', error.response || error);
        throw error;
    }
};
