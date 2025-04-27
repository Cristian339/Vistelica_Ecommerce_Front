import axios from 'axios';

// URL base para las peticiones API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Obtiene todos los productos desde el servidor
 * @returns {Promise<Array>} Lista de productos
 */
const getAll = async () => {
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
const getById = async (id) => {
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
 * Obtiene productos filtrados por categoría y subcategoría
 * @param {string} categoryId - ID de la categoría
 * @param {string} subcategoryId - ID de la subcategoría
 * @returns {Promise<Array>} Lista de productos filtrados
 */
const getByCategoryAndSubcategory = async (categoryId, subcategoryId) => {
    try {
        const response = await axios.get(`${API_URL}/products/category/${categoryId}/subcategory/${subcategoryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener productos por categoría ${categoryId} y subcategoría ${subcategoryId}:`, error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los productos para esta categoría y subcategoría.'
        );
    }
};

/**
 * Obtiene todas las imágenes principales de los productos
 * @returns {Promise<Array>} Lista de imágenes principales con sus IDs de producto
 */
const getMainProductImages = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/images/main`);
        console.log("Respuesta de imágenes principales:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener imágenes principales de productos:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar las imágenes de los productos.'
        );
    }
};

/**
 * Obtiene la imagen principal de un producto específico
 * @param {string} productId - ID del producto
 * @returns {Promise<Object>} Datos de la imagen principal
 */
const getMainImageByProductId = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/products/${productId}/image/main`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener imagen principal del producto ${productId}:`, error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo cargar la imagen del producto.'
        );
    }
};

const productService = {
    getAll,
    getById,
    getByCategoryAndSubcategory,
    getMainProductImages,
    getMainImageByProductId
};

export default productService;