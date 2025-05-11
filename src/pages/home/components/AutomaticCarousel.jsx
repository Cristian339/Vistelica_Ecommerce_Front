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
import productService from '@/services/productService';

import { useRouter } from 'next/navigation';

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
        <Card
            onClick={() => handleProductClickDetail(product.product_id)}
            sx={{
                position: 'relative',
                height: '275px',
                minWidth: {
                    xs: '65%',
                    sm: '45%',
                    md: '33%',
                    lg: '25%'
                },
                mx: 1,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }
            }}
        >
            <Box sx={{ position: 'relative', height: '85%', width: '100%', overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    image={product.main_image || product.mainImage}
                    alt={product.name}
                    sx={{
                        objectFit: 'cover',
                        height: '100%',
                        width: '100%'
                    }}
                />
            </Box>
            <CardContent
                sx={{
                    py: 1.5,
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(5px)'
                }}
            >
                <Typography variant="subtitle2" noWrap>
                    {product.name}
                </Typography>
                <Typography variant="body2" fontWeight={500} color="primary">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </Typography>
            </CardContent>
        </Card>
    );
};
const AutomaticCarouselWithScrollbar = () => {
    const scrollContainerRef = useRef(null);
    const scrollbarRef = useRef(null);
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

    // Duplicar productos para crear efecto infinito
    const carouselProducts = products.length > 0 ? [...products, ...products, ...products] : [];

    // Lógica para actualizar la posición de la barra de desplazamiento basada en el scroll
    const updateScrollbarPosition = () => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const scrollableWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const percentage = scrollableWidth > 0 ? (scrollContainer.scrollLeft / scrollableWidth) : 0;

        setScrollPercentage(percentage * 100);
    };

    // Manejar el scroll automático y actualizar la posición de la barra
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer || loading || products.length === 0) return;

        let animationFrameId;
        let lastTime = 0;
        const speed = isMobile ? 0.5 : 0.7;  // Velocidad más lenta en móviles
        let isPaused = false;

        // Función para manejar la animación
        const scrollAnimation = (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const elapsed = timestamp - lastTime;

            if (!isPaused && !isDragging) {
                // Aumentar el scroll gradualmente
                scrollContainer.scrollLeft += speed * (elapsed / 16);

                // Actualizar la posición de la barra
                updateScrollbarPosition();

                // Reiniciar el scroll cuando llegue al final para crear un bucle
                if (scrollContainer.scrollLeft >=
                    (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2) {
                    scrollContainer.scrollLeft = 0;
                }
            }

            lastTime = timestamp;
            animationFrameId = requestAnimationFrame(scrollAnimation);
        };

        // Iniciar la animación
        animationFrameId = requestAnimationFrame(scrollAnimation);

        // Función para actualizar la barra cuando el usuario hace scroll manualmente
        const handleScroll = () => {
            updateScrollbarPosition();
        };

        scrollContainer.addEventListener('scroll', handleScroll);

        // Pausar el carrusel al pasar el mouse por encima
        const handleMouseEnter = () => {
            isPaused = true;
        };

        // Reanudar el carrusel al quitar el mouse
        const handleMouseLeave = () => {
            isPaused = false;
        };

        scrollContainer.addEventListener('mouseenter', handleMouseEnter);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);

        // Detener animación cuando el componente se desmonte
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            scrollContainer.removeEventListener('scroll', handleScroll);
            scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
            scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isMobile, isDragging, loading, products]);

    // Funciones para manejar el arrastre de la barra de desplazamiento
    const handleDragStart = (e) => {
        setIsDragging(true);
        setDragStartX(e.clientX);
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            setInitialScrollLeft(scrollContainer.scrollLeft);
        }

        // Prevenir problemas con el drag en dispositivos
        e.preventDefault();
    };

    const handleDrag = (e) => {
        if (!isDragging) return;

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            const scrollbarContainer = scrollbarRef.current.parentElement;
            const deltaX = e.clientX - dragStartX;
            const scrollableWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;

            // Calcular cuánto debe moverse el scroll basado en el arrastre
            const dragRatio = scrollbarContainer.clientWidth / scrollableWidth;
            const newScrollLeft = initialScrollLeft + (deltaX / dragRatio);

            scrollContainer.scrollLeft = newScrollLeft;
            updateScrollbarPosition();
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
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
        const scrollbarContainer = scrollbarRef.current.parentElement;
        const scrollContainer = scrollContainerRef.current;

        const rect = scrollbarContainer.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = clickPosition / rect.width;

        const scrollableWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        scrollContainer.scrollLeft = percentage * scrollableWidth;

        updateScrollbarPosition();
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Definimos los estilos globales para ocultar la barra de desplazamiento */}
            <GlobalStyles
                styles={{
                    '.hide-carousel-scrollbar::-webkit-scrollbar': {
                        display: 'none'
                    },
                    '.hide-carousel-scrollbar': {
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                    }
                }}
            />

            <Typography variant="h5" component="h2" fontWeight={500} mb={3} sx={{ fontFamily: 'Amethysta, sans-serif' }}>
                Accesorios variados
            </Typography>

            <Box

                ref={scrollContainerRef}
                className="hide-carousel-scrollbar"
                sx={{
                    display: 'flex',
                    width: '100%',
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    pb: 2
                }}
            >
                {loading ? (
                    // Mostrar placeholders mientras carga
                    Array(6).fill(0).map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                height: '275px',
                                minWidth: {
                                    xs: '65%',
                                    sm: '45%',
                                    md: '33%',
                                    lg: '25%'
                                },
                                mx: 1,
                                borderRadius: 2,
                                bgcolor: 'rgba(0,0,0,0.05)'
                            }}
                        />
                    ))
                ) : (
                    carouselProducts.map((product, index) => (
                        <CarouselItem

                            key={`${product.id}-${index}`}
                            product={product}

                        />
                    ))
                )}
            </Box>

            {/* Barra de desplazamiento personalizada estilo minimalista */}
            <Box

                sx={{
                    position: 'relative',
                    height: '4px',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: '2px',
                    mt: 1,
                    mb: 2,
                    cursor: 'pointer',
                    background: 'rgba(158, 158, 158, 0.3)'
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
                        bgcolor: '#E4B002',
                        borderRadius: '2px',
                        transition: isDragging ? 'none' : 'left 0.1s ease',
                        cursor: 'pointer',
                    }}
                    onMouseDown={handleDragStart}
                />
            </Box>
        </Container>
    );
};

export default AutomaticCarouselWithScrollbar;