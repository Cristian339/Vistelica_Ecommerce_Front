import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    IconButton,
    CircularProgress,
    Typography,
    Box
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import Link from 'next/link';

const ProductCard = ({
                         product,
                         isFavorite,
                         isLoadingWishlist,
                         onToggleFavorite,
                         isMobile,
                         isTablet
                     }) => {
    const formattedPrice = `${product.price} €`;
    const hasDiscount = product.discount_percentage && parseFloat(product.discount_percentage) > 0;
    const mainImage = product.main_image ||
        (product.images?.find(img => img.is_main)?.image_url) ||
        "/api/placeholder/400";

    return (
        <Link
            href={`/product-detail/page?id=${product.product_id}`}
            passHref
            style={{ textDecoration: 'none' }}
        >
            <Card
                sx={{
                    bgcolor: isFavorite ? 'rgba(255, 193, 193, 0.1)' : 'grey.50',
                    borderRadius: 2,
                    boxShadow: isFavorite ? '0 2px 8px rgba(255, 107, 107, 0.2)' : 0,
                    border: isFavorite ? '2px solid rgba(255, 107, 107, 0.3)' : '1px solid transparent',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '100%',
                    transform: isMobile ? 'scale(1)' : 'scale(0.9)',
                    transformOrigin: 'center',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: isMobile ? 'scale(1.02)' : 'scale(0.92)',
                        boxShadow: isFavorite
                            ? '0 4px 12px rgba(255, 107, 107, 0.3)'
                            : '0 2px 8px rgba(0,0,0,0.1)'
                    },
                    '&:focus': {
                        textDecoration: 'none'
                    },
                    '&:visited': {
                        textDecoration: 'none'
                    },
                    '&:active': {
                        textDecoration: 'none'
                    }
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        image={mainImage}
                        alt={product.name}
                        sx={{
                            aspectRatio: '1/1',
                            bgcolor: 'white',
                            objectFit: 'contain',
                            height: {
                                xs: '150px',   // Móvil
                                sm: '200px',   // Tablet pequeño
                                md: '220px',   // Tablet
                                lg: '250px'    // Desktop
                            }
                        }}
                    />

                    {/* Indicador de producto en wishlist */}
                    {isFavorite && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: { xs: 4, sm: 8 },
                                left: { xs: 4, sm: 8 },
                                bgcolor: 'rgba(255, 107, 107, 0.9)',
                                color: 'white',
                                px: { xs: 0.5, sm: 1 },
                                py: { xs: 0.25, sm: 0.5 },
                                borderRadius: 1,
                                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                fontWeight: 'bold',
                                zIndex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}
                        >
                            ❤️ Favorito
                        </Box>
                    )}

                    {/* Botón de favorito */}
                    <IconButton
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleFavorite();
                        }}
                        disabled={isLoadingWishlist}
                        sx={{
                            position: 'absolute',
                            top: { xs: 4, sm: 8 },
                            right: { xs: 4, sm: 8 },
                            bgcolor: isFavorite ? 'rgba(255, 107, 107, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            opacity: 0.95,
                            width: { xs: 30, sm: 40 },
                            height: { xs: 30, sm: 40 },
                            '&:hover': {
                                bgcolor: isFavorite ? 'rgba(255, 107, 107, 1)' : 'rgba(255, 255, 255, 1)',
                                opacity: 1,
                                transform: 'scale(1.1)'
                            },
                            padding: { xs: '4px', sm: '8px' },
                            zIndex: 2,
                            transition: 'all 0.3s ease-in-out',
                            border: isFavorite ? '2px solid white' : '1px solid #ddd'
                        }}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        size="small"
                    >
                        {isLoadingWishlist ? (
                            <CircularProgress
                                size={isMobile ? 16 : 20}
                                sx={{ color: isFavorite ? 'white' : 'primary.main' }}
                            />
                        ) : isFavorite ? (
                            <Favorite
                                sx={{
                                    color: 'white',
                                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }}
                            />
                        ) : (
                            <FavoriteBorder
                                sx={{
                                    color: 'black',
                                    fontSize: { xs: '1.2rem', sm: '1.5rem' }
                                }}
                            />
                        )}
                    </IconButton>

                    {/* Badge de descuento */}
                    {hasDiscount && (
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: { xs: 4, sm: 8 },
                                left: { xs: 4, sm: 8 },
                                bgcolor: 'error.main',
                                color: 'white',
                                px: { xs: 0.5, sm: 0.75 },
                                py: { xs: 0.2, sm: 0.25 },
                                borderRadius: 1,
                                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                fontWeight: 'bold',
                                zIndex: 2
                            }}
                        >
                            -{product.discount_percentage}%
                        </Box>
                    )}
                </Box>

                {/* Contenido de la tarjeta */}
                <CardContent sx={{
                    py: { xs: 0.5, sm: 1 },
                    px: { xs: 1, sm: 1.5 },
                    flexGrow: 1
                }}>
                    {product.sizes && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'orange',
                                fontWeight: 600,
                                display: 'block',
                                mb: { xs: 0.1, sm: 0.25 },
                                fontSize: { xs: '0.6rem', sm: '0.65rem' }
                            }}
                        >
                            {product.sizes.join(" · ")}
                        </Typography>
                    )}

                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            mb: { xs: 0.1, sm: 0.25 },
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            color: isFavorite ? 'rgba(255, 107, 107, 0.8)' : 'text.primary',
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {product.name}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            color: isFavorite ? 'rgba(255, 107, 107, 1)' : 'text.primary'
                        }}
                    >
                        {formattedPrice}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
};

export default ProductCard;