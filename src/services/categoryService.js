import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Ajusta según tu configuración

// Obtener todas las categorías
const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
        throw error;
    }
};

// Obtener una categoría específica por ID
const fetchCategoryById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al cargar la categoría con ID ${id}:`, error);
        throw error;
    }
};

// Crear una nueva categoría
const createCategory = async (name) => {
    try {
        const response = await axios.post(`${API_URL}/categories`, { name });
        return response.data;
    } catch (error) {
        console.error("Error al crear la categoría:", error);
        throw error;
    }
};

// Actualizar una categoría existente
const updateCategory = async (categoryId, name) => {
    try {
        const response = await axios.put(`${API_URL}/categories/${categoryId}`, { name });
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar la categoría con ID ${categoryId}:`, error);
        throw error;
    }
};

// Eliminar una categoría
const deleteCategory = async (categoryId) => {
    try {
        await axios.delete(`${API_URL}/categories/${categoryId}`);
    } catch (error) {
        console.error(`Error al eliminar la categoría con ID ${categoryId}:`, error);
        throw error;
    }
};

// Cambiar el estado de descartado de una categoría
const toggleDiscardCategory = async (categoryId) => {
    try {
        const response = await axios.patch(`${API_URL}/categories/${categoryId}/toggle-discard`);
        return response.data;
    } catch (error) {
        console.error(`Error al cambiar estado de descarte para categoría ${categoryId}:`, error);
        throw error;
    }
};

// Obtener subcategorías por categoría
const getSubcategoriesByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/categories/${categoryId}/subcategories`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener subcategorías para categoría ${categoryId}:`, error);
        throw error;
    }
};

// Crear una nueva subcategoría
const createSubcategory = async (name, categoryId) => {
    try {
        const response = await axios.post(`${API_URL}/subcategories`, { name, categoryId });
        return response.data;
    } catch (error) {
        console.error("Error al crear la subcategoría:", error);
        throw error;
    }
};

// Actualizar una subcategoría existente
const updateSubcategory = async (subcategoryId, name, categoryId) => {
    try {
        const response = await axios.put(`${API_URL}/subcategories/${subcategoryId}`, { name, categoryId });
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar la subcategoría con ID ${subcategoryId}:`, error);
        throw error;
    }
};

// Cambiar el estado de descartado de una subcategoría
const toggleDiscardSubcategory = async (subcategoryId) => {
    try {
        const response = await axios.patch(`${API_URL}/subcategories/${subcategoryId}/toggle-discard`);
        return response.data;
    } catch (error) {
        console.error(`Error al cambiar estado de descarte para subcategoría ${subcategoryId}:`, error);
        throw error;
    }
};

export default {
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleDiscardCategory,
    getSubcategoriesByCategory,
    createSubcategory,
    updateSubcategory,
    toggleDiscardSubcategory
};