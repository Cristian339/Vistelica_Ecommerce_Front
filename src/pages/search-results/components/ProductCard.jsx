'use client';
import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    Card, CardActionArea, CardMedia, CardContent,
    Typography, Box, Chip, Skeleton
} from '@mui/material';
import { TagIcon } from 'lucide-react';
import Link from 'next/link';

const ProductCard = memo(({ product }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hovered, setHovered] = useState(false);

    // Optimización con useCallback
    const handleMouseEnter = useCallback(() => setHovered(true), []);
    const handleMouseLeave = useCallback(() => setHovered(false), []);
    const handleImageLoad = useCallback(() => setImageLoaded(true), []);

    // Cálculo de descuento
    const hasDiscount = product.original_price && product.original_price > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : null;

    // URL segura para el enlace
    const productUrl = `/product-detail/page?id=${encodeURIComponent(product.product_id)}`;

    return (
        <Card
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                // Responsive con breakpoints
                minHeight: { xs: '400px', sm: '450px' },
                maxHeight: { xs: 'auto', sm: '450px' },
                minWidth: { xs: '280px', sm: '320px' },
                maxWidth: { xs: '100%', sm: '320px' },
                borderRadius: { xs: '8px', sm: '12px' },
                boxShadow: hovered
                    ? '0 10px 25px rgba(0,0,0,0.15), 0 0 10px rgba(228, 176, 2, 0.2)'
                    : '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
                overflow: 'hidden',
                position: 'relative',
                bgcolor: '#fff',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '5px',
                    background: 'linear-gradient(90deg, #E4B002, #FFD854)',
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    zIndex: 1
                }
            }}
            role="article"
            aria-labelledby={`product-title-${product.product_id}`}
        >
            {/* Etiqueta de descuento */}
            {hasDiscount && (
                <Chip
                    icon={<TagIcon size={14} aria-hidden="true" />}
                    label={`-${discountPercentage}%`}
                    size="small"
                    role="status"
                    aria-label={`Descuento del ${discountPercentage}%`}
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: '#E53935',
                        color: 'white',
                        fontWeight: 'bold',
                        zIndex: 2,
                        boxShadow: '0 2px 8px rgba(229, 57, 53, 0.3)',
                    }}
                />
            )}

            <Link
                href={productUrl}
                passHref
                style={{ textDecoration: 'none', color: 'inherit', height: '100%' }}
                aria-label={`Ver detalles de ${product.name}`}
            >
                <CardActionArea
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        bgcolor: 'white',
                        '&:focus-visible': {
                            outline: '2px solid #E4B002',
                            outlineOffset: '-2px'
                        }
                    }}
                >
                    {/* Contenedor de la imagen */}
                    <Box sx={{
                        width: '100%',
                        height: '70%',
                        minHeight: '70%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 0,
                        background: '#f8f8f8',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        {!imageLoaded && (
                            <Skeleton
                                variant="rectangular"
                                width="100%"
                                height="100%"
                                animation="wave"
                                sx={{ position: 'absolute' }}
                            />
                        )}
                        <CardMedia
                            component="img"
                            image={product.main_image}
                            alt={`Imagen del producto: ${product.name}`}
                            loading="lazy"
                            onLoad={handleImageLoad}
                            sx={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                                transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                                opacity: imageLoaded ? 1 : 0,
                                filter: hovered ? 'brightness(1.05)' : 'brightness(1)',
                            }}
                        />
                    </Box>

                    {/* Contenedor del texto mejorado */}
                    <CardContent sx={{
                        width: '100%',
                        height: '30%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        px: { xs: 2, sm: 3 },
                        pt: 2.5,
                        pb: 3,
                        borderTop: '1px solid #f0f0f0',
                        background: hovered ?
                            'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(250,250,250,1) 100%)' :
                            'white',
                        transition: 'background 0.3s ease'
                    }}>
                        <Typography
                            variant="subtitle1"
                            component="h3"
                            id={`product-title-${product.product_id}`}
                            sx={{
                                fontWeight: 400,
                                mb: 1.5,
                                minHeight: { xs: '2.4em', sm: '2.8em' },
                                maxHeight: '3em',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: '1.4em',
                                px: 0.5,
                                color: hovered ? '#222' : '#333',
                            }}
                        >
                            {product.name}
                        </Typography>

                        {/* Contenedor de precio con mejor espaciado */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-start',
                            mt: 'auto',
                            pl: 0.5,
                            pt: 0.5
                        }}
                             aria-label={hasDiscount ?
                                 `Precio: ${product.price} euros, antes ${product.original_price} euros` :
                                 `Precio: ${product.price} euros`}
                        >
                            {hasDiscount && (
                                <Typography
                                    component="span"
                                    aria-hidden="true"
                                    sx={{
                                        fontSize: '0.85rem',
                                        color: '#888',
                                        textDecoration: 'line-through',
                                        mb: 0.3,
                                        display: 'block'
                                    }}
                                >
                                    {product.original_price}€
                                </Typography>
                            )}
                            <Typography
                                variant="h5"
                                component="div"
                                sx={{
                                    color: hasDiscount ? '#E53935' : '#E4B002',
                                    fontSize: { xs: '1.3rem', sm: '1.5rem' },
                                    fontWeight: 400,
                                    lineHeight: 1.2,
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                {product.price}€
                            </Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    );
});

// Nombre para DevTools
ProductCard.displayName = 'ProductCard';

// Validación de props
ProductCard.propTypes = {
    product: PropTypes.shape({
        product_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        original_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        main_image: PropTypes.string.isRequired
    }).isRequired
};

export default ProductCard;