import axios from 'axios';

// URL base para las peticiones API
const API_URL = `http://localhost:5000/api`;



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
    // Si es string, reemplazar comas por puntos para decimales
    if (typeof euros === 'string') {
        euros = euros.replace(',', '.');
    }

    // Convertir a número
    const amount = parseFloat(euros);


    console.log("EL AMOUNT ES: " + euros);


    // Verificar que es un número válido
    if (isNaN(amount)) {
        throw new Error('El valor proporcionado no es un número válido');
    }

    // Redondear a 2 decimales y convertir a céntimos
    const cents = Math.round(amount * 100);

    return cents;
};


const paymentService = {
    payWithCard,
    convertEurosToCents
};

export default paymentService;