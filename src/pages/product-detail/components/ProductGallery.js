"use client";

import React, { useState, useEffect } from 'react';
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
import productService from '@/services/productService';
import CircularProgress from "@mui/joy/CircularProgress";

const ProductGallery = ({ productId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductImages = async () => {
            try {
                setLoading(true);
                const productImages = await productService.getAllImagesByProductId(productId);
                setImages(productImages);
            } catch (error) {
                console.error('Error al cargar imágenes del producto:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductImages();
    }, [productId]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    if (loading) {
        return (
            <Box sx={{
                width: '100%',
                maxWidth: isMobile ? '100%' : '500px',
                margin: '0 auto',
                minHeight: '500px',
                minWidth: '550px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '500px',
            margin: '0 auto',
            minHeight: '500px',
            minWidth: '550px',
            [theme.breakpoints.down('sm')]: {
                minHeight: '400px'
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
                    minHeight: '600px',
                    [theme.breakpoints.down('sm')]: {
                        minHeight: '350px'
                    }
                }}>
                    <Box
                        component="img"
                        src={images[currentIndex]?.image_url || '/default-product-image.jpg'}
                        alt={`Producto ${currentIndex + 1}`}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            backgroundColor: '#f5f5f5'
                        }}
                    />

                    {/* Flecha izquierda */}
                    {images.length > 1 && (
                        <IconButton
                            onClick={handlePrev}
                            sx={{
                                position: 'absolute',
                                left: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                }
                            }}
                        >
                            <ChevronLeftIcon fontSize="large" />
                        </IconButton>
                    )}

                    {/* Flecha derecha */}
                    {images.length > 1 && (
                        <IconButton
                            onClick={handleNext}
                            sx={{
                                position: 'absolute',
                                right: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                }
                            }}
                        >
                            <ChevronRightIcon fontSize="large" />
                        </IconButton>
                    )}
                </Paper>

                {/* Miniaturas (solo si hay más de 1 imagen) */}
                {images.length > 1 && (
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        mt: 2,
                        overflowX: 'auto',
                        paddingBottom: 1,
                        minHeight: '90px'
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
                                    minWidth: '80px',
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