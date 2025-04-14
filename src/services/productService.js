// src/services/productService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getProductById = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        throw error;
    }
};

export default {
    getProductById
};