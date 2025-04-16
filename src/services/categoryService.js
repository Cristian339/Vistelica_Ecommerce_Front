import axios from 'axios';

// URL base para las peticiones API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Obtiene todas las categorías con sus subcategorías
 * @returns {Promise<Array>} Lista de categorías con subcategorías
 */
const getAllWithSubcategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar las categorías. Inténtalo más tarde.'
        );
    }
};

/**
 * Obtiene una categoría específica por su ID
 * @param {string} id - ID de la categoría
 * @returns {Promise<Object>} Datos de la categoría con subcategorías
 */
const getById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener categoría con ID ${id}:`, error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo cargar la categoría solicitada'
        );
    }
};

/**
 * Crea una nueva subcategoría
 * @param {Object} subcategoryData - Datos de la subcategoría a crear
 * @returns {Promise<Object>} Datos de la subcategoría creada
 */
const createSubcategory = async (subcategoryData) => {
    try {
        const response = await axios.post(`${API_URL}/subcategories`, subcategoryData);
        return response.data;
    } catch (error) {
        console.error('Error al crear subcategoría:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo crear la subcategoría. Inténtalo más tarde.'
        );
    }
};

/**
 * Obtiene todas las subcategorías de una categoría específica
 * @param {string} categoryId - ID de la categoría padre
 * @returns {Promise<Array>} Lista de subcategorías
 */
const getSubcategoriesByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/categories/${categoryId}/subcategories`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener subcategorías para categoría ${categoryId}:`, error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar las subcategorías. Inténtalo más tarde.'
        );
    }
};

const categoryService = {
    getAllWithSubcategories,
    getById,
    createSubcategory,
    getSubcategoriesByCategory
};

export default categoryService;