'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Container,
    CircularProgress,
    Snackbar,
    Alert,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from "@/components/layout/HeaderComponent";
import { getStyleById } from "@/services/styleService";
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

// Importar componentes modulares
import HeaderComponent from './components/HeaderComponent';
import MainContentSection from './components/MainContentSection';

const Page = ({ params }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const styleId = searchParams.get('id');
    const theme = useTheme();

    // Detección de dispositivos mejorada para responsividad
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

    // Estados
    const [loading, setLoading] = useState(true);
    const [styleData, setStyleData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedThumbnail, setSelectedThumbnail] = useState(0);
    const [wishlistItems, setWishlistItems] = useState(new Set());
    const [loadingWishlist, setLoadingWishlist] = useState({});
    const [wishlistCount, setWishlistCount] = useState(0);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    // Memoizar productos para mejorar rendimiento
    const products = useMemo(() => styleData?.products || [], [styleData]);

    // Función para inicializar wishlist optimizada
    const initializeWishlist = useCallback(async (productsToInit) => {
        if (!productsToInit?.length) return;

        const token = getToken();
        const wishlistSet = new Set();

        try {
            if (token) {
                const serverWishlist = await wishlistService.getWishlist();
                const syncedWishlist = syncLocalWishlist(serverWishlist);

                syncedWishlist.forEach(item => {
                    if (item.id) wishlistSet.add(item.id);
                    if (item.product_id) wishlistSet.add(item.product_id);
                });

                setWishlistCount(syncedWishlist.length);
            } else {
                const localWishlist = getLocalWishlist();

                localWishlist.forEach(item => {
                    if (item.id) wishlistSet.add(item.id);
                    if (item.product_id) wishlistSet.add(item.product_id);
                });

                setWishlistCount(localWishlist.length);
            }
        } catch (error) {
            // Fallback a localStorage en caso de error
            const localWishlist = getLocalWishlist();
            localWishlist.forEach(item => {
                if (item.id) wishlistSet.add(item.id);
                if (item.product_id) wishlistSet.add(item.product_id);
            });
            setWishlistCount(localWishlist.length);
        }

        setWishlistItems(wishlistSet);
    }, []);

    // Función para verificar si un producto está en la wishlist - rendimiento optimizado
    const isProductInWishlist = useCallback((productId) => {
        return productId ? wishlistItems.has(productId) : false;
    }, [wishlistItems]);

    // Función optimizada para mostrar toast
    const showToast = useCallback((message, severity) => {
        setToast({
            open: true,
            message,
            severity
        });
    }, []);

    // Función para toggle de favoritos con mejor manejo de errores y feedback
    const toggleFavorite = useCallback(async (productId, product) => {
        if (!productId || !product) return;

        const token = getToken();
        const isCurrentlyFavorite = isProductInWishlist(productId);
        const newFavoriteStatus = !isCurrentlyFavorite;

        // Actualizar estado inmediatamente para feedback visual (UI optimista)
        const newWishlistItems = new Set(wishlistItems);
        if (newFavoriteStatus) {
            newWishlistItems.add(productId);
            setWishlistCount(prev => prev + 1);
        } else {
            newWishlistItems.delete(productId);
            setWishlistCount(prev => Math.max(0, prev - 1));
        }
        setWishlistItems(newWishlistItems);

        // Preparar producto para almacenamiento de forma eficiente
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
            } else {
                removeFromLocalWishlist(productId);
            }
        } catch (error) {
            // Solo loguear en desarrollo
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error actualizando localStorage:', error);
            }
        }

        if (!token) {
            showToast(
                newFavoriteStatus
                    ? '❤️ Producto guardado. Inicia sesión para sincronizar.'
                    : '🗑️ Producto eliminado de favoritos.',
                'info'
            );
            return;
        }

        // Para usuarios autenticados: sincronizar con API
        try {
            setLoadingWishlist(prev => ({ ...prev, [productId]: true }));

            if (newFavoriteStatus) {
                await wishlistService.addToWishlist(productId);
            } else {
                await wishlistService.removeFromWishlist(productId);
            }

            showToast(
                newFavoriteStatus
                    ? '❤️ Producto añadido a favoritos'
                    : '🗑️ Producto eliminado de favoritos',
                'success'
            );

            // Emitir evento para otros componentes con un objeto inmutable
            window.dispatchEvent(new CustomEvent('wishlistUpdated', {
                detail: Object.freeze({
                    productId,
                    isInWishlist: newFavoriteStatus,
                    count: wishlistCount
                })
            }));

        } catch (error) {
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

            showToast('❌ Error al sincronizar. Inténtalo de nuevo.', 'error');
        } finally {
            setLoadingWishlist(prev => ({ ...prev, [productId]: false }));
        }
    }, [wishlistItems, wishlistCount, isProductInWishlist, showToast]);

    // Función para cerrar el toast
    const closeToast = useCallback(() => {
        setToast(prev => ({ ...prev, open: false }));
    }, []);

    // Cargar datos del estilo de manera optimizada con mejor manejo de errores
    const fetchStyleData = useCallback(async () => {
        if (!styleId) return;

        try {
            setLoading(true);
            const data = await getStyleById(styleId);

            // Procesamiento de datos optimizado
            const processedData = {
                ...data,
                products: data.products.map(product => {
                    const relatedProduct = data.relatedProducts.find(rp => rp.product_id === product.product_id);
                    if (relatedProduct) {
                        return {
                            ...product,
                            main_image: relatedProduct.main_image,
                            images: relatedProduct.images
                        };
                    }
                    return product;
                })
            };

            setStyleData(processedData);

            if (processedData.products && processedData.products.length > 0) {
                await initializeWishlist(processedData.products);
            }

            // Encontrar imagen principal de forma optimizada
            const mainImageIndex = processedData.styleImages.findIndex(img => img.is_main);
            if (mainImageIndex !== -1) {
                setCurrentImageIndex(mainImageIndex);
                setSelectedThumbnail(mainImageIndex);
            }
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error("Error al cargar el estilo:", error);
            }
            showToast('Error al cargar el estilo. Por favor, inténtalo más tarde.', 'error');
        } finally {
            setLoading(false);
        }
    }, [styleId, initializeWishlist, showToast]);

    // Efecto para cargar datos
    useEffect(() => {
        fetchStyleData();

        // Limpiar al desmontar
        return () => {
            // Limpiar cualquier timeout o suscripción si se implementan
        };
    }, [fetchStyleData]);

    return (
        <>
            <Navbar />
            {/* Uso de Box como componente main semántico para accesibilidad */}
            <Box
                component="main"
                id="main-content"
                tabIndex="-1"
                sx={{
                    minHeight: { xs: 'calc(100vh - 64px)', sm: 'auto' },
                    pt: { xs: 1, sm: 2 }
                }}
            >
                {loading ? (
                    <Container
                        maxWidth="lg"
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            py: { xs: 6, md: 10 },
                            minHeight: '50vh',
                            alignItems: 'center'
                        }}
                    >
                        <CircularProgress
                            size={isMobile ? 50 : 60}
                            thickness={4}
                            sx={{ color: vistelicaColors.primary }}
                            aria-label="Cargando estilo"
                            role="progressbar"
                        />
                    </Container>
                ) : styleData ? (
                    <>
                        <HeaderComponent
                            title={styleData.name}
                            subtitle={styleData.description}
                            articleCount={`${styleData.products.length} artículos`}
                            wishlistCount={wishlistCount}
                        />
                        <MainContentSection
                            styleImages={styleData.styleImages}
                            currentImageIndex={currentImageIndex}
                            setCurrentImageIndex={setCurrentImageIndex}
                            selectedThumbnail={selectedThumbnail}
                            setSelectedThumbnail={setSelectedThumbnail}
                            products={products}
                            isProductInWishlist={isProductInWishlist}
                            loadingWishlist={loadingWishlist}
                            toggleFavorite={toggleFavorite}
                            isMobile={isMobile}
                            isTablet={isTablet}
                            isLargeScreen={isLargeScreen}
                        />
                    </>
                ) : (
                    <Container maxWidth="lg">
                        <Typography
                            variant="h5"
                            color="error"
                            sx={{
                                py: 4,
                                textAlign: 'center',
                                fontFamily: typography.fontFamily,
                                color: vistelicaColors.error
                            }}
                            role="alert"
                        >
                            ❌ No se pudo cargar el estilo. Por favor, inténtalo más tarde.
                        </Typography>
                    </Container>
                )}
            </Box>

            {/* Toast de notificaciones estilizado con la marca */}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={closeToast}
                anchorOrigin={{
                    vertical: 'bottom',  // Siempre aparecerá abajo
                    horizontal: 'center'
                }}
                sx={{
                    mb: { xs: 2, sm: 3, md: 4 },  // Margen responsivo
                    '& .MuiPaper-root': {
                        fontFamily: typography.fontFamily
                    }
                }}
            >
                <Alert
                    onClose={closeToast}
                    severity={toast.severity}
                    variant="filled"
                    sx={{
                        width: { xs: '90%', sm: '100%' }, // Ancho responsivo
                        maxWidth: { xs: '90vw', sm: 400 }, // Ancho máximo responsivo
                        fontFamily: typography.fontFamily,
                        fontWeight: 500,
                        backgroundColor: toast.severity === 'success'
                            ? vistelicaColors.success
                            : toast.severity === 'error'
                                ? vistelicaColors.error
                                : toast.severity === 'info'
                                    ? vistelicaColors.primary
                                    : vistelicaColors.warning,
                        '& .MuiAlert-icon': {
                            color: vistelicaColors.white,
                            marginRight: 1
                        },
                        '& .MuiAlert-message': {
                            fontFamily: typography.fontFamily,
                            fontSize: { xs: '0.875rem', sm: '1rem' } // Tamaño de texto responsivo
                        }
                    }}
                    role="alert"
                    aria-live="polite"
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Page;