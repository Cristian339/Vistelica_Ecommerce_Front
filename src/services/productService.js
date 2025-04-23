// src/services/productService.js
import axios from 'axios';

// URL base para las peticiones API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Obtiene todos los productos desde el servidor
 * @returns {Promise<Array>} Lista de productos
 */
export const getAll = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los productos. Inténtalo más tarde.'
        );
    }
};

/**
 * Obtiene un producto por su ID
 * @param {string} id - ID del producto
 * @returns {Promise<Object>} Datos del producto
 */
export const getById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener producto con ID ${id}:`, error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo cargar el producto solicitado'
        );
    }
};

/**
 * Obtiene las reseñas de un producto por su nombre
 * @param {number} productId - Nombre del producto
 * @returns {Promise<Array>} Lista de reseñas
 */
export const getReviewsByProductName = async (productId) => {
    try {
        const response = await axios.get(
            `${API_URL}/reviews/product/${productId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error al obtener reseñas por nombre de producto:", error);
        throw error;
    }
};

export const getReviewsByProductId = async (productId) => {
    try {
        const response = await axios.get(
            `${API_URL}/reviews/product/${productId}`
        );
        // Ajustamos para devolver solo el array de reseñas (response.data.data)
        return response.data.data || [];
    } catch (error) {
        console.error("Error al obtener reseñas por ID de producto:", error);
        throw error;
    }
};

export const createProductReview = async (productId, rating, reviewText, userid) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Debes iniciar sesión para dejar una reseña');
        }

        const response = await axios.post(
            `${API_URL}/review`,
            {
                user_id: userid,
                product_id: productId,
                rating,
                review_text: reviewText
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al crear reseña:", error);
        throw error;
    }
};

// Exportamos las funciones como un objeto para mantener compatibilidad
export default {
    getAll,
    getById,
    getReviewsByProductId,
    getReviewsByProductName,
    createProductReview
};