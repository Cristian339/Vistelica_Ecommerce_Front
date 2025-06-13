import axios from 'axios';
import {
    getAuth,
    signInWithPopup,
    getAdditionalUserInfo,
    signOut
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "./firebase";

const API_URL = `http://localhost:5000/api`;

// ========== MÉTODOS DE REGISTRO CON VERIFICACIÓN ==========

/**
 * Inicia el proceso de registro enviando código de verificación
 * @param {Object} userData - Datos del usuario a registrar
 * @returns {Promise<Object>} - Respuesta con registrationToken
 */
export const initiateRegistration = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/initiate-registration`, userData);
        return response.data;
    } catch (error) {
        console.error("Error iniciando registro:", error);
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al iniciar el registro');
        }
        throw error;
    }
};

/**
 * Verifica el código y completa el registro del usuario
 * @param {string} registrationToken - Token de registro recibido
 * @param {string} verificationCode - Código de verificación del email
 * @returns {Promise<Object>} - Datos del usuario registrado y token JWT
 */
export const verifyRegistration = async (registrationToken, verificationCode) => {
    try {
        const response = await axios.post(`${API_URL}/verify-registration`, {
            registrationToken,
            verificationCode
        });

        // Si el registro es exitoso, guardamos el token JWT
        if (response.data.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response.data;
    } catch (error) {
        console.error("Error verificando registro:", error);
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al verificar el registro');
        }
        throw error;
    }
};

/**
 * Reenvía el código de verificación
 * @param {string} registrationToken - Token de registro
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const resendVerificationCode = async (registrationToken) => {
    try {
        const response = await axios.post(`${API_URL}/resend-verification-code`, {
            registrationToken
        });
        return response.data;
    } catch (error) {
        console.error("Error reenviando código:", error);
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al reenviar código de verificación');
        }
        throw error;
    }
};

/**
 * Cancela un proceso de registro pendiente
 * @param {string} registrationToken - Token de registro a cancelar
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const cancelRegistration = async (registrationToken) => {
    try {
        const response = await axios.post(`${API_URL}/cancel-registration`, {
            registrationToken
        });
        return response.data;
    } catch (error) {
        console.error("Error cancelando registro:", error);
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al cancelar registro');
        }
        throw error;
    }
};

/**
 * Obtiene el estado de un registro pendiente
 * @param {string} registrationToken - Token de registro
 * @returns {Promise<Object>} - Estado del registro
 */
export const getRegistrationStatus = async (registrationToken) => {
    try {
        const response = await axios.get(`${API_URL}/registration-status/${registrationToken}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo estado de registro:", error);
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al obtener estado del registro');
        }
        throw error;
    }
};

// ========== MÉTODO DEPRECADO (mantener para compatibilidad) ==========

/**
 * Registra un nuevo usuario en el sistema (DEPRECADO)
 * @param {Object} userData - Datos del usuario a registrar
 * @returns {Promise} - Datos del usuario registrado
 * @deprecated Usar initiateRegistration + verifyRegistration en su lugar
 */
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Error registrando usuario (método deprecado):", error);
        throw error;
    }
};



/**
 * Obtiene los encabezados de autenticación para las peticiones HTTP
 * @returns {Object} Objeto con los headers incluyendo el token si existe
 */
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) return {};

    return {
        Authorization: `Bearer ${token}`
    };
};

/**
 * Obtiene los datos del usuario actualmente autenticado
 * @returns {Promise<Object|null>} - Datos del usuario o null si no hay sesión
 */
export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await axios.post(`${API_URL}/user`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error obteniendo usuario:", error);
        localStorage.removeItem('token'); // Limpiamos token si hay error
        return null;
    }
};

/**
 * Verifica si el usuario actual tiene rol de administrador
 * @returns {Promise<boolean>} - True si el usuario es admin, false en caso contrario
 */
export const isAdmin = async () => {
    const user = await getCurrentUser();
    return user?.role === 0;
};

/**
 * Autentica al usuario con sus credenciales
 * @param {Object} credentials - Credenciales del usuario (email y password)
 * @returns {Promise} - Datos del usuario y token de autenticación
 */
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Verifica si un email está disponible para registro
 * @param {string} email - Email a verificar
 * @returns {Promise} - Respuesta sobre disponibilidad del email
 */
export const checkEmailAvailability = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/check-email`, { email });
        return response.data;
    } catch (error) {
        console.error("Error verificando email:", error);
        throw error;
    }
};

/**
 * Verifica si un número telefónico está disponible para registro
 * @param {string} phone - Número telefónico a verificar
 * @returns {Promise} - Respuesta sobre disponibilidad del teléfono
 */
export const checkPhoneAvailability = async (phone) => {
    try {
        const response = await axios.post(`${API_URL}/check-phone`, { phone });
        return response.data;
    } catch (error) {
        console.error("Error verificando teléfono:", error);
        throw error;
    }
};

/**
 * Solicita un restablecimiento de contraseña
 * @param {string} email - Correo electrónico del usuario
 * @returns {Promise} - Respuesta del servidor
 */
export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(
            `${API_URL}/reset-password-request`,
            { email }
        );
        return response.data;
    } catch (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error);
        if (error.response && error.response.status === 404) {
            throw new Error(error.response.data.error || "No existe una cuenta con este correo electrónico");
        } else {
            throw new Error("Ha ocurrido un error al procesar tu solicitud. Inténtalo más tarde.");
        }
    }
};

/**
 * Verifica el código de restablecimiento
 * @param {string} token - Token JWT recibido
 * @param {string} code - Código de verificación
 * @returns {Promise} - Respuesta del servidor
 */
export const verifyResetCode = async (token, code) => {
    try {
        const response = await axios.post(
            `${API_URL}/verify-reset-code`,
            { token, code }
        );
        return response.data;
    } catch (error) {
        console.error('Error al verificar código de restablecimiento:', error);
        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data.error || "El código o token son inválidos");
        } else {
            throw new Error("Ha ocurrido un error al verificar el código. Inténtalo más tarde.");
        }
    }
};

/**
 * Completa el restablecimiento de contraseña
 * @param {string} token - Token JWT recibido
 * @param {string} code - Código de verificación
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise} - Respuesta del servidor
 */
export const completePasswordReset = async (token, code, newPassword) => {
    try {
        const response = await axios.post(
            `${API_URL}/complete-password-reset`,
            { token, code, newPassword }
        );
        return response.data;
    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data.error || "El código o token son inválidos");
        } else {
            throw new Error("Ha ocurrido un error al restablecer la contraseña. Inténtalo más tarde.");
        }
    }
};

/**
 * Verifica que la contraseña actual sea correcta
 * @param {string} password - Contraseña actual a verificar
 * @returns {Promise<boolean>} - True si es correcta, false si no
 */
export const verifyPassword = async (password) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No hay sesión activa');

        const response = await axios.post(
            `${API_URL}/verify-password`,
            { password },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        return response.data.success;
    } catch (error) {
        console.error('Error al verificar contraseña:', error);
    }
};

/**
 * Cambia la contraseña del usuario
 * @param {string} oldPassword - Contraseña actual
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const changePassword = async (oldPassword, newPassword) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No hay sesión activa');

        const response = await axios.post(
            `${API_URL}/change-password`,
            { oldPassword, newPassword },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        return response.data;
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        throw new Error(error.response?.data?.error || 'Error al actualizar contraseña');
    }
};

/**
 * Restablece la contraseña usando el token y código (mantener por compatibilidad)
 * @param {string} token - Token JWT recibido
 * @param {string} code - Código de verificación
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise} - Respuesta del servidor
 */
export const resetPassword = async (token, code, newPassword) => {
    try {
        const response = await axios.post(
            `${API_URL}/reset-password`,
            { token, code, newPassword }
        );
        return response.data;
    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data.error || "El código o token son inválidos");
        } else {
            throw new Error("Ha ocurrido un error al restablecer la contraseña. Inténtalo más tarde.");
        }
    }
};

/**
 * Inicia sesión con Google
 * @returns {Promise} - Información del usuario, token e información adicional
 */
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const additionalInfo = getAdditionalUserInfo(result);
        const token = await result.user.getIdToken();

        localStorage.setItem('firebaseToken', token);

        return {
            user: result.user,
            token,
            isNewUser: additionalInfo?.isNewUser || false,
            profile: additionalInfo?.profile || {}
        };
    } catch (error) {
        console.error("Error en login con Google:", error.code, error.message);
        throw error;
    }
};

/**
 * Inicia sesión con Facebook
 * @returns {Promise} - Información del usuario, token e información adicional
 */
export const signInWithFacebook = async () => {
    try {
        const result = await signInWithPopup(auth, facebookProvider);
        const additionalInfo = getAdditionalUserInfo(result);
        const token = await result.user.getIdToken();

        localStorage.setItem('firebaseToken', token);

        return {
            user: result.user,
            token,
            isNewUser: additionalInfo?.isNewUser || false,
            profile: additionalInfo?.profile || {}
        };
    } catch (error) {
        console.error("Error en login con Facebook:", error.code, error.message);
        throw error;
    }
};

/**
 * Registra un usuario de proveedor social en el backend
 * @param {Object} userData - Datos del usuario autenticado con proveedor social
 * @returns {Promise} - Respuesta del servidor
 */
export const registerSocialUser = async (userData) => {
    try {
        // Usar la instancia ya importada de auth
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error('No hay usuario autenticado');
        }

        const firebaseToken = await currentUser.getIdToken();

        const response = await axios.post(`${API_URL}/social-auth`, userData, {
            headers: {
                'Authorization': `Bearer ${firebaseToken}`
            }
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response.data;
    } catch (error) {
        console.error("Error al registrar usuario social:", error);
        throw error;
    }
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica la parte del payload del JWT
            const currentTime = Math.floor(Date.now() / 1000); // tiempo actual en segundos

            if (payload.exp && payload.exp < currentTime) {
                // El token ha expirado
                localStorage.removeItem('token'); // Borra el token viejo
                return null;
            }

            return token;
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token'); // Si falla la decodificación, lo borramos
            return null;
        }
    }
    return null;
};

/**
 * Cierra la sesión del usuario actual
 * @returns {Promise<void>}
 */
export const logout = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay token disponible');

        await axios.post(`${API_URL}/logout`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        localStorage.removeItem('token');
        localStorage.removeItem('firebaseToken');
        localStorage.removeItem('sessionInitialized');
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        throw error;
    }
};

/**
 * Elimina permanentemente la cuenta del usuario y todos sus datos asociados
 * @param {string} password - Contraseña actual del usuario para verificación
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const deleteAccount = async (password) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const response = await axios.delete(`${API_URL}/user`, {
            data: { password },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Limpiar datos locales después de eliminar la cuenta
        if (response.data.success) {
            localStorage.removeItem('token');
            localStorage.removeItem('firebaseToken');
        }

        return response.data;
    } catch (error) {
        console.error('Error al eliminar cuenta:', error);

        // Manejo de errores específicos
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                throw new Error('No autorizado - sesión inválida o expirada');
            } else if (status === 400) {
                throw new Error(data.message || 'Contraseña incorrecta o datos inválidos');
            } else {
                throw new Error(data.message || 'Error al eliminar la cuenta');
            }
        } else if (error.request) {
            throw new Error('No se recibió respuesta del servidor');
        } else {
            throw new Error('Error al configurar la solicitud');
        }
    }
};

/**
 * Solicita el cambio de email enviando un código de verificación al email actual
 * @param {string} password - Contraseña actual para verificación
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const requestEmailChange = async (password) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No hay sesión activa');

        const response = await axios.post(
            `${API_URL}/request-email-change`,
            { password },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        return response.data.success;
    } catch (error) {
        console.error('Error al solicitar cambio de email:', error);
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al solicitar cambio de email');
        } else {
            throw new Error('Error de conexión al solicitar cambio de email');
        }
    }
};

/**
 * Confirma el cambio de email con el código de verificación
 * @param {string} code - Código de verificación recibido por email
 * @param {string} newEmail - Nuevo email a establecer
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const confirmEmailChange = async (code, newEmail) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No hay sesión activa');

        const response = await axios.post(
            `${API_URL}/confirm-email-change`,
            { code, newEmail },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        return response.data;
    } catch (error) {
        console.error('Error al confirmar cambio de email:', error);
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al confirmar cambio de email');
        } else {
            throw new Error('Error de conexión al confirmar cambio de email');
        }
    }
};