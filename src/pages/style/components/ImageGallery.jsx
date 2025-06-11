import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    IconButton,
    useTheme,
    useMediaQuery,
    Typography,
    Fade,
    Grow,
    CircularProgress,
    Modal,
    Slide
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    X,
    Maximize,
    MinusCircle,
    PlusCircle
} from 'lucide-react';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const ImageGallery = ({
                          styleImages,
                          currentImageIndex,
                          selectedThumbnail,
                          onPrevImage,
                          onNextImage,
                          onThumbnailClick,
                          isMobile
                      }) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const [imageLoading, setImageLoading] = useState(true);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [zoomed, setZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const [modalOpen, setModalOpen] = useState(false);
    const [modalZoomLevel, setModalZoomLevel] = useState(1);
    const [modalImagePos, setModalImagePos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setImageLoading(true);
    }, [currentImageIndex]);

    // Reset zoom cuando se cambia de imagen en el modal
    useEffect(() => {
        if (modalOpen) {
            setModalZoomLevel(1);
            setModalImagePos({ x: 0, y: 0 });
        }
    }, [currentImageIndex, modalOpen]);

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    // Handlers para swipe/deslizar
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart === null || touchEnd === null) return;
        const distance = touchStart - touchEnd;
        if (distance > 50) onNextImage();
        if (distance < -50) onPrevImage();
        setTouchStart(null);
        setTouchEnd(null);
    };

    // Handlers de zoom al pasar el mouse
    const handleMouseMove = (e) => {
        if (isMobile) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
    };

    const handleMouseEnter = () => !isMobile && setZoomed(true);
    const handleMouseLeave = () => !isMobile && setZoomed(false);

    // Handlers del modal
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => {
        setModalOpen(false);
        setModalZoomLevel(1);
        setModalImagePos({ x: 0, y: 0 });
    };

    // Zoom en el modal
    const increaseModalZoom = () => {
        setModalZoomLevel(prev => Math.min(prev + 0.5, 3));
    };

    const decreaseModalZoom = () => {
        setModalZoomLevel(prev => {
            const newZoom = Math.max(prev - 0.5, 1);
            if (newZoom === 1) setModalImagePos({ x: 0, y: 0 });
            return newZoom;
        });
    };

    // Arrastrar imagen en el modal
    const handleModalMouseDown = (e) => {
        if (modalZoomLevel > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - modalImagePos.x,
                y: e.clientY - modalImagePos.y
            });
        }
    };

    const handleModalMouseMove = useCallback((e) => {
        if (isDragging && modalZoomLevel > 1) {
            const maxOffset = 100 * (modalZoomLevel - 1);
            setModalImagePos({
                x: Math.max(Math.min(e.clientX - dragStart.x, maxOffset), -maxOffset),
                y: Math.max(Math.min(e.clientY - dragStart.y, maxOffset), -maxOffset)
            });
        }
    }, [isDragging, modalZoomLevel, dragStart]);

    const handleModalMouseUp = () => {
        setIsDragging(false);
    };

    // Escuchamos los eventos de mouse globales cuando estamos arrastrando
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleModalMouseMove);
            window.addEventListener('mouseup', handleModalMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleModalMouseMove);
            window.removeEventListener('mouseup', handleModalMouseUp);
        };
    }, [isDragging, handleModalMouseMove]);

    // Navegación con teclado en el modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!modalOpen) return;

            switch (e.key) {
                case 'ArrowLeft':
                    onPrevImage();
                    break;
                case 'ArrowRight':
                    onNextImage();
                    break;
                case 'Escape':
                    handleCloseModal();
                    break;
                case '+':
                    increaseModalZoom();
                    break;
                case '-':
                    decreaseModalZoom();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalOpen, onNextImage, onPrevImage]);

    return (
        <Box sx={{
            position: 'relative',
            borderRadius: 5,
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${vistelicaColors.backgroundLight} 60%, ${vistelicaColors.backgroundAccent}50 100%)`,
            boxShadow: `0 22px 55px ${vistelicaColors.shadow}30`,
            border: `2px solid ${vistelicaColors.primary}40`,
            minHeight: { xs: 450, sm: 560, md: 720 },
            maxWidth: { xs: '98vw', md: 720, lg: 920 },
            margin: '0 auto',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                boxShadow: `0 28px 70px ${vistelicaColors.primary}38, 0 6px 14px ${vistelicaColors.shadow}18`
            }
        }}>
            {/* Contador de imágenes */}
            <Box sx={{
                position: 'absolute',
                top: 24,
                right: 32,
                zIndex: 5,
                backgroundColor: `${vistelicaColors.backgroundDark}C0`,
                color: vistelicaColors.white,
                borderRadius: 16,
                px: 2.5,
                py: 0.7,
                fontSize: { xs: '1rem', sm: '1.15rem' },
                fontWeight: 700,
                fontFamily: typography.fontFamily,
                letterSpacing: 1,
                backdropFilter: 'blur(8px)',
                boxShadow: `0 2px 12px ${vistelicaColors.shadow}30`,
                border: `1px solid ${vistelicaColors.white}30`
            }}>
                {currentImageIndex + 1} / {styleImages.length}
            </Box>

            {/* Botones de navegación principales */}
            <IconButton
                onClick={onPrevImage}
                aria-label="Imagen anterior"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: { xs: 10, sm: 24 },
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    bgcolor: `${vistelicaColors.white}F0`,
                    boxShadow: `0 6px 18px ${vistelicaColors.shadow}18`,
                    border: `2px solid ${vistelicaColors.primary}30`,
                    borderRadius: '50%',
                    backdropFilter: 'blur(6px)',
                    width: { xs: 54, sm: 64, md: 74 },
                    height: { xs: 54, sm: 64, md: 74 },
                    color: vistelicaColors.primary,
                    '&:hover': {
                        bgcolor: vistelicaColors.primary,
                        color: vistelicaColors.white,
                        transform: 'translateY(-50%) scale(1.12)',
                        boxShadow: `0 10px 24px ${vistelicaColors.primary}30`,
                    },
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <ChevronLeft size={isMobile ? 28 : 36} strokeWidth={2.5} />
            </IconButton>

            <IconButton
                onClick={onNextImage}
                aria-label="Imagen siguiente"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    right: { xs: 10, sm: 24 },
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    bgcolor: `${vistelicaColors.white}F0`,
                    boxShadow: `0 6px 18px ${vistelicaColors.shadow}18`,
                    border: `2px solid ${vistelicaColors.primary}30`,
                    borderRadius: '50%',
                    backdropFilter: 'blur(6px)',
                    width: { xs: 54, sm: 64, md: 74 },
                    height: { xs: 54, sm: 64, md: 74 },
                    color: vistelicaColors.primary,
                    '&:hover': {
                        bgcolor: vistelicaColors.primary,
                        color: vistelicaColors.white,
                        transform: 'translateY(-50%) scale(1.12)',
                        boxShadow: `0 10px 24px ${vistelicaColors.primary}30`,
                    },
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <ChevronRight size={isMobile ? 28 : 36} strokeWidth={2.5} />
            </IconButton>

            {/* Botón de ampliación */}
            <IconButton
                aria-label="Ampliar imagen"
                onClick={handleOpenModal}
                sx={{
                    position: 'absolute',
                    bottom: { xs: 90, sm: 120 },
                    right: 32,
                    zIndex: 3,
                    bgcolor: `${vistelicaColors.white}F0`,
                    boxShadow: `0 4px 14px ${vistelicaColors.shadow}15`,
                    border: `2px solid ${vistelicaColors.primary}30`,
                    backdropFilter: 'blur(5px)',
                    width: { xs: 44, sm: 54 },
                    height: { xs: 44, sm: 54 },
                    color: vistelicaColors.secondary,
                    '&:hover': {
                        bgcolor: vistelicaColors.primary,
                        color: vistelicaColors.white,
                    },
                    transition: 'all 0.2s ease-in-out'
                }}
            >
                <Maximize size={isMobile ? 22 : 26} />
            </IconButton>

            {/* Imagen principal con efecto de lupa al hover */}
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '24px 24px 0 0',
                    bgcolor: vistelicaColors.backgroundAccent,
                    aspectRatio: { xs: '3/4', sm: '4/5', md: '4/5' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: { xs: 320, sm: 420, md: 540 },
                    cursor: zoomed ? 'zoom-in' : 'default',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        opacity: zoomed ? 0 : 0.6,
                        background: `radial-gradient(circle at center, transparent 30%, ${vistelicaColors.backgroundDark}20 100%)`,
                        zIndex: 1,
                        transition: 'opacity 0.5s ease'
                    }
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleOpenModal}
            >
                {imageLoading && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `${vistelicaColors.backgroundLight}80`,
                        zIndex: 2
                    }}>
                        <CircularProgress size={60} thickness={4.5} sx={{
                            color: vistelicaColors.primary
                        }} />
                    </Box>
                )}
                <Fade in={!imageLoading} timeout={400}>
                    <Box
                        component="img"
                        src={styleImages[currentImageIndex]?.image_url || "/api/placeholder/600/800"}
                        alt={`Vista del producto ${currentImageIndex + 1}`}
                        onLoad={handleImageLoad}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center',
                            padding: { xs: 0, sm: 2 },
                            transition: 'transform 0.5s cubic-bezier(.25,.8,.25,1)',
                            transform: zoomed && !isMobile ? 'scale(1.7)' : 'scale(1)',
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            filter: zoomed ? 'none' : 'brightness(0.95)',
                            zIndex: 1
                        }}
                    />
                </Fade>

                {/* Indicador de zoom (solo en desktop) */}
                {!isMobile && (
                    <Fade in={!imageLoading} timeout={600}>
                        <Box sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 2,
                            color: vistelicaColors.white,
                            padding: '6px 16px',
                            borderRadius: 20,
                            background: `${vistelicaColors.backgroundDark}A0`,
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            opacity: 0.75,
                            transition: 'opacity 0.3s',
                            '&:hover': {
                                opacity: 1
                            }
                        }}>
                            <ZoomIn size={18} />
                            <Typography sx={{
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                userSelect: 'none'
                            }}>
                                Pasa el mouse para zoom | Click para ampliar
                            </Typography>
                        </Box>
                    </Fade>
                )}
            </Box>

            {/* Modal avanzado para ver la imagen completa */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                closeAfterTransition
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1300
                }}
            >
                <Fade in={modalOpen}>
                    <Box sx={{
                        outline: 'none',
                        position: 'relative',
                        bgcolor: '#000000',
                        borderRadius: 3,
                        boxShadow: 24,
                        p: { xs: 1, sm: 3 },
                        maxWidth: '96vw',
                        maxHeight: '96vh',
                        width: { xs: '100%', md: '90%' },
                        height: { xs: '90%', md: '90%' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${vistelicaColors.primary}30`
                    }}>
                        {/* Barra superior del modal */}
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            padding: { xs: 1, sm: 2 },
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backdropFilter: 'blur(10px)',
                            background: 'rgba(0,0,0,0.5)',
                            zIndex: 5,
                            borderRadius: '12px 12px 0 0'
                        }}>
                            <Typography sx={{
                                color: vistelicaColors.white,
                                fontWeight: 500,
                                ml: 2,
                                fontSize: { xs: '0.9rem', md: '1.1rem' }
                            }}>
                                {currentImageIndex + 1} / {styleImages.length}
                            </Typography>

                            {/* Controles de zoom */}
                            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                                <IconButton
                                    onClick={decreaseModalZoom}
                                    disabled={modalZoomLevel <= 1}
                                    size="small"
                                    sx={{
                                        color: vistelicaColors.white,
                                        opacity: modalZoomLevel <= 1 ? 0.4 : 0.8,
                                        '&:hover': {
                                            opacity: 1,
                                            bgcolor: `${vistelicaColors.primary}50`
                                        }
                                    }}
                                >
                                    <MinusCircle size={20} />
                                </IconButton>

                                <Typography sx={{
                                    color: vistelicaColors.white,
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '0.9rem'
                                }}>
                                    {Math.round(modalZoomLevel * 100)}%
                                </Typography>

                                <IconButton
                                    onClick={increaseModalZoom}
                                    disabled={modalZoomLevel >= 3}
                                    size="small"
                                    sx={{
                                        color: vistelicaColors.white,
                                        opacity: modalZoomLevel >= 3 ? 0.4 : 0.8,
                                        '&:hover': {
                                            opacity: 1,
                                            bgcolor: `${vistelicaColors.primary}50`
                                        }
                                    }}
                                >
                                    <PlusCircle size={20} />
                                </IconButton>
                            </Box>

                            {/* Botón de cierre */}
                            <IconButton
                                onClick={handleCloseModal}
                                aria-label="Cerrar vista ampliada"
                                sx={{
                                    position: 'absolute',
                                    top: { xs: 8, sm: 16 },
                                    right: { xs: 8, sm: 16 },
                                    color: vistelicaColors.quaternary,
                                    bgcolor: 'rgba(0,0,0,0.4)',
                                    '&:hover': {
                                        bgcolor: vistelicaColors.primary,
                                    }
                                }}
                            >
                                <X size={24} />
                            </IconButton>
                        </Box>

                        {/* Container principal de la imagen con navegación */}
                        <Box sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: modalZoomLevel > 1 ? isDragging ? 'grabbing' : 'grab' : 'default'
                        }}
                             onMouseDown={handleModalMouseDown}
                        >
                            {/* Imagen con zoom */}
                            <Box
                                component="img"
                                src={styleImages[currentImageIndex]?.image_url || "/api/placeholder/600/800"}
                                alt={`Vista ampliada del producto ${currentImageIndex + 1}`}
                                sx={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    transition: isDragging ? 'none' : 'transform 0.3s ease',
                                    transform: `scale(${modalZoomLevel}) translate(${modalImagePos.x / modalZoomLevel}px, ${modalImagePos.y / modalZoomLevel}px)`,
                                    filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.4))'
                                }}
                            />

                            {/* Botones de navegación en el modal */}
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: { xs: '0 10px', sm: '0 20px' },
                                pointerEvents: 'none' // Permitir clicks en la imagen
                            }}>
                                <IconButton
                                    onClick={onPrevImage}
                                    aria-label="Imagen anterior"
                                    sx={{
                                        bgcolor: 'rgba(0,0,0,0.2)',
                                        color: vistelicaColors.white,
                                        '&:hover': {
                                            bgcolor: vistelicaColors.primary
                                        },
                                        pointerEvents: 'auto' // Reactivar clicks en este botón
                                    }}
                                >
                                    <ChevronLeft size={24} />
                                </IconButton>

                                <IconButton
                                    onClick={onNextImage}
                                    aria-label="Imagen siguiente"
                                    sx={{
                                        bgcolor: 'rgba(0,0,0,0.2)',
                                        color: vistelicaColors.white,
                                        '&:hover': {
                                            bgcolor: vistelicaColors.primary
                                        },
                                        pointerEvents: 'auto' // Reactivar clicks en este botón
                                    }}
                                >
                                    <ChevronRight size={24} />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Miniaturas en el modal */}
                        <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1.5,
                            padding: '12px',
                            backdropFilter: 'blur(10px)',
                            background: 'rgba(0,0,0,0.5)',
                            overflowX: 'auto',
                            scrollbarWidth: 'none',
                            '&::-webkit-scrollbar': { display: 'none' },
                        }}>
                            {styleImages.map((img, index) => (
                                <Box
                                    key={index}
                                    onClick={() => onThumbnailClick(index)}
                                    sx={{
                                        width: { xs: 40, sm: 50 },
                                        height: { xs: 50, sm: 60 },
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        border: index === currentImageIndex
                                            ? `2px solid ${vistelicaColors.primary}`
                                            : '2px solid transparent',
                                        opacity: index === currentImageIndex ? 1 : 0.6,
                                        transform: index === currentImageIndex ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'all 0.2s ease',
                                        flexShrink: 0,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            opacity: 1,
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={img.image_url}
                                        alt={`Miniatura ${index + 1}`}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* Miniaturas mejoradas */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: { xs: '18px 8px', sm: '24px 16px' },
                background: `linear-gradient(90deg, ${vistelicaColors.white} 80%, ${vistelicaColors.backgroundLight} 100%)`,
                gap: { xs: 1.5, sm: 2.5 },
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                boxShadow: `inset 0 2px 8px ${vistelicaColors.shadow}10`
            }}>
                {styleImages.map((img, index) => (
                    <Grow
                        key={index}
                        in={true}
                        style={{ transformOrigin: '0 0 0' }}
                        timeout={350 + index * 60}
                    >
                        <Box
                            onClick={() => onThumbnailClick(index)}
                            sx={{
                                position: 'relative',
                                width: { xs: 50, sm: 65, md: 75 },
                                height: { xs: 70, sm: 90, md: 100 },
                                borderRadius: 2,
                                overflow: 'hidden',
                                flexShrink: 0,
                                cursor: 'pointer',
                                boxShadow: index === selectedThumbnail
                                    ? `0 0 0 3px ${vistelicaColors.primary}, 0 8px 20px ${vistelicaColors.shadow}30`
                                    : `0 3px 10px ${vistelicaColors.shadow}20`,
                                transform: index === selectedThumbnail ? 'translateY(-4px)' : 'none',
                                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                opacity: index === selectedThumbnail ? 1 : 0.85,
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: index === selectedThumbnail
                                        ? `0 8px 20px ${vistelicaColors.shadow}30, 0 0 0 3px ${vistelicaColors.primary}`
                                        : `0 8px 20px ${vistelicaColors.shadow}30`,
                                    opacity: 1
                                },
                                '&::after': index === selectedThumbnail ? {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '4px',
                                    background: `linear-gradient(90deg, ${vistelicaColors.primary}20, ${vistelicaColors.primary}, ${vistelicaColors.primary}20)`,
                                    animation: 'pulse 2s infinite',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 0.6 },
                                        '50%': { opacity: 1 },
                                        '100%': { opacity: 0.6 },
                                    }
                                } : {}
                            }}
                        >
                            <Box
                                component="img"
                                src={img.image_url}
                                alt={`Vista miniatura ${index + 1}`}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s cubic-bezier(.2,1,.2,1)',
                                    '&:hover': {
                                        transform: 'scale(1.12)'
                                    }
                                }}
                            />
                        </Box>
                    </Grow>
                ))}
            </Box>
        </Box>
    );
};

export default ImageGallery;