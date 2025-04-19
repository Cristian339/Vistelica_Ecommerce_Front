// src/services/productService.js
import axios from 'axios';

// URL base para las peticiones API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


export const getProductById = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        throw error;
    }
};

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

export const getSizesByProductName = async (productName) => {
    try {
        const response = await axios.get(`${API_URL}/products/${encodeURIComponent(productName)}/sizes`);
        return response.data.sizes;
    } catch (error) {
        console.error("Error al obtener tallas por nombre de producto:", error);
        throw error;
    }
};

export const getColorsByProductAndSize = async (productName, size) => {
    try {
        const response = await axios.get(
            `${API_URL}/products/${encodeURIComponent(productName)}/${encodeURIComponent(size)}/colors`
        );
        return response.data.colors;
    } catch (error) {
        console.error("Error al obtener colores por producto y talla:", error);
        throw error;
    }
};

export const getProductByNameSizeAndColor = async (productName, size, color) => {
    try {
        const response = await axios.get(
            `${API_URL}/products/${encodeURIComponent(productName)}/${encodeURIComponent(size)}/${encodeURIComponent(color)}`
        );
        return response.data;
    } catch (error) {
        console.error("Error al obtener producto por nombre, talla y color:", error);
        throw error;
    }
};

export const getProductVariantsByName = async (productName) => {
    try {
        const response = await axios.get(
            `${API_URL}/products/${encodeURIComponent(productName)}/variants`
        );
        return response.data;
    } catch (error) {
        console.error("Error al obtener variantes de producto:", error);
        throw error;
    }
};

export const getReviewsByProductName = async (productName) => {
    try {
        const response = await axios.get(
            `${API_URL}/reviews/product/name/${encodeURIComponent(productName)}`
        );
        return response.data;
    } catch (error) {
        console.error("Error al obtener reseñas por nombre de producto:", error);
        throw error;
    }
};

export default {
    getProductById,
    getSizesByProductName,
    getColorsByProductAndSize,
    getProductByNameSizeAndColor,
    getProductVariantsByName,
    getReviewsByProductName,
    getAll,
    getById
};