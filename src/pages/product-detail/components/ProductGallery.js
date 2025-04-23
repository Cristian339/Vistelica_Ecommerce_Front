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
            maxWidth: isMobile ? '100%' : '500px', // Reducido de 600px a 500px para mejor proporción
            margin: '0 auto',
            minHeight: '500px', // Altura mínima para evitar saltos de layout
            minWidth: '550px',
            [theme.breakpoints.down('sm')]: {
                minHeight: '400px' // Altura menor en móviles
            }
        }}>
            {/* Contenedor de la galería */}
            <Box sx={{
                position: 'relative',
                width: '100%',
                height: '100%'
            }}>
                {/* Imagen principal con flechas */}
                <Paper elevation={3} sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    aspectRatio: '3/4',
                    minHeight: '600px', // Altura mínima para la imagen principal
                    [theme.breakpoints.down('sm')]: {
                        minHeight: '350px'
                    }
                }}>
                    <Box
                        component="img"
                        src={images[currentIndex]?.image_url || '/default-product-image.jpg'} // Imagen por defecto
                        alt={`Producto ${currentIndex + 1}`}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            backgroundColor: '#f5f5f5' // Fondo gris claro si no hay imagen
                        }}
                    />

                    {/* Flechas de navegación */}
                    {images.length > 1 && (
                        <>
                            <IconButton
                                onClick={handlePrev}
                                sx={{
                                    position: 'absolute',
                                    left: 8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,1)',
                                    },
                                    [theme.breakpoints.down('sm')]: {
                                        left: 4,
                                        padding: '6px'
                                    }
                                }}
                            >
                                <ChevronLeftIcon fontSize={isMobile ? "small" : "medium"} />
                            </IconButton>

                            <IconButton
                                onClick={handleNext}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,1)',
                                    },
                                    [theme.breakpoints.down('sm')]: {
                                        right: 4,
                                        padding: '6px'
                                    }
                                }}
                            >
                                <ChevronRightIcon fontSize={isMobile ? "small" : "medium"} />
                            </IconButton>
                        </>
                    )}

                    {/* Botón de zoom */}
                    <IconButton
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,1)',
                            },
                            [theme.breakpoints.down('sm')]: {
                                bottom: 4,
                                right: 4,
                                padding: '6px'
                            }
                        }}
                    >
                        <ZoomInIcon fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                </Paper>

                {/* Miniaturas (solo si hay más de 1 imagen) */}
                {images.length > 1 && (
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        mt: 2,
                        overflowX: 'auto',
                        paddingBottom: 1,
                        minHeight: '90px' // Altura fija para el contenedor de miniaturas
                    }}>
                        {images.map((img, index) => (
                            <Box
                                key={index}
                                component="img"
                                src={img.image_url}
                                alt={`Miniatura ${index + 1}`}
                                onClick={() => setCurrentIndex(index)}
                                sx={{
                                    width: '80px',
                                    height: '80px',
                                    minWidth: '80px', // Evita que se reduzcan
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    border: currentIndex === index ? '2px solid' : '1px solid',
                                    borderColor: currentIndex === index ? theme.palette.primary.main : theme.palette.divider,
                                    transition: 'border-color 0.2s ease',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main
                                    },
                                    [theme.breakpoints.down('sm')]: {
                                        width: '70px',
                                        height: '70px',
                                        minWidth: '70px'
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