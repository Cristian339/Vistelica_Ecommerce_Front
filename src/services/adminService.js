import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

const getClients = async () => {
    const response = await axios.get(`${API_URL}/admin/clients`);
    // Transformar los datos para incluir el nombre completo directamente
    return response.data.map(client => ({
        ...client,
        fullName: client.profile ? `${client.profile.name} ${client.profile.lastName}` : 'Sin nombre'
    }));
};

const getAllOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/orders`);
        return response.data;
    } catch (error) {
        console.error('Error getting all orders:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener las órdenes');
    }
};

const markOrderAsShipped = async (orderId) => {
    try {
        const response = await axios.post(`${API_URL}/admin/orders/${orderId}/shipped`);
        return response.data;
    } catch (error) {
        console.error('Error marcando pedido como enviado:', error);
        throw new Error(error.response?.data?.message || 'No se pudo marcar como enviado');
    }
};

const markOrderAsDelivered = async (orderId) => {
    try {
        const response = await axios.post(`${API_URL}/admin/orders/${orderId}/delivered`);
        return response.data;
    } catch (error) {
        console.error('Error marcando pedido como entregado:', error);
        throw new Error(error.response?.data?.message || 'No se pudo marcar como entregado');
    }
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

const createProduct = async (formData) => {
    try {
        // 3. Enviar petición
        const response = await axios.post(`${API_URL}/products`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);

        // Mejor manejo de errores
        if (error.response) {
            // Error del servidor (4xx, 5xx)
            throw new Error(error.response.data.message || 'Failed to create product');
        } else if (error.request) {
            // Error de red (no llegó al servidor)
            throw new Error('Network error - please check your connection');
        } else {
            // Error en la validación o código
            throw error;
        }
    }
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

// Obtener todas las reseñas reportadas (agrupadas por reseña)
const getReportedReviews = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/reviews/reported`);
        return response.data;
    } catch (error) {
        console.error('Error getting reported reviews:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener reseñas reportadas');
    }
};

// Obtener todos los reportes individuales (vista detallada)
const getAllReports = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/reviews/reports`);
        return response.data;
    } catch (error) {
        console.error('Error getting all reports:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener todos los reportes');
    }
};

const getRefundsInReview = async () => {
    try {
        const response = await axios.get(`${API_URL}/refunds/review`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.data || [];
    } catch (error) {
        console.error('Error al obtener devoluciones en revisión:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar las devoluciones en revisión'
        );
    }
};

const updateRefundStatus = async (orderDetailId, status, rejectionReason) => {
    try {
        const response = await axios.put(
            `${API_URL}/refunds/${orderDetailId}/status`,
            {
                status,
                rejection_reason: rejectionReason
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error al actualizar estado de devolución:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo actualizar el estado de la devolución'
        );
    }
};

// Eliminar una reseña reportada (y todos sus reportes)
const deleteReview = async (reviewId) => {
    try {
        const response = await axios.delete(`${API_URL}/admin/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw new Error(error.response?.data?.message || 'Error al eliminar la reseña');
    }
};

// Eliminar un reporte específico (mantener la reseña)
const deleteReport = async (reportId) => {
    try {
        const response = await axios.delete(`${API_URL}/admin/reports/${reportId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting report:', error);
        throw new Error(error.response?.data?.message || 'Error al eliminar el reporte');
    }
};

// Eliminar todos los reportes de una reseña específica (mantener la reseña)
const deleteReportsForReview = async (reviewId) => {
    try {
        const response = await axios.delete(`${API_URL}/admin/reviews/${reviewId}/reports`);
        return response.data;
    } catch (error) {
        console.error('Error deleting reports for review:', error);
        throw new Error(error.response?.data?.message || 'Error al eliminar reportes de la reseña');
    }
};

// Crear el objeto del servicio
const adminService = {
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
    getSubcategoriesByCategory,
    markOrderAsDelivered,
    markOrderAsShipped,
    getReportedReviews,
    getAllReports,
    deleteReview,
    deleteReport,
    deleteReportsForReview,
    updateRefundStatus,
    getRefundsInReview
};

export default adminService;