import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Typography, Container, Divider, CircularProgress,
    useMediaQuery, useTheme, Paper, Fade, Button, Tooltip
} from '@mui/material';
import { useRouter } from 'next/router';
import ProductCard from './components/ProductCard';
import wishlistService from '@/services/wishlistService';
import { useAuth } from './components/AuthContext';
import EmptyWishlist from './components/EmptyWishlist';
import AnonymousWishlistMessage from './components/AnonymousWishlistMessage';
import { vistelicaColors } from '../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import HeaderComponent from '@/components/layout/HeaderComponent';
import { toast,ToastContainer  } from 'react-toastify';
import { getToken } from '@/services/authService';
import productService from '@/services/productService';
import SyncIcon from '@mui/icons-material/Sync';
import { darken } from '@mui/material/styles';
import '@/app/globals.css';

// Función auxiliar para obtener headers de autenticación
const getAuthHeaders = () => {
    if (typeof window !== 'undefined') {
        const token = getToken();
        return token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        };
    }
    return { 'Content-Type': 'application/json' };
};

const Wishlist = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
    const [mounted, setMounted] = useState(false);
    const hasSyncedRef = useRef(false);
    const isLoadingRef = useRef(false);

    // Funciones auxiliares optimizadas
    const checkRealAuth = useCallback(() => {
        if (typeof window === 'undefined') return false;
        return Boolean(getToken());
    }, []);

    const getUserId = useCallback(() => {
        if (user?.id) return user.id;
        if (typeof window === 'undefined') return null;

        const token = getToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.id || payload.sub || payload.user_id;
            } catch (err) {
                // Error silencioso en producción
                return null;
            }
        }
        return null;
    }, [user]);

    // Función principal para cargar la wishlist - optimizada
    const loadWishlist = useCallback(async () => {
        if (isLoadingRef.current) return;

        try {
            isLoadingRef.current = true;
            setLoading(true);
            setError(null);

            if (checkRealAuth()) {
                const userId = getUserId();
                if (userId) {
                    try {
                        const response = await fetch(`http://localhost:5000/api/wishlist/user/${userId}`, {
                            headers: getAuthHeaders()
                        });

                        if (response.ok) {
                            const data = await response.json();

                            // Extraer lista de productos de diferentes formatos posibles
                            let productList = Array.isArray(data) ? data :
                                (data?.products && Array.isArray(data.products)) ? data.products :
                                    (data?.wishlist && Array.isArray(data.wishlist)) ? data.wishlist : [];

                            // Procesamiento de productos en paralelo
                            const productsWithImages = await Promise.all(productList.map(async (item, index) => {
                                // Extraer ID de producto de manera robusta
                                const productId = extractProductId(item, index);

                                // Crear producto normalizado
                                const normalizedProduct = {
                                    id: productId || `unknown-${index}`,
                                    product_id: productId,
                                    name: item.name || (item.product && item.product.name) || "Producto sin nombre",
                                    price: item.price || (item.product && item.product.price) || 0,
                                    description: item.description || (item.product && item.product.description) || "Sin descripción",
                                    image: "https://placehold.co/400x300?text=Producto",
                                    slug: item.slug || (item.product && item.product.slug) || `product-${productId || index}`
                                };

                                // Cargar imagen solo si hay ID
                                if (productId) {
                                    try {
                                        const imageData = await productService.getMainImageByProductId(productId);
                                        normalizedProduct.image = extractImageUrl(imageData, productId);
                                    } catch (error) {
                                        normalizedProduct.image = `http://localhost:5000/api/products/${productId}/image/main`;
                                    }
                                }

                                return normalizedProduct;
                            }));

                            setProducts(productsWithImages);
                        } else {
                            throw new Error("Error al obtener favoritos");
                        }
                    } catch (error) {
                        // Fallback a localStorage en caso de error
                        const localWishlist = wishlistService.getLocalWishlist();
                        setProducts(localWishlist);
                    }
                }
            } else {
                // Usuario no autenticado, usar localStorage
                const localWishlist = wishlistService.getLocalWishlist();
                setProducts(localWishlist);
            }
        } catch (error) {
            setError("No se pudieron cargar tus favoritos");
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    }, [checkRealAuth, getUserId]);

    // Función auxiliar para extraer ID de producto
    const extractProductId = (item, index) => {
        if (!item || typeof item !== 'object') return null;

        // Buscar en propiedades comunes
        const id = item.id || item.product_id || item.productId ||
            (item.product && item.product.id) ||
            (item.product && item.product.product_id);

        if (id) return id;

        // Búsqueda en campos con nombre de ID
        for (const key in item) {
            if (typeof item[key] !== 'object' &&
                (key.toLowerCase().includes('id') || key.toLowerCase().includes('_id'))) {
                return item[key];
            }
        }

        return null;
    };

    // Función auxiliar para extraer URL de imagen
    const extractImageUrl = (imageData, productId) => {
        if (!imageData) return "https://placehold.co/400x300?text=Producto";

        // Procesamiento directo de image_url
        if (imageData.image_url) return imageData.image_url;

        // Otros formatos posibles
        let imageUrl;
        if (typeof imageData === 'string') {
            imageUrl = imageData;
        } else if (imageData.url || imageData.imageUrl || imageData.src || imageData.path || imageData.image) {
            imageUrl = imageData.url || imageData.imageUrl || imageData.src || imageData.path || imageData.image;
        } else if (Array.isArray(imageData) && imageData.length > 0) {
            const first = imageData[0];
            imageUrl = typeof first === 'string' ? first :
                (first?.url || first?.image_url || first?.imageUrl || first?.src);
        }

        // Asegurar URL absoluta
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
            const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
            return `http://localhost:5000/${cleanPath}`;
        }

        return imageUrl || "https://placehold.co/400x300?text=Producto";
    };

    // Sincronización optimizada
    const syncWishlistWithServer = async () => {
        if (isLoadingRef.current) return;

        try {
            isLoadingRef.current = true;
            setLoading(true);
            hasSyncedRef.current = true;

            const localProducts = wishlistService.getLocalWishlist();

            if (localProducts.length > 0) {
                // Usar Promise.all para sincronizar en paralelo
                await Promise.all(localProducts.map(async (product) => {
                    const productId = product.id || product.product_id;
                    if (productId) {
                        try {
                            await wishlistService.addToWishlist(productId);
                        } catch (e) {
                            // Ignorar errores individuales
                        }
                    }
                }));

                wishlistService.updateLocalWishlist([]);

                toast.success(`${localProducts.length} productos sincronizados`, {
                    position: "bottom-right",
                    autoClose: 3000
                });
            } else {
                toast.info('No hay productos nuevos para sincronizar', {
                    position: "bottom-right",
                    autoClose: 3000
                });
            }

            await loadWishlist();
        } catch (error) {
            toast.error('Error al sincronizar la lista', {
                position: "bottom-right",
                autoClose: 3000
            });
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    };

    // Efectos optimizados
    useEffect(() => {
        loadWishlist();
        setMounted(true);
    }, [loadWishlist]);

    useEffect(() => {
        if (mounted && checkRealAuth() && !hasSyncedRef.current) {
            syncWishlistWithServer();
        }
    }, [isAuthenticated, user, mounted, checkRealAuth]);

    // Manejadores de eventos optimizados
    const handleRemoveFromWishlist = async (productId) => {
        try {
            await wishlistService.removeFromWishlist(productId);
            setProducts(products => products.filter(p =>
                (p.id || p.product_id) !== productId
            ));

            toast.success('Producto eliminado de favoritos', {
                position: "bottom-right",
                autoClose: 3000
            });
        } catch (error) {
            toast.error('Error al eliminar el producto', {
                position: "bottom-right",
                autoClose: 3000
            });
        }
    };

    const handleAddToCart = (product) => {
        toast.success('Producto añadido al carrito', {
            position: "bottom-right",
            autoClose: 3000
        });
    };

    return (
        <>
            <HeaderComponent />

            <Box
                sx={{
                    background: `linear-gradient(45deg, ${vistelicaColors.primary}15, ${vistelicaColors.secondary}15)`,
                    minHeight: '100vh',
                    pt: { xs: 2, sm: 3, md: 4 },
                    pb: { xs: 4, sm: 5, md: 6 }
                }}
            >
                <Container
                    maxWidth={false}
                    sx={{
                        width: '100%',
                        px: { xs: 1, sm: 1, md: 1 }
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            p: { xs: 1.5, sm: 2, md: 2.5 },
                            borderRadius: 2,
                            backgroundColor: 'white',
                            mb: 4
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 600,
                                    color: vistelicaColors.primary,
                                    fontFamily: typography.fontFamily,
                                    fontSize: { xs: '1.8rem', sm: '2.125rem' }
                                }}
                            >
                                Mis Favoritos
                            </Typography>

                            {mounted && checkRealAuth() && (
                                <Tooltip
                                    title="Sincroniza los productos guardados mientras navegabas sin iniciar sesión con tu cuenta"
                                    placement="bottom"
                                    arrow
                                >
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => syncWishlistWithServer()}
                                        startIcon={<SyncIcon />}
                                        sx={{
                                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                                            backgroundColor: vistelicaColors.secondary,
                                            px: { xs: 1, sm: 1.5, md: 2 },
                                            py: { xs: 0.5, sm: 0.75 },
                                            whiteSpace: 'nowrap',
                                            minWidth: { xs: '32px', sm: 'auto' },
                                            '&:hover': {
                                                backgroundColor: vistelicaColors.primary || darken(vistelicaColors.primaryDark, 0.1)
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                            Sincronizar favoritos
                                        </Box>
                                        <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>
                                            Sincronizar
                                        </Box>
                                    </Button>
                                </Tooltip>
                            )}
                        </Box>

                        <Typography
                            variant="body1"
                            sx={{
                                mb: 3,
                                color: vistelicaColors.secondary,
                                fontFamily: typography.fontFamily
                            }}
                        >
                            {!mounted ? "Encuentra aquí todos los productos que has marcado como favoritos" :
                                checkRealAuth() ? `Tienes ${products.length} productos en tu lista de favoritos` :
                                    "Encuentra aquí todos los productos que has marcado como favoritos"}
                        </Typography>

                        <Divider sx={{
                            mb: 4,
                            backgroundColor: '#e0e0e0'
                        }} />

                        {mounted && !checkRealAuth() && <AnonymousWishlistMessage />}

                        {error && (
                            <Box sx={{ my: 4, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
                                <Typography color="error">{error}</Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={loadWishlist}
                                    sx={{ mt: 2 }}
                                >
                                    Reintentar
                                </Button>
                            </Box>
                        )}

                        {loading ? (
                            <Box display="flex" justifyContent="center" my={8}>
                                <CircularProgress sx={{ color: vistelicaColors.primary }} />
                            </Box>
                        ) : products.length > 0 ? (
                            <Fade in={!loading}>
                                <div>
                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        width: '100%',
                                        justifyContent: 'center',
                                        mx: 'auto'
                                    }}>
                                        {products.map((product, index) => (
                                            <Box
                                                key={(product.id || product.product_id || index)}
                                                sx={{
                                                    width: {
                                                        xs: '100%',
                                                        sm: '50%',
                                                        md: '50%',
                                                        lg: '33.333%',
                                                        xl: '24%'
                                                    },
                                                    px: 1.5,
                                                    mb: 3
                                                }}
                                            >
                                                <Fade in={true} timeout={(index + 1) * 200}>
                                                    <div style={{ height: '100%' }}>
                                                        <ProductCard
                                                            product={product}
                                                            onRemoveFromWishlist={() => handleRemoveFromWishlist(product.id || product.product_id)}
                                                            showRemoveWishlist={true}
                                                            onAddToCart={() => handleAddToCart(product)}
                                                        />
                                                    </div>
                                                </Fade>
                                            </Box>
                                        ))}
                                    </Box>
                                </div>
                            </Fade>
                        ) : (
                            <EmptyWishlist />
                        )}
                    </Paper>
                </Container>
                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    toastClassName="vistelica-toast"
                    bodyClassName="vistelica-toast-body"
                    progressClassName="vistelica-toast-progress"
                />
            </Box>

        </>
    );
};

export default Wishlist;