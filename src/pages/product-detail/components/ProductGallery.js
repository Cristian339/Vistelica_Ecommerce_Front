"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box,
    Paper,
    IconButton,
    useMediaQuery,
    useTheme,
    Typography,
    Modal,
    Fade,
    Backdrop,
    Skeleton
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import productService from '@/services/productService';
import CircularProgress from '@mui/material/CircularProgress';
import { motion, AnimatePresence } from "framer-motion";
import { vistelicaColors } from '@/components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";

const fallbackImages = [
    { image_url: '/assets/images/products/placeholder-image.jpg', is_fallback: true },
    { image_url: '/assets/images/products/placeholder-image-2.jpg', is_fallback: true }
];

const ProductGallery = ({ productId, initialImages = [] }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState(initialImages);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openZoom, setOpenZoom] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [imagesLoaded, setImagesLoaded] = useState({});
    const imageRef = useRef(null);
    const containerRef = useRef(null);

    // Evitar bucle infinito y múltiples llamadas
    const fetchAttempted = useRef(false);
    const loadingRetries = useRef(0);
    const MAX_RETRIES = 2;

    // Optimización de carga de imágenes - usando objeto para seguimiento individual
    const handleImageLoad = useCallback((index) => {
        setImagesLoaded(prev => ({
            ...prev,
            [index]: true
        }));
    }, []);

    // Funciones de navegación memoizadas
    const handleNext = useCallback((e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    }, [images.length]);

    const handlePrev = useCallback((e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    }, [images.length]);

    const handleCloseZoom = useCallback(() => {
        setOpenZoom(false);
    }, []);

    // Pre-carga de imágenes adyacentes
    useEffect(() => {
        if (images.length > 1) {
            const nextIndex = (currentIndex + 1) % images.length;
            const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;

            // Pre-cargar siguiente y anterior
            const preloadNext = new Image();
            preloadNext.src = images[nextIndex]?.image_url;

            const preloadPrev = new Image();
            preloadPrev.src = images[prevIndex]?.image_url;
        }
    }, [currentIndex, images, images.length]);

    useEffect(() => {
        // Si ya tenemos imágenes, usamos esas
        if (initialImages?.length > 0) {
            setImages(initialImages);
            setLoading(false);
            return;
        }

        // Si ya intentamos cargar demasiadas veces o no hay ID, usamos fallback
        if ((fetchAttempted.current && loadingRetries.current >= MAX_RETRIES) || !productId) {
            if (!images.length) {
                setImages(fallbackImages);
            }
            setLoading(false);
            return;
        }

        const fetchProductImages = async () => {
            setLoading(true);
            fetchAttempted.current = true;
            loadingRetries.current += 1;

            try {
                const productImages = await productService.getAllImagesByProductId(productId);

                if (productImages?.length > 0) {
                    // Validar URLs de imágenes
                    const validImages = productImages.filter(img =>
                        img.image_url && typeof img.image_url === 'string' && img.image_url.trim() !== ''
                    );

                    if (validImages.length > 0) {
                        setImages(validImages);
                        setError(null);
                    } else {
                        console.warn("No se encontraron imágenes válidas, usando fallback");
                        setImages(fallbackImages);
                    }
                } else {
                    console.warn("No se encontraron imágenes, usando fallback");
                    setImages(fallbackImages);
                }
            } catch (error) {
                console.error('Error al cargar imágenes del producto:', error);
                setError("No se pudieron cargar las imágenes del producto");
                setImages(fallbackImages);
            } finally {
                setTimeout(() => setLoading(false), 300); // Pequeño retraso para evitar parpadeos
            }
        };

        fetchProductImages();
    }, [productId, initialImages, images.length]);

    // Función mejorada para manejar errores de imagen con retraso para evitar bucles
    const handleImageError = useCallback((index) => {
        console.warn(`Error al cargar la imagen ${index}`);

        // Solo reemplazamos si no es ya una imagen de fallback
        setImages(prevImages => {
            if (prevImages[index]?.is_fallback) return prevImages;

            const newImages = [...prevImages];
            const fallbackIndex = index % fallbackImages.length;
            newImages[index] = {
                ...fallbackImages[fallbackIndex],
                original_url: newImages[index]?.image_url
            };

            // Marcar como cargada después del reemplazo
            setTimeout(() => handleImageLoad(index), 100);
            return newImages;
        });
    }, [handleImageLoad]);

    const handleOpenZoom = useCallback(() => {
        setOpenZoom(true);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!imageRef.current || !isHovering || isMobile) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        // Limitar valores entre 0 y 1 para evitar comportamiento extraño en bordes
        setMousePosition({
            x: Math.max(0, Math.min(1, x)),
            y: Math.max(0, Math.min(1, y))
        });
    }, [isHovering, isMobile]);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (!isMobile) {
            setIsHovering(true);
        }
    }, [isMobile]);

    // Gestos para dispositivos móviles
    useEffect(() => {
        if (isMobile && containerRef.current) {
            let touchStartX = 0;

            const handleTouchStart = (e) => {
                touchStartX = e.touches[0].clientX;
            };

            const handleTouchEnd = (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;

                // Umbral de 30px para considerar un deslizamiento
                if (Math.abs(diff) > 30) {
                    if (diff > 0) {
                        handleNext();
                    } else {
                        handlePrev();
                    }
                }
            };

            const container = containerRef.current;
            container.addEventListener('touchstart', handleTouchStart);
            container.addEventListener('touchend', handleTouchEnd);

            return () => {
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [isMobile, handleNext, handlePrev]);

    // Manejo de teclado para accesibilidad
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!openZoom) return;

            switch(e.key) {
                case 'ArrowLeft':
                    handlePrev();
                    break;
                case 'ArrowRight':
                    handleNext();
                    break;
                case 'Escape':
                    handleCloseZoom();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [openZoom, handleNext, handlePrev, handleCloseZoom]);

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: { xs: '350px', sm: '400px', md: '500px' },
                width: '100%',
                fontFamily: typography.fontFamily
            }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <CircularProgress
                        color="primary"
                        size={isMobile ? 40 : 50}
                        sx={{ color: vistelicaColors.primary }}
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            mt: 2,
                            color: 'text.secondary',
                            fontFamily: typography.fontFamily,
                            textAlign: 'center'
                        }}
                    >
                        Cargando imágenes...
                    </Typography>
                </motion.div>
            </Box>
        );
    }

    // Verifica si la imagen actual está cargada
    const isCurrentImageLoaded = imagesLoaded[currentIndex];

    return (
        <Box sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '100%', md: '520px', lg: '600px' },
            margin: '0 auto',
            minHeight: { xs: '350px', sm: '400px', md: '500px' }
        }}>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Box sx={{
                        mb: 2,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: `${vistelicaColors.primary}15`,
                        color: vistelicaColors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                        <ErrorOutlineIcon fontSize="small" />
                        <Typography
                            variant="body2"
                            sx={{ fontFamily: typography.fontFamily }}
                        >
                            {error}
                        </Typography>
                    </Box>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                ref={containerRef}
            >
                <Paper
                    elevation={isMobile ? 2 : 4}
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: { xs: 2, sm: 3 },
                        aspectRatio: isMobile ? '1/1.2' : '3/4',
                        minHeight: {
                            xs: '300px',
                            sm: '400px',
                            md: '500px',
                            lg: '600px'
                        },
                        cursor: !isMobile && isHovering ? 'crosshair' : 'zoom-in',
                        boxShadow: isHovering
                            ? '0 15px 35px rgba(0,0,0,0.1)'
                            : '0 10px 25px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                            transform: 'translateY(-2px)'
                        },
                        border: `1px solid ${vistelicaColors.primary}10`,
                    }}
                    onClick={handleOpenZoom}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    ref={imageRef}
                >
                    {/* Fondo con gradiente sutil */}
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(45deg, ${vistelicaColors.primary}05, ${vistelicaColors.secondary}05, white)`
                    }} />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{
                                height: '100%',
                                width: '100%',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {!isCurrentImageLoaded && (
                                <Box sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'rgba(248, 248, 248, 0.6)',
                                    zIndex: 1
                                }}>
                                    <Skeleton
                                        variant="rectangular"
                                        animation="wave"
                                        width="80%"
                                        height="60%"
                                        sx={{
                                            bgcolor: 'rgba(240, 240, 240, 0.7)',
                                            borderRadius: 2
                                        }}
                                    />
                                    <PhotoLibraryIcon
                                        sx={{
                                            color: vistelicaColors.primary,
                                            fontSize: { xs: '2.5rem', sm: '3.5rem' },
                                            opacity: 0.5,
                                            position: 'absolute'
                                        }}
                                    />
                                </Box>
                            )}

                            <Box
                                component="img"
                                src={images[currentIndex]?.image_url || fallbackImages[0].image_url}
                                alt={`Imagen del producto ${currentIndex + 1}`}
                                onError={() => handleImageError(currentIndex)}
                                onLoad={() => handleImageLoad(currentIndex)}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.15s ease-out',
                                    transformOrigin: isHovering && !isMobile
                                        ? `${mousePosition.x * 100}% ${mousePosition.y * 100}%`
                                        : 'center center',
                                    transform: isHovering && !isMobile ? 'scale(1.6)' : 'scale(1)',
                                    filter: images[currentIndex]?.is_fallback ? 'grayscale(0.2)' : 'none',
                                }}
                            />

                            {/* Superposición para imágenes de respaldo */}
                            {images[currentIndex]?.is_fallback && isCurrentImageLoaded && (
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    p: { xs: 1, sm: 1.5 },
                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                    fontFamily: typography.fontFamily,
                                }}>
                                    Imagen de ejemplo
                                </Box>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Botón de zoom */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovering || isMobile ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        sx={{
                            position: 'absolute',
                            right: 12,
                            top: 12,
                            zIndex: 10
                        }}
                    >
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenZoom();
                            }}
                            aria-label="Ver imagen ampliada"
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 1)'
                                },
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            <ZoomInIcon sx={{ color: vistelicaColors.secondary }} />
                        </IconButton>
                    </Box>

                    {/* Controles de navegación - CENTRADOS Y CORREGIDOS */}
                    {images.length > 1 && (
                        <>
                            {/* Botones estilo "carrusel profesional" - centrados verticalmente */}
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                pointerEvents: 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                px: { xs: 1, sm: 1.5, md: 2 },
                                zIndex: 5
                            }}>
                                {/* Botón anterior */}
                                <IconButton
                                    onClick={handlePrev}
                                    aria-label="Imagen anterior"
                                    sx={{
                                        pointerEvents: 'auto',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            transform: 'scale(1.1)'
                                        },
                                        '&:active': {
                                            transform: 'scale(0.95)'
                                        },
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                        width: { xs: 40, sm: 50 },
                                        height: { xs: 40, sm: 50 },
                                        transition: 'all 0.2s ease',
                                        borderRadius: '50%',
                                    }}
                                >
                                    <ChevronLeftIcon sx={{
                                        fontSize: { xs: 24, sm: 30 },
                                        color: vistelicaColors.secondary
                                    }} />
                                </IconButton>

                                {/* Botón siguiente */}
                                <IconButton
                                    onClick={handleNext}
                                    aria-label="Imagen siguiente"
                                    sx={{
                                        pointerEvents: 'auto',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            transform: 'scale(1.1)'
                                        },
                                        '&:active': {
                                            transform: 'scale(0.95)'
                                        },
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                        width: { xs: 40, sm: 50 },
                                        height: { xs: 40, sm: 50 },
                                        transition: 'all 0.2s ease',
                                        borderRadius: '50%',
                                    }}
                                >
                                    <ChevronRightIcon sx={{
                                        fontSize: { xs: 24, sm: 30 },
                                        color: vistelicaColors.secondary
                                    }} />
                                </IconButton>
                            </Box>
                        </>
                    )}

                    {/* Indicadores de posición */}
                    {/* Indicadores de posición - MEJORADOS Y CENTRADOS */}
                    {images.length > 1 && (
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            sx={{
                                position: 'absolute',
                                bottom: { xs: 10, sm: 12, md: 16 },
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 10
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: { xs: 0.5, sm: 0.8 },
                                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                                    backdropFilter: 'blur(4px)',
                                    borderRadius: 10,
                                    py: { xs: 0.5, sm: 0.7 },
                                    px: { xs: 1.5, sm: 2 },
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    border: `1px solid rgba(255,255,255,0.8)`
                                }}
                            >
                                {images.map((_, index) => (
                                    <IconButton
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentIndex(index);
                                        }}
                                        size="small"
                                        aria-label={`Ir a imagen ${index + 1} de ${images.length}`}
                                        sx={{
                                            padding: { xs: 0.4, sm: 0.5 },
                                            minWidth: 'auto',
                                            width: { xs: 18, sm: 24 },
                                            height: { xs: 18, sm: 24 },
                                            margin: '0 1px'
                                        }}
                                    >
                                        <FiberManualRecordIcon
                                            sx={{
                                                fontSize: currentIndex === index ? { xs: 12, sm: 14 } : { xs: 8, sm: 10 },
                                                color: currentIndex === index ? vistelicaColors.primary : 'rgba(0,0,0,0.3)',
                                                transition: 'all 0.3s ease',
                                                filter: currentIndex === index ? 'drop-shadow(0 0 2px rgba(0,0,0,0.2))' : 'none'
                                            }}
                                        />
                                    </IconButton>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Paper>
            </motion.div>

            {/* Miniaturas mejoradas */}
            {images.length > 1 && (
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: { xs: 1, sm: 1.5 },
                        mt: { xs: 1.5, sm: 2.5, md: 3 },
                        pb: { xs: 1, sm: 1.5, md: 2 },
                        px: { xs: 1, sm: 2 },
                        overflowX: 'auto',
                        scrollSnapType: 'x mandatory',
                        msOverflowStyle: 'none', // Para Edge
                        scrollbarWidth: 'thin', // Para Firefox
                        '&::-webkit-scrollbar': {
                            height: { xs: 3, sm: 4 }
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                            borderRadius: 10
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: vistelicaColors.primary,
                            borderRadius: 10
                        }
                    }}
                >
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, y: -3 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: Math.min(index * 0.05, 0.5) // limitar el delay máximo
                            }}
                            style={{ scrollSnapAlign: 'center' }}
                        >
                            <Paper
                                elevation={currentIndex === index ? 3 : 1}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(index);
                                }}
                                sx={{
                                    width: { xs: 50, sm: 60, md: 70 },
                                    height: { xs: 65, sm: 75, md: 90 },
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    borderRadius: { xs: 1.5, sm: 2 },
                                    border: currentIndex === index
                                        ? `2px solid ${vistelicaColors.primary}`
                                        : `1px solid ${vistelicaColors.primary}20`,
                                    boxShadow: currentIndex === index
                                        ? `0 0 0 2px white, 0 0 0 4px ${vistelicaColors.primary}30`
                                        : 'none',
                                    transition: 'all 0.2s ease',
                                    opacity: img.is_fallback ? 0.7 : 1,
                                    filter: img.is_fallback ? 'grayscale(0.3)' : 'none',
                                    position: 'relative'
                                }}
                            >
                                {!imagesLoaded[index] && (
                                    <Skeleton
                                        variant="rectangular"
                                        animation="wave"
                                        width="100%"
                                        height="100%"
                                        sx={{ position: 'absolute', inset: 0 }}
                                    />
                                )}
                                <Box
                                    component="img"
                                    src={img.image_url}
                                    alt={`Miniatura ${index + 1}`}
                                    onError={() => handleImageError(index)}
                                    onLoad={() => handleImageLoad(index)}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Paper>
                        </motion.div>
                    ))}
                </Box>
            )}

            {/* Modal para zoom a pantalla completa - Mejorado */}
            <Modal
                open={openZoom}
                onClose={handleCloseZoom}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 300,
                        sx: { backgroundColor: 'rgba(0, 0, 0, 0.85)' }
                    },
                }}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Fade in={openZoom} timeout={300}>
                    <Box sx={{
                        position: 'relative',
                        maxWidth: '95vw',
                        maxHeight: '95vh',
                        outline: 'none'
                    }}>
                        {/* Botón cerrar */}
                        <IconButton
                            onClick={handleCloseZoom}
                            aria-label="Cerrar vista ampliada"
                            sx={{
                                position: 'absolute',
                                right: { xs: -8, sm: -16 },
                                top: { xs: -8, sm: -16 },
                                backgroundColor: 'white',
                                zIndex: 10,
                                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                '&:hover': {
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            <CloseIcon sx={{ color: vistelicaColors.secondary }} />
                        </IconButton>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Paper
                                elevation={24}
                                sx={{
                                    overflow: 'hidden',
                                    borderRadius: { xs: 1, sm: 2 },
                                    maxHeight: '90vh',
                                    maxWidth: '90vw',
                                    backgroundColor: '#fff',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative'
                                }}
                            >
                                {/* Contador de imágenes */}
                                {images.length > 1 && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 15,
                                            left: 15,
                                            bgcolor: 'rgba(0,0,0,0.7)',
                                            borderRadius: 5,
                                            px: 1.5,
                                            py: 0.5,
                                            zIndex: 5,
                                            fontFamily: typography.fontFamily
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'white',
                                                fontFamily: typography.fontFamily,
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {currentIndex + 1} / {images.length}
                                        </Typography>
                                    </Box>
                                )}

                                {!isCurrentImageLoaded && (
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '90vw',
                                        height: '80vh',
                                        position: 'relative'
                                    }}>
                                        <CircularProgress
                                            size={40}
                                            sx={{ color: vistelicaColors.primary }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mt: 2,
                                                fontFamily: typography.fontFamily
                                            }}
                                        >
                                            Cargando imagen...
                                        </Typography>
                                    </Box>
                                )}

                                <Box
                                    component="img"
                                    loading="lazy"
                                    src={images[currentIndex]?.image_url}
                                    alt={`Imagen ampliada ${currentIndex + 1}`}
                                    onError={() => handleImageError(currentIndex)}
                                    onLoad={() => handleImageLoad(currentIndex)}
                                    sx={{
                                        maxHeight: '90vh',
                                        maxWidth: '90vw',
                                        objectFit: 'contain',
                                        display: isCurrentImageLoaded ? 'block' : 'none'
                                    }}
                                />
                            </Paper>
                        </motion.div>

                        {/* Controles de navegación en modal - CENTRADOS */}
                        {images.length > 1 && (
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                pointerEvents: 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: { xs: 1, sm: 2 }
                            }}>
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrev();
                                    }}
                                    aria-label="Imagen anterior (modo zoom)"
                                    sx={{
                                        pointerEvents: 'auto',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            transform: 'scale(1.1)'
                                        },
                                        '&:active': {
                                            transform: 'scale(0.95)'
                                        },
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        width: { xs: 40, sm: 56 },
                                        height: { xs: 40, sm: 56 }
                                    }}
                                >
                                    <ChevronLeftIcon
                                        fontSize={isMobile ? "medium" : "large"}
                                        sx={{ color: vistelicaColors.secondary }}
                                    />
                                </IconButton>

                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNext();
                                    }}
                                    aria-label="Imagen siguiente (modo zoom)"
                                    sx={{
                                        pointerEvents: 'auto',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            transform: 'scale(1.1)'
                                        },
                                        '&:active': {
                                            transform: 'scale(0.95)'
                                        },
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        width: { xs: 40, sm: 56 },
                                        height: { xs: 40, sm: 56 }
                                    }}
                                >
                                    <ChevronRightIcon
                                        fontSize={isMobile ? "medium" : "large"}
                                        sx={{ color: vistelicaColors.secondary }}
                                    />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default ProductGallery;