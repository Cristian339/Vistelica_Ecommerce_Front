import { useState, useEffect, useCallback, useMemo } from 'react';
import wishlistService from '@/services/wishlistService';
import { getToken } from '@/services/authService';
import {
    addToLocalWishlist,
    removeFromLocalWishlist,
    getLocalWishlist,
    syncLocalWishlist
} from "@/utils/localStorageHelpers";
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

// Nombres semánticos para los tipos de toast
const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
};

// Configuración de colores para toast basados en la paleta de Vistelica
const TOAST_STYLES = {
    [TOAST_TYPES.SUCCESS]: {
        backgroundColor: `${vistelicaColors.success}10`,
        color: vistelicaColors.success,
        borderColor: vistelicaColors.success,
        icon: '✅'
    },
    [TOAST_TYPES.ERROR]: {
        backgroundColor: `${vistelicaColors.error}10`,
        color: vistelicaColors.error,
        borderColor: vistelicaColors.error,
        icon: '❌'
    },
    [TOAST_TYPES.INFO]: {
        backgroundColor: `${vistelicaColors.primary}10`,
        color: vistelicaColors.primary,
        borderColor: vistelicaColors.primary,
        icon: 'ℹ️'
    },
    [TOAST_TYPES.WARNING]: {
        backgroundColor: `${vistelicaColors.secondary}10`,
        color: vistelicaColors.secondary,
        borderColor: vistelicaColors.secondary,
        icon: '⚠️'
    }
};

/**
 * Hook para gestionar la lista de deseos (wishlist) con sincronización local y remota
 * @param {Array} products - Lista de productos para verificar wishlist
 * @returns {Object} - Estados y funciones para manejar la wishlist
 */
const useWishlist = (products = []) => {
    const [wishlistItems, setWishlistItems] = useState(new Set());
    const [loadingWishlist, setLoadingWishlist] = useState({});
    const [wishlistCount, setWishlistCount] = useState(0);
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: TOAST_TYPES.SUCCESS,
        style: TOAST_STYLES[TOAST_TYPES.SUCCESS]
    });

    // Variable para controlar si el componente está montado
    const isMounted = useMemo(() => {
        const ref = { current: true };
        return ref;
    }, []);

    // Función para crear un toast con los estilos de Vistelica
    const createToast = useCallback((message, severity) => {
        const toastStyle = TOAST_STYLES[severity] || TOAST_STYLES[TOAST_TYPES.INFO];

        return {
            open: true,
            message,
            severity,
            style: toastStyle,
            fontFamily: typography.fontFamily,
            ariaLive: severity === TOAST_TYPES.ERROR ? 'assertive' : 'polite'
        };
    }, []);

    // Inicializar wishlist de forma optimizada
    const initializeWishlist = useCallback(async (productList) => {
        if (!productList?.length || !isMounted.current) return;

        const token = getToken();
        const wishlistSet = new Set();

        // Usar try-catch más corto y directo
        try {
            let wishlistData = [];

            if (token) {
                // Usuario autenticado: obtener de API y sincronizar
                const serverWishlist = await wishlistService.getWishlist();
                wishlistData = syncLocalWishlist(serverWishlist);
            } else {
                // Usuario invitado: obtener solo del localStorage
                wishlistData = getLocalWishlist();
            }

            // Agregar IDs al Set para búsqueda rápida
            wishlistData.forEach(item => {
                const productId = item.id || item.product_id;
                if (productId) {
                    wishlistSet.add(productId);
                }
            });

            if (isMounted.current) {
                setWishlistCount(wishlistData.length);
                setWishlistItems(wishlistSet);
            }
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error al inicializar wishlist:', error);
            }

            // Fallback a localStorage en caso de error
            const localWishlist = getLocalWishlist();
            localWishlist.forEach(item => {
                const productId = item.id || item.product_id;
                if (productId) wishlistSet.add(productId);
            });

            if (isMounted.current) {
                setWishlistCount(localWishlist.length);
                setWishlistItems(wishlistSet);
            }
        }
    }, [isMounted]);

    // Verificación memoizada para mejor rendimiento
    const isProductInWishlist = useCallback((productId) => {
        return productId ? wishlistItems.has(productId) : false;
    }, [wishlistItems]);

    // Función optimizada para toggle de favoritos
    const toggleFavorite = useCallback(async (productId, product) => {
        if (!productId || !product || !isMounted.current) return;

        const token = getToken();
        const isCurrentlyFavorite = isProductInWishlist(productId);
        const newFavoriteStatus = !isCurrentlyFavorite;

        // Optimistic UI update - actualizar primero la UI
        const newWishlistItems = new Set(wishlistItems);
        if (newFavoriteStatus) {
            newWishlistItems.add(productId);
            setWishlistCount(prev => prev + 1);
        } else {
            newWishlistItems.delete(productId);
            setWishlistCount(prev => Math.max(0, prev - 1));
        }
        setWishlistItems(newWishlistItems);

        // Preparar producto con solo datos necesarios
        const productToStore = {
            product_id: product.product_id || productId,
            id: product.product_id || productId,
            name: product.name || '',
            price: product.price,
            image: product.main_image || product.image || product.images?.[0]?.image_url || '',
        };

        // Actualizar localStorage (operaciones síncronas)
        try {
            if (newFavoriteStatus) {
                addToLocalWishlist(productToStore);
            } else {
                removeFromLocalWishlist(productId);
            }
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error en localStorage:', error);
            }
        }


        // Para usuarios autenticados: sincronizar con API
        try {
            // Marcar como cargando
            setLoadingWishlist(prev => ({ ...prev, [productId]: true }));

            // Llamada a la API
            if (newFavoriteStatus) {
                await wishlistService.addToWishlist(productId);
            } else {
                await wishlistService.removeFromWishlist(productId);
            }

            // Notificar éxito
            if (isMounted.current) {
                setToast(createToast(
                    newFavoriteStatus
                        ? '❤️ Producto añadido a favoritos'
                        : '🗑️ Producto eliminado de favoritos',
                    TOAST_TYPES.SUCCESS
                ));

                // Emitir evento para otros componentes - con cancelTimers para evitar memory leaks
                const event = new CustomEvent('wishlistUpdated', {
                    detail: {
                        productId,
                        isInWishlist: newFavoriteStatus,
                        count: newFavoriteStatus ? wishlistCount + 1 : Math.max(0, wishlistCount - 1)
                    }
                });
                window.dispatchEvent(event);
            }
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error en API:', error);
            }

            // Revertir cambios en la UI en caso de error
            if (isMounted.current) {
                // Revertir estado en la UI
                const revertedWishlistItems = new Set(wishlistItems);
                if (isCurrentlyFavorite) {
                    revertedWishlistItems.add(productId);
                    setWishlistCount(prev => prev + 1);
                } else {
                    revertedWishlistItems.delete(productId);
                    setWishlistCount(prev => Math.max(0, prev - 1));
                }
                setWishlistItems(revertedWishlistItems);

                // Revertir localStorage
                try {
                    if (isCurrentlyFavorite) {
                        addToLocalWishlist(productToStore);
                    } else {
                        removeFromLocalWishlist(productId);
                    }
                } catch (localError) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.error('Error revirtiendo localStorage:', localError);
                    }
                }

                // Mostrar toast de error
                setToast(createToast(
                    'Error al sincronizar. Inténtalo de nuevo.',
                    TOAST_TYPES.ERROR
                ));
            }
        } finally {
            // Finalizar estado de carga si el componente sigue montado
            if (isMounted.current) {
                setLoadingWishlist(prev => ({ ...prev, [productId]: false }));
            }
        }
    }, [wishlistItems, wishlistCount, isProductInWishlist, createToast, isMounted]);

    // Función para cerrar toast con accesibilidad mejorada
    const closeToast = useCallback(() => {
        if (isMounted.current) {
            setToast(prev => ({ ...prev, open: false }));
        }
    }, [isMounted]);

    // Inicializar wishlist cuando cambien los productos
    useEffect(() => {
        if (products?.length > 0) {
            initializeWishlist(products);
        }

        // Cleanup para evitar memory leaks
        return () => {
            isMounted.current = false;
        };
    }, [products, initializeWishlist, isMounted]);

    // Devolver objeto memoizado para evitar re-renders innecesarios
    return useMemo(() => ({
        wishlistItems,
        wishlistCount,
        loadingWishlist,
        toast,
        isProductInWishlist,
        toggleFavorite,
        closeToast,
        initializeWishlist
    }), [
        wishlistItems,
        wishlistCount,
        loadingWishlist,
        toast,
        isProductInWishlist,
        toggleFavorite,
        closeToast,
        initializeWishlist
    ]);
};

export default useWishlist;