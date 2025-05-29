import axios from 'axios';
import { getCurrentUser } from '@/services/authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const handleError = (error, defaultMessage) => {
    console.error(defaultMessage, error);
    throw new Error(
        error.response?.data?.message || defaultMessage
    );
};

const cartService = {
    /**
     * Obtiene el ID de sesión del localStorage
     * @returns {string|null}
     */
    getSessionId() {
        return localStorage.getItem('sessionId');
    },

    /**
     * Guarda el sessionId en localStorage
     * @param {string} sessionId
     */
    setSessionId(sessionId) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sessionId', sessionId);
        }
    },

    /**
     * Elimina el sessionId del localStorage
     */
    clearSessionId() {
        localStorage.removeItem('sessionId');
    },

    /**
     * Crea un nuevo carrito de compras
     * @param {number|null} userId - ID del usuario
     * @param {string|null} sessionId - ID de sesión
     * @returns {Promise<Object>} - Carrito creado
     */
    async createCart(userId = null, sessionId = null) {
        try {
            const response = await axios.post(`${API_URL}/cart/`, {
                userId,
                sessionId: sessionId || this.getSessionId()
            });

            // Guardar sessionId si es un nuevo carrito de invitado
            if (!userId && response.data.data?.session_id) {
                this.setSessionId(response.data.data.session_id);
            }

            return response.data.data || response.data;
        } catch (error) {
            return handleError(error, 'No se pudo crear el carrito');
        }
    },

    /**
     * Obtiene el carrito actual
     * @param {number|null} userId - ID del usuario
     * @param {string|null} sessionId - ID de sesión
     * @returns {Promise<Object|null>} - Carrito encontrado o null
     */
    async getCart(userId, sessionId) {
        console.log(userId);
        try {
            const response = await axios.get(`${API_URL}/cart/`, {
                params: {
                    userId,
                    sessionId: sessionId || this.getSessionId()
                }
            });

            const cart = response.data.data || response.data;
            console.log("Carro service" + cart.cartDetails);
            return {
                ...cart,
                cartDetails: cart.cartDetails || []
            };
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            return handleError(error, 'Error al obtener el carrito');
        }
    },


    /**
     * Obtiene los IDs de productos que han sido entregados al usuario
     * @returns {Promise<number[]>} - Array de IDs de productos entregados
     */
    async getDeliveredProductsIds() {
        try {
            const response = await axios.get(`${API_URL}/cart/delivered-products`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            return response.data.product_ids || [];
        } catch (error) {
            if (error.response?.status === 401) {
                // Token inválido o expirado
                console.error('Error de autenticación:', error);
                throw new Error('Por favor, inicia sesión nuevamente');
            }

            console.error('Error al obtener productos entregados:', error);
            throw new Error(
                error.response?.data?.message ||
                'Error al obtener los productos entregados'
            );
        }
    },

    /**
     * Asocia un carrito de sesión a un usuario registrado
     * @param {number} orderId - ID del pedido
     * @param {number} userId - ID del usuario
     * @param {string|null} sessionId - ID de sesión
     * @returns {Promise<Object>} - Carrito actualizado
     */
    async associateCartToUser(orderId, userId, sessionId = null) {
        try {
            const response = await axios.post(`${API_URL}/cart/associate`, {
                orderId,
                userId,
                sessionId: sessionId || this.getSessionId()
            });

            // Limpiar sessionId después de asociar
            if (response.data.success) {
                this.clearSessionId();
            }

            return response.data.data || response.data;
        } catch (error) {
            return handleError(error, 'Error al asociar carrito al usuario');
        }
    },

    /**
     * Obtiene el número total de productos en el carrito
     * @param {number|null} userId - ID del usuario (opcional)
     * @param {string|null} sessionId - ID de sesión (opcional)
     * @returns {Promise<number>} - Número total de productos en el carrito
     */
    async getCartItemCount(userId = null, sessionId = null) {
        try {
            const response = await axios.get(`${API_URL}/cart/count`, {
                params: {
                    userId,
                    sessionId: sessionId || this.getSessionId()
                }
            });

            return response.data.data?.count || 0;
        } catch (error) {
            // Si hay error (como carrito no encontrado), devolver 0
            if (error.response?.status === 404) {
                return 0;
            }
            console.error('Error al obtener conteo de productos:', error);
            throw new Error(
                error.response?.data?.message ||
                'Error al obtener el conteo de productos del carrito'
            );
        }
    },

    /**
     * Maneja la fusión de carritos cuando un usuario se autentica
     * @returns {Promise<Object|null>} - Carrito resultante
     */
    async handleCartMergeOnAuth() {
        try {
            const sessionId = this.getSessionId();
            const user = await getCurrentUser();

            if (!user || !sessionId) return null;

            // Obtener ambos carritos
            const [sessionCart, userCart] = await Promise.all([
                this.getCart(null, sessionId),
                this.getCart(user.user_id)
            ]);

            // Caso 1: Solo existe carrito de sesión
            if (sessionCart && !userCart) {
                console.log("solo uno");
                return await this.associateCartToUser(sessionCart.cart_id, user.user_id);
            }

            // Caso 2: Existen ambos carritos
            if (sessionCart && userCart) {
                console.log("estan ambos");
                await this.associateCartToUser(sessionCart.cart_id, user.user_id);
                return await this.getCart(user.user_id); // Obtener el carrito fusionado
            }

            // Caso 3: Solo existe carrito de usuario
            return userCart;
        } catch (error) {
            console.error('Error al fusionar carritos:', error);
            throw error;
        }
    },

    /**
     * Añade un producto al carrito
     * @param {number} orderId - ID del pedido
     * @param {number} productId - ID del producto
     * @param {number} quantity - Cantidad
     * @param {number} price - Precio unitario
     * @param {string|null} size - Tamaño seleccionado
     * @param {string|null} color - Color seleccionado
     * @returns {Promise<Object>} - Item añadido
     */
    async addToCart(orderId, productId, quantity, price, size = null, color = null, discount_percentage = null) {
        try {
            const response = await axios.post(`${API_URL}/cart/items`, {
                orderId,
                productId,
                quantity,
                price,
                size,
                color,
                discount_percentage // Nuevo parámetro añadido
            });
            return response.data.data || response.data;
        } catch (error) {
            return handleError(error, 'Error al añadir producto al carrito');
        }
    },

    /**
     * Obtiene los items del carrito
     * @param {number} orderId - ID del pedido
     * @returns {Promise<Array>} - Lista de items
     */
    async getCartItems(orderId) {
        try {
            const response = await axios.get(`${API_URL}/cart/items/${orderId}`);
            return response.data.data || response.data;
        } catch (error) {
            return handleError(error, 'Error al obtener items del carrito');
        }
    },

    /**
     * Actualiza la cantidad de un item
     * @param {number} itemId - ID del item
     * @param {number} quantity - Nueva cantidad
     * @param {string|null} size - Nuevo tamaño (opcional)
     * @param {string|null} color - Nuevo color (opcional)
     * @returns {Promise<Object>} - Item actualizado
     */
    async updateCartItem(itemId, quantity) {
        try {
            console.log("ID:" + itemId + " Cantidad: " + quantity)
            const response = await axios.put(
                `${API_URL}/cart/items/${itemId}/quantity`,
                { quantity } // Solo enviamos quantity según lo que espera el backend
            );
            return response.data; // El backend devuelve data directamente en la respuesta
        } catch (error) {
            return handleError(error, 'Error al actualizar cantidad del producto');
        }
    },

    /**
     * Elimina un item del carrito
     * @param {number} itemId - ID del item
     * @returns {Promise<void>}
     */
    async removeFromCart(itemId) {
        try {
            await axios.delete(`${API_URL}/cart/items/${itemId}`);
        } catch (error) {
            return handleError(error, 'Error al eliminar producto del carrito');
        }
    },

    /**
     * Obtiene el total del carrito
     * @param {number|null} userId - ID del usuario
     * @param {string|null} sessionId - ID de sesión
     * @returns {Promise<Object>} - { totalPrice, itemCount }
     */
    async getCartTotal(userId = null, sessionId = null) {
        try {
            const params = {};

            // Añadir userId si está disponible
            if (userId) {
                params.userId = userId;
            }

            // Usar sessionId proporcionado o obtener el de localStorage
            const effectiveSessionId = sessionId || this.getSessionId();
            if (effectiveSessionId) {
                params.sessionId = effectiveSessionId;
            }

            // Validación mínima de parámetros
            if (!params.userId && !params.sessionId) {
                throw new Error('Se requiere userId o sessionId para obtener el total del carrito');
            }

            const response = await axios.get(`${API_URL}/cart/total`, {
                params,
                validateStatus: (status) => status < 500
            });

            // Verificar si la respuesta tiene la estructura esperada
            if (!response.data || !Array.isArray(response.data.items)) {
                throw new Error('La respuesta del servidor no tiene el formato esperado');
            }

            // Procesar los datos para el frontend
            const processedData = {
                items: response.data.items.map(item => ({
                    id: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    originalPrice: item.originalPrice,
                    discountPercentage: item.discountPercentage,
                    finalPrice: item.discountedPrice,
                    subtotal: item.subtotal,
                    savings: item.savings
                })),
                summary: {
                    totalOriginal: response.data.items.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0),
                    totalDiscounted: response.data.items.reduce((sum, item) => sum + item.subtotal, 0),
                    totalSavings: response.data.items.reduce((sum, item) => sum + item.savings, 0)
                }
            };

            return processedData;

        } catch (error) {
            console.error('Error al obtener el total del carrito:', error);

            // Propagar el error con un mensaje amigable
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Error al cargar el carrito';
            throw new Error(errorMessage);
        }
    },

    /**
     * Actualiza el estado del pedido
     * @param {number} orderId - ID del pedido
     * @param {string} status - Nuevo estado
     * @returns {Promise<Object>} - Pedido actualizado
     */
    async updateOrderStatus(orderId, status) {
        try {
            const response = await axios.put(`${API_URL}/cart/${orderId}/status`, {
                status
            });
            return response.data.data || response.data;
        } catch (error) {
            return handleError(error, 'Error al actualizar estado del pedido');
        }
    },

    /**
     * Elimina un carrito
     * @param {number} orderId - ID del pedido
     * @returns {Promise<void>}
     */
    async deleteOrder(orderId) {
        try {
            await axios.delete(`${API_URL}/cart/${orderId}`);
        } catch (error) {
            return handleError(error, 'Error al eliminar el carrito');
        }
    },


    /**
     * Obtiene los productos del carrito actual del usuario
     * @returns {Promise<Array>} - Lista de productos del carrito
     */
    async getCurrentCartProducts() {
        try {
            const user = await getCurrentUser();
            const userId = user?.user_id || null;
            const sessionId = this.getSessionId();

            // Obtener el carrito actual
            const cart = await this.getCart(userId, sessionId);

            if (!cart) {
                return [];
            }

            // Obtener los items del carrito
            const cartItems = await this.getCartItems(cart.cart_id);
            return cartItems || [];

        } catch (error) {
            console.error('Error al obtener productos del carrito actual:', error);
            throw new Error('Error al obtener los productos del carrito');
        }
    },

    /**
     * Limpia todos los productos del carrito eliminándolos uno por uno
     * @returns {Promise<void>}
     */
    async clearCartByItems() {
        try {
            // Obtener los productos actuales del carrito
            const products = await this.getCurrentCartProducts();

            if (!products || products.length === 0) {
                console.log('El carrito ya está vacío');
                return;
            }

            // Eliminar cada producto individualmente
            const deletePromises = products.map(item =>
                this.removeFromCart(item.cart_detail_id)
            );

            // Esperar a que se eliminen todos los productos
            await Promise.all(deletePromises);

            console.log('Carrito limpiado exitosamente');

        } catch (error) {
            console.error('Error al limpiar el carrito:', error);
            throw new Error('No se pudo limpiar el carrito');
        }
    },
};

export default cartService;