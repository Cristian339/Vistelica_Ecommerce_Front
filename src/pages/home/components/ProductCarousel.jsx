
import React, { useState, useRef, useEffect } from 'react';
import { Button, Box, Typography, CircularProgress, Container, Skeleton, Card } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '../../../services/productService';
import { useRouter } from 'next/navigation';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

// Componente de tarjeta de producto con animación
const ProductCard = ({ product, onClick }) => {
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
                            fontWeight: 600,
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
};

const ProductCarousel = ({
                             title = "Tendencias de moda",
                             subtitle = "Descubre las últimas tendencias y los diseños más exclusivos de nuestra colección.",
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

    // Cargar productos destacados desde la API
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
        setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(maxIndex, prevIndex + 1));
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
        router.push('/product-list/productList');
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
                background: 'linear-gradient(180deg, #FDFBF6 0%, #FFFFFF 100%)',
                borderRadius: { xs: '0', md: '16px' },
                my: { xs: 3, md: 5 },
                overflow: 'hidden'
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
                                        type: 'spring',
                                        stiffness: 50,
                                        damping: 20
                                    }}
                                    sx={{
                                        display: 'flex',
                                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
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
                                    border: `1px solid ${vistelicaColors.secondary}`,
                                    color: vistelicaColors.secondary,
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    },
                                    '&.Mui-disabled': {
                                        opacity: 0.3,
                                        color: 'text.disabled'
                                    }
                                }}
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
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
                            >
                                <Box
                                    component={motion.div}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ type: 'spring', stiffness: 50 }}
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
                                    border: `1px solid ${vistelicaColors.secondary}`,
                                    color: vistelicaColors.secondary,
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    },
                                    '&.Mui-disabled': {
                                        opacity: 0.3,
                                        color: 'text.disabled'
                                    }
                                }}
                                onClick={handleNext}
                                disabled={currentIndex >= maxIndex}
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

export default ProductCarousel;