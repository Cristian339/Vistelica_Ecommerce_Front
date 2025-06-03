'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button, Box, Typography, CircularProgress, Container, Skeleton, Card, Tooltip } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InventoryIcon from '@mui/icons-material/Inventory';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TimerIcon from '@mui/icons-material/Timer';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '../../../services/productService';
import { useRouter } from 'next/navigation';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

// Componente para los círculos de color mejorado
const ColorCircle = React.memo(({ color }) => {
    const colorMap = {
        black: '#000', white: '#fff', blue: '#1e88e5',
        red: '#e53935', green: '#43a047', yellow: '#fdd835',
        pink: '#d81b60', purple: '#8e24aa', orange: '#fb8c00',
        brown: '#6d4c41', gray: '#757575', beige: '#f5f5dc',
        gold: '#ffd700', navy: '#0d47a1', silver: '#bdbdbd'
    };

    const bgColor = colorMap[color.toLowerCase()] || '#bdbdbd';
    const needsBorder = ['white', 'yellow', 'beige'].includes(color.toLowerCase());

    return (
        <motion.div
            whileHover={{ scale: 1.3, y: -2 }}
            whileTap={{ scale: 0.9 }}
            style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: bgColor,
                marginRight: '6px',
                border: needsBorder ? '1px solid #aaa' : 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                position: 'relative',
                cursor: 'pointer'
            }}
            title={color}
        />
    );
});

// Componente para el badge de stock mejorado visual y animado
const StockBadge = React.memo(({ stockQuantity }) => {
    const stockConfig = useMemo(() => {
        if (stockQuantity <= 3) return {
            bg: 'linear-gradient(135deg, rgba(255,59,48,0.95) 0%, rgba(255,36,0,0.95) 100%)',
            color: '#ffffff',
            icon: <LocalFireDepartmentIcon
                sx={{
                    fontSize: '1rem',
                    mr: 0.5,
                    animation: 'pulseStock 1.5s infinite',
                    '@keyframes pulseStock': {
                        '0%': { opacity: 0.7 },
                        '50%': { opacity: 1 },
                        '100%': { opacity: 0.7 },
                    }
                }}
            />,
            text: '¡Últimas unidades!'
        };

        if (stockQuantity <= 8) return {
            bg: 'linear-gradient(135deg, rgba(255,149,0,0.95) 0%, rgba(255,111,0,0.95) 100%)',
            color: '#ffffff',
            icon: <TimerIcon sx={{ fontSize: '1rem', mr: 0.5 }} />,
            text: `¡Solo ${stockQuantity} disponibles!`
        };

        return {
            bg: 'linear-gradient(135deg, rgba(52,199,89,0.95) 0%, rgba(48,180,80,0.95) 100%)',
            color: '#ffffff',
            icon: <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5 }} />,
            text: 'Disponible'
        };
    }, [stockQuantity]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 10
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    background: stockConfig.bg,
                    color: stockConfig.color,
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    paddingX: stockQuantity <= 3 ? 1.8 : 1.5,
                    paddingY: 0.6,
                    boxShadow: stockQuantity <= 3 ?
                        '0px 4px 12px rgba(255,59,48,0.4), 0 0 0 2px rgba(255,255,255,0.2)' :
                        '0px 3px 8px rgba(0,0,0,0.15)',
                    fontSize: '0.75rem',
                    lineHeight: 1.1,
                    border: stockQuantity <= 3 ?
                        '1px solid rgba(255,255,255,0.3)' :
                        'none',
                    animation: stockQuantity <= 3 ? 'glowStock 2s infinite alternate' : 'none',
                    '@keyframes glowStock': {
                        '0%': { boxShadow: '0px 4px 12px rgba(255,59,48,0.4), 0 0 0 2px rgba(255,255,255,0.2)' },
                        '100%': { boxShadow: '0px 4px 15px rgba(255,59,48,0.7), 0 0 0 3px rgba(255,255,255,0.25)' }
                    }
                }}
            >
                {stockConfig.icon}
                {stockConfig.text}
            </Box>
        </motion.div>
    );
});

// Componente para el badge de descuento mejorado con animación
const DiscountBadge = React.memo(({ discountPercentage }) => {
    if (!discountPercentage || discountPercentage <= 0) return null;

    return (
        <motion.div
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
                type: "spring",
                damping: 12,
                stiffness: 300,
                delay: 0.2
            }}
            whileHover={{
                scale: 1.1,
                rotate: -5,
                transition: { duration: 0.2 }
            }}
            style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 10
            }}
        >
            <Box sx={{
                background: 'linear-gradient(135deg, #f5365c 0%, #f33 100%)',
                color: 'white',
                fontSize: discountPercentage >= 30 ? '1.1rem' : '0.95rem',
                fontWeight: 800,
                borderRadius: '50%',
                width: discountPercentage >= 30 ? 65 : 58,
                height: discountPercentage >= 30 ? 65 : 58,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(243, 51, 51, 0.35)',
                border: '2px solid rgba(255,255,255,0.5)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-15px',
                    left: '-15px',
                    right: '-15px',
                    bottom: '-15px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
                    opacity: 0.7,
                    animation: 'pulseLight 2s infinite'
                },
                '@keyframes pulseLight': {
                    '0%': { opacity: 0.4, transform: 'scale(1)' },
                    '50%': { opacity: 0.2, transform: 'scale(1.1)' },
                    '100%': { opacity: 0.4, transform: 'scale(1)' }
                }
            }}>
                <Typography
                    sx={{
                        lineHeight: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        fontFamily: typography.fontFamily
                    }}
                >
                    <span style={{ fontSize: '65%', fontWeight: 600 }}>AHORRA</span>
                    <span>{discountPercentage}%</span>
                </Typography>
            </Box>
        </motion.div>
    );
});

// Componente de tarjeta de producto mejorado
const LowStockProductCard = React.memo(({ product, onClick }) => {
    const isHotDeal = product.stock_quantity <= 3;
    const hasDiscount = product.discount_percentage > 0;

    return (
        <motion.div
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                type: "spring",
                damping: 20
            }}
            style={{ height: '100%' }}
        >
            <Card
                onClick={() => onClick(product.product_id)}
                sx={{
                    height: '100%',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    boxShadow: isHotDeal ?
                        '0 8px 25px rgba(255, 59, 48, 0.15)' :
                        '0 8px 20px rgba(0, 0, 0, 0.08)',
                    border: isHotDeal ?
                        '1px solid rgba(255, 59, 48, 0.2)' :
                        '1px solid rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.4s ease',
                    '&:hover': {
                        boxShadow: isHotDeal ?
                            '0 14px 30px rgba(255, 59, 48, 0.25)' :
                            '0 14px 25px rgba(0, 0, 0, 0.12)',
                        '& .product-image': {
                            transform: 'scale(1.08)'
                        },
                        '& .view-details': {
                            opacity: 1,
                            transform: 'translateY(0)'
                        }
                    }
                }}
            >
                {/* Badges de stock y descuento */}
                <StockBadge stockQuantity={product.stock_quantity} />
                <DiscountBadge discountPercentage={product.discount_percentage} />

                {/* Imagen del producto */}
                <Box sx={{
                    position: 'relative',
                    height: { xs: '220px', sm: '240px', md: '280px' },
                    overflow: 'hidden',
                    backgroundColor: '#f8f8f8',
                    '&::after': isHotDeal ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '70px',
                        background: 'linear-gradient(to top, rgba(255,59,48,0.08), transparent)',
                        zIndex: 1
                    } : {}
                }}>
                    <Box
                        component="img"
                        className="product-image"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }}
                        src={product.image || product.main_image || '/api/placeholder/400/300'}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/api/placeholder/400/300';
                        }}
                    />


                </Box>

                {/* Contenido de la tarjeta */}
                <Box sx={{
                    p: 2.2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '180px'
                }}>
                    {/* Categoría */}
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: 'text.secondary',
                            fontFamily: typography.fontFamily,
                            mb: 0.5,
                            fontSize: '0.85rem',
                            fontWeight: 500
                        }}
                    >
                        {product.subcategory_name || product.brand || ''}
                    </Typography>

                    {/* Nombre del producto */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: typography.fontFamily,
                            fontWeight: 500,
                            fontSize: '1.05rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            height: '2.5em',
                            lineHeight: 1.25,
                            mb: 1
                        }}
                    >
                        {product.name}
                    </Typography>

                    {/* Colores disponibles */}
                    {product.colors && product.colors.length > 0 && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1.5
                        }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: '0.8rem',
                                    mr: 1
                                }}
                            >
                                Colores:
                            </Typography>
                            <Box sx={{ display: 'flex' }}>
                                {product.colors.slice(0, 4).map((color, index) => (
                                    <ColorCircle key={index} color={color} />
                                ))}
                                {product.colors.length > 4 && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: 'text.secondary',
                                            ml: 0.5,
                                            mt: 0.5
                                        }}
                                    >
                                        +{product.colors.length - 4}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* Precio */}
                    <Box sx={{
                        mt: 'auto',
                        display: 'flex',
                        alignItems: 'flex-end'
                    }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: typography.fontFamily,
                                fontWeight: 700,
                                fontSize: '1.4rem',
                                color: hasDiscount ? '#f5365c' : vistelicaColors.primary,
                                mr: 1,
                                lineHeight: 1
                            }}
                        >
                            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                        </Typography>

                        {/* Precio original si hay descuento */}
                        {hasDiscount && product.original_price && (
                            <Typography
                                sx={{
                                    fontFamily: typography.fontFamily,
                                    fontSize: '1rem',
                                    color: 'text.secondary',
                                    textDecoration: 'line-through',
                                    mb: 0.3
                                }}
                            >
                                ${typeof product.original_price === 'number' ?
                                product.original_price.toFixed(2) :
                                product.original_price}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Card>
        </motion.div>
    );
});

// Componente para los controles de navegación
const NavigationControls = React.memo(({
                                           onPrevious,
                                           onNext,
                                           currentIndex,
                                           maxIndex,
                                           onProgressClick,
                                           progressBarRef,
                                           progressPercentage,
                                           title  // Añadido title como prop
                                       }) => {
    return (
        <>
            {/* Encabezado con icono de fuego y "¡Aprovecha!" */}
            <Box
                component={motion.div}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 1
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalFireDepartmentIcon
                        sx={{
                            color: '#ff6b6b',
                            fontSize: '2rem',
                            animation: 'pulseIcon 2s infinite',
                            '@keyframes pulseIcon': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.1)' },
                                '100%': { transform: 'scale(1)' }
                            }
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: typography.fontFamily,
                            fontWeight: 700,
                            color: '#D32F2F',
                            fontSize: '1.3rem',
                            textShadow: '0px 1px 2px rgba(0,0,0,0.3)'
                        }}
                    >
                        ¡Aprovecha!
                    </Typography>
                </Box>
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: typography.fontFamily,
                        fontWeight: 700,
                        color: '#ff6b6b',
                        fontSize: { xs: '1.75rem', md: '2rem' },
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: 0,
                            width: '40%',
                            height: '3px',
                            background: 'linear-gradient(90deg, #ff6b6b, transparent)'
                        }
                    }}
                >
                    {title}
                </Typography>
            </Box>

            {/* Controles de navegación */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, mb: 2 }}>
                <Tooltip title="Anterior">
                    <Button
                        onClick={onPrevious}
                        sx={{
                            minWidth: 'auto',
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            color: '#ff6b6b',
                            border: '2px solid rgba(255, 107, 107, 0.3)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 107, 107, 0.08)',
                                borderColor: '#ff6b6b'
                            }
                        }}
                        component={motion.button}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ArrowBackIosNewIcon fontSize="small" />
                    </Button>
                </Tooltip>

                {/* Barra de progreso */}
                <Box
                    sx={{
                        flex: 1,
                        height: '8px',
                        bgcolor: 'rgba(255, 107, 107, 0.15)',
                        borderRadius: '4px',
                        position: 'relative',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                    }}
                    ref={progressBarRef}
                    onClick={onProgressClick}
                    role="slider"
                    aria-valuemin={0}
                    aria-valuemax={maxIndex}
                    aria-valuenow={currentIndex}
                >
                    <Box
                        component={motion.div}
                        animate={{
                            width: `${progressPercentage}%`
                        }}
                        transition={{ type: "spring", stiffness: 100 }}
                        sx={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #ff6b6b 0%, #ff8e8e 100%)',
                            borderRadius: '4px'
                        }}
                    />

                    {/* Indicador circular en la barra */}
                    <Box
                        component={motion.div}
                        animate={{
                            left: `${progressPercentage}%`
                        }}
                        transition={{ type: "spring", stiffness: 100 }}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            bgcolor: '#ff6b6b',
                            border: '2px solid white',
                            boxShadow: '0 0 5px rgba(0,0,0,0.3)'
                        }}
                    />
                </Box>

                {/* Botón Siguiente */}
                <Tooltip title="Siguiente">
                    <Button
                        onClick={onNext}
                        sx={{
                            minWidth: 'auto',
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            color: '#ff6b6b',
                            border: '2px solid rgba(255, 107, 107, 0.3)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 107, 107, 0.08)',
                                borderColor: '#ff6b6b'
                            }
                        }}
                        component={motion.button}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ArrowForwardIosIcon fontSize="small" />
                    </Button>
                </Tooltip>
            </Box>
        </>
    );
});

// Componente de esqueleto de carga mejorado
const ProductCardSkeleton = () => (
    <Box sx={{ height: '100%' }}>
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 1
            }}
        >
            <Card
                sx={{
                    height: '100%',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: '#fff',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                    border: '1px solid rgba(0,0,0,0.06)'
                }}
            >
                <Skeleton
                    variant="rectangular"
                    height={280}
                    animation="wave"
                />
                <Box sx={{ p: 2.2 }}>
                    <Skeleton variant="text" width="30%" height={18} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="85%" height={26} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="70%" height={26} sx={{ mb: 1.5 }} />
                    <Skeleton variant="text" width="40%" height={16} sx={{ mb: 1.5 }} />
                    <Skeleton variant="rectangular" width="50%" height={32} sx={{ borderRadius: 1 }} />
                </Box>
            </Card>
        </motion.div>
    </Box>
);

// Hooks personalizados mantenidos tal cual
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

        return () => {
            isMounted = false;
        };
    }, []);

    return state;
};

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

    const maxIndex = useMemo(() =>
            Math.max(0, products.length - slidesToShow),
        [products.length, slidesToShow]
    );

    return { slidesToShow, cardWidth, maxIndex };
};

// Componente principal
const LowStockCarousel = React.memo(({
                                         title = "¡Últimas unidades!",
                                         subtitle = "Productos con stock limitado. ¡No dejes pasar la oportunidad!",
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
            prevIndex === 0 ? maxIndex : Math.max(0, prevIndex - 1)
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

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
                py: { xs: 4, md: 6 },
                background: 'linear-gradient(180deg, #fff5f5 0%, #FFFFFF 100%)',
                borderRadius: { xs: '0', md: '20px' },
                mx: { xs: 0, md: 2 },
                my: { xs: 3, md: 5 },
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '5px',
                    background: 'linear-gradient(90deg, #ff6b6b, #f5365c)'
                }
            }}
            onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') handlePrevious();
                else if (e.key === 'ArrowRight') handleNext();
            }}
            tabIndex="0"
            role="region"
            aria-label="Carrusel de productos con poco stock"
        >
            <Container maxWidth="xl">
                {/* Cabecera mejorada */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4,
                        flexWrap: { xs: 'wrap', sm: 'nowrap' }
                    }}
                >
                    <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                        <Box
                            component={motion.div}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                mb: 1
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 700,
                                    color: '#ff6b6b',
                                    fontSize: { xs: '1.75rem', md: '2rem' },
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -8,
                                        left: 0,
                                        width: '40%',
                                        height: '3px',
                                        background: 'linear-gradient(90deg, #ff6b6b, transparent)'
                                    }
                                }}
                            >
                                {title}
                            </Typography>
                        </Box>

                        {subtitle && (
                            <Typography
                                component={motion.p}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                variant="body1"
                                sx={{
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
                        variant="outlined"
                        onClick={handleSeeAllClick}
                        component={motion.button}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        sx={{
                            color: '#ff6b6b',
                            borderColor: '#ff6b6b',
                            fontWeight: 600,
                            borderRadius: '8px',
                            px: 2.5,
                            py: 1,
                            textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(255,107,107,0.15)',
                            '&:hover': {
                                borderColor: '#e55757',
                                backgroundColor: 'rgba(255,107,107,0.08)',
                                boxShadow: '0 4px 12px rgba(255,107,107,0.25)'
                            }
                        }}
                    >
                        Ver todos
                    </Button>
                </Box>

                {/* Estado de carga */}
                {loading ? (
                    <Box sx={{ mt: 2 }}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: '1fr 1fr',
                                    md: '1fr 1fr 1fr',
                                    lg: '1fr 1fr 1fr 1fr'
                                },
                                gap: 3,
                                px: 1
                            }}
                        >
                            {[...Array(4)].map((_, index) => (
                                <Box key={index} sx={{ height: '480px' }}>
                                    <ProductCardSkeleton />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ) : error ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 5,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 82, 82, 0.1)',
                            border: '1px solid rgba(255, 82, 82, 0.2)'
                        }}
                    >
                        <Typography color="error" variant="h6">
                            {error}
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{ mt: 2 }}
                            onClick={() => window.location.reload()}
                        >
                            Reintentar
                        </Button>
                    </Box>
                ) : (
                    <>
                        {/* Carrusel de productos */}
                        <Box
                            sx={{
                                position: 'relative',
                                overflow: 'hidden',
                                mx: -1,
                                height: '100%',
                                py: 2
                            }}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Botones laterales para escritorio */}
                            <Box
                                component={motion.div}
                                whileHover={{ opacity: 1, x: 5 }}
                                sx={{
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 10,
                                    opacity: 0.2,
                                    display: { xs: 'none', md: 'block' }
                                }}
                            >
                                <Button
                                    onClick={handlePrevious}
                                    sx={{
                                        minWidth: '48px',
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        boxShadow: '0 3px 12px rgba(0,0,0,0.12)',
                                        color: '#ff6b6b',
                                        '&:hover': {
                                            backgroundColor: '#ffffff',
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.15)'
                                        }
                                    }}
                                >
                                    <KeyboardArrowLeftIcon />
                                </Button>
                            </Box>

                            <Box
                                component={motion.div}
                                whileHover={{ opacity: 1, x: -5 }}
                                sx={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 10,
                                    opacity: 0.2,
                                    display: { xs: 'none', md: 'block' }
                                }}
                            >
                                <Button
                                    onClick={handleNext}
                                    sx={{
                                        minWidth: '48px',
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        boxShadow: '0 3px 12px rgba(0,0,0,0.12)',
                                        color: '#ff6b6b',
                                        '&:hover': {
                                            backgroundColor: '#ffffff',
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.15)'
                                        }
                                    }}
                                >
                                    <KeyboardArrowRightIcon />
                                </Button>
                            </Box>

                            {/* Carrusel con animaciones mejoradas */}
                            <AnimatePresence mode="wait">
                                <Box
                                    component={motion.div}
                                    animate={{
                                        x: `-${currentIndex * (100 / slidesToShow)}%`
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 30
                                    }}
                                    sx={{
                                        display: 'flex',
                                        height: '100%',
                                        px: 1
                                    }}
                                >
                                    {products.map((product) => (
                                        <Box
                                            key={product.product_id}
                                            sx={{
                                                width: `${cardWidth}%`,
                                                flexShrink: 0,
                                                px: 1.5,
                                                height: '100%'
                                            }}
                                        >
                                            <LowStockProductCard
                                                product={product}
                                                onClick={handleProductClick}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </AnimatePresence>
                        </Box>

                        {/* Controles de navegación inferiores */}
                        <NavigationControls
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            currentIndex={currentIndex}
                            maxIndex={maxIndex}
                            onProgressClick={handleProgressBarClick}
                            progressBarRef={progressBarRef}
                            progressPercentage={progressPercentage}
                        />

                        {/* Indicador de página actual */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mt: 2
                            }}
                        >
                            <Typography
                                component={motion.div}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                    times: [0, 0.5, 1],
                                    repeat: 0,
                                    repeatDelay: 0
                                }}
                                key={currentIndex}
                                variant="caption"
                                sx={{
                                    backgroundColor: 'rgba(255,107,107,0.15)',
                                    color: '#ff6b6b',
                                    fontWeight: 'bold',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: '12px',
                                    fontSize: '0.8rem'
                                }}
                            >
                                {currentIndex + 1} de {Math.min(products.length, maxIndex + 1)}
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
NavigationControls.displayName = 'NavigationControls';
ProductCardSkeleton.displayName = 'ProductCardSkeleton';
LowStockCarousel.displayName = 'LowStockCarousel';

export default LowStockCarousel;