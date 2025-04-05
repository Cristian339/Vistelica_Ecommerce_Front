'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

const ProgressBarCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);
    const progressIntervalRef = useRef(null);

    // Definición de las imágenes del carrusel
    const slides = [
        {
            src: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743791584/vistelica/Carrusel/hslrccwjzkmexfjv2sc8.jpg",
            alt: "Monstera leaf close-up",
            title: "Colecciones exclusivas",
            subtitle: "Explora nuestra amplia gama de productos, colaborarando con los mejores proveedores del país."
        },
        {
            src: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743791584/vistelica/Carrusel/kpr9ii8oqevnneudgzno.webp",
            alt: "Indoor plants",
            title: "Gran variedad",
            subtitle: " Encuentra lo que buscas, desde pijamas para estar por casa hasta cazadoras para irte al polo norte."
        },
        {
            src: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743791578/vistelica/Carrusel/ctidxlquiebnqas0ivxk.jpg",
            alt: "Tropical leaf",
            title: "Grandes ofertas",
            subtitle: " Aprovecha nuestras ofertas y descuentos exclusivos en productos seleccionados."
        }
    ];

    // Duración de cada slide en milisegundos
    const slideDuration = 6000;
    const progressUpdateFrequency = 30; // cada 30ms actualizamos el progreso

    // Función para avanzar al siguiente slide
    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        setProgress(0);
    };

    // Iniciar carrusel y progreso
    useEffect(() => {
        // Limpiar cualquier intervalo existente
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

        // Configurar intervalo para cambiar slides
        intervalRef.current = setInterval(nextSlide, slideDuration);

        // Configurar intervalo para actualizar la barra de progreso
        progressIntervalRef.current = setInterval(() => {
            setProgress(prev => {
                const increment = (progressUpdateFrequency / slideDuration) * 100;
                const newProgress = prev + increment;
                return newProgress > 100 ? 100 : newProgress;
            });
        }, progressUpdateFrequency);

        // Limpieza
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, [currentSlide]);

    // Cambiar manualmente el slide
    const goToSlide = (index) => {
        setCurrentSlide(index);
        setProgress(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        intervalRef.current = setInterval(nextSlide, slideDuration);
        progressIntervalRef.current = setInterval(() => {
            setProgress(prev => {
                const increment = (progressUpdateFrequency / slideDuration) * 100;
                const newProgress = prev + increment;
                return newProgress > 100 ? 100 : newProgress;
            });
        }, progressUpdateFrequency);
    };

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
                    <Box sx={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
                        <Box
                            component="img"
                            src={slide.src}
                            alt={slide.alt}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>

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
                                    variant="contained"
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
            ))}

            {/* Indicadores de progreso en la parte inferior - igual que en la imagen */}
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
                {slides.map((_, index) => (
                    <Box
                        key={index}
                        onClick={() => goToSlide(index)}
                        sx={{
                            width: '50px',
                            height: '2px',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {currentSlide === index && (
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
                ))}
            </Box>
        </Box>
    );
};

export default ProgressBarCarousel;