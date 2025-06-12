'use client';
import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    Box,
    IconButton,
    useTheme,
    useMediaQuery,
    Fade,
    CircularProgress,
    Modal
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    X
} from 'lucide-react';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const ImageGallery = memo(({
                               styleImages = [],
                               currentImageIndex = 0,
                               selectedThumbnail,
                               onPrevImage,
                               onNextImage,
                               onThumbnailClick,
                               isMobile,
                               isFullWidth = false
                           }) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [zoomed, setZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const [modalOpen, setModalOpen] = useState(false);

    // Precargar imagen actual
    useEffect(() => {
        setImageLoaded(false);
        setImageError(false);

        if (!styleImages[currentImageIndex]?.image_url) {
            setImageLoaded(true);
            return;
        }

        const img = new Image();
        img.src = styleImages[currentImageIndex].image_url;
        img.onload = () => setImageLoaded(true);
        img.onerror = () => {
            setImageError(true);
            setImageLoaded(true);
        };

        const timeout = setTimeout(() => setImageLoaded(true), 3000);
        return () => clearTimeout(timeout);
    }, [currentImageIndex, styleImages]);

    // Manejadores de eventos táctiles optimizados
    const handleTouchStart = useCallback((e) => {
        setTouchStart(e.targetTouches[0].clientX);
    }, []);

    const handleTouchMove = useCallback((e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (touchStart === null || touchEnd === null) return;
        const distance = touchStart - touchEnd;
        if (distance > 50) onNextImage();
        if (distance < -50) onPrevImage();
        setTouchStart(null);
        setTouchEnd(null);
    }, [touchStart, touchEnd, onNextImage, onPrevImage]);

    // Manejo de zoom optimizado
    const handleMouseMove = useCallback((e) => {
        if (isMobile) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
    }, [isMobile]);

    const handleMouseEnter = useCallback(() => {
        if (!isMobile) setZoomed(true);
    }, [isMobile]);

    const handleMouseLeave = useCallback(() => {
        if (!isMobile) setZoomed(false);
    }, [isMobile]);

    // Gestión del modal
    const handleOpenModal = useCallback(() => setModalOpen(true), []);
    const handleCloseModal = useCallback(() => setModalOpen(false), []);

    // Navegación con teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!modalOpen) return;

            switch (e.key) {
                case 'ArrowLeft': onPrevImage(); break;
                case 'ArrowRight': onNextImage(); break;
                case 'Escape': handleCloseModal(); break;
                default: break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalOpen, onPrevImage, onNextImage, handleCloseModal]);

    // URL de imagen segura
    const currentImageUrl = styleImages[currentImageIndex]?.image_url || "/api/placeholder/800/1000";

    return (
        <Box
            role="region"
            aria-label="Galería de imágenes del producto"
            sx={{
                position: 'relative',
                borderRadius: { xs: 2, sm: 3 },
                overflow: 'hidden',
                background: vistelicaColors.white,
                boxShadow: `0 10px 30px ${vistelicaColors.shadow}20`,
                border: `1px solid #f0f0f0`,
                minHeight: { xs: 480, sm: 600, md: 720 },  // AMPLIADO: aumentado la altura mínima
                width: isFullWidth ? '100%' : { xs: '100vw', md: 620, lg: 720 },  // AMPLIADO: aumentado ancho
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    boxShadow: `0 15px 45px ${vistelicaColors.shadow}25`,
                    transform: 'translateY(-2px)'
                },
                willChange: 'transform',  // Optimización para animaciones
            }}
        >
            {/* Contador de imágenes */}
            <Box
                role="status"
                aria-live="polite"
                sx={{
                    position: 'absolute',
                    top: { xs: 16, sm: 20 },
                    right: { xs: 16, sm: 20 },
                    zIndex: 5,
                    backgroundColor: vistelicaColors.white,
                    color: vistelicaColors.textPrimary,
                    borderRadius: '40px',
                    px: { xs: 1.8, sm: 2 },
                    py: { xs: 0.6, sm: 0.7 },
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    fontWeight: 500,
                    fontFamily: typography.fontFamily,
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.03)'
                }}
            >
                {currentImageIndex + 1} / {styleImages.length}
            </Box>

            {/* Botones de navegación */}
            <IconButton
                onClick={onPrevImage}
                aria-label="Imagen anterior"
                tabIndex={0}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: { xs: 12, sm: 20 },
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    bgcolor: 'rgba(255,255,255,0.92)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    borderRadius: '50%',
                    width: { xs: 42, sm: 52 },  // AMPLIADO: botones más grandes
                    height: { xs: 42, sm: 52 },
                    color: vistelicaColors.textPrimary,
                    '&:hover': {
                        bgcolor: 'rgba(255,255,255,1)',
                        transform: 'translateY(-50%) scale(1.08)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.16)'
                    },
                    '&:focus': {
                        outline: `2px solid ${vistelicaColors.primary}80`,
                        outlineOffset: 2
                    },
                    transition: 'all 0.2s ease'
                }}
            >
                <ChevronLeft size={isMobile ? 22 : 26} />
            </IconButton>

            <IconButton
                onClick={onNextImage}
                aria-label="Imagen siguiente"
                tabIndex={0}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    right: { xs: 12, sm: 20 },
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    bgcolor: 'rgba(255,255,255,0.92)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    borderRadius: '50%',
                    width: { xs: 42, sm: 52 },  // AMPLIADO: botones más grandes
                    height: { xs: 42, sm: 52 },
                    color: vistelicaColors.textPrimary,
                    '&:hover': {
                        bgcolor: 'rgba(255,255,255,1)',
                        transform: 'translateY(-50%) scale(1.08)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.16)'
                    },
                    '&:focus': {
                        outline: `2px solid ${vistelicaColors.primary}80`,
                        outlineOffset: 2
                    },
                    transition: 'all 0.2s ease'
                }}
            >
                <ChevronRight size={isMobile ? 22 : 26} />
            </IconButton>

            {/* Botón de zoom completo */}
            <IconButton
                onClick={handleOpenModal}
                aria-label="Ampliar imagen"
                tabIndex={0}
                sx={{
                    position: 'absolute',
                    bottom: { xs: 96, sm: 116 },  // AMPLIADO: ajustado posición
                    right: { xs: 16, sm: 20 },
                    zIndex: 2,
                    bgcolor: 'rgba(255,255,255,0.92)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    borderRadius: '50%',
                    width: { xs: 40, sm: 46 },
                    height: { xs: 40, sm: 46 },
                    color: vistelicaColors.textPrimary,
                    '&:hover': {
                        bgcolor: 'rgba(255,255,255,1)',
                        transform: 'scale(1.08)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.16)'
                    },
                    '&:focus': {
                        outline: `2px solid ${vistelicaColors.primary}80`,
                        outlineOffset: 2
                    },
                    transition: 'all 0.2s ease'
                }}
            >
                <ZoomIn size={isMobile ? 20 : 22} />
            </IconButton>

            {/* Imagen principal con zoom al hover */}
            <Box
                role="button"
                tabIndex={0}
                aria-label={`Ampliar imagen ${currentImageIndex + 1} de ${styleImages.length}`}
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: '#f9f9f9',
                    aspectRatio: { xs: '3/4', sm: '4/5' },  // Mantiene proporción
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: { xs: 360, sm: 480, md: 580 },  // AMPLIADO: altura mínima aumentada
                    cursor: 'zoom-in',
                    '&:focus': {
                        outline: `2px solid ${vistelicaColors.primary}80`,
                        outlineOffset: '-2px'
                    }
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleOpenModal}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenModal();
                    }
                }}
            >
                {/* Loader - Solo visible cuando la imagen está cargando */}
                {!imageLoaded && (
                    <Box
                        role="progressbar"
                        aria-label="Cargando imagen"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f9f9f9',
                            zIndex: 2
                        }}
                    >
                        <CircularProgress size={54} thickness={3} sx={{
                            color: vistelicaColors.primary
                        }} />
                    </Box>
                )}

                {/* Imagen con zoom al hover */}
                <Box
                    component="img"
                    src={currentImageUrl}
                    alt={`Vista del producto ${currentImageIndex + 1} de ${styleImages.length}`}
                    loading="lazy"
                    onError={() => setImageError(true)}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        transition: 'transform 0.4s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.3s ease',
                        transform: zoomed && !isMobile ? 'scale(2)' : 'scale(1)',
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        opacity: imageLoaded ? 1 : 0.2,
                        willChange: 'transform',  // Optimización para transformaciones
                    }}
                />

                {/* Mensaje de error en caso de fallo */}
                {imageError && (
                    <Box
                        role="alert"
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: 1,
                            fontSize: '0.8rem',
                            maxWidth: '80%',
                            textAlign: 'center'
                        }}
                    >
                        No se pudo cargar la imagen
                    </Box>
                )}
            </Box>

            {/* Modal para ver la imagen completa */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                closeAfterTransition
                aria-labelledby="modal-image-title"
            >
                <Fade in={modalOpen}>
                    <Box
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-image-title"
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'rgba(255,255,255,0.97)',
                            outline: 'none',
                            zIndex: theme.zIndex.modal
                        }}
                    >
                        {/* Cabecera del modal */}
                        <Box
                            component="header"
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: { xs: 2, sm: 2.5 },
                                borderBottom: '1px solid #f0f0f0',
                                bgcolor: vistelicaColors.white
                            }}
                        >
                            <Box sx={{ width: 40 }} />
                            <Box
                                id="modal-image-title"
                                sx={{
                                    px: 2.5,
                                    py: 0.8,
                                    borderRadius: '40px',
                                    bgcolor: '#f5f5f5',
                                    fontWeight: 500,
                                    fontSize: '0.95rem',
                                    fontFamily: typography.fontFamily
                                }}
                            >
                                {currentImageIndex + 1} / {styleImages.length}
                            </Box>
                            <IconButton
                                onClick={handleCloseModal}
                                aria-label="Cerrar ventana de imagen"
                            >
                                <X size={24} />
                            </IconButton>
                        </Box>

                        {/* Contenedor principal de la imagen */}
                        <Box
                            component="main"
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Botones de navegación grandes en el modal */}
                            <IconButton
                                onClick={onPrevImage}
                                aria-label="Imagen anterior"
                                tabIndex={0}
                                sx={{
                                    position: 'absolute',
                                    left: { xs: 16, sm: 28, md: 48 },
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    bgcolor: 'white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    width: { xs: 46, sm: 54, md: 60 },
                                    height: { xs: 46, sm: 54, md: 60 },
                                    '&:hover': {
                                        transform: 'translateY(-50%) scale(1.1)',
                                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                                    },
                                    '&:focus': {
                                        outline: `2px solid ${vistelicaColors.primary}80`,
                                        outlineOffset: 2
                                    }
                                }}
                            >
                                <ChevronLeft size={28} />
                            </IconButton>

                            <Box
                                component="img"
                                src={currentImageUrl}
                                alt={`Vista ampliada del producto ${currentImageIndex + 1} de ${styleImages.length}`}
                                loading="lazy"
                                onError={() => setImageError(true)}
                                sx={{
                                    maxHeight: 'calc(100vh - 180px)',
                                    maxWidth: '95%',
                                    objectFit: 'contain',
                                    transition: 'opacity 0.3s ease',
                                    opacity: imageLoaded ? 1 : 0.4
                                }}
                            />

                            <IconButton
                                onClick={onNextImage}
                                aria-label="Imagen siguiente"
                                tabIndex={0}
                                sx={{
                                    position: 'absolute',
                                    right: { xs: 16, sm: 28, md: 48 },
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    bgcolor: 'white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    width: { xs: 46, sm: 54, md: 60 },
                                    height: { xs: 46, sm: 54, md: 60 },
                                    '&:hover': {
                                        transform: 'translateY(-50%) scale(1.1)',
                                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                                    },
                                    '&:focus': {
                                        outline: `2px solid ${vistelicaColors.primary}80`,
                                        outlineOffset: 2
                                    }
                                }}
                            >
                                <ChevronRight size={28} />
                            </IconButton>
                        </Box>

                        {/* Miniaturas en el modal */}
                        <Box
                            component="footer"
                            sx={{
                                p: { xs: 2, sm: 2.5 },
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 1.8,   // AMPLIADO: más espacio entre miniaturas
                                overflowX: 'auto',
                                bgcolor: vistelicaColors.white,
                                borderTop: '1px solid #f0f0f0',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': { display: 'none' }
                            }}
                        >
                            {styleImages.map((img, idx) => (
                                <Box
                                    key={idx}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Seleccionar imagen ${idx + 1}${idx === currentImageIndex ? ' (seleccionada)' : ''}`}
                                    aria-current={idx === currentImageIndex ? 'true' : 'false'}
                                    onClick={() => onThumbnailClick(idx)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            onThumbnailClick(idx);
                                        }
                                    }}
                                    sx={{
                                        width: { xs: 64, sm: 70 },   // AMPLIADO: miniaturas más grandes
                                        height: { xs: 64, sm: 70 },
                                        borderRadius: 1.2,   // AMPLIADO: bordes más redondeados
                                        overflow: 'hidden',
                                        border: idx === currentImageIndex
                                            ? `2px solid ${vistelicaColors.primary}`
                                            : '2px solid transparent',
                                        cursor: 'pointer',
                                        opacity: idx === currentImageIndex ? 1 : 0.7,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            opacity: 1,
                                            transform: 'translateY(-4px)'
                                        },
                                        '&:focus': {
                                            outline: `2px solid ${vistelicaColors.primary}80`,
                                            outlineOffset: 2
                                        }
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={img.image_url || "/api/placeholder/100"}
                                        alt={`Miniatura ${idx + 1}`}
                                        loading="lazy"
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* Miniaturas - AMPLIADAS */}
            <Box
                role="tablist"
                aria-label="Miniaturas de imágenes"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: { xs: '16px 10px', sm: '20px 16px' },  // AMPLIADO: más padding
                    bgcolor: vistelicaColors.white,
                    gap: { xs: 1.8, sm: 2 },  // AMPLIADO: más espacio entre miniaturas
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                    borderTop: '1px solid #f0f0f0'
                }}
            >
                {styleImages.map((img, index) => (
                    <Box
                        key={index}
                        role="tab"
                        tabIndex={0}
                        aria-selected={index === currentImageIndex}
                        aria-label={`Miniatura ${index + 1}${index === currentImageIndex ? ' (seleccionada)' : ''}`}
                        onClick={() => onThumbnailClick(index)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onThumbnailClick(index);
                            }
                        }}
                        sx={{
                            width: { xs: 58, sm: 80 },  // AMPLIADO: miniaturas más grandes
                            height: { xs: 58, sm: 80 },
                            borderRadius: 1.5,  // AMPLIADO: bordes más redondeados
                            overflow: 'hidden',
                            border: index === currentImageIndex
                                ? `3px solid ${vistelicaColors.primary}`  // AMPLIADO: borde más grueso
                                : '1px solid #f0f0f0',
                            cursor: 'pointer',
                            opacity: index === currentImageIndex ? 1 : 0.7,
                            transition: 'all 0.3s ease',
                            transform: index === currentImageIndex
                                ? 'scale(1.08)'
                                : 'scale(1)',
                            boxShadow: index === currentImageIndex
                                ? `0 5px 12px ${vistelicaColors.shadow}40`  // AMPLIADO: sombra más pronunciada
                                : 'none',
                            '&:hover': {
                                transform: 'scale(1.08)',
                                opacity: 1,
                                boxShadow: `0 6px 14px ${vistelicaColors.shadow}40`
                            },
                            '&:focus': {
                                outline: `2px solid ${vistelicaColors.primary}80`,
                                outlineOffset: 2
                            }
                        }}
                    >
                        <Box
                            component="img"
                            src={img.image_url || "/api/placeholder/100"}
                            alt={`Miniatura ${index + 1}`}
                            loading="lazy"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
});

// Nombre para DevTools
ImageGallery.displayName = 'ImageGallery';

export default ImageGallery;