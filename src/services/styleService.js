import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

/**
 * Obtener todos los estilos
 * @returns {Promise<Array>}
 */
const getAllStyles = async () => {
    try {
        const response = await axios.get(`${API_URL}/styles`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener estilos:', error);
        throw new Error(
            error.response?.data?.message || 'No se pudieron cargar los estilos.'
        );
    }
};

/**
 * Obtener estilo por ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getStyleById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/styles/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener estilo con ID ${id}:`, error);
        throw new Error(
            error.response?.data?.message || 'No se pudo cargar el estilo solicitado.'
        );
    }
};

/**
 * Crear un nuevo estilo con imágenes
 * @param {Object} styleData - Contiene name, description, category_id, products
 * @param {File[]} files - Array de archivos de imagen
 * @returns {Promise<Object>}
 */
const createStyle = async (styleData, files) => {
    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(styleData));
        files.forEach(file => formData.append('files', file));

        const response = await axios.post(`${API_URL}/styles`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al crear estilo:', error);
        throw new Error(
            error.response?.data?.message || 'No se pudo crear el estilo.'
        );
    }
};

/**
 * Actualizar un estilo
 * @param {number} id
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
const updateStyle = async (id, updateData) => {
    try {
        const response = await axios.put(`${API_URL}/styles/${id}`, updateData);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar estilo ${id}:`, error);
        throw new Error(
            error.response?.data?.message || 'No se pudo actualizar el estilo.'
        );
    }
};

/**
 * Eliminar estilo
 * @param {number} id
 * @returns {Promise<void>}
 */
const deleteStyle = async (id) => {
    try {
        await axios.delete(`${API_URL}/styles/${id}`);
    } catch (error) {
        console.error(`Error al eliminar estilo ${id}:`, error);
        throw new Error(
            error.response?.data?.message || 'No se pudo eliminar el estilo.'
        );
    }
};
/**
 * Obtener estilos por ID de categoría
 * @param {number} categoryId
 * @returns {Promise<Array>}
 */
export const getStylesByCategoryId = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/styles/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener estilos por categoría ${categoryId}:`, error);
        throw new Error(
            error.response?.data?.message || 'No se pudieron cargar los estilos por categoría.'
        );
    }
};

const styleService = {
    getAllStyles,
    getStyleById,
    createStyle,
    updateStyle,
    deleteStyle,
    getStylesByCategoryId,
};

export default styleService;
