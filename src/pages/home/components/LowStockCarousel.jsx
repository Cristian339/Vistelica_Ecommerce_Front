import React, { useState, useRef, useEffect } from 'react';
import { Button, Box, Typography, CircularProgress, Container, Skeleton, Card, Chip } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InventoryIcon from '@mui/icons-material/Inventory';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '../../../services/productService';
import { useRouter } from 'next/navigation';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

// Componente de tarjeta de producto con poco stock
const LowStockProductCard = ({ product, onClick }) => {
    // Función para determinar el color del chip según el stock
    const getStockChipColor = (stock) => {
        if (stock <= 5) return { bg: '#ffebee', color: '#c62828', border: '#ffcdd2' };
        if (stock <= 10) return { bg: '#fff3e0', color: '#ef6c00', border: '#ffcc02' };
        return { bg: '#e8f5e8', color: '#2e7d32', border: '#c8e6c8' };
    };

    const stockColors = getStockChipColor(product.stock_quantity);

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
                    />

                    {/* Badge de stock bajo */}
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
                        }}
                    >
                        <InventoryIcon sx={{ fontSize: '0.875rem' }} />
                        Stock: {product.stock_quantity}
                    </Box>

                    {/* Badge de descuento si existe */}
                    {product.discount_percentage > 0 && (
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
                        >
                            -{product.discount_percentage}%
                        </Box>
                    )}
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

                    {/* Colores disponibles */}
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
                                    <Box
                                        key={index}
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            backgroundColor: color.toLowerCase() === 'black' ? '#000' :
                                                color.toLowerCase() === 'white' ? '#fff' :
                                                    color.toLowerCase() === 'blue' ? '#2196f3' :
                                                        color.toLowerCase() === 'red' ? '#f44336' :
                                                            color.toLowerCase() === 'green' ? '#4caf50' :
                                                                color.toLowerCase() === 'yellow' ? '#ffeb3b' :
                                                                    color.toLowerCase() === 'pink' ? '#e91e63' :
                                                                        color.toLowerCase() === 'purple' ? '#9c27b0' :
                                                                            color.toLowerCase() === 'orange' ? '#ff9800' :
                                                                                color.toLowerCase() === 'brown' ? '#795548' :
                                                                                    color.toLowerCase() === 'gray' ? '#9e9e9e' :
                                                                                        color.toLowerCase() === 'beige' ? '#f5f5dc' :
                                                                                            color.toLowerCase() === 'gold' ? '#ffd700' :
                                                                                                '#bdbdbd',
                                            border: color.toLowerCase() === 'white' ? '1px solid #ddd' : 'none',
                                        }}
                                    />
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
};

const LowStockCarousel = ({
                              title = "¡Últimas unidades!",
                              subtitle = "Productos con stock limitado. ¡No dejes pasar la oportunidad de conseguir estos artículos únicos!",
                              initialSlidesToShow = 4
                          }) => {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(initialSlidesToShow);
    const [cardWidth, setCardWidth] = useState(100);
    const containerRef = useRef(null);
    const progressBarRef = useRef(null);

    const handleProductClick = (productId) => {
        router.push(`/product-detail/page?id=${productId}`);
    };

    // Cargar productos con poco stock desde la API
    useEffect(() => {
        const fetchLowStockProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getLowStockProducts();
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error('Error al cargar productos con poco stock:', err);
                setError('No se pudieron cargar los productos con stock bajo. Por favor, inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchLowStockProducts();
    }, []);

    // Calcular el índice máximo basado en el número de slides
    const maxIndex = Math.max(0, products.length - slidesToShow);

    // Efecto para manejar el resize y ajustar el número de slides
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
            // Para valores decimales, calculamos el porcentaje apropiado
            const newCardWidth = 100 / newSlidesToShow;
            setCardWidth(newCardWidth);

            // Asegurarse de que currentIndex no exceda el nuevo maxIndex
            const newMaxIndex = Math.max(0, products.length - newSlidesToShow);
            if (currentIndex > newMaxIndex) {
                setCurrentIndex(newMaxIndex);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [initialSlidesToShow, products.length, currentIndex]);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex === 0 && maxIndex > 0) {
                // Si está en el inicio, ir al final
                return maxIndex;
            }
            return Math.max(0, prevIndex - 1);
        });
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex >= maxIndex) {
                // Si está al final, volver al principio
                return 0;
            }
            return prevIndex + 1;
        });
    };

    const handleProgressBarClick = (e) => {
        if (!progressBarRef.current) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const clickPositionRatio = (e.clientX - rect.left) / rect.width;
        const newIndex = Math.floor(clickPositionRatio * (maxIndex + 1));
        setCurrentIndex(Math.min(maxIndex, Math.max(0, newIndex)));
    };

    // Calcular el porcentaje de progreso
    const progressPercentage = maxIndex === 0 ? 100 : (currentIndex / maxIndex) * 100;

    const handleSeeAllClick = () => {
        router.push('/product-list/productList?filter=lowstock');
    };

    // Si no hay productos con poco stock, no mostrar el componente
    if (!loading && (!products || products.length === 0)) {
        return null;
    }

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
            }}
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
                    >
                        Ver todos
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, overflowX: 'hidden' }}>
                            {[...Array(4)].map((_, index) => (
                                <Box key={index} sx={{ width: { xs: '100%', sm: '50%', md: `${100 / initialSlidesToShow}%` }, px: 1 }}>
                                    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '12px', mb: 1 }} />
                                    <Skeleton variant="text" width="70%" height={24} sx={{ mb: 0.5 }} />
                                    <Skeleton variant="text" width="40%" height={20} />
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
                    </Box>
                ) : (
                    <>
                        <Box
                            sx={{
                                position: 'relative',
                                overflow: 'hidden',
                                mx: -1
                            }}
                        >
                            <AnimatePresence>
                                <Box
                                    component={motion.div}
                                    animate={{
                                        x: `-${currentIndex * (100 / slidesToShow)}%`
                                    }}
                                    transition={{
                                        type: 'tween',
                                        duration: 0.3,
                                        ease: [0.2, 0, 0.3, 1]  // Curva de aceleración personalizada para un movimiento más natural
                                    }}
                                    sx={{
                                        display: 'flex',
                                    }}
                                >
                                    {products.map((product) => (
                                        <Box
                                            key={product.product_id}
                                            sx={{
                                                width: `${cardWidth}%`,
                                                flexShrink: 0,
                                                px: 1
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
                                mt: 3,
                                px: 2
                            }}
                            component={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                color="secondary"
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
                            >
                                <Box
                                    component={motion.div}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0, 0.3, 1] }}
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
                                color="secondary"
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
                            >
                                <ArrowForwardIosIcon fontSize="small" />
                            </Button>
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default LowStockCarousel;