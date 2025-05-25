"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    IconButton,
    useMediaQuery,
    useTheme,
    Typography,
    Modal,
    Fade,
    Backdrop
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import productService from '@/services/productService';
import CircularProgress from '@mui/material/CircularProgress';
import { motion, AnimatePresence } from "framer-motion";
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';

const ProductGallery = ({ productId, initialImages = [] }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState(initialImages);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openZoom, setOpenZoom] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);

    // Evitar bucle infinito
    const fetchAttempted = useRef(false);

    // Imágenes de respaldo
    const fallbackImages = [
        { image_url: '/assets/images/products/placeholder-image.jpg' },
        { image_url: '/assets/images/products/placeholder-image-2.jpg' }
    ];

    useEffect(() => {
        // Si ya tenemos imágenes, no hacemos llamada
        if (initialImages?.length > 0) {
            setImages(initialImages);
            setLoading(false);
            return;
        }

        // Si ya intentamos cargar o no hay ID, usamos fallback
        if (fetchAttempted.current || !productId) {
            if (!images.length) {
                setImages(fallbackImages);
            }
            setLoading(false);
            return;
        }

        const fetchProductImages = async () => {
            setLoading(true);
            fetchAttempted.current = true;

            try {
                const productImages = await productService.getAllImagesByProductId(productId);

                if (productImages?.length > 0) {
                    setImages(productImages);
                } else {
                    console.log("No se encontraron imágenes, usando fallback");
                    setImages(fallbackImages);
                }
            } catch (error) {
                console.error('Error al cargar imágenes del producto:', error);
                setError("No se pudieron cargar las imágenes");
                setImages(fallbackImages);
            } finally {
                setLoading(false);
            }
        };

        fetchProductImages();
    }, [productId, initialImages]);

    const handleNext = (e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrev = (e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleImageError = (index) => {
        // Reemplazar imagen rota con fallback
        setImages(prevImages => {
            const newImages = [...prevImages];
            newImages[index] = {
                ...newImages[index],
                image_url: '/assets/images/products/placeholder-image.jpg'
            };
            return newImages;
        });
    };

    const handleOpenZoom = () => setOpenZoom(true);
    const handleCloseZoom = () => setOpenZoom(false);

    const handleMouseMove = (e) => {
        if (!imageRef.current || !isHovering) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        // Limitar valores entre 0 y 1 para evitar comportamiento extraño en bordes
        setMousePosition({
            x: Math.max(0, Math.min(1, x)),
            y: Math.max(0, Math.min(1, y))
        });
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '500px'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <CircularProgress color="primary" />
                </motion.div>
            </Box>
        );
    }

    return (
        <Box sx={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '520px',
            margin: '0 auto',
            minHeight: '500px'
        }}>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Box sx={{
                        mb: 2,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: `${vistelicaColors.primary}15`,
                        color: vistelicaColors.primary,
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <Typography variant="body2">{error}</Typography>
                    </Box>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 3,
                        aspectRatio: '3/4',
                        minHeight: '600px',
                        [theme.breakpoints.down('sm')]: {
                            minHeight: '350px'
                        },
                        cursor: isHovering ? 'crosshair' : 'zoom-in',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                            transform: 'translateY(-5px)'
                        }
                    }}
                    onClick={handleOpenZoom}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    ref={imageRef}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}
                        >
                            <Box
                                component="img"
                                src={images[currentIndex]?.image_url || '/assets/images/products/placeholder-image.jpg'}
                                alt={`Imagen del producto ${currentIndex + 1}`}
                                onError={() => handleImageError(currentIndex)}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.2s ease-out',
                                    transformOrigin: isHovering ? `${mousePosition.x * 100}% ${mousePosition.y * 100}%` : 'center center',
                                    transform: isHovering ? 'scale(1.7)' : 'scale(1)'
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Botón de zoom */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovering ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenZoom();
                            }}
                            sx={{
                                position: 'absolute',
                                right: 12,
                                top: 12,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 1)'
                                },
                                transition: 'all 0.2s ease',
                                zIndex: 10
                            }}
                        >
                            <ZoomInIcon />
                        </IconButton>
                    </motion.div>

                    {/* Controles de navegación - MEJORADOS */}
                    {images.length > 1 && (
                        <>
                            {/* Botón anterior */}
                            <IconButton
                                onClick={handlePrev}
                                aria-label="Imagen anterior"
                                sx={{
                                    position: 'absolute',
                                    left: 10,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                        transform: 'translateY(-50%) scale(1.1)'
                                    },
                                    '&:active': {
                                        transform: 'translateY(-50%) scale(0.95)'
                                    },
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                    zIndex: 20,
                                    width: 50,
                                    height: 50,
                                    transition: 'all 0.2s ease',
                                    borderRadius: '50%',
                                    padding: 2
                                }}
                            >
                                <ChevronLeftIcon sx={{ fontSize: 30 }} />
                            </IconButton>

                            {/* Botón siguiente */}
                            <IconButton
                                onClick={handleNext}
                                aria-label="Imagen siguiente"
                                sx={{
                                    position: 'absolute',
                                    right: 10,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                        transform: 'translateY(-50%) scale(1.1)'
                                    },
                                    '&:active': {
                                        transform: 'translateY(-50%) scale(0.95)'
                                    },
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                    zIndex: 20,
                                    width: 50,
                                    height: 50,
                                    transition: 'all 0.2s ease',
                                    borderRadius: '50%',
                                    padding: 2
                                }}
                            >
                                <ChevronRightIcon sx={{ fontSize: 30 }} />
                            </IconButton>
                        </>
                    )}

                    {/* Indicadores de posición */}
                    {images.length > 1 && (
                        <Box sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: 1,
                            zIndex: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: 10,
                            padding: '5px 10px'
                        }}>
                            {images.map((_, index) => (
                                <IconButton
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(index);
                                    }}
                                    size="small"
                                    sx={{
                                        padding: 0.5,
                                        minWidth: 'auto'
                                    }}
                                >
                                    <FiberManualRecordIcon
                                        sx={{
                                            fontSize: currentIndex === index ? 14 : 10,
                                            color: currentIndex === index ? vistelicaColors.primary : 'rgba(0,0,0,0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </IconButton>
                            ))}
                        </Box>
                    )}
                </Paper>
            </motion.div>

            {/* Miniaturas mejoradas */}
            {images.length > 1 && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1.5,
                    mt: 3,
                    overflowX: 'auto',
                    paddingBottom: 1.5,
                    '&::-webkit-scrollbar': {
                        height: 4
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: 10
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: vistelicaColors.primary,
                        borderRadius: 10
                    }
                }}>
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.08, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Paper
                                elevation={currentIndex === index ? 4 : 1}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(index);
                                }}
                                sx={{
                                    width: 70,
                                    height: 90,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    borderRadius: 2,
                                    border: currentIndex === index ? `2px solid ${vistelicaColors.primary}` : '2px solid transparent',
                                    boxShadow: currentIndex === index ? `0 0 0 2px white, 0 0 0 4px ${vistelicaColors.primary}30` : '',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Box
                                    component="img"
                                    src={img.image_url || '/assets/images/products/placeholder-image.jpg'}
                                    alt={`Miniatura ${index + 1}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/assets/images/products/placeholder-image.jpg';
                                    }}
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

            {/* Modal para zoom a pantalla completa */}
            <Modal
                open={openZoom}
                onClose={handleCloseZoom}
                closeAfterTransition
                slots={{
                    backdrop: Backdrop
                }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Fade in={openZoom}>
                    <Box sx={{
                        position: 'relative',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        outline: 'none'
                    }}>
                        <IconButton
                            onClick={handleCloseZoom}
                            sx={{
                                position: 'absolute',
                                right: -16,
                                top: -16,
                                backgroundColor: 'white',
                                zIndex: 10,
                                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                '&:hover': {
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Paper
                                elevation={24}
                                sx={{
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    maxHeight: '85vh',
                                    maxWidth: '85vw'
                                }}
                            >
                                <Box
                                    component="img"
                                    src={images[currentIndex]?.image_url || '/assets/images/products/placeholder-image.jpg'}
                                    alt={`Imagen ampliada ${currentIndex + 1}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/assets/images/products/placeholder-image.jpg';
                                    }}
                                    sx={{
                                        maxHeight: '85vh',
                                        maxWidth: '85vw',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Paper>
                        </motion.div>

                        {/* Controles de navegación en modo zoom - MEJORADOS */}
                        {images.length > 1 && (
                            <>
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrev();
                                    }}
                                    aria-label="Imagen anterior (modo zoom)"
                                    sx={{
                                        position: 'absolute',
                                        left: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            transform: 'translateY(-50%) scale(1.1)'
                                        },
                                        '&:active': {
                                            transform: 'translateY(-50%) scale(0.95)'
                                        },
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        zIndex: 100,
                                        width: 56,
                                        height: 56
                                    }}
                                >
                                    <ChevronLeftIcon fontSize="large" />
                                </IconButton>

                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNext();
                                    }}
                                    aria-label="Imagen siguiente (modo zoom)"
                                    sx={{
                                        position: 'absolute',
                                        right: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            transform: 'translateY(-50%) scale(1.1)'
                                        },
                                        '&:active': {
                                            transform: 'translateY(-50%) scale(0.95)'
                                        },
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        zIndex: 100,
                                        width: 56,
                                        height: 56
                                    }}
                                >
                                    <ChevronRightIcon fontSize="large" />
                                </IconButton>
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default ProductGallery;