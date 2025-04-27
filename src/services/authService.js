import axios from 'axios';
import {
    getAuth,
    signInWithPopup,
    getAdditionalUserInfo,
    signOut
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "./firebase";

const API_URL = 'http://localhost:5000/api';

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} userData - Datos del usuario a registrar
 * @returns {Promise} - Datos del usuario registrado
 */
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
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
            localStorage.removeItem('sessionId'); // Limpiar sessionId de guest
            localStorage.removeItem('sessionInitialized'); // Permitir reinicialización si needed
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
 * Cierra la sesión del usuario actual
 * @returns {Promise<void>}
 */
export const logout = async () => {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('firebaseToken');

        // Cerrar sesión en Firebase si hay una sesión activa
        if (auth.currentUser) {
            await signOut(auth);
        }
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
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
        return localStorage.getItem('token');
    }
    return null;
};