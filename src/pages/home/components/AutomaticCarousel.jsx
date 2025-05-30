'use client';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardMedia,
    CardContent,
    useMediaQuery,
    useTheme,
    GlobalStyles,
    Alert,
    Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import productService from '@/services/productService';
import { useRouter } from 'next/navigation';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

// Componente optimizado con React.memo
const CarouselItem = React.memo(({ product }) => {
    const router = useRouter();
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Optimizado con useMemo
    const imageUrl = useMemo(() => {
        if (imageError) return '/images/placeholder-image.png';

        return product.image_url ||
            product.main_image ||
            product.mainImage ||
            product.image ||
            product.imageUrl ||
            '/images/placeholder-image.png';
    }, [product, imageError]);

    // Optimizado con useCallback
    const handleProductClickDetail = useCallback((productId) => {
        if (router) {
            router.push(`/product-detail/page?id=${productId}`);
        } else {
            console.error('Router is not available.');
        }
    }, [router]);

    // Optimizado con useCallback
    const handleImageError = useCallback(() => {
        setImageError(true);
        setImageLoaded(true);
    }, []);

    // Optimizado con useCallback
    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                onClick={() => handleProductClickDetail(product.product_id || product.id)}
                sx={{
                    position: 'relative',
                    height: '350px',
                    width: '350px',
                    mx: 1.5,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    '&:hover': {
                        boxShadow: `0 8px 16px ${vistelicaColors.primary}40`
                    }
                }}
            >
                <Box sx={{ position: 'relative', height: '75%', width: '100%', overflow: 'hidden', backgroundColor: '#fff' }}>
                    {!imageLoaded && (
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                            animation="wave"
                        />
                    )}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        style={{ opacity: imageLoaded ? 1 : 0 }}
                    >
                        <CardMedia
                            component="img"
                            image={imageUrl}
                            alt={product.name || 'Producto'}
                            loading="lazy"
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                p: 1
                            }}
                        />
                    </motion.div>
                </Box>
                <CardContent
                    sx={{
                        py: 1.5,
                        px: 2,
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(5px)'
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        noWrap
                        sx={{
                            fontWeight: 500,
                            color: vistelicaColors.secondary,
                            fontFamily: typography.fontFamily || 'Amethysta, sans-serif',
                        }}
                    >
                        {product.name || 'Producto sin nombre'}
                    </Typography>
                    <Typography
                        variant="body1"
                        fontWeight={600}
                        sx={{
                            color: vistelicaColors.primary,
                            fontFamily: typography.fontFamily || 'Amethysta, sans-serif',
                        }}
                    >
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price || '0.00'}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
});

// Componente principal optimizado
const AutomaticCarouselWithScrollbar = () => {
    const scrollContainerRef = useRef(null);
    const isPausedRef = useRef(false);
    const animationRef = useRef(null);
    const isResettingRef = useRef(false);
    const touchStartXRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [manuallyPaused, setManuallyPaused] = useState(false);

    // Número de puntos adaptable según el dispositivo
    const NUM_DOTS = useMemo(() => isMobile ? 3 : 5, [isMobile]);
    const [activeDotIndex, setActiveDotIndex] = useState(0);

    const updateActiveDotIndicator = useCallback(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const scrollableWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;

        if (scrollableWidth <= 0) {
            setActiveDotIndex(0);
            return;
        }

        const currentScroll = scrollContainer.scrollLeft;
        let dotIndex;

        if (currentScroll >= scrollableWidth - 1) {
            dotIndex = NUM_DOTS - 1;
        } else if (currentScroll <= 0) {
            dotIndex = 0;
        } else {
            const segmentWidth = scrollableWidth / NUM_DOTS;
            dotIndex = Math.floor(currentScroll / segmentWidth);
        }

        setActiveDotIndex(Math.max(0, Math.min(dotIndex, NUM_DOTS - 1)));
    }, [NUM_DOTS]);

    // Fetch optimizado con mejor manejo de errores
    useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController();

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await productService.getRandomAccessoryProducts();

                if (!isMounted) return;

                // Aseguramos que data es un array
                const processedData = Array.isArray(data) ? data : [];

                // Normalizamos los datos para asegurar consistencia
                const normalizedProducts = processedData.map((product, index) => ({
                    ...product,
                    product_id: product.product_id || product.id || `temp-id-${index}`,
                    name: product.name || `Producto ${index + 1}`,
                    price: product.price || 0,
                    // Aseguramos que haya una URL de imagen
                    image_url: product.image_url ||
                        product.main_image ||
                        product.mainImage ||
                        product.image ||
                        product.imageUrl ||
                        '/images/placeholder-image.png'
                }));

                setProducts(normalizedProducts);
            } catch (error) {
                if (!isMounted) return;
                console.error('Error al cargar los accesorios:', error);
                setError('No se pudieron cargar los productos. Por favor, intente más tarde.');
                setProducts([]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, []);

    // Memoizamos productos para evitar re-renders innecesarios
    const carouselProducts = useMemo(() => products || [], [products]);

    const handleScroll = useCallback(() => {
        if (!isResettingRef.current) {
            updateActiveDotIndicator();
        }
    }, [updateActiveDotIndicator]);

    // Efecto optimizado para la animación del carrusel
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer || loading || carouselProducts.length === 0) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            return;
        }

        scrollContainer.scrollLeft = 0;
        setActiveDotIndex(0);
        isResettingRef.current = false;

        // Velocidad adaptativa según dispositivo
        const pixelsPerFrame = isMobile ? 0.6 : isTablet ? 0.9 : 1.2;

        const scrollAnimation = () => {
            const currentScrollContainer = scrollContainerRef.current;
            if (!currentScrollContainer) {
                animationRef.current = requestAnimationFrame(scrollAnimation);
                return;
            }

            const maxScroll = currentScrollContainer.scrollWidth - currentScrollContainer.clientWidth;

            if (maxScroll <= 0) {
                if (!isResettingRef.current) setActiveDotIndex(0);
                animationRef.current = requestAnimationFrame(scrollAnimation);
                return;
            }

            if (!isPausedRef.current && !isResettingRef.current && !manuallyPaused) {
                if (currentScrollContainer.scrollLeft >= maxScroll - 1) {
                    isResettingRef.current = true;
                    currentScrollContainer.scrollLeft = 0;
                    setActiveDotIndex(0);
                    setTimeout(() => {
                        isResettingRef.current = false;
                    }, 100);
                } else {
                    currentScrollContainer.scrollLeft += pixelsPerFrame;
                    // Actualizamos los indicadores solo cada 10 frames para mejor rendimiento
                    if (Math.floor(currentScrollContainer.scrollLeft) % 10 === 0) {
                        updateActiveDotIndicator();
                    }
                }
            }
            animationRef.current = requestAnimationFrame(scrollAnimation);
        };

        if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
            animationRef.current = requestAnimationFrame(scrollAnimation);
        } else {
            setActiveDotIndex(0);
        }

        // Manejo optimizado de eventos de interacción
        const handleMouseEnter = () => { isPausedRef.current = true; };
        const handleMouseLeave = () => { isPausedRef.current = false; };

        // Manejo de eventos táctiles
        const handleTouchStart = (e) => {
            touchStartXRef.current = e.touches[0].clientX;
            isPausedRef.current = true;
        };

        const handleTouchEnd = () => {
            touchStartXRef.current = null;
            // Pequeño retraso antes de reanudar el desplazamiento automático
            setTimeout(() => {
                isPausedRef.current = false;
            }, 1000);
        };

        scrollContainer.addEventListener('mouseenter', handleMouseEnter);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);
        scrollContainer.addEventListener('touchstart', handleTouchStart);
        scrollContainer.addEventListener('touchend', handleTouchEnd);
        scrollContainer.addEventListener('scroll', handleScroll);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (scrollContainer) {
                scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
                scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
                scrollContainer.removeEventListener('touchstart', handleTouchStart);
                scrollContainer.removeEventListener('touchend', handleTouchEnd);
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [loading, carouselProducts, isMobile, isTablet, updateActiveDotIndicator, handleScroll, manuallyPaused]);

    // Navegación optimizada con indicadores
    const handleDotClick = useCallback((index) => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const scrollableWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        if (scrollableWidth <= 0) return;

        let targetScrollLeft;
        if (index === NUM_DOTS - 1) {
            targetScrollLeft = scrollableWidth;
        } else {
            targetScrollLeft = (index / NUM_DOTS) * scrollableWidth;
        }
        targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, scrollableWidth));

        isPausedRef.current = true;
        scrollContainer.style.scrollBehavior = 'smooth';
        scrollContainer.scrollLeft = targetScrollLeft;

        setTimeout(() => {
            scrollContainer.style.scrollBehavior = 'auto';
            isPausedRef.current = false;
            updateActiveDotIndicator();
        }, 500);
    }, [NUM_DOTS, updateActiveDotIndicator]);

    // Estilos memoizados para evitar recálculos
    const dotStyles = useMemo(() => (index) => ({
        width: activeDotIndex === index ? '12px' : '8px',
        height: activeDotIndex === index ? '12px' : '8px',
        borderRadius: '50%',
        bgcolor: activeDotIndex === index ? (vistelicaColors.primary || '#E4B002') : 'rgba(158, 158, 158, 0.5)',
        mx: '4px',
        cursor: 'pointer',
        transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s ease',
        '&:hover': {
            bgcolor: activeDotIndex === index ? (vistelicaColors.primary || '#E4B002') : 'rgba(158, 158, 158, 0.8)',
        }
    }), [activeDotIndex]);

    return (
        <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, md: 4 }, maxWidth: '1800px', mx: 'auto' }}>
            <GlobalStyles
                styles={{
                    '.hide-carousel-scrollbar::-webkit-scrollbar': { display: 'none' },
                    '.hide-carousel-scrollbar': { msOverflowStyle: 'none', scrollbarWidth: 'none' },
                    '@keyframes shimmer': {
                        '0%': { backgroundPosition: '-468px 0' },
                        '100%': { backgroundPosition: '468px 0' }
                    }
                }}
            />
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography
                    variant="h5" component="h2" fontWeight={500} mb={3}
                    sx={{
                        fontFamily: typography.fontFamily || 'Amethysta, sans-serif',
                        color: vistelicaColors.secondary, position: 'relative', display: 'inline-block',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -5,
                            left: 0,
                            width: '60px',
                            height: '2px',
                            backgroundColor: vistelicaColors.primary
                        }
                    }}
                >
                    Accesorios variados
                </Typography>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                )}

                {!loading && carouselProducts.length === 0 && !error && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        No hay accesorios disponibles en este momento.
                    </Alert>
                )}

                <Box
                    ref={scrollContainerRef}
                    className="hide-carousel-scrollbar"
                    role="region"
                    aria-label="Carrusel de accesorios"
                    sx={{
                        display: 'flex', width: '100%', overflowX: 'auto', scrollBehavior: 'auto',
                        pb: 2, gap: 3,
                        '&::before, &::after': { content: '""', minWidth: '1px' },
                        px: { xs: 0, md: 1 }
                    }}
                >
                    {loading ? (
                        Array(isMobile ? 2 : 6).fill(0).map((_, index) => (
                            <Box
                                key={`skeleton-${index}`}
                                sx={{
                                    height: '350px',
                                    width: '350px',
                                    mx: 1.5,
                                    borderRadius: 2,
                                    background: 'linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%)',
                                    backgroundSize: '800px 104px',
                                    animation: 'shimmer 1.5s infinite linear'
                                }}
                            />
                        ))
                    ) : (
                        carouselProducts.map((product, index) => (
                            <CarouselItem
                                key={`${product.product_id || product.id || index}`}
                                product={product}
                            />
                        ))
                    )}
                </Box>
            </motion.div>

            {/* Indicador de Puntos optimizado */}
            {!loading && carouselProducts.length > 0 && (scrollContainerRef.current && scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth) && (
                <Box
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 2 }}
                    role="tablist"
                    aria-label="Navegación del carrusel"
                >
                    {[...Array(NUM_DOTS).keys()].map((index) => (
                        <Box
                            key={`dot-${index}`}
                            onClick={() => handleDotClick(index)}
                            role="tab"
                            tabIndex={0}
                            aria-selected={activeDotIndex === index}
                            aria-label={`Página ${index + 1} de ${NUM_DOTS}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleDotClick(index);
                                }
                            }}
                            sx={dotStyles(index)}
                        />
                    ))}
                </Box>
            )}
        </Container>
    );
};

// Añadimos displayName para mejor depuración
CarouselItem.displayName = 'CarouselItem';

export default AutomaticCarouselWithScrollbar;