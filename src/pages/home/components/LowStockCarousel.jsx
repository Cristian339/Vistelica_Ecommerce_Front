'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button, Box, Typography, CircularProgress, Container, Skeleton, Card } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InventoryIcon from '@mui/icons-material/Inventory';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '../../../services/productService';
import { useRouter } from 'next/navigation';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

// Componente memoizado para los círculos de color
const ColorCircle = React.memo(({ color }) => {
    const colorMap = {
        black: '#000', white: '#fff', blue: '#2196f3',
        red: '#f44336', green: '#4caf50', yellow: '#ffeb3b',
        pink: '#e91e63', purple: '#9c27b0', orange: '#ff9800',
        brown: '#795548', gray: '#9e9e9e', beige: '#f5f5dc',
        gold: '#ffd700'
    };

    const bgColor = colorMap[color.toLowerCase()] || '#bdbdbd';
    const needsBorder = color.toLowerCase() === 'white';

    return (
        <Box
            sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: bgColor,
                border: needsBorder ? '1px solid #ddd' : 'none',
            }}
        />
    );
});

// Componente para el badge de stock
const StockBadge = React.memo(({ stockQuantity }) => {
    // Memoizar los colores de stock
    const stockColors = useMemo(() => {
        if (stockQuantity <= 5) return { bg: '#ffebee', color: '#c62828', border: '#ffcdd2' };
        if (stockQuantity <= 10) return { bg: '#fff3e0', color: '#ef6c00', border: '#ffcc02' };
        return { bg: '#e8f5e8', color: '#2e7d32', border: '#c8e6c8' };
    }, [stockQuantity]);

    return (
        <Box
            component={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                backgroundColor: stockColors.bg,
                color: stockColors.color,
                border: `1px solid ${stockColors.border}`,
                borderRadius: '20px',
                px: 1.5,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontWeight: 'bold',
                fontSize: '0.75rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 2,
            }}
        >
            <InventoryIcon sx={{ fontSize: '0.875rem' }} />
            Stock: {stockQuantity}
        </Box>
    );
});

// Componente para el badge de descuento
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
                zIndex: 2,
            }}
        >
            -{discountPercentage}%
        </Box>
    );
});

// Componente de tarjeta de producto con poco stock (memoizado)
const LowStockProductCard = React.memo(({ product, onClick }) => {
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
                role="button"
                aria-label={`Ver detalles de ${product.name}`}
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
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/api/placeholder/400/300';
                        }}
                    />

                    <StockBadge stockQuantity={product.stock_quantity} />
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

                    {/* Colores disponibles - Componente optimizado */}
                    {product.colors && product.colors.length > 0 && (
                        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: '0.75rem',
                                    fontFamily: typography.fontFamily
                                }}
                            >
                                Colores:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {product.colors.slice(0, 3).map((color, index) => (
                                    <ColorCircle key={index} color={color} />
                                ))}
                                {product.colors.length > 3 && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: '0.7rem',
                                            color: 'text.secondary',
                                            ml: 0.5
                                        }}
                                    >
                                        +{product.colors.length - 3}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}

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

// Componente de esqueleto de carga personalizado
const ProductCardSkeleton = () => (
    <Box sx={{ height: '100%' }}>
        <Skeleton
            variant="rectangular"
            height={320}
            sx={{
                borderRadius: '12px 12px 0 0',
                animation: 'pulse 1.5s ease-in-out 0.5s infinite'
            }}
        />
        <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="30%" height={16} sx={{ mb: 1 }} />
            <Box sx={{ pt: 1, mt: 'auto' }}>
                <Skeleton variant="rectangular" width="40%" height={32} sx={{ borderRadius: 1 }} />
            </Box>
        </Box>
    </Box>
);

// Hook personalizado para la lógica de fetch
const useLowStockProducts = () => {
    const [state, setState] = useState({
        products: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            try {
                const data = await productService.getLowStockProducts();
                if (isMounted) {
                    setState({
                        products: data,
                        loading: false,
                        error: null
                    });
                }
            } catch (err) {
                console.error('Error al cargar productos con poco stock:', err);
                if (isMounted) {
                    setState({
                        products: [],
                        loading: false,
                        error: 'No se pudieron cargar los productos. Inténtalo más tarde.'
                    });
                }
            }
        };

        fetchProducts();

        // Limpieza
        return () => {
            isMounted = false;
        };
    }, []);

    return state;
};

// Hook personalizado para la lógica de responsive
const useResponsiveSlider = (initialSlidesToShow, products, currentIndex) => {
    const [slidesToShow, setSlidesToShow] = useState(initialSlidesToShow);
    const [cardWidth, setCardWidth] = useState(100);

    useEffect(() => {
        const handleResize = () => {
            let newSlidesToShow;

            if (window.innerWidth < 480) {
                newSlidesToShow = 1;
            } else if (window.innerWidth <= 600) {
                newSlidesToShow = 1.2;
            } else if (window.innerWidth <= 900) {
                newSlidesToShow = 2;
            } else if (window.innerWidth <= 1200) {
                newSlidesToShow = 3;
            } else {
                newSlidesToShow = initialSlidesToShow;
            }

            setSlidesToShow(newSlidesToShow);
            setCardWidth(100 / newSlidesToShow);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [initialSlidesToShow]);

    // Calcular el índice máximo con memoización para evitar cálculos innecesarios
    const maxIndex = useMemo(() =>
            Math.max(0, products.length - slidesToShow),
        [products.length, slidesToShow]
    );

    return { slidesToShow, cardWidth, maxIndex };
};

// Componente principal con memoización
const LowStockCarousel = React.memo(({
                                         title = "¡Últimas unidades!",
                                         subtitle = "Productos con stock limitado. ¡No dejes pasar la oportunidad de conseguir estos artículos únicos!",
                                         initialSlidesToShow = 4
                                     }) => {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [touchStart, setTouchStart] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const progressBarRef = useRef(null);
    const autoPlayTimerRef = useRef(null);

    // Usar hooks personalizados
    const { products, loading, error } = useLowStockProducts();
    const { slidesToShow, cardWidth, maxIndex } = useResponsiveSlider(
        initialSlidesToShow, products, currentIndex
    );

    // Funciones para navegación con memoización
    const handleProductClick = useCallback((productId) => {
        router.push(`/product-detail/page?id=${productId}`);
    }, [router]);

    const handlePrevious = useCallback(() => {
        setCurrentIndex(prevIndex =>
            prevIndex === 0 && maxIndex > 0 ? maxIndex : Math.max(0, prevIndex - 1)
        );
    }, [maxIndex]);

    const handleNext = useCallback(() => {
        setCurrentIndex(prevIndex =>
            prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
    }, [maxIndex]);

    const handleProgressBarClick = useCallback((e) => {
        if (!progressBarRef.current) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const clickPositionRatio = (e.clientX - rect.left) / rect.width;
        const newIndex = Math.floor(clickPositionRatio * (maxIndex + 1));
        setCurrentIndex(Math.min(maxIndex, Math.max(0, newIndex)));
    }, [maxIndex]);

    const handleSeeAllClick = useCallback(() => {
        router.push('/product-list/productList?filter=lowstock');
    }, [router]);

    // Auto-play
    useEffect(() => {
        if (isAutoPlaying && products.length > 0 && !isSwiping) {
            autoPlayTimerRef.current = setInterval(() => {
                handleNext();
            }, 5000);
        }

        return () => {
            if (autoPlayTimerRef.current) {
                clearInterval(autoPlayTimerRef.current);
            }
        };
    }, [isAutoPlaying, products.length, handleNext, isSwiping]);

    // Touch events para swipe en móviles
    const handleTouchStart = useCallback((e) => {
        setTouchStart(e.touches[0].clientX);
        setIsSwiping(true);
        if (autoPlayTimerRef.current) {
            clearInterval(autoPlayTimerRef.current);
        }
    }, []);

    const handleTouchEnd = useCallback((e) => {
        setIsSwiping(false);
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > 50) { // umbral de swipe
            if (diff > 0) {
                handleNext();
            } else {
                handlePrevious();
            }
        }
    }, [touchStart, handleNext, handlePrevious]);

    // Calcular el porcentaje de progreso
    const progressPercentage = useMemo(() =>
            maxIndex === 0 ? 100 : (currentIndex / maxIndex) * 100,
        [currentIndex, maxIndex]
    );

    // No mostrar componente si no hay productos
    if (!loading && (!products || products.length === 0)) {
        return null;
    }

    // Navegación con teclado
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') handlePrevious();
        else if (e.key === 'ArrowRight') handleNext();
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            sx={{
                py: { xs: 4, md: 6 },
                px: { xs: 2, md: 4 },
                background: 'linear-gradient(180deg, #fff5f5 0%, #FFFFFF 100%)',
                borderRadius: { xs: '0', md: '16px' },
                my: { xs: 3, md: 5 },
                overflow: 'hidden',
                border: '1px solid rgba(255, 107, 107, 0.1)',
                position: 'relative',
            }}
            onKeyDown={handleKeyDown}
            tabIndex="0"
            role="region"
            aria-label="Carrusel de productos con poco stock"
        >
            <Container maxWidth="xl">
                {/* Cabecera */}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <InventoryIcon sx={{ color: '#ff6b6b', fontSize: '2rem' }} />
                            <Typography
                                variant="h4"
                                component={motion.h2}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                sx={{
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 600,
                                    color: '#ff6b6b',
                                    position: 'relative',
                                    display: 'inline-block',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -8,
                                        left: 0,
                                        width: '60px',
                                        height: '3px',
                                        backgroundColor: '#ff6b6b'
                                    }
                                }}
                            >
                                {title}
                            </Typography>
                        </Box>
                        {subtitle && (
                            <Typography
                                variant="body1"
                                component={motion.p}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                sx={{
                                    mt: 1,
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
                            color: '#ff6b6b',
                            fontFamily: typography.fontFamily,
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 107, 107, 0.08)'
                            }
                        }}
                        aria-label="Ver todos los productos con poco stock"
                    >
                        Ver todos
                    </Button>
                </Box>

                {/* Estado de carga */}
                {loading ? (
                    <Box sx={{ mt: 2 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                overflowX: 'hidden',
                                mx: -1
                            }}
                        >
                            {[...Array(4)].map((_, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        width: {
                                            xs: '100%',
                                            sm: '50%',
                                            md: `${100 / initialSlidesToShow}%`
                                        },
                                        px: 1
                                    }}
                                >
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
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 82, 82, 0.1)',
                            border: '1px solid rgba(255, 82, 82, 0.2)',
                            my: 2
                        }}
                    >
                        <Typography
                            color="error"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1
                            }}
                        >
                            {error}
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{ mt: 2, textTransform: 'none' }}
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
                            {/* Indicadores laterales de navegación */}
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
                                        color: '#ff6b6b',
                                        '&:hover': {
                                            backgroundColor: '#ffffff'
                                        }
                                    }}
                                    aria-label="Anterior producto"
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
                                        color: '#ff6b6b',
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
                                            <LowStockProductCard
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
                                    border: `1px solid #ff6b6b`,
                                    color: '#ff6b6b',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 107, 107, 0.04)'
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
                                    bgcolor: 'rgba(255, 107, 107, 0.2)',
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
                                        backgroundColor: '#ff6b6b',
                                        borderRadius: '2px'
                                    }}
                                />
                            </Box>

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
                                    border: `1px solid #ff6b6b`,
                                    color: '#ff6b6b',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 107, 107, 0.04)'
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
ColorCircle.displayName = 'ColorCircle';
StockBadge.displayName = 'StockBadge';
DiscountBadge.displayName = 'DiscountBadge';
LowStockProductCard.displayName = 'LowStockProductCard';
LowStockCarousel.displayName = 'LowStockCarousel';

export default LowStockCarousel;