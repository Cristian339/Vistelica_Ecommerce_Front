'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button, Box, Typography, CircularProgress, Container, Skeleton, Card } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '../../../services/productService';
import { useRouter } from 'next/navigation';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

// Componente memoizado para el badge de descuento
const DiscountBadge = React.memo(({ discountPercentage }) => {
    if (!discountPercentage || discountPercentage <= 0) return null;

    return (
        <Box
            component={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: vistelicaColors.primary,
                color: '#fff',
                borderRadius: '50%',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
            aria-label={`Descuento del ${discountPercentage}%`}
        >
            -{discountPercentage}%
        </Box>
    );
});

// Componente de tarjeta de producto con memoización
const ProductCard = React.memo(({ product, onClick }) => {
    return (
        <motion.div
            whileHover={{
                y: -10,
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card
                onClick={onClick}
                sx={{
                    height: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        backgroundColor: vistelicaColors.primary,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                        opacity: 1,
                    }
                }}
                role="article"
                aria-label={`Producto: ${product.name}`}
                tabIndex={0}
            >
                <Box
                    sx={{
                        position: 'relative',
                        height: { xs: '220px', sm: '260px', md: '320px' },
                        overflow: 'hidden',
                        backgroundColor: '#f8f8f8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        component={motion.img}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                        }}
                        alt={product.name}
                        src={product.image || product.main_image || '/api/placeholder/400/300'}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/api/placeholder/400/300';
                        }}
                        loading="lazy"
                    />
                    <DiscountBadge discountPercentage={product.discount_percentage} />
                </Box>
                <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: vistelicaColors.secondary,
                            fontFamily: typography.fontFamily,
                            mb: 0.5,
                            fontSize: '0.85rem',
                        }}
                    >
                        {product.subcategory_name || product.brand || ''}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: typography.fontFamily,
                            fontWeight: 400,
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            color: '#333',
                            lineHeight: 1.2,
                            height: '2.4em',
                        }}
                    >
                        {product.name}
                    </Typography>
                    <Box sx={{ mt: 'auto', pt: 1 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: typography.fontFamily,
                                fontWeight: 700,
                                color: vistelicaColors.primary,
                                fontSize: '1.25rem',
                            }}
                        >
                            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </motion.div>
    );
});

// Componente de esqueleto de carga
const ProductCardSkeleton = () => (
    <Box sx={{ height: '100%' }}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '12px', mb: 1 }} />
        <Skeleton variant="text" width="70%" height={24} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="40%" height={20} />
    </Box>
);

// Hook personalizado para la gestión de productos
const useFeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getRandomFeaturedProducts();
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error('Error al cargar productos destacados:', err);
                setError('No se pudieron cargar los productos destacados. Por favor, inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return { products, loading, error };
};

// Hook personalizado para la lógica responsive del slider
const useResponsiveSlider = (initialSlidesToShow, products, currentIndex, setCurrentIndex) => {
    const [slidesToShow, setSlidesToShow] = useState(initialSlidesToShow);
    const [cardWidth, setCardWidth] = useState(100);

    // Calcular el índice máximo basado en el número de slides
    const maxIndex = useMemo(() =>
            Math.max(0, products.length - slidesToShow),
        [products.length, slidesToShow]);

    useEffect(() => {
        const handleResize = () => {
            let newSlidesToShow;

            if (window.innerWidth < 480) {
                newSlidesToShow = 1;
            } else if (window.innerWidth <= 600) {
                newSlidesToShow = 1.2; // Muestra 1 completo y un poco del siguiente
            } else if (window.innerWidth <= 900) {
                newSlidesToShow = 2;
            } else if (window.innerWidth <= 1200) {
                newSlidesToShow = 3;
            } else {
                newSlidesToShow = initialSlidesToShow;
            }

            setSlidesToShow(newSlidesToShow);

            // Ajustar el ancho de la tarjeta según slidesToShow
            const newCardWidth = 100 / newSlidesToShow;
            setCardWidth(newCardWidth);

            // Asegurarse de que currentIndex no exceda el nuevo maxIndex
            const newMaxIndex = Math.max(0, products.length - newSlidesToShow);
            if (currentIndex > newMaxIndex) {
                setCurrentIndex(Math.max(0, newMaxIndex));
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [initialSlidesToShow, products.length, currentIndex, setCurrentIndex]);

    return { slidesToShow, cardWidth, maxIndex };
};

// Componente principal con memoización
const ProductCarousel = React.memo(({
                                        title = "Tendencias de moda",
                                        subtitle = "Descubre las últimas tendencias y los diseños más exclusivos de nuestra colección.",
                                        initialSlidesToShow = 4,
                                        autoPlay = true,
                                        autoPlayInterval = 5000
                                    }) => {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isTouching, setIsTouching] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const progressBarRef = useRef(null);
    const containerRef = useRef(null);
    const autoPlayTimerRef = useRef(null);

    const { products, loading, error } = useFeaturedProducts();
    const { slidesToShow, cardWidth, maxIndex } = useResponsiveSlider(
        initialSlidesToShow,
        products,
        currentIndex,
        setCurrentIndex
    );

    // Calcular el porcentaje de progreso
    const progressPercentage = useMemo(() =>
            maxIndex === 0 ? 100 : (currentIndex / maxIndex) * 100,
        [currentIndex, maxIndex]);

    // Navegar a la página de detalle del producto
    const handleProductClick = useCallback((productId) => {
        router.push(`/product-detail/page?id=${productId}`);
    }, [router]);

    // Ver todos los productos
    const handleSeeAllClick = useCallback(() => {
        router.push('/product-list/productList');
    }, [router]);

    // Navegar a la diapositiva anterior
    const handlePrevious = useCallback(() => {
        setCurrentIndex(prevIndex => {
            if (prevIndex === 0 && maxIndex > 0) {
                // Si está en el inicio, ir al final
                return maxIndex;
            }
            return Math.max(0, prevIndex - 1);
        });
    }, [maxIndex]);

    // Navegar a la siguiente diapositiva
    const handleNext = useCallback(() => {
        setCurrentIndex(prevIndex => {
            if (prevIndex >= maxIndex) {
                // Si está al final, volver al principio
                return 0;
            }
            return prevIndex + 1;
        });
    }, [maxIndex]);

    // Manejar clic en la barra de progreso
    const handleProgressBarClick = useCallback((e) => {
        if (!progressBarRef.current) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const clickPositionRatio = (e.clientX - rect.left) / rect.width;
        const newIndex = Math.floor(clickPositionRatio * (maxIndex + 1));
        setCurrentIndex(Math.min(maxIndex, Math.max(0, newIndex)));
    }, [maxIndex]);

    // Manejar eventos de teclado para accesibilidad
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowLeft') {
            handlePrevious();
        } else if (e.key === 'ArrowRight') {
            handleNext();
        } else if (e.key === ' ') {
            setIsPlaying(prev => !prev);
            e.preventDefault();
        }
    }, [handleNext, handlePrevious]);

    // Manejar inicio de toque (para móvil)
    const handleTouchStart = useCallback((e) => {
        setTouchStart(e.touches[0].clientX);
        setIsTouching(true);
    }, []);

    // Manejar fin de toque (para móvil)
    const handleTouchEnd = useCallback((e) => {
        setIsTouching(false);
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        // Si el deslizamiento fue significativo
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                handleNext();
            } else {
                handlePrevious();
            }
        }
    }, [touchStart, handleNext, handlePrevious]);

    // Alternar reproducción automática
    const toggleAutoPlay = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, []);

    // Configurar reproducción automática
    useEffect(() => {
        if (isPlaying && !isTouching) {
            autoPlayTimerRef.current = setInterval(() => {
                handleNext();
            }, autoPlayInterval);
        }

        return () => {
            if (autoPlayTimerRef.current) {
                clearInterval(autoPlayTimerRef.current);
            }
        };
    }, [isPlaying, isTouching, handleNext, autoPlayInterval]);

    // Pausar al interactuar con el carrusel
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseEnter = () => {
            if (autoPlay) setIsPlaying(false);
        };

        const handleMouseLeave = () => {
            if (autoPlay) setIsPlaying(true);
        };

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [autoPlay]);

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            sx={{
                py: { xs: 4, md: 6 },
                px: { xs: 2, md: 4 },
                background: 'linear-gradient(180deg, #FDFBF6 0%, #FFFFFF 100%)',
                borderRadius: { xs: '0', md: '16px' },
                my: { xs: 3, md: 5 },
                overflow: 'hidden'
            }}
            ref={containerRef}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Carrusel de productos destacados"
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4,
                        flexWrap: { xs: 'wrap', sm: 'nowrap' }
                    }}
                    component={motion.div}
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                        <Typography
                            variant="h4"
                            component={motion.h2}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            sx={{
                                fontFamily: typography.fontFamily,
                                fontWeight: 600,
                                color: vistelicaColors.secondary,
                                position: 'relative',
                                display: 'inline-block',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -8,
                                    left: 0,
                                    width: '60px',
                                    height: '3px',
                                    backgroundColor: vistelicaColors.primary
                                }
                            }}
                        >
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography
                                variant="body1"
                                component={motion.p}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                sx={{
                                    mt: 2,
                                    color: 'text.secondary',
                                    maxWidth: '600px',
                                    fontFamily: typography.fontFamily
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Button
                        variant="text"
                        component={motion.button}
                        whileHover={{ scale: 1.05 }}
                        onClick={handleSeeAllClick}
                        sx={{
                            color: vistelicaColors.primary,
                            fontFamily: typography.fontFamily,
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 214, 0, 0.08)'
                            }
                        }}
                    >
                        Ver todos
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, overflowX: 'hidden' }}>
                            {[...Array(4)].map((_, index) => (
                                <Box key={index} sx={{ width: { xs: '100%', sm: '50%', md: `${100 / initialSlidesToShow}%` }, px: 1 }}>
                                    <ProductCardSkeleton />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ) : error ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 4,
                            color: 'error.main',
                            borderRadius: 2,
                            backgroundColor: 'error.light',
                            opacity: 0.7
                        }}
                    >
                        <Typography>{error}</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={() => window.location.reload()}
                        >
                            Reintentar
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Box
                            sx={{
                                position: 'relative',
                                overflow: 'hidden',
                                mx: -1,
                                height: '100%',
                            }}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Botones de navegación lateral */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: 0,
                                    transform: 'translateY(-50%)',
                                    zIndex: 5,
                                    width: '60px',
                                    height: '60px',
                                    display: { xs: 'none', md: 'flex' },
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0.2,
                                    transition: 'opacity 0.3s ease',
                                    '&:hover': { opacity: 1 },
                                }}
                                component={motion.div}
                                whileHover={{ opacity: 1 }}
                            >
                                <Button
                                    onClick={handlePrevious}
                                    sx={{
                                        minWidth: '44px',
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                        color: vistelicaColors.secondary,
                                        '&:hover': {
                                            backgroundColor: '#ffffff'
                                        }
                                    }}
                                    aria-label="Producto anterior"
                                >
                                    <KeyboardArrowLeftIcon />
                                </Button>
                            </Box>

                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: 0,
                                    transform: 'translateY(-50%)',
                                    zIndex: 5,
                                    width: '60px',
                                    height: '60px',
                                    display: { xs: 'none', md: 'flex' },
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0.2,
                                    transition: 'opacity 0.3s ease',
                                    '&:hover': { opacity: 1 },
                                }}
                                component={motion.div}
                                whileHover={{ opacity: 1 }}
                            >
                                <Button
                                    onClick={handleNext}
                                    sx={{
                                        minWidth: '44px',
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                        color: vistelicaColors.secondary,
                                        '&:hover': {
                                            backgroundColor: '#ffffff'
                                        }
                                    }}
                                    aria-label="Siguiente producto"
                                >
                                    <KeyboardArrowRightIcon />
                                </Button>
                            </Box>

                            <AnimatePresence mode="wait">
                                <Box
                                    component={motion.div}
                                    animate={{
                                        x: `-${currentIndex * (100 / slidesToShow)}%`
                                    }}
                                    transition={{
                                        type: 'tween',
                                        duration: 0.4,
                                        ease: [0.25, 0.1, 0.25, 1.0]  // Curva de aceleración mejorada
                                    }}
                                    sx={{
                                        display: 'flex',
                                        height: '100%',
                                    }}
                                >
                                    {products.map((product) => (
                                        <Box
                                            key={product.product_id}
                                            sx={{
                                                width: `${cardWidth}%`,
                                                flexShrink: 0,
                                                px: 1,
                                                height: '100%',
                                            }}
                                        >
                                            <ProductCard
                                                product={product}
                                                onClick={() => handleProductClick(product.product_id)}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </AnimatePresence>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mt: 4,
                                px: 2
                            }}
                            component={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                aria-label="Producto anterior"
                                sx={{
                                    minWidth: '44px',
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: `1px solid ${vistelicaColors.secondary}`,
                                    color: vistelicaColors.secondary,
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                                onClick={handlePrevious}
                                component={motion.button}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowBackIosNewIcon fontSize="small" />
                            </Button>

                            <Box
                                sx={{
                                    flex: 1,
                                    mx: 2,
                                    height: '4px',
                                    bgcolor: 'rgba(0, 0, 0, 0.1)',
                                    borderRadius: '2px',
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}
                                ref={progressBarRef}
                                onClick={handleProgressBarClick}
                                role="slider"
                                aria-valuemin={0}
                                aria-valuemax={maxIndex}
                                aria-valuenow={currentIndex}
                                tabIndex={0}
                            >
                                <Box
                                    component={motion.div}
                                    animate={{
                                        width: `${progressPercentage}%`,
                                        transition: { ease: "easeOut", duration: 0.4 }
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        height: '100%',
                                        backgroundColor: vistelicaColors.primary,
                                        borderRadius: '2px'
                                    }}
                                />
                            </Box>

                            {autoPlay && (
                                <Button
                                    aria-label={isPlaying ? "Pausar carrusel" : "Reproducir carrusel"}
                                    sx={{
                                        minWidth: '36px',
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: `1px solid ${vistelicaColors.secondary}`,
                                        color: vistelicaColors.secondary,
                                        mx: 1,
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                        }
                                    }}
                                    onClick={toggleAutoPlay}
                                    component={motion.button}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                                </Button>
                            )}

                            <Button
                                aria-label="Siguiente producto"
                                sx={{
                                    minWidth: '44px',
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: `1px solid ${vistelicaColors.secondary}`,
                                    color: vistelicaColors.secondary,
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                                onClick={handleNext}
                                component={motion.button}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowForwardIosIcon fontSize="small" />
                            </Button>
                        </Box>

                        {/* Indicador de índice */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 2
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: '0.8rem',
                                }}
                            >
                                {currentIndex + 1} / {Math.min(products.length, maxIndex + 1)}
                            </Typography>
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
});

// Añadir displayName para mejor depuración
DiscountBadge.displayName = 'DiscountBadge';
ProductCard.displayName = 'ProductCard';
ProductCarousel.displayName = 'ProductCarousel';

export default ProductCarousel;