import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

// Función auxiliar para incluir el token de autenticación en las peticiones
const authConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

/**
 * Obtiene todas las direcciones del usuario autenticado
 * @returns {Promise<Array>} Lista de direcciones
 */
const getAddresses = async () => {
    try {
        const response = await axios.get(`${API_URL}/addresses`, authConfig());

        // Examinar la estructura de la respuesta
        console.log("Respuesta completa:", response.data);

        // Si la respuesta es un objeto pero no un array

        if (response.data && !Array.isArray(response.data)) {
            // Buscar el array de direcciones en propiedades comunes
            if (response.data.addresses) return response.data.addresses;
            if (response.data.data) return response.data.data;
            if (response.data.items) return response.data.items;
            if (response.data.results) return response.data.results;

            // Si no encontramos el array, devolver un array vacío
            console.error('Formato de respuesta inesperado:', response.data);
            return [];
        }

        return response.data || [];
    } catch (error) {
        console.error('Error al obtener direcciones:', error);
        return []; // Devolver array vacío en caso de error
    }
};

/**
 * Añade una nueva dirección para el usuario
 * @param {Object} addressData - Datos de la dirección
 * @returns {Promise<Object>} Dirección creada
 */
const addAddress = async (addressData) => {
    try {

        console.log(JSON.stringify(addressData));
        const response = await axios.post(
            `${API_URL}/addresses`,
            addressData,
            authConfig()
        );
        return response.data;
    } catch (error) {
        console.error('Error al añadir dirección:', error);
        throw error.response?.data || error;
    }
};

/**
 * Actualiza una dirección existente
 * @param {string|number} addressId - ID de la dirección a actualizar
 * @param {Object} addressData - Datos actualizados de la dirección
 * @returns {Promise<Object>} Dirección actualizada
 */
const updateAddress = async (addressId, addressData) => {
    try {
        const response = await axios.put(
            `${API_URL}/addresses/${addressId}`,
            addressData,
            authConfig()
        );
        return response.data;
    } catch (error) {
        console.error('Error al actualizar dirección:', error);
        throw error.response?.data || error;
    }
};

/**
 * Elimina una dirección existente
 * @param {string|number} addressId - ID de la dirección a eliminar
 * @returns {Promise<Object>} Respuesta de confirmación
 */
const deleteAddress = async (addressId) => {
    try {
        const response = await axios.delete(
            `${API_URL}/addresses/${addressId}`,
            authConfig()
        );
        return response.data;
    } catch (error) {
        console.error('Error al eliminar dirección:', error);
        throw error.response?.data || error;
    }
};

/**
 * Establece una dirección como predeterminada
 * @param {string|number} addressId - ID de la dirección a establecer como predeterminada
 * @returns {Promise<Object>} Respuesta de confirmación
 */
const setDefaultAddress = async (addressId) => {
    try {
        const response = await axios.patch(
            `${API_URL}/addresses/${addressId}/default`,
            {},
            authConfig()
        );
        return response.data;
    } catch (error) {
        console.error('Error al establecer dirección predeterminada:', error);
        throw error.response?.data || error;
    }
};

/**
 * Obtiene la dirección predeterminada del usuario
 * @returns {Promise<Object>} Dirección predeterminada
 */
const getDefaultAddress = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/addresses/default`,
            authConfig()
        );
        return response.data;
    } catch (error) {
        console.error('Error al obtener la dirección predeterminada:', error);
        throw error.response?.data || error;
    }
};

// Crear el objeto del servicio
const addressService = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress
};

export default addressService;