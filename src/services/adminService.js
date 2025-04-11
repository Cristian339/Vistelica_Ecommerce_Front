import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Ajusta según tu configuración

const getClients = async () => {
    const response = await axios.get(`${API_URL}/admin/clients`);
    // Transformar los datos para incluir el nombre completo directamente
    return response.data.map(client => ({
        ...client,
        fullName: client.profile ? `${client.profile.name} ${client.profile.lastName}` : 'Sin nombre'
    }));
};

const getSuppliers = async () => {
    const response = await axios.get(`${API_URL}/suppliers`);
    return response.data;
};


const banUser = async (userId, reason) => {
    try {
        // Validación adicional en el cliente
        if (!reason) {
            throw new Error('Debe incluir razon del baneo');
        }

        const response = await axios.post(`${API_URL}/admin/ban/${userId}`, {
            reason: reason.trim()
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error banning user:', error);
        throw new Error(error.response?.data?.message || 'Error al banear usuario');
    }
};

const unbanUser = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/admin/unban/${userId}`, {}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error unbanning user:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to unban user');
    }
};

// Métodos para pedidos
const getAllOrders = async () => {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
};

const deleteOrder = async (orderId) => {
    await axios.delete(`${API_URL}/orders/${orderId}`);
};

// Métodos para proveedores
const createSupplier = async (supplierData) => {
    const response = await axios.post(`${API_URL}/suppliers`, supplierData);
    return response.data;
};


const toggleDiscardProduct = async (productId) => {
    const response = await axios.patch(`${API_URL}/products/${productId}/discard`);

    // Asegurarnos de que la respuesta incluya las relaciones completas
    if (response.data && !response.data.category) {
        // Si no vienen las relaciones, hacemos una nueva petición para obtener el producto completo
        const fullProduct = await axios.get(`${API_URL}/products/${productId}`);
        return fullProduct.data;
    }

    return response.data;
};

const updateSupplier = async (id, supplierData) => {
    const response = await axios.put(`${API_URL}/suppliers/${id}`, supplierData);
    return response.data;
};

const deleteSupplier = async (id) => {
    await axios.delete(`${API_URL}/suppliers/${id}`);
};

const searchSuppliersByName = async (name) => {
    const response = await axios.get(`${API_URL}/suppliers/search?name=${name}`);
    return response.data;
};

const getAllProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};

const createProduct = async (productData) => {
    const formData = new FormData();

    // Agregar campos del producto al FormData
    Object.keys(productData).forEach(key => {
        if (key !== 'image') {
            formData.append(key, productData[key]);
        }
    });

    // Si hay imagen, agregarla
    if (productData.image) {
        formData.append('image', productData.image);
    }

    const response = await axios.post(`${API_URL}/products`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

const updateProduct = async (id, productData) => {
    const response = await axios.put(`${API_URL}/products/${id}`, productData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}/products/${id}`);
};

const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
};

const getProductsByCategory = async (categoryId, subcategoryId) => {
    const response = await axios.get(`${API_URL}/products/category/${categoryId}/subcategory/${subcategoryId}`);
    return response.data;
};



const getCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
};

const createCategory = async (name) => {
    const response = await axios.post(`${API_URL}/categories`, { name });
    return response.data;
};

const updateCategory = async (categoryId, name) => {
    const response = await axios.put(`${API_URL}/categories/${categoryId}`, { name });
    return response.data;
};

const deleteCategory = async (categoryId) => {
    await axios.delete(`${API_URL}/categories/${categoryId}`);
};

const toggleDiscardCategory = async (categoryId) => {
    const response = await axios.patch(`${API_URL}/categories/${categoryId}/toggle-discard`);
    return response.data;
};

// Métodos para Subcategorías
const createSubcategory = async (name, categoryId) => {
    const response = await axios.post(`${API_URL}/subcategories`, { name, categoryId });
    return response.data;
};

const updateSubcategory = async (subcategoryId, name, categoryId) => {
    const response = await axios.put(`${API_URL}/subcategories/${subcategoryId}`, { name, categoryId });
    return response.data;
};

const toggleDiscardSubcategory = async (subcategoryId) => {
    const response = await axios.patch(`${API_URL}/subcategories/${subcategoryId}/toggle-discard`);
    return response.data;
};

const getSubcategoriesByCategory = async (categoryId) => {
    const response = await axios.get(`${API_URL}/categories/${categoryId}/subcategories`);
    return response.data;
};

export default {
    getClients,
    getSuppliers,
    getCategories,
    banUser,
    unbanUser,
    getAllOrders,
    deleteOrder,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    toggleDiscardProduct,
    searchSuppliersByName,
    // Métodos de productos
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleDiscardCategory,
    createSubcategory,
    updateSubcategory,
    toggleDiscardSubcategory,
    getSubcategoriesByCategory
};