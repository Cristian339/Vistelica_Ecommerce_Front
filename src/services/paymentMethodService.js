import axios from 'axios';
import { getCurrentUser } from '@/services/authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const handleError = (error, defaultMessage) => {
    console.error(defaultMessage, error);
    throw new Error(
        error.response?.data?.message || defaultMessage
    );
};

const paymentMethodService = {
    /**
     * Obtiene el token de autenticación del localStorage
     * @returns {string|null}
     */
    getAuthToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },

    /**
     * Crea un nuevo método de pago
     * @param {Object} data - Datos del método de pago
     * @returns {Promise<Object>} - Método de pago creado
     */
    async createPaymentMethod(data) {
        try {
            const token = this.getAuthToken();
            if (!token) {
                throw new Error('Usuario no autenticado');
            }

            const response = await axios.post(`${API_URL}/payment-methods`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data.data || response.data;
        } catch (error) {
            return handleError(error, 'No se pudo crear el método de pago');
        }
    },

    /**
     * Obtiene todos los métodos de pago del usuario
     * @returns {Promise<Array>} - Lista de métodos de pago
     */
    async getUserPaymentMethods() {
        try {
            const token = this.getAuthToken();
            if (!token) {
                throw new Error('Usuario no autenticado');
            }

            const response = await axios.get(`${API_URL}/payment-methods`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data.data || response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return [];
            }
            return handleError(error, 'Error al obtener los métodos de pago');
        }
    },



    /**
     * Actualiza un método de pago existente
     * @param {number} methodId - ID del método de pago a actualizar
     * @param {Object} data - Datos a actualizar
     * @returns {Promise<Object>} - Método de pago actualizado
     */
    async updatePaymentMethod(methodId, data) {
        try {
            const token = this.getAuthToken();
            if (!token) {
                throw new Error('Usuario no autenticado');
            }

            const response = await axios.put(
                `${API_URL}/payment-methods/${methodId}`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.data || response.data;
        } catch (error) {
            return handleError(error, 'Error al actualizar el método de pago');
        }
    },




    /**
     * Establece un método de pago como predeterminado
     * @param {number} methodId - ID del método de pago
     * @returns {Promise<Object>} - Método de pago actualizado
     */
    async setDefaultPaymentMethod(methodId) {
        try {
            const token = this.getAuthToken();
            if (!token) {
                throw new Error('Usuario no autenticado');
            }

            const response = await axios.put(
                `${API_URL}/payment-methods/${methodId}/default`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            return response.data.data || response.data;
        } catch (error) {
            return handleError(error, 'Error al establecer método predeterminado');
        }
    },

    /**
     * Elimina un método de pago
     * @param {number} methodId - ID del método de pago
     * @returns {Promise<void>}
     */
    async deletePaymentMethod(methodId) {
        try {
            const token = this.getAuthToken();
            if (!token) {
                throw new Error('Usuario no autenticado');
            }

            await axios.delete(`${API_URL}/payment-methods/${methodId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            return handleError(error, 'Error al eliminar el método de pago');
        }
    },

    /**
     * Obtiene el método de pago predeterminado del usuario
     * @returns {Promise<Object|null>} - Método de pago predeterminado
     */
    async getDefaultPaymentMethod() {
        try {
            const token = this.getAuthToken();
            if (!token) {
                throw new Error('Usuario no autenticado');
            }

            const response = await axios.get(`${API_URL}/payment-methods/default`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data.data || response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            return handleError(error, 'Error al obtener el método predeterminado');
        }
    },

    /**
     * Procesa un pago usando Stripe
     * @param {number} amount - Monto a pagar (en centavos)
     * @param {string|null} paymentMethodId - ID del método de pago (opcional para Google Pay)
     * @returns {Promise<Object>} - Resultado del pago
     */
    async processPayment(amount, paymentMethodId = null) {
        try {
            const token = this.getAuthToken();
            if (!token) {
                throw new Error('Usuario no autenticado');
            }

            const response = await axios.post(`${API_URL}/checkout`, {
                amount,
                id: paymentMethodId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            return handleError(error, 'Error al procesar el pago');
        }
    },

    /**
     * Formatea los datos de la tarjeta para mostrarlos de manera segura
     * @param {Object} paymentMethod - Método de pago
     * @returns {Object} - Datos formateados
     */
    formatPaymentMethodDisplay(paymentMethod) {
        if (!paymentMethod) return {};

        const formatted = {
            id: paymentMethod.payment_method_id,
            type: paymentMethod.type,
            provider: paymentMethod.provider,
            isDefault: paymentMethod.is_default
        };

        if (paymentMethod.type.includes('card')) {
            formatted.display = `${paymentMethod.provider} •••• ${paymentMethod.card_last_four}`;
            if (paymentMethod.expiry_month && paymentMethod.expiry_year) {
                formatted.expiry = `${paymentMethod.expiry_month.toString().padStart(2, '0')}/${paymentMethod.expiry_year.toString().slice(-2)}`;
            }
            if (paymentMethod.card_holder_name) {
                formatted.holderName = paymentMethod.card_holder_name;
            }
        } else if (paymentMethod.type === 'paypal') {
            formatted.display = 'PayPal';
        }

        return formatted;
    }
};

export default paymentMethodService;