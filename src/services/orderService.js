import axios from 'axios';

const API_URL = `http://localhost:5000/api`;

const createOrder = async (orderData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/order/create`, orderData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);

        // Mejor manejo de errores
        let errorMessage = 'No se pudo crear el pedido. Inténtalo más tarde.';

        if (error.response) {
            // Errores de validación del backend
            if (error.response.data.errors) {
                errorMessage = Object.values(error.response.data.errors).join('\n');
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            }
        } else if (error.request) {
            errorMessage = 'No se recibió respuesta del servidor';
        }

        throw new Error(errorMessage);
    }
};


const getOrdersByUser = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/order/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw new Error(
            error.response?.data?.message || 'No se pudieron cargar los pedidos. Inténtalo más tarde.'
        );
    }
};

const getOrderDetails = async (orderId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/order/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw new Error(
            error.response?.data?.message || 'No se pudieron cargar los detalles del pedido.'
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



export const orderService = {
    createOrder,
    getOrdersByUser,
    getOrderDetails,
    updateOrderStatus,
    cancelOrder,

};