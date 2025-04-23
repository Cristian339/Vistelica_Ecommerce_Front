// src/services/cartService.js
import axios from 'axios';

// URL base para las peticiones API
const API_URL = 'http://localhost:5000/api';

/**
 * Crea un nuevo carrito de compras
 * @param {number|null} userId - ID del usuario (opcional)
 * @param {string|null} sessionId - ID de sesión (opcional)
 * @returns {Promise<Object>} Datos del carrito creado
 */
export const createCart = async (userId = null, sessionId = null) => {
    try {
        const response = await axios.post(`${API_URL}/cart/`, {
            userId,
            sessionId
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo crear el carrito. Inténtalo más tarde.'
        );
    }
};

/**
 * Obtiene el carrito actual del usuario o sesión
 * @param {number|null} userId - ID del usuario (opcional)
 * @param {string|null} sessionId - ID de sesión (opcional)
 * @returns {Promise<Object>} Datos del carrito
 */
export const getCart = async (userId = null, sessionId = null) => {
    try {
        const response = await axios.get(`${API_URL}/cart/`, {
            params: { userId, sessionId }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo cargar el carrito. Inténtalo más tarde.'
        );
    }
};

/**
 * Asocia un carrito de sesión a un usuario registrado
 * @param {number} orderId - ID del pedido/carrito
 * @param {number} userId - ID del usuario
 * @param {string} sessionId - ID de sesión actual
 * @returns {Promise<Object>} Datos del carrito actualizado
 */
export const associateCartToUser = async (orderId, userId, sessionId) => {
    try {
        const response = await axios.post(`${API_URL}/cart/associate`, {
            orderId,
            userId,
            sessionId
        });
        return response.data;
    } catch (error) {
        console.error("Error al asociar carrito al usuario:", error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo asociar el carrito al usuario'
        );
    }
};

/**
 * Añade un producto al carrito
 * @param {number} orderId - ID del pedido/carrito
 * @param {number} productId - ID del producto
 * @param {number} quantity - Cantidad
 * @param {number} price - Precio unitario
 * @returns {Promise<Object>} Detalle del pedido creado
 */
export const addToCart = async (orderId, productId, quantity, price) => {
    try {
        const response = await axios.post(`${API_URL}/cart/items`, {
            orderId,
            productId,
            quantity,
            price
        });
        return response.data;
    } catch (error) {
        console.error("Error al añadir producto al carrito:", error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo añadir el producto al carrito'
        );
    }
};

/**
 * Obtiene los items del carrito
 * @param {number} orderId - ID del pedido/carrito
 * @returns {Promise<Array>} Lista de items en el carrito
 */
export const getCartItems = async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/cart/items/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener items del carrito:", error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los items del carrito'
        );
    }
};

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {number} itemId - ID del item/detalle
 * @param {number} quantity - Nueva cantidad
 * @returns {Promise<Object>} Item actualizado
 */
export const updateCartItemQuantity = async (itemId, quantity) => {
    try {
        const response = await axios.put(`${API_URL}/cart/items/${itemId}/quantity`, {
            quantity
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar cantidad en el carrito:", error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo actualizar la cantidad del producto'
        );
    }
};

/**
 * Elimina un producto del carrito
 * @param {number} itemId - ID del item/detalle
 * @returns {Promise<void>}
 */
export const removeFromCart = async (itemId) => {
    try {
        await axios.delete(`${API_URL}/cart/items/${itemId}`);
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo eliminar el producto del carrito'
        );
    }
};

/**
 * Obtiene el total del carrito y conteo de items
 * @param {number|null} userId - ID del usuario (opcional)
 * @param {string|null} sessionId - ID de sesión (opcional)
 * @returns {Promise<Object>} { totalPrice, itemCount, orderDetails }
 */
export const getCartTotal = async (userId = null, sessionId = null) => {
    try {
        const response = await axios.get(`${API_URL}/cart/total`, {
            params: { userId, sessionId }
        });
        return response.data;
    } catch (error) {
        console.error("Error al calcular total del carrito:", error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo calcular el total del carrito'
        );
    }
};

/**
 * Actualiza el estado del pedido (ej. "completado")
 * @param {number} orderId - ID del pedido
 * @param {string} status - Nuevo estado
 * @returns {Promise<Object>} Pedido actualizado
 */
export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axios.put(`${API_URL}/cart/${orderId}/status`, {
            status
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar estado del pedido:", error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo actualizar el estado del pedido'
        );
    }
};

export default {
    createCart,
    getCart,
    associateCartToUser,
    addToCart,
    getCartItems,
    updateCartItemQuantity,
    removeFromCart,
    getCartTotal,
    updateOrderStatus
};