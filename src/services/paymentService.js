import axios from 'axios';

// URL base para las peticiones API
const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;



const payWithCard = async (id,amount) => {
    try {
        const response = await axios.post(`${API_URL}/checkout`, {
            id,
            amount
        });

        console.log(response.data);
        return response.data.success;
    } catch (error) {
        console.log(error);
        return false;
    }
};

/**
 * Convierte una cantidad en euros a céntimos (para Stripe)
 * @param {number|string} euros - Cantidad en euros (ej. 10.99 o "15,99")
 * @returns {number} Cantidad en céntimos (ej. 1099)
 */
const convertEurosToCents = (euros) => {
    if (euros === undefined || euros === null) {
        throw new Error('No se proporcionó una cantidad válida');
    }

    if (typeof euros === 'string') {
        euros = euros.replace(',', '.');
    }

    const amount = parseFloat(euros);
    console.log("EL AMOUNT ES:", euros);

    if (isNaN(amount)) {
        throw new Error('El valor proporcionado no es un número válido');
    }

    return Math.round(amount * 100);
};



const paymentService = {
    payWithCard,
    convertEurosToCents
};

export default paymentService;