'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Fade, Link } from '@mui/material';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const BannerVideoSection = ({
    videoUrl = "https://res.cloudinary.com/dhyv4dpk2/video/upload/v1747847378/vistelica/subcategorias/vuo7vq7l9bizoandcyup.mp4",
    posterUrl = "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1747847378/vistelica/subcategorias/vuo7vq7l9bizoandcyup.jpg",
    catalogLink = "/catalog"
}) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    // Detectar preferencia de reducción de movimiento
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            setReducedMotion(mediaQuery.matches);

            const handleMediaChange = () => {
                setReducedMotion(mediaQuery.matches);
            };

            mediaQuery.addEventListener('change', handleMediaChange);
            return () => mediaQuery.removeEventListener('change', handleMediaChange);
        }
    }, []);

    useEffect(() => {
        // Implementación de lazy loading nativo con IntersectionObserver
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Cargar el video solo cuando es visible
                    setShowVideo(true);
                    
                    if (videoRef.current && !reducedMotion) {
                        // Reproducir solo si el usuario no prefiere reducción de movimiento
                        videoRef.current.play().catch(error => {
                            console.error("Error al reproducir el video:", error);
                        });
                        setIsPlaying(true);
                    }
                } else {
                    if (videoRef.current && isPlaying) {
                        videoRef.current.pause();
                        setIsPlaying(false);
                    }
                }
            },
            { threshold: 0.2, rootMargin: '200px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [isPlaying, reducedMotion]);

    // Gestionar la carga del video
    const handleVideoLoaded = () => {
        setIsLoaded(true);
    };

    // Manejar los eventos de teclado para el botón
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.location.href = catalogLink;
        }
    };

    return (
        <Box
            ref={containerRef}
            sx={{
                width: '100%',
                height: { xs: '60vh', sm: '60vh', md: '70vh' },
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            role="region"
            aria-label="Banner principal con video de fondo"
        >
            {/* Placeholder mientras se carga el video */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'black',
                    backgroundImage: `url(${posterUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(5px) brightness(0.7)',
                    transform: 'scale(1.1)',
                    transition: 'opacity 0.5s ease',
                    opacity: isLoaded ? 0 : 1,
                    zIndex: isLoaded ? -1 : 0,
                }}
            />

            {/* Video de fondo que se carga solo cuando es visible */}
            {showVideo && (
                <video
                    ref={videoRef}
                    autoPlay={!reducedMotion}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onLoadedData={handleVideoLoaded}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                        filter: 'brightness(0.85)',
                    }}
                    poster={posterUrl}
                    aria-hidden="true" // El video es decorativo
                >
                    <source src={videoUrl} type="video/mp4" />
                    Tu navegador no soporta videos HTML5.
                </video>
            )}

            {/* Capa de superposición optimizada */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(160deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)`,
                    zIndex: 1,
                }}
                aria-hidden="true"
            />

            {/* Decoración - patrón geométrico sutil (con will-change optimizado) */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h-40V0h40v40z'/%3E%3C/g%3E%3C/svg%3E")`,
                    zIndex: 1,
                    willChange: 'opacity',
                }}
                aria-hidden="true"
            />

            {/* Línea decorativa superior */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '5px',
                    background: `linear-gradient(90deg, transparent, ${vistelicaColors.primary}, transparent)`,
                    zIndex: 2,
                }}
                aria-hidden="true"
            />

            {/* Contenido del banner - accesible y responsive */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2,
                    padding: { xs: '0 15px', sm: '0 20px', md: '0 30px' },
                    maxWidth: '100%',
                }}
            >
                <Fade in={isVisible} timeout={800}>
                    <Box sx={{ position: 'relative' }}>
                        <Typography
                            variant="h1"
                            sx={{
                                color: 'white',
                                fontFamily: typography.fontFamily,
                                fontWeight: 900,
                                fontSize: { xs: '2rem', sm: '3rem', md: '4rem', lg: '5rem' },
                                letterSpacing: { xs: '0.2px', md: '0.5px' },
                                textTransform: 'uppercase',
                                mb: { xs: 1.5, md: 3 },
                                textShadow: '0 2px 15px rgba(0,0,0,0.5)',
                            }}
                        >
                            <span style={{ color: vistelicaColors.primary }}>LOS MEJORES</span>
                        </Typography>

                        <Box
                            sx={{
                                display: 'inline-flex',
                                position: 'relative',
                                p: { xs: '0.5rem 1rem', md: '1rem 1.5rem' },
                                borderRadius: '8px',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                border: `3px solid ${vistelicaColors.primary}`,
                                backdropFilter: 'blur(5px)',
                                boxShadow: `0 5px 25px rgba(0,0,0,0.3)`,
                                transform: { xs: 'translateY(5px)', md: 'translateY(10px)' },
                                mb: { xs: 3, md: 5 },
                                maxWidth: '100%',
                            }}
                        >
                            <Typography
                                variant="h2"
                                sx={{
                                    color: 'white',
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 800,
                                    fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem', lg: '5rem' },
                                    letterSpacing: { xs: '0.5px', md: '1px' },
                                    textTransform: 'uppercase',
                                    textShadow: '0 2px 5px rgba(0,0,0,0.4)',
                                    whiteSpace: { xs: 'normal', md: 'nowrap' },
                                    overflowWrap: 'break-word',
                                }}
                            >
                                PRODUCTOS
                            </Typography>
                        </Box>

                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: 'white',
                                fontFamily: typography.fontFamily,
                                fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' },
                                fontWeight: 'normal',
                                opacity: 0.9,
                                mt: { xs: 1.5, md: 3 },
                                maxWidth: { xs: '95%', sm: '80%', md: '800px' },
                                margin: '0 auto',
                                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                                lineHeight: 1.5,
                            }}
                        >
                            Descubre nuestra colección exclusiva con los estilos más destacados de la temporada
                        </Typography>
                    </Box>
                </Fade>

                {/* Botón llamativo accesible */}
                <Fade in={isVisible} timeout={1200} style={{ transitionDelay: '300ms' }}>
                    <Link
                        href={catalogLink}
                        underline="none"
                        sx={{
                            mt: { xs: 2.5, md: 5 },
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: { xs: '10px 18px', md: '12px 30px' },
                            bgcolor: vistelicaColors.primary,
                            color: 'black',
                            borderRadius: '50px',
                            fontFamily: typography.fontFamily,
                            fontWeight: 'bold',
                            fontSize: { xs: '0.9rem', md: '1.1rem' },
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                                bgcolor: vistelicaColors.secondary,
                                color: 'white',
                            },
                            '&:focus': {
                                outline: `3px solid ${vistelicaColors.primary}`,
                                outlineOffset: '2px',
                            },
                            '&:focus-visible': {
                                outline: `3px solid ${vistelicaColors.primary}`,
                                outlineOffset: '2px',
                            },
                        }}
                        role="button"
                        aria-label="Explorar catálogo de productos"
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                    >
                        Explorar catálogo
                        <Box component="span" sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </Box>
                    </Link>
                </Fade>
            </Box>

            {/* Líneas decorativas en las esquinas simplificadas para mejor rendimiento */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    width: { xs: '25px', md: '50px' },
                    height: { xs: '25px', md: '50px' },
                    borderLeft: `2px solid ${vistelicaColors.primary}`,
                    borderTop: `2px solid ${vistelicaColors.primary}`,
                    zIndex: 2,
                    willChange: 'opacity',
                }}
                aria-hidden="true"
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    width: { xs: '25px', md: '50px' },
                    height: { xs: '25px', md: '50px' },
                    borderRight: `2px solid ${vistelicaColors.primary}`,
                    borderBottom: `2px solid ${vistelicaColors.primary}`,
                    zIndex: 2,
                    willChange: 'opacity',
                }}
                aria-hidden="true"
            />
        </Box>
    );
};

export default BannerVideoSection;
