import axios from 'axios';
import { getAuthHeaders } from './authService'; // Suponiendo que tienes un servicio de autenticación

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class WishService {
    /**
     * Añade un producto a la lista de deseos
     * @param {string} productId - ID del producto a añadir
     * @returns {Promise} - Respuesta del servidor
     */
    async addToWishlist(productId) {
        try {
            const response = await axios.post(
                `${API_URL}/wishlist/add`,
                { productId },
                { headers: await getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error al añadir a favoritos:', error);
            throw error;
        }
    }

    /**
     * Elimina un producto de la lista de deseos
     * @param {string} productId - ID del producto a eliminar
     * @returns {Promise} - Respuesta del servidor
     */
    async removeFromWishlist(productId) {
        try {
            const response = await axios.delete(
                `${API_URL}/wishlist/remove`,
                {
                    headers: await getAuthHeaders(),
                    data: { productId }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error al eliminar de favoritos:', error);
            throw error;
        }
    }

    /**
     * Obtiene la lista de deseos del usuario
     * @param {string} userId - ID del usuario
     * @returns {Promise} - Lista de productos en la lista de deseos
     */
    async getUserWishlist(userId) {
        try {
            const response = await axios.get(
                `${API_URL}/wishlist/user/${userId}`,
                { headers: await getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener la lista de favoritos:', error);
            throw error;
        }
    }
}

export default new WishService();