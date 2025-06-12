'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import NextLink from 'next/link';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Container,
    Box,
    Link,
    Skeleton,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { vistelicaColors } from '../../../components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";
import { motion, AnimatePresence } from 'framer-motion';

// Componentes estilizados con mejor optimización
const CategoryCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'isHovered'
})(({ theme, isHovered }) => ({
    position: 'relative',
    height: 480,
    maxWidth: 1100,
    margin: '0 auto',
    borderRadius: 16,
    overflow: 'hidden',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
    boxShadow: isHovered
        ? '0 15px 30px rgba(0,0,0,0.15)'
        : '0 8px 20px rgba(0,0,0,0.1)',
    transform: isHovered ? 'translateY(-10px)' : 'none',
    cursor: 'pointer',
    border: `1px solid ${vistelicaColors.divider}`,
    [theme.breakpoints.down('sm')]: {
        height: 350,
    },
}));

const VideoContainer = styled(Box)(() => ({
    position: 'relative',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
}));

const StyledVideo = styled('video')(() => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease, filter 0.4s ease',
}));

const CategoryContent = styled(CardContent)(() => ({
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: '25px',
    backgroundColor: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingBottom: '35px',
    },
}));

const CategoryTitle = styled(Typography)(() => ({
    fontFamily: typography.fontFamily,
    fontWeight: 600,
    fontSize: '1.8rem',
    textAlign: 'center',
    color: vistelicaColors.secondary,
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -10,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '0%',
        height: '2px',
        backgroundColor: vistelicaColors.primary,
        transition: 'width 0.3s ease',
    },
    '&:hover::after': {
        width: '40%',
    }
}));

// Definición del componente SectionTitle (faltante en la implementación anterior)
const SectionTitle = styled(motion.h2)(() => ({
    textAlign: 'center',
    marginBottom: '40px',
    fontWeight: 700,
    fontSize: '2rem',
    fontFamily: typography.fontFamily,
    color: vistelicaColors.secondary,
    position: 'relative',
    paddingBottom: '15px',
    margin: '0 auto 40px',
    maxWidth: '80%',
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        width: 80,
        height: 3,
        backgroundColor: vistelicaColors.primary,
        transform: 'translateX(-50%)',
    },
}));

// Componente de video optimizado
const CategoryVideo = React.memo(({ category, isHovered, videoRef, onLoadStart, onLoadEnd, onError }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Optimizar manejo de eventos de video
    const handleLoadedData = useCallback(() => {
        setIsLoading(false);
        onLoadEnd?.();
    }, [onLoadEnd]);

    const handleError = useCallback(() => {
        setIsLoading(false);
        setHasError(true);
        onError?.();
    }, [onError]);

    return (
        <VideoContainer>
            {isLoading && !hasError && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5'
                }}>
                    <CircularProgress size={60} sx={{ color: vistelicaColors.primary }} />
                </Box>
            )}

            {hasError ? (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5'
                }}>
                    <Typography variant="body1" color="error">
                        No se pudo cargar el video
                    </Typography>
                    <Box component="img"
                         src={category.poster || '/images/placeholder-image.png'}
                         alt={category.imageAlt}
                         sx={{
                             width: '100%',
                             height: '100%',
                             objectFit: 'cover'
                         }}
                    />
                </Box>
            ) : (
                <StyledVideo
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={category.poster}
                    onLoadStart={onLoadStart}
                    onLoadedData={handleLoadedData}
                    onError={handleError}
                    style={{
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        filter: isHovered ? 'brightness(1.05)' : 'brightness(1)'
                    }}
                >
                    <source src={category.video} type={category.type} />
                    Tu navegador no soporta el elemento de video.
                </StyledVideo>
            )}

            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%)',
                    opacity: isHovered ? 0.8 : 0.5,
                    transition: 'opacity 0.4s ease'
                }}
            />
        </VideoContainer>
    );
});
CategoryVideo.displayName = 'CategoryVideo';

// Componente de categoría individual
const CategoryItem = React.memo(({ category, index, hoverIndex, onMouseEnter, onMouseLeave }) => {
    const videoRef = useRef(null);
    const observerRef = useRef(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const isHovered = hoverIndex === index;
    const [isInView, setIsInView] = useState(false);

    // Usar Intersection Observer para cargar videos solo cuando son visibles
    useEffect(() => {
        if (!observerRef.current && window.IntersectionObserver) {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setIsInView(true);
                        observerRef.current.disconnect();
                    }
                },
                { threshold: 0.1 }
            );

            if (videoRef.current) {
                observerRef.current.observe(videoRef.current.parentNode);
            }
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    // Iniciar reproducción cuando el video está en vista
    useEffect(() => {
        if (isInView && videoRef.current && !isVideoLoaded) {
            if (videoRef.current.readyState >= 3) {
                setIsVideoLoaded(true);
            }

            videoRef.current.play().catch(error => {
                console.log('Error reproduciendo video:', error);
            });
        }
    }, [isInView, isVideoLoaded]);

    const handleLoadStart = useCallback(() => {
        setIsVideoLoaded(false);
    }, []);

    const handleLoadEnd = useCallback(() => {
        setIsVideoLoaded(true);
    }, []);

    return (
        <Grid
            item
            xs={12}
            sm={12}
            md={12}
            component={motion.div}
            variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 12
                    }
                }
            }}
        >
            <NextLink href={category.path} passHref legacyBehavior>
                <Link
                    underline="none"
                    onMouseEnter={() => onMouseEnter(index)}
                    onMouseLeave={onMouseLeave}
                    sx={{ display: 'block' }}
                    aria-label={`Ver categoría ${category.title}`}
                >
                    <CategoryCard isHovered={isHovered}>
                        <CategoryVideo
                            category={category}
                            isHovered={isHovered}
                            videoRef={videoRef}
                            onLoadStart={handleLoadStart}
                            onLoadEnd={handleLoadEnd}
                        />
                        <CategoryContent>
                            <CategoryTitle variant="h5" component="h3">
                                {category.title}
                            </CategoryTitle>
                            <Box
                                sx={{
                                    height: isHovered ? '30px' : '0px',
                                    opacity: isHovered ? 1 : 0,
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden',
                                    mt: isHovered ? 1 : 0
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: 'center',
                                        fontFamily: typography.fontFamily,
                                        color: vistelicaColors.secondary,
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {category.description}
                                </Typography>
                            </Box>
                        </CategoryContent>
                    </CategoryCard>
                </Link>
            </NextLink>
        </Grid>
    );
});
CategoryItem.displayName = 'CategoryItem';

// Componente principal
const FeaturedCategories = () => {
    const [hoverIndex, setHoverIndex] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState({});

    // Memoizar categorías para evitar recálculos
    const categories = useMemo(() => [
        {
            title: 'Hombre',
            video: 'https://res.cloudinary.com/dhyv4dpk2/video/upload/v1747333743/vistelica/home%20page/Img-Main/man/hudcof9s4ukdnj0kpb6l.webm',
            type: 'video/webm',
            imageAlt: 'Categoría de moda para hombres',
            path: '/sub-men/MainLayout-subM',
            description: 'Elegancia y estilo para cada ocasión',
        },
        {
            title: 'Mujer',
            video: 'https://res.cloudinary.com/dhyv4dpk2/video/upload/v1747333750/vistelica/home%20page/Img-Main/Women/alihfmkaaz3humbjwnu2.mp4',
            type: 'video/mp4',
            imageAlt: 'Categoría de moda para mujeres',
            path: '/sub-women/MainLayout-subW',
            description: 'Tendencias que resaltan tu personalidad',
        },
        {
            title: 'Chica',
            video: 'https://res.cloudinary.com/dhyv4dpk2/video/upload/v1747333744/vistelica/home%20page/Img-Main/Girl/bn4dotyydgmc25nrnmtx.webm',
            type: 'video/webm',
            imageAlt: 'Categoría de moda para adolescentes',
            path: '/sub-girl/MainLayout-subG',
            description: 'Frescura y estilo juvenil',
        },
        {
            title: 'Chico',
            video: 'https://res.cloudinary.com/dhyv4dpk2/video/upload/v1747333744/vistelica/home%20page/Img-Main/Boy/dj4xcaojseib3xypqtqa.webm',
            type: 'video/webm',
            imageAlt: 'Categoría de accesorios de moda',
            path: '/sub-boy/MainLayout-subB',
            description: 'Comodidad y diseño para jóvenes',
        }
    ], []);

    const handleMouseEnter = useCallback((index) => {
        setHoverIndex(index);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoverIndex(null);
    }, []);

    // Controlar estado de carga de videos
    const updateLoadingStatus = useCallback((index, isLoading) => {
        setLoadingStatus(prev => ({
            ...prev,
            [index]: isLoading
        }));
    }, []);

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 6, md: 10 },
                backgroundColor: '#ffffff',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: 'radial-gradient(circle at 20% 90%, rgba(228, 176, 2, 0.03) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(228, 176, 2, 0.03) 0%, transparent 30%)'
            }}
        >
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SectionTitle
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Categorías Destacadas
                </SectionTitle>

                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2,
                            }
                        }
                    }}
                    initial="hidden"
                    animate="visible"
                    style={{ width: '100%' }}
                >
                    <Grid container spacing={6} justifyContent="center">
                        {categories.map((category, index) => (
                            <CategoryItem
                                key={category.title}
                                category={category}
                                index={index}
                                hoverIndex={hoverIndex}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            />
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

export default React.memo(FeaturedCategories);