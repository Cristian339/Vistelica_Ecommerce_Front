import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const createOrder = async (userId, products) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/orders`, {
            userId,
            products: products.map(p => ({
                productId: p.id,
                quantity: p.quantity,
                price: p.price
            }))
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo crear el pedido. Inténtalo más tarde.'
        );
    }
};

const getOrdersByUser = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/orders/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los pedidos. Inténtalo más tarde.'
        );
    }
};

const getOrderDetails = async (orderId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/orders/${orderId}/details`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los detalles del pedido.'
        );
    }
};

const updateOrderStatus = async (orderId, status) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `${API_URL}/orders/${orderId}/status`,
            { status },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo actualizar el estado del pedido.'
        );
    }
};

const cancelOrder = async (orderId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error canceling order:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudo cancelar el pedido. Inténtalo más tarde.'
        );
    }
};

const getAllOrders = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw new Error(
            error.response?.data?.message ||
            'No se pudieron cargar los pedidos. Inténtalo más tarde.'
        );
    }
};

export const orderService = {
    createOrder,
    getOrdersByUser,
    getOrderDetails,
    updateOrderStatus,
    cancelOrder,
    getAllOrders
};