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
    GlobalStyles // Importamos GlobalStyles
} from '@mui/material';

// Componente para un slide individual del carrusel
const CarouselItem = ({ product }) => {
    return (
        <Card
            sx={{
                position: 'relative',
                height: '275px',
                minWidth: {
                    xs: '65%', // En móviles ocupa 65% del ancho
                    sm: '45%', // En tablets ocupa 45% del ancho
                    md: '33%', // En desktop ocupa 33% del ancho
                    lg: '25%'  // En pantallas grandes ocupa 25% del ancho
                },
                mx: 1,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
        >
            <Box sx={{
                position: 'relative',
                height: '85%',
                width: '100%',
                overflow: 'hidden'
            }}>
                <CardMedia
                    component="img"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{
                        objectFit: 'cover',
                        height: '100%',
                        width: '100%'
                    }}
                />
            </Box>

            <CardContent sx={{
                py: 1.5,
                position: 'absolute',
                bottom: 0,
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(5px)'
            }}>
                <Typography variant="subtitle2" noWrap>
                    {product.name}
                </Typography>
                <Typography variant="body2" fontWeight={500} color="primary">
                    ${product.price}
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

    // Datos de ejemplo (reemplazar con data real de tu API)
    const products = [
        {
            id: 1,
            name: "Anillo Inspirado en Vintage con Zafiro",
            price: "420.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
        },
        {
            id: 2,
            name: "Altavoz Bluetooth de Malla Redondo",
            price: "215.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
        },
        {
            id: 3,
            name: "Parlante Portátil Minimalista",
            price: "145.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
        },
        {
            id: 4,
            name: "Gafas de Sol Clásicas",
            price: "95.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
        },
        {
            id: 5,
            name: "Plato Decorativo Mármol",
            price: "125.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
        },
        {
            id: 6,
            name: "Jarrón Plateado Moderno",
            price: "175.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
        }
    ];

    // Duplicar productos para crear efecto infinito
    const carouselProducts = [...products, ...products, ...products];

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
        if (!scrollContainer) return;

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
    }, [isMobile, isDragging]);

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
                Tendencias actuales
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
                    // Eliminamos el pseudo-elemento problemático de aquí
                }}
            >
                {carouselProducts.map((product, index) => (
                    <CarouselItem
                        key={`${product.id}-${index}`}
                        product={product}
                    />
                ))}
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