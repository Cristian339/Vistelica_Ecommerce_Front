'use client';
import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Badge, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const ProductImageComponent = React.memo(({
                                              mainImage,
                                              loadingImage,
                                              productName,
                                              hasDiscount,
                                              discountPercentage
                                          }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [imgError, setImgError] = useState(false);

    // Tamaños responsivos
    const imageWidth = isMobile ? 90 : 120;
    const imageHeight = isMobile ? 90 : 120;

    // Crear URL de placeholder en caso de error
    const placeholderUrl = `https://placehold.co/${imageWidth}x${imageHeight}/e9e9e9/959595?text=${encodeURIComponent(productName?.substring(0, 10) || "Producto")}`;

    // Restablecer el error si cambia la imagen
    useEffect(() => {
        setImgError(false);
    }, [mainImage]);

    // Manejar el error de carga de imagen
    const handleImageError = (e) => {
        e.target.onerror = null; // Prevenir bucles infinitos
        e.target.src = placeholderUrl;
        setImgError(true);
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <motion.div
                whileHover={{
                    scale: 1.05,
                    rotate: -1,
                    transition: { duration: 0.3 }
                }}
            >
                {loadingImage ? (
                    <Box
                        sx={{
                            width: imageWidth,
                            height: imageHeight,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            borderRadius: 2,
                            boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
                        }}
                    >
                        <CircularProgress size={30} thickness={5} sx={{ color: vistelicaColors.primary }} />
                    </Box>
                ) : imgError ? (
                    <Box
                        sx={{
                            width: imageWidth,
                            height: imageHeight,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f9f9f9',
                            borderRadius: 2,
                            boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                            border: '1px solid #e0e0e0',
                            p: 1
                        }}
                    >
                        <ImageNotSupportedIcon sx={{ color: '#aaa', fontSize: imageWidth * 0.4, mb: 1 }} />
                        <Box
                            component="span"
                            sx={{
                                fontSize: isMobile ? '0.6rem' : '0.7rem',
                                color: '#888',
                                textAlign: 'center',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {productName || "Producto"}
                        </Box>
                    </Box>
                ) : (
                    <Box
                        component="img"
                        src={mainImage}
                        alt={productName || "Producto"}
                        loading="lazy"
                        sx={{
                            width: imageWidth,
                            height: imageHeight,
                            borderRadius: 2,
                            objectFit: 'contain',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(0,0,0,0.06)',
                            backgroundColor: '#f9f9f9'
                        }}
                        onError={handleImageError}
                    />
                )}
            </motion.div>

            {/* Etiqueta de descuento flotante */}
            {hasDiscount && !loadingImage && (
                <Badge
                    badgeContent={
                        <Tooltip title={`${discountPercentage}% de descuento`} arrow placement="top">
                            <Box sx={{
                                background: `linear-gradient(135deg, ${vistelicaColors.error}, #ff6b6b)`,
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: isMobile ? '0.65rem' : '0.8rem',
                                p: isMobile ? '2px 6px' : '3px 10px',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                boxShadow: '0 3px 10px rgba(255,0,0,0.25)',
                                border: '1.5px solid rgba(255,255,255,0.4)',
                                transform: 'rotate(-5deg)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '50%',
                                    background: 'linear-gradient(rgba(255,255,255,0.3), transparent)',
                                    borderTopLeftRadius: '16px',
                                    borderTopRightRadius: '16px',
                                }
                            }}>
                                <LocalOfferIcon sx={{ fontSize: isMobile ? '0.8rem' : '1rem', transform: 'rotate(45deg)' }} />
                                {isMobile ? `${discountPercentage}%` : `${discountPercentage}% de Descuento`}
                            </Box>
                        </Tooltip>
                    }
                    sx={{
                        position: 'absolute',
                        top: isMobile ? -5 : -8,
                        right: isMobile ? -5 : -8,
                        zIndex: 2,
                        '& .MuiBadge-badge': {
                            backgroundColor: 'transparent',
                            padding: 0,
                        }
                    }}
                >
                    <motion.div
                        animate={{
                            rotate: [0, -5, 0, 5, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: 'loop',
                            repeatDelay: 6
                        }}
                        style={{ width: 10, height: 10 }}
                    />
                </Badge>
            )}
        </Box>
    );
});

ProductImageComponent.displayName = 'ProductImageComponent';

export default ProductImageComponent;