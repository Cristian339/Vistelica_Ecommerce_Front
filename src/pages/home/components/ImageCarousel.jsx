'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Box, Typography, Button, Container, IconButton, useMediaQuery, useTheme } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Link from 'next/link';

const ProgressBarCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);
    const progressIntervalRef = useRef(null);

// Componente para la barra de progreso individual
const ProgressBar = React.memo(({ isActive, progress, onClick, index }) => (
    <Box
        onClick={onClick}
        role="button"
        aria-label={`Ir a diapositiva ${index + 1}`}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        sx={{
            width: '50px',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s ease',
            '&:hover': {
                transform: 'scaleY(1.5)'
            },
        }}
    >
        {isActive && (
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${progress}%`,
                    backgroundColor: 'white',
                    transition: 'width 30ms linear'
                }}
            />
        )}
    </Box>
));
    // Definición de las imágenes del carrusel con enlaces específicos
    const slides = [
        {
            src: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743791584/vistelica/Carrusel/hslrccwjzkmexfjv2sc8.jpg",
            alt: "Monstera leaf close-up",
            title: "Colecciones exclusivas",
            subtitle: "Explora nuestra amplia gama de productos, colaborando con los mejores proveedores del país.",
            buttonText: "Explorar",
            link: "/product-list/productList"
        },
        {
            src: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743791584/vistelica/Carrusel/kpr9ii8oqevnneudgzno.webp",
            alt: "Indoor plants",
            title: "Últimas unidades",
            subtitle: "¡Aprovecha! Productos con poco stock disponible. No te quedes sin el tuyo.",
            buttonText: "Ver productos",
            link: "/product-list/productList?filter=lowStock" // Enlace para productos con poco stock
        },
        {
            src: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743791578/vistelica/Carrusel/ctidxlquiebnqas0ivxk.jpg",
            alt: "Tropical leaf",
            title: "Grandes ofertas",
            subtitle: "Aprovecha nuestras ofertas y descuentos exclusivos en productos seleccionados.",
            buttonText: "Ver ofertas",
            link: "/product-list/productList?filter=hasDiscount" // Enlace para productos con descuento
        }
    ];

// Componente para cada slide
const Slide = React.memo(({ slide, isActive, onExploreClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Precarga de la siguiente imagen cuando está casi visible
    const imgRef = useRef(null);

    useEffect(() => {
        // Precarga de imagen cuando está a punto de mostrarse
        if (imgRef.current && isActive) {
            imgRef.current.loading = 'eager';
        }
    }, [isActive]);

    return (
        <Box sx={{ width: '100%', position: 'relative', overflow: 'hidden', height: { xs: '70vh', md: '80vh' } }}>
            {/* Slides */}
            {slides.map((slide, index) => (
                <Box
                    key={index}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: currentSlide === index ? 1 : 0,
                        transition: 'opacity 0.8s ease-in-out',
                        zIndex: currentSlide === index ? 1 : 0,
                    }}
                >
                    <Box
                        component="img"
                        src={slide.src}
                        alt={slide.alt}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Container>
                            <Box
                                sx={{
                                    maxWidth: { xs: '90%', sm: '70%', md: '500px' },
                                    animation: currentSlide === index ? 'fadeInUp 0.8s ease-out' : 'none',
                                    opacity: currentSlide === index ? 1 : 0,
                                    '@keyframes fadeInUp': {
                                        '0%': {
                                            opacity: 0,
                                            transform: 'translateY(20px)'
                                        },
                                        '100%': {
                                            opacity: 1,
                                            transform: 'translateY(0)'
                                        }
                                    }
                                }}
                            >
                                <Typography
                                    variant="h2"
                                    color="white"
                                    fontWeight="bold"
                                    sx={{
                                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                                        lineHeight: 1.1,
                                        mb: 2,
                                        fontFamily: '"Playfair Display", serif'
                                    }}
                                >
                                    {slide.title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="white"
                                    sx={{
                                        fontSize: { xs: '1rem', md: '1.1rem' },
                                        mb: 4,
                                        maxWidth: '90%'
                                    }}
                                >
                                    {slide.subtitle}
                                </Typography>
                                <Button
                                    component={Link}
                                    href={slide.link}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        borderRadius: '50px',
                                        padding: '12px 24px',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0',
                                        }
                                    }}
                                >
                                    {slide.buttonText}
                                </Button>
                            </Box>
                        </Container>
                    </Box>
                </Box>
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: isActive ? 1 : 0,
                visibility: isActive ? 'visible' : 'hidden',
                transition: 'opacity 0.8s ease-in-out',
                zIndex: isActive ? 1 : 0,
            }}
            role="tabpanel"
            aria-hidden={!isActive}
        >
            <Box
                component="img"
                ref={imgRef}
                src={slide.src}
                alt={slide.alt}
                loading={isActive ? "eager" : "lazy"}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                <Container>
                    <Box
                        sx={{
                            maxWidth: { xs: '90%', sm: '70%', md: '500px' },
                            animation: isActive ? 'fadeInUp 0.8s ease-out' : 'none',
                            opacity: isActive ? 1 : 0,
                            '@keyframes fadeInUp': {
                                '0%': {
                                    opacity: 0,
                                    transform: 'translateY(20px)'
                                },
                                '100%': {
                                    opacity: 1,
                                    transform: 'translateY(0)'
                                }
                            }
                        }}
                    >
                        <Typography
                            variant="h2"
                            color="white"
                            fontWeight="bold"
                            sx={{
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                lineHeight: 1.1,
                                mb: 2,
                                fontFamily: '"Playfair Display", serif'
                            }}
                        >
                            {slide.title}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="white"
                            sx={{
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                mb: 4,
                                maxWidth: '90%'
                            }}
                        >
                            {slide.subtitle}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={onExploreClick}
                            aria-label="Explorar esta colección"
                            sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                borderRadius: '50px',
                                padding: '12px 24px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                }
                            }}
                        >
                            Explorar
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
});

// Componente principal del carrusel
const ProgressBarCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const intervalRef = useRef(null);
    const progressIntervalRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Datos del carrusel memorizados
    const slides = useMemo(() => [
        {
            src: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743791584/vistelica/Carrusel/hslrccwjzkmexfjv2sc8.jpg",
            alt: "Monstera leaf close-up",
            title: "Colecciones exclusivas",
            subtitle: "Explora nuestra amplia gama de productos, colaborando con los mejores proveedores del país."
        },
        {
            src: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743791584/vistelica/Carrusel/kpr9ii8oqevnneudgzno.webp",
            alt: "Indoor plants",
            title: "Gran variedad",
            subtitle: "Encuentra lo que buscas, desde pijamas para estar por casa hasta cazadoras para irte al polo norte."
        },
        {
            src: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743791578/vistelica/Carrusel/ctidxlquiebnqas0ivxk.jpg",
            alt: "Tropical leaf",
            title: "Grandes ofertas",
            subtitle: "Aprovecha nuestras ofertas y descuentos exclusivos en productos seleccionados."
        }
    ], []);

    // Configuraciones del carrusel
    const slideDuration = 6000;
    const progressUpdateFrequency = 30;

    // Función para avanzar al siguiente slide (memoizada)
    const nextSlide = useCallback(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        setProgress(0);
    }, [slides.length]);

    // Función para ir al slide anterior (memoizada)
    const prevSlide = useCallback(() => {
        setCurrentSlide((prevSlide) => prevSlide === 0 ? slides.length - 1 : prevSlide - 1);
        setProgress(0);
    }, [slides.length]);

    // Función para pausar/reanudar el carrusel
    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    // Gestión de la navegación por teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            else if (e.key === 'ArrowLeft') prevSlide();
            else if (e.key === ' ') togglePause();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide, togglePause]);

    // Controlar los intervalos y la barra de progreso
    useEffect(() => {
        // Limpiar intervalos existentes
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

        if (!isPaused) {
            // Configurar nuevo intervalo solo si no está pausado
            intervalRef.current = setInterval(nextSlide, slideDuration);

            // Actualizar la barra de progreso
            progressIntervalRef.current = setInterval(() => {
                setProgress(prev => {
                    const increment = (progressUpdateFrequency / slideDuration) * 100;
                    const newProgress = prev + increment;
                    return newProgress > 100 ? 100 : newProgress;
                });
            }, progressUpdateFrequency);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, [currentSlide, isPaused, nextSlide, slideDuration, progressUpdateFrequency]);

    // Pausar automáticamente al hacer hover
    useEffect(() => {
        if (isHovering) {
            setIsPaused(true);
        } else if (isPaused && !isHovering) {
            // Solo reanudar si estaba pausado por hover
            setIsPaused(false);
        }
    }, [isHovering, isPaused]);

    // Función para ir a un slide específico (memoizada)
    const goToSlide = useCallback((index) => {
        setCurrentSlide(index);
        setProgress(0);
    }, []);

    // Función para manejar el botón explorar
    const handleExploreClick = useCallback(() => {
        console.log(`Explorando colección: ${slides[currentSlide].title}`);
        // Aquí puedes agregar la navegación a la página correspondiente
    }, [slides, currentSlide]);

    return (
        <Box
            sx={{
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                height: { xs: '70vh', md: '80vh' }
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            role="tablist"
            aria-roledescription="carrusel"
            aria-label="Carrusel de imágenes promocionales"
        >
            {/* Slides del carrusel */}
            {slides.map((slide, index) => (
                <Slide
                    key={index}
                    slide={slide}
                    isActive={currentSlide === index}
                    onExploreClick={handleExploreClick}
                />
            ))}

            {/* Controles de navegación */}
            {!isMobile && (
                <>
                    <IconButton
                        onClick={prevSlide}
                        aria-label="Slide anterior"
                        sx={{
                            position: 'absolute',
                            left: 20,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.4)' }
                        }}
                    >
                        <ArrowBackIosNewIcon />
                    </IconButton>

                    <IconButton
                        onClick={nextSlide}
                        aria-label="Siguiente slide"
                        sx={{
                            position: 'absolute',
                            right: 20,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.4)' }
                        }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </>
            )}

            {/* Indicadores de progreso y controles inferiores */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: { xs: '20px', md: '40px' },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    zIndex: 10
                }}
            >
                {/* Botón de pausa/reproducir */}
                <IconButton
                    onClick={togglePause}
                    aria-label={isPaused ? "Reproducir carrusel" : "Pausar carrusel"}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        width: 30,
                        height: 30,
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.5)' }
                    }}
                >
                    {isPaused ? <PlayArrowIcon fontSize="small" /> : <PauseIcon fontSize="small" />}
                </IconButton>

                {/* Barras de progreso */}
                {slides.map((_, index) => (
                    <ProgressBar
                        key={index}
                        index={index}
                        isActive={currentSlide === index}
                        progress={currentSlide === index ? progress : 0}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </Box>
        </Box>
    );
};

// Añadir displayName para mejor depuración
ProgressBar.displayName = 'ProgressBar';
Slide.displayName = 'CarouselSlide';

export default React.memo(ProgressBarCarousel);