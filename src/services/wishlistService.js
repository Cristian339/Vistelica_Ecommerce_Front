// src/services/wishlistService.js
import axios from 'axios';
import {getAuthHeaders, getCurrentUser, getToken} from '@/services/authService';

const API_URL = `http://localhost:5000/api`;

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
                // Si no hay usuario, solo actualizar localStorage
                const localWishlist = this.getLocalWishlist();
                const updatedWishlist = localWishlist.filter(
                    item => item.id !== productId && item.product_id !== productId
                );
                this.updateLocalWishlist(updatedWishlist);
                return;
            }

            // Intentar actualizar en la API
            try {
                await axios.delete(`${API_URL}/wishlist/remove`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    data: { product_id: productId }
                });
            } catch (apiError) {
                console.error('Error al eliminar del servidor:', apiError);
            }

            // Actualizar también en localStorage
            const localWishlist = this.getLocalWishlist();
            const updatedWishlist = localWishlist.filter(
                item => item.id !== productId && item.product_id !== productId
            );
            this.updateLocalWishlist(updatedWishlist);
        } catch (error) {
            console.error('Error al eliminar producto de favoritos:', error);
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

            const wishlist = await this.getWishlist();
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
     * Obtiene la lista de deseos del usuario actual
     * @returns {Promise<Array>} - Lista de productos en la wishlist
     */
    async getWishlist() {
        try {
            const token = getToken();
            if (!token) {
                // Devolver la lista local si no hay autenticación
                return this.getLocalWishlist();
            }

            // Intentar obtener productos desde la API
            try {
                const user = await getCurrentUser();
                // Primero intentar con el endpoint check para cada producto guardado localmente
                const localWishlist = this.getLocalWishlist();

                if (localWishlist.length > 0) {
                    // Si hay productos en localStorage, usar esos
                    return localWishlist;
                } else {
                    // Si no hay productos en localStorage, intentar cargar desde la API
                    return [];
                }
            } catch (error) {
                console.error('Error al obtener wishlist:', error);
                return this.getLocalWishlist(); // Usar localStorage como respaldo
            }
        } catch (error) {
            console.error('Error general en wishlist:', error);
            return this.getLocalWishlist();
        }
    },

    /**
     * Actualiza la lista de deseos en localStorage
     * @param {Array} wishlist - Lista de productos
     */
    updateLocalWishlist(wishlist) {
        localStorage.setItem('vistelica_wishlist', JSON.stringify(wishlist || []));
    },

    /**
     * Obtiene la lista de deseos desde localStorage
     * @returns {Array} - Lista de productos
     */
    getLocalWishlist() {
        return JSON.parse(localStorage.getItem('vistelica_wishlist') || '[]');
    },

    /**
     * Añade un producto a la lista de deseos local
     * @param {Object} product - Producto a añadir
     */
    addToLocalWishlist(product) {
        const localWishlist = this.getLocalWishlist();
        // Verificar si el producto ya está en la lista
        if (!localWishlist.some(item => item.id === product.id || item.product_id === product.id)) {
            localWishlist.push({
                id: product.id,
                product_id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || product.images?.[0],
                description: product.description,
                slug: product.slug
            });
            this.updateLocalWishlist(localWishlist);
        }
    },

    /**
     * Obtiene la lista de deseos del usuario
     * @param {string} userId - ID del usuario
     * @returns {Promise} - Lista de productos en la lista de deseos
     */
    async getUserWishlist(userId) {
        try {
            console.log(`[Wishlist] Solicitando wishlist para usuario: ${userId}`);

            // Verificar headers de autenticación
            const headers = await getAuthHeaders();
            console.log("[Wishlist] Headers de autenticación presentes:", !!headers.Authorization);

            const response = await axios.get(
                `${API_URL}/wishlist/user/${userId}`,
                { headers }
            );

            console.log(`[Wishlist] Respuesta recibida status: ${response.status}`);
            console.log("[Wishlist] Datos recibidos:", response.data);

            // Manejar diferentes formatos posibles de respuesta
            let products = [];

            if (Array.isArray(response.data)) {
                // Si la API devuelve un array directamente
                products = response.data;
                console.log("[Wishlist] Formato: array directo");
            }
            else if (response.data && Array.isArray(response.data.products)) {
                // Si la API devuelve {products: [...]}
                products = response.data.products;
                console.log("[Wishlist] Formato: objeto con propiedad products");
            }
            else if (response.data && typeof response.data === 'object') {
                // Buscar cualquier propiedad que sea un array en la respuesta
                for (const key in response.data) {
                    if (Array.isArray(response.data[key])) {
                        console.log(`[Wishlist] Encontrado array en propiedad: ${key}`);
                        products = response.data[key];
                        break;
                    }
                }
            }

            console.log(`[Wishlist] Total productos encontrados: ${products.length}`);
            return { products };
        } catch (error) {
            console.error('[Wishlist] Error al obtener favoritos:', error);
            if (error.response) {
                console.error(`[Wishlist] Status: ${error.response.status}`);
            }
            throw error;
        }
    },
};

export default wishlistService;