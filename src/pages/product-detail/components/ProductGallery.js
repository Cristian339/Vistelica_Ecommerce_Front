"use client";

import React, { useState } from 'react';
import {
    Box,
    Paper,
    IconButton,
    useMediaQuery,
    useTheme
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ProductGallery = ({ images }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <Box sx={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '600px', // Ajustado el ancho máximo
            margin: '0 auto'
        }}>
            {/* Contenedor de la galería */}
            <Box sx={{
                position: 'relative',
                width: '100%'
            }}>
                {/* Imagen principal con flechas */}
                <Paper elevation={3} sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    aspectRatio: '3/4'
                }}>
                    <Box
                        component="img"
                        src={images[currentIndex]}
                        alt={`Producto ${currentIndex + 1}`}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                        }}
                    />

                    {/* Flechas de navegación */}
                    {images.length > 1 && (
                        <>
                            <IconButton
                                onClick={handlePrev}
                                sx={{
                                    position: 'absolute',
                                    left: 16,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,1)',
                                    }
                                }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>

                            <IconButton
                                onClick={handleNext}
                                sx={{
                                    position: 'absolute',
                                    right: 16,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,1)',
                                    }
                                }}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        </>
                    )}

                    {/* Botón de zoom */}
                    <IconButton
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,1)',
                            }
                        }}
                    >
                        <ZoomInIcon />
                    </IconButton>
                </Paper>

                {/* Miniaturas (solo si hay más de 1 imagen) */}
                {images.length > 1 && (
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        mt: 2,
                        overflowX: 'auto',
                        paddingBottom: 1
                    }}>
                        {images.map((img, index) => (
                            <Box
                                key={index}
                                component="img"
                                src={img}
                                alt={`Miniatura ${index + 1}`}
                                onClick={() => setCurrentIndex(index)}
                                sx={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    border: currentIndex === index ? '2px solid' : '1px solid',
                                    borderColor: currentIndex === index ? theme.palette.primary.main : theme.palette.divider,
                                    transition: 'border-color 0.2s ease',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main
                                    }
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ProductGallery;