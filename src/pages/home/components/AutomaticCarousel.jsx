import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardMedia,
    CardContent,
    useMediaQuery,
    useTheme,
    GlobalStyles
} from '@mui/material';
import { motion } from 'framer-motion';
import productService from '@/services/productService';
import { useRouter } from 'next/navigation';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const CarouselItem = ({ product }) => {
    const router = useRouter();

    const handleProductClickDetail = (productId) => {
        if (router) {
            router.push(`/product-detail/page?id=${productId}`);
        } else {
            console.error('Router is not available.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                onClick={() => handleProductClickDetail(product.product_id)}
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
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
                        <CardMedia
                            component="img"
                            image={product.main_image || product.mainImage}
                            alt={product.name}
                            loading="eager"
                            sx={{
                                objectFit: 'contain',
                                height: '100%',
                                width: '100%'
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
                            fontFamily: typography.fontFamily,
                            fontSize: '1rem',
                            fontWeight: 500
                        }}
                    >
                        {product.name}
                    </Typography>
                    <Typography
                        variant="body1"
                        fontWeight={600}
                        sx={{
                            color: vistelicaColors.primary,
                            fontSize: '1.15rem'
                        }}
                    >
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const AutomaticCarouselWithScrollbar = () => {
    const scrollContainerRef = useRef(null);
    const scrollbarRef = useRef(null);
    const isPausedRef = useRef(false);
    const animationRef = useRef(null);
    const isResettingRef = useRef(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [initialScrollLeft, setInitialScrollLeft] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar productos desde la API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getRandomAccessoryProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error al cargar los accesorios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const carouselProducts = products;

    // Lógica para actualizar la posición de la barra de desplazamiento
    const updateScrollbarPosition = () => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const scrollableWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        if (scrollableWidth <= 0) return;

        const percentage = scrollContainer.scrollLeft / scrollableWidth;
        const scrollbarWidth = 15; // Ancho de la barra (15%)
        const maxPercentage = 100 - scrollbarWidth;

        // Forzamos la actualización del estado para reflejar el movimiento actual
        setScrollPercentage(Math.min(percentage * 100, maxPercentage));
    };

    // Manejar el scroll automático y actualizar la posición de la barra
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer || loading || products.length === 0) return;

        // Resetear posición inicial
        scrollContainer.scrollLeft = 0;

        // Velocidad del desplazamiento (pixeles por frame)
        const pixelsPerFrame = isMobile ? 0.8 : 1.2;

        let lastTimestamp = 0;
        const scrollAnimation = (timestamp) => {
            if (!scrollContainerRef.current) return;

            const scrollContainer = scrollContainerRef.current;
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

            // Solo avanzar si no está en pausa y no se está arrastrando
            if (!isPausedRef.current && !isDragging && !isResettingRef.current) {
                // Si llegó al final, reiniciar
                if (scrollContainer.scrollLeft >= maxScroll - 5) {
                    isResettingRef.current = true;
                    // Reiniciar al principio inmediatamente
                    scrollContainer.scrollLeft = 0;
                    // Dar un pequeño tiempo para el reinicio
                    setTimeout(() => {
                        isResettingRef.current = false;
                    }, 100);
                } else {
                    // Avanzar normalmente
                    scrollContainer.scrollLeft += pixelsPerFrame;
                }

                // Actualizar la posición de la barra cada vez que avanzamos
                updateScrollbarPosition();
            }

            // Seguir animando
            animationRef.current = requestAnimationFrame(scrollAnimation);
        };

        // Iniciar la animación
        animationRef.current = requestAnimationFrame(scrollAnimation);

        // Eventos para pausar al interactuar
        const handleMouseEnter = () => {
            isPausedRef.current = true;
        };

        const handleMouseLeave = () => {
            isPausedRef.current = false;
        };

        scrollContainer.addEventListener('mouseenter', handleMouseEnter);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationRef.current);
            scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
            scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isMobile, isDragging, loading, products]);

    // Funciones para manejar el arrastre de la barra de desplazamiento
    const handleDragStart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(true);
        isPausedRef.current = true;
        setDragStartX(e.clientX);

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            setInitialScrollLeft(scrollContainer.scrollLeft);
        }
    };

    const handleDrag = (e) => {
        if (!isDragging) return;

        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const scrollbarContainer = scrollbarRef.current.parentElement;
        const deltaX = e.clientX - dragStartX;
        const scrollableWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;

        // Factor de multiplicación para el movimiento del arrastre
        const moveRatio = scrollableWidth / scrollbarContainer.clientWidth;
        const newScrollLeft = initialScrollLeft + (deltaX * moveRatio);

        // Limitar el desplazamiento dentro del rango válido
        scrollContainer.scrollLeft = Math.max(0, Math.min(newScrollLeft, scrollableWidth));

        // Actualizar la barra
        updateScrollbarPosition();
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        // Pequeño retraso antes de reanudar la animación
        setTimeout(() => {
            isPausedRef.current = false;
        }, 300);
    };

    // Configurar eventos de mouse para el arrastre
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (isDragging) {
                handleDrag(e);
            }
        };

        const handleGlobalMouseUp = () => {
            if (isDragging) {
                handleDragEnd();
            }
        };

        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging]);

    // Manejar clic en la barra de desplazamiento
    const handleScrollbarClick = (e) => {
        // Ignorar si se hizo clic en el thumb (la barra móvil)
        if (e.target === scrollbarRef.current) return;

        const scrollbarContainer = scrollbarRef.current.parentElement;
        const scrollContainer = scrollContainerRef.current;

        if (!scrollContainer || !scrollbarContainer) return;

        const rect = scrollbarContainer.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = clickPosition / rect.width;

        const scrollableWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;

        isPausedRef.current = true;
        scrollContainer.style.scrollBehavior = 'smooth';
        scrollContainer.scrollLeft = percentage * scrollableWidth;

        // Restablecer después de completar el desplazamiento
        setTimeout(() => {
            scrollContainer.style.scrollBehavior = 'auto';
            isPausedRef.current = false;
        }, 500);
    };

    return (
        <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, md: 4 }, maxWidth: '1800px', mx: 'auto' }}>
            {/* Definimos los estilos globales para ocultar la barra de desplazamiento */}
            <GlobalStyles
                styles={{
                    '.hide-carousel-scrollbar::-webkit-scrollbar': {
                        display: 'none'
                    },
                    '.hide-carousel-scrollbar': {
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                    },
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
                    variant="h5"
                    component="h2"
                    fontWeight={500}
                    mb={3}
                    sx={{
                        fontFamily: typography.fontFamily || 'Amethysta, sans-serif',
                        color: vistelicaColors.secondary,
                        position: 'relative',
                        display: 'inline-block',
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
                <Box
                    ref={scrollContainerRef}
                    className="hide-carousel-scrollbar"
                    sx={{
                        display: 'flex',
                        width: '100%',
                        overflowX: 'auto',
                        scrollBehavior: 'auto',
                        pb: 2,
                        gap: 3,
                        '&::before, &::after': {
                            content: '""',
                            minWidth: '160px' // Añadimos espacio en los extremos
                        },
                        px: 4 // Padding horizontal adicional
                    }}
                >
                    {loading ? (
                        // Mostrar placeholders mientras carga
                        Array(6).fill(0).map((_, index) => (
                            <Box
                                key={index}
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
                                key={`${product.product_id || product.id}-${index}`}
                                product={product}
                            />
                        ))
                    )}
                </Box>
            </motion.div>

            {/* Barra de desplazamiento personalizada estilo minimalista */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        height: '4px',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        borderRadius: '2px',
                        mt: 1,
                        mb: 2,
                        cursor: 'pointer',
                        background: 'rgba(158, 158, 158, 0.3)',
                        transition: 'height 0.2s ease',
                        '&:hover': {
                            height: '6px'
                        }
                    }}
                    onClick={handleScrollbarClick}
                >
                    <Box
                        ref={scrollbarRef}
                        sx={{
                            position: 'absolute',
                            left: `${scrollPercentage}%`,
                            transform: 'translateX(-0%)',
                            height: '100%',
                            width: '15%',
                            bgcolor: vistelicaColors.primary || '#E4B002',
                            borderRadius: '2px',
                            transition: isDragging ? 'none' : 'left 0.1s ease',
                            cursor: 'grab',
                            '&:active': {
                                cursor: 'grabbing'
                            },
                            boxShadow: isDragging ? `0 0 8px ${vistelicaColors.primary}` : 'none'
                        }}
                        onMouseDown={handleDragStart}
                    />
                </Box>
            </motion.div>
        </Container>
    );
};

export default AutomaticCarouselWithScrollbar;