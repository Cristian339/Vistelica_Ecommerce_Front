import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Obtiene la lista de deseos del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise} - Lista de productos en la lista de deseos
 */
export const getUserWishlist = async (userId) => {
    try {
        const token = localStorage.getItem('token');

        // Si no hay token, devolver array vacío en lugar de hacer la petición
        if (!token) {
            console.log('No hay token de autenticación, devolviendo wishlist vacía');
            return [];
        }

        const response = await axios.get(
            `${API_URL}/wishlist/user/${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        // Manejar específicamente error 401
        if (error.response && error.response.status === 401) {
            console.log('Sesión expirada o no autorizada para acceder a favoritos');
            // Opcionalmente, limpiar token inválido
            // localStorage.removeItem('token');
            return [];
        }
        console.error('Error al obtener la lista de favoritos:', error);
        return []; // Devolver array vacío en caso de error
    }
};

/**
 * Añade un producto a la lista de deseos
 * @param {string} productId - ID del producto a añadir
 * @returns {Promise} - Respuesta del servidor
 */
export const addToWishlist = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Usuario no autenticado');
        }

        const response = await axios.post(
            `${API_URL}/wishlist/add`,
            { productId },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al añadir a favoritos:', error);
        throw error;
    }
};

/**
 * Elimina un producto de la lista de deseos
 * @param {string} productId - ID del producto a eliminar
 * @returns {Promise} - Respuesta del servidor
 */
export const removeFromWishlist = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Usuario no autenticado');
        }

        const response = await axios.delete(
            `${API_URL}/wishlist/remove`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: { productId }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al eliminar de favoritos:', error);
        throw error;
    }
};

const wishService = {
    addToWishlist,
    removeFromWishlist,
    getUserWishlist
};

export default wishService;