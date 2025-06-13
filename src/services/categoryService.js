import axios from 'axios';

const API_URL = `http://localhost:5000/api`;

// Obtener todas las categorías con subcategorías anidadas
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

// Actualizar una categoría
const updateCategory = async (categoryId, name) => {
    try {
        const response = await axios.put(`${API_URL}/categories/${categoryId}`, { name });
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar la categoría con ID ${categoryId}:`, error);
        throw error;
    }
};

// Eliminar una categoría (si existe esta funcionalidad)
const deleteCategory = async (categoryId) => {
    try {
        await axios.delete(`${API_URL}/categories/${categoryId}`);
    } catch (error) {
        console.error(`Error al eliminar la categoría con ID ${categoryId}:`, error);
        throw error;
    }
};

// Cambiar el estado "descartado" de una categoría
const toggleDiscardCategory = async (categoryId) => {
    try {
        const response = await axios.patch(`${API_URL}/categories/${categoryId}/toggle-discard`);
        return response.data;
    } catch (error) {
        console.error(`Error al descartar la categoría con ID ${categoryId}:`, error);
        throw error;
    }
};

// Obtener subcategorías por categoría
const getSubcategoriesByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/categories/${categoryId}/subcategories`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener subcategorías para la categoría ${categoryId}:`, error);
        throw error;
    }
};

// Crear subcategoría
const createSubcategory = async (name, category_id, image_url_sub = '') => {
    try {
        const response = await axios.post(`${API_URL}/subcategories`, {
            name,
            category_id,
            image_url_sub
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear la subcategoría:", error);
        throw error;
    }
};

// Actualizar subcategoría
const updateSubcategory = async (subcategoryId, name, category_id, image_url_sub = '') => {
    try {
        const response = await axios.put(`${API_URL}/subcategories/${subcategoryId}`, {
            name,
            category_id,
            image_url_sub
        });
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar la subcategoría con ID ${subcategoryId}:`, error);
        throw error;
    }
};

// Cambiar estado de descarte de subcategoría
const toggleDiscardSubcategory = async (subcategoryId) => {
    try {
        const response = await axios.patch(`${API_URL}/subcategories/${subcategoryId}/toggle-discard`);
        return response.data;
    } catch (error) {
        console.error(`Error al descartar la subcategoría con ID ${subcategoryId}:`, error);
        throw error;
    }
};

// Obtener subcategoría por ID
const fetchSubcategoryById = async (subcategoryId) => {
    try {
        const response = await axios.get(`${API_URL}/subcategories/${subcategoryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al cargar la subcategoría con ID ${subcategoryId}:`, error);
        throw error;
    }
};

// eslint-disable-next-line import/no-anonymous-default-export
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
    toggleDiscardSubcategory,
    fetchSubcategoryById
};
