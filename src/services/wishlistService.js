// src/services/wishlistService.js
import axios from 'axios';
import {getCurrentUser, getToken} from '@/services/authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const handleError = (error, defaultMessage) => {
    console.error(defaultMessage, error);
    throw new Error(
        error.response?.data?.message || defaultMessage
    );
};

const wishlistService = {

    /**
     * Añade un producto a la lista de deseos
     * @param {number} productId - ID del producto
     * @returns {Promise<Object>} - Item añadido a la wishlist
     */
    async addToWishlist(productId) {
        try {
            const user = await getCurrentUser();
            if (!user) {
                throw new Error('Usuario no autenticado');
            }

            const response = await axios.post(
                `${API_URL}/wishlist/add`,
                { product_id: productId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return handleError(error, 'Error al añadir producto a la lista de deseos');
        }
    },

    /**
     * Elimina un producto de la lista de deseos
     * @param {number} productId - ID del producto
     * @returns {Promise<void>}
     */
    async removeFromWishlist(productId) {
        try {
            const user = await getCurrentUser();
            if (!user) {
                throw new Error('Usuario no autenticado');
            }

            await axios.delete(`${API_URL}/wishlist/remove`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                data: { product_id: productId }
            });
        } catch (error) {
            return handleError(error, 'Error al eliminar producto de la lista de deseos');
        }
    },

    /**
     * Verifica si un producto está en la lista de deseos del usuario
     * @param {number} productId - ID del producto
     * @returns {Promise<boolean>} - true si está en la wishlist
     */
    async isInWishlist(productId) {
        try {
            const user = await getCurrentUser();
            if (!user) return false;

            const response = await axios.get(`${API_URL}/wishlist/check`, {
                params: { product_id: productId },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.isInWishlist;
        } catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            console.error('Error al verificar wishlist:', error);
            return false;
        }
    },

    /**
     * Obtiene el conteo de productos en la wishlist
     * @returns {Promise<number>} - Número de productos en la wishlist
     */
    async getWishlistCount() {
        try {
            const user = await getCurrentUser();
            if (!user) return 0;

            const wishlist = await this.getWishlist(user.user_id);
            return wishlist.length;
        } catch (error) {
            console.error('Error al obtener conteo de wishlist:', error);
            return 0;
        }
    },

    /**
     * Alterna un producto en la lista de deseos (añade si no está, quita si está)
     * @param {number} productId - ID del producto
     * @returns {Promise<Object>} - Resultado de la operación
     */
    async toggleWishlistItem(productId) {
        try {
            const isInWishlist = await this.isInWishlist(productId);
            if (isInWishlist) {
                await this.removeFromWishlist(productId);
                return { action: 'removed', productId };
            } else {
                const result = await this.addToWishlist(productId);
                return { action: 'added', productId, result };
            }
        } catch (error) {
            return handleError(error, 'Error al alternar producto en la lista de deseos');
        }
    },
    /**
     * Verifica si un producto está en la wishlist del usuario
     * @param {number} productId - ID del producto
     * @returns {Promise<boolean>} - true si está en la wishlist
     */
    async checkProductInWishlist(productId) {
        try {
            const token = getToken();
            if (!token) return false;

            const response = await axios.get(`${API_URL}/wishlist/check/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.isInWishlist;
        } catch (error) {
            console.error('Error checking product in wishlist:', error);
            return false;
        }
    },


    /**
     * Obtiene la lista de deseos de un usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} - Lista de productos en la wishlist
     */
    async getWishlistUser(userId) {
        try {
            const response = await axios.get(`${API_URL}/wishlist/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            return handleError(error, 'Error al obtener la lista de deseos');
        }
    },

    /**
     * Obtiene la wishlist completa del usuario
     * @returns {Promise<Array>} - Lista de productos en la wishlist
     */
    async getWishlist() {
        try {
            const token = getToken();
            if (!token) return [];

            const response = await axios.get(`${API_URL}/wishlist`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting wishlist:', error);
            return [];
        }
    },
};

export default wishlistService;