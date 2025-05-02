import React, { createContext, useState, useContext, useEffect } from 'react';
import { getLocalWishlist, setLocalWishlist } from '@/utils/localStorageHelpers';

// Crear el contexto con valores predeterminados
const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    loading: true,
    login: () => Promise.resolve(false),
    logout: () => {},
    syncWishlist: () => {}
});

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Comprobar si hay una sesión al cargar
    useEffect(() => {
        const checkAuth = () => {
            try {
                // Prevenir errores durante SSR
                if (typeof window === 'undefined') return;

                const storedUser = localStorage.getItem('user');

                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error al verificar autenticación:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        // Listener para sincronizar el estado entre pestañas
        const handleStorageChange = (event) => {
            if (event.key === 'user') {
                if (event.newValue) {
                    const userData = JSON.parse(event.newValue);
                    setUser(userData);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorageChange);
            return () => window.removeEventListener('storage', handleStorageChange);
        }
    }, []);

    // Función para iniciar sesión
    const login = async (credentials) => {
        try {
            // Aquí implementarías la llamada real a tu API
            // Este es solo un ejemplo
            const userData = { id: 'user123', name: 'Usuario de Ejemplo' };
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));

            // Al iniciar sesión, podríamos sincronizar los favoritos locales
            syncWishlist(userData.id);

            return true;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return false;
        }
    };

    // Función para sincronizar wishlist local con el servidor
    const syncWishlist = async (userId) => {
        if (!userId) return;

        try {
            // Este es un punto donde puedes implementar la sincronización
            // entre favoritos locales y favoritos del servidor
            const localItems = getLocalWishlist();

            // Aquí irían las llamadas para sincronizar con el servidor
            // Por ejemplo: await wishService.syncWishlist(userId, localItems);

            console.log('Sincronizando wishlist para el usuario', userId, 'con', localItems.length, 'productos');
        } catch (error) {
            console.error('Error al sincronizar favoritos:', error);
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        syncWishlist
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export default AuthProvider;