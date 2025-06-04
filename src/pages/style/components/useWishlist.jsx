import { useState, useEffect, useCallback } from 'react';
import wishlistService from '@/services/wishlistService';
import { getToken } from '@/services/authService';
import {
    addToLocalWishlist,
    removeFromLocalWishlist,
    getLocalWishlist,
    syncLocalWishlist
} from "@/utils/localStorageHelpers";

const useWishlist = (products = []) => {
    const [wishlistItems, setWishlistItems] = useState(new Set());
    const [loadingWishlist, setLoadingWishlist] = useState({});
    const [wishlistCount, setWishlistCount] = useState(0);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    const initializeWishlist = useCallback(async (productList) => {
        const token = getToken();
        const wishlistSet = new Set();

        console.log('🔄 Inicializando wishlist para productos:', productList.map(p => ({ id: p.product_id, name: p.name })));

        try {
            if (token) {
                console.log('👤 Usuario autenticado - consultando API');
                const serverWishlist = await wishlistService.getWishlist();
                const syncedWishlist = syncLocalWishlist(serverWishlist);

                syncedWishlist.forEach(item => {
                    wishlistSet.add(item.id);
                    wishlistSet.add(item.product_id);
                });

                setWishlistCount(syncedWishlist.length);
                console.log('✅ Wishlist sincronizada:', syncedWishlist.length, 'items');

            } else {
                console.log('👤 Usuario invitado - usando localStorage');
                const localWishlist = getLocalWishlist();

                localWishlist.forEach(item => {
                    wishlistSet.add(item.id);
                    wishlistSet.add(item.product_id);
                });

                setWishlistCount(localWishlist.length);
                console.log('✅ Wishlist local cargada:', localWishlist.length, 'items');
            }
        } catch (error) {
            console.error('❌ Error al cargar wishlist desde API, usando localStorage como respaldo:', error);
            const localWishlist = getLocalWishlist();
            localWishlist.forEach(item => {
                wishlistSet.add(item.id);
                wishlistSet.add(item.product_id);
            });
            setWishlistCount(localWishlist.length);
        }

        setWishlistItems(wishlistSet);

        productList.forEach(product => {
            const isInWishlist = wishlistSet.has(product.product_id);
            console.log(`📦 Producto ${product.product_id} (${product.name}): ${isInWishlist ? '❤️ En wishlist' : '🤍 No en wishlist'}`);
        });
    }, []);

    const isProductInWishlist = useCallback((productId) => {
        return wishlistItems.has(productId);
    }, [wishlistItems]);

    const toggleFavorite = useCallback(async (productId, product) => {
        const token = getToken();
        const isCurrentlyFavorite = isProductInWishlist(productId);
        const newFavoriteStatus = !isCurrentlyFavorite;

        console.log(`🔄 Toggle favorite para producto ${productId}:`, {
            current: isCurrentlyFavorite,
            new: newFavoriteStatus,
            product: product.name
        });

        // Actualizar estado inmediatamente para feedback visual
        const newWishlistItems = new Set(wishlistItems);
        if (newFavoriteStatus) {
            newWishlistItems.add(productId);
            setWishlistCount(prev => prev + 1);
        } else {
            newWishlistItems.delete(productId);
            setWishlistCount(prev => Math.max(0, prev - 1));
        }
        setWishlistItems(newWishlistItems);

        // Preparar producto para almacenamiento
        const productToStore = {
            ...product,
            product_id: product.product_id || productId,
            id: product.product_id || productId,
            image: product.main_image || product.image || product.images?.[0]?.image_url || '',
        };

        // Actualizar localStorage inmediatamente
        try {
            if (newFavoriteStatus) {
                addToLocalWishlist(productToStore);
                console.log(`✅ Producto ${productId} añadido a localStorage`);
            } else {
                removeFromLocalWishlist(productId);
                console.log(`✅ Producto ${productId} removido de localStorage`);
            }
        } catch (error) {
            console.error('❌ Error actualizando localStorage:', error);
        }

        if (!token) {
            setToast({
                open: true,
                message: newFavoriteStatus
                    ? '❤️ Producto guardado. Inicia sesión para sincronizar.'
                    : '🗑️ Producto eliminado de favoritos.',
                severity: 'info'
            });
            return;
        }

        // Para usuarios autenticados: sincronizar con API
        try {
            setLoadingWishlist(prev => ({ ...prev, [productId]: true }));

            if (newFavoriteStatus) {
                await wishlistService.addToWishlist(productId);
                console.log(`✅ Producto ${productId} añadido a API`);
            } else {
                await wishlistService.removeFromWishlist(productId);
                console.log(`✅ Producto ${productId} removido de API`);
            }

            setToast({
                open: true,
                message: newFavoriteStatus
                    ? '❤️ Producto añadido a favoritos'
                    : '🗑️ Producto eliminado de favoritos',
                severity: 'success'
            });

            // Emitir evento para otros componentes
            window.dispatchEvent(new CustomEvent('wishlistUpdated', {
                detail: { productId, isInWishlist: newFavoriteStatus, count: wishlistCount }
            }));

        } catch (error) {
            console.error('❌ Error sincronizando con API:', error);

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
                console.error('❌ Error revirtiendo localStorage:', localError);
            }

            setToast({
                open: true,
                message: '❌ Error al sincronizar. Inténtalo de nuevo.',
                severity: 'error'
            });
        } finally {
            setLoadingWishlist(prev => ({ ...prev, [productId]: false }));
        }
    }, [wishlistItems, wishlistCount, isProductInWishlist]);

    const closeToast = useCallback(() => {
        setToast(prev => ({ ...prev, open: false }));
    }, []);

    // Inicializar wishlist cuando cambien los productos
    useEffect(() => {
        if (products && products.length > 0) {
            initializeWishlist(products);
        }
    }, [products, initializeWishlist]);

    return {
        wishlistItems,
        wishlistCount,
        loadingWishlist,
        toast,
        isProductInWishlist,
        toggleFavorite,
        closeToast,
        initializeWishlist
    };
};

export default useWishlist;