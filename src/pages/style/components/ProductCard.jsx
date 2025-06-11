import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    IconButton,
    CircularProgress,
    Typography,
    Box,
    Chip
} from '@mui/material';
import { Favorite, FavoriteBorder, Star } from '@mui/icons-material';
import Link from 'next/link';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const ProductCard = ({
    product,
    isFavorite,
    isLoadingWishlist,
    onToggleFavorite,
    isMobile,
    isTablet
}) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const formattedPrice = `${product.price} €`;
    const hasDiscount = product.discount_percentage && parseFloat(product.discount_percentage) > 0;
    const mainImage = product.main_image ||
        (product.images?.find(img => img.is_main)?.image_url) ||
        "/api/placeholder/400";
    
    // Calcular precio con descuento
    const discountedPrice = hasDiscount 
        ? `${(product.price * (1 - parseFloat(product.discount_percentage) / 100)).toFixed(2)} €`
        : null;

    return (
        <Link
            href={`/product-detail/page?id=${product.product_id}`}
            passHref
            style={{ textDecoration: 'none' }}
        >
            <Card
                sx={{
                    position: 'relative',
                    width: { xs: '180px', sm: '220px', md: '250px' },
                    height: '100%',
                    bgcolor: 'transparent',
                    borderRadius: '16px',
                    overflow: 'visible',
                    boxShadow: 'none',
                    transition: 'transform 0.4s ease',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                    }
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Contenedor de imagen con efectos */}
                <Box sx={{ 
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: isFavorite 
                        ? `0 10px 25px ${vistelicaColors.accent}30` 
                        : `0 10px 25px ${vistelicaColors.shadow}20`,
                    aspectRatio: '3/4',
                    transition: 'all 0.4s ease',
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                    border: isFavorite 
                        ? `2px solid ${vistelicaColors.accent}60` 
                        : `1px solid ${vistelicaColors.divider}`,
                }}>
                    <CardMedia
                        component="img"
                        image={mainImage}
                        alt={product.name}
                        sx={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.6s ease',
                            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                        }}
                    />
                    
                    {/* Capa de gradiente */}
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: isHovered 
                            ? 'linear-gradient(to top, rgba(0,0,0,0.15), rgba(0,0,0,0) 50%)' 
                            : 'linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0) 70%)',
                        transition: 'opacity 0.3s ease',
                    }} />

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
                            top: 10,
                            right: 10,
                            bgcolor: isFavorite 
                                ? vistelicaColors.accent 
                                : `${vistelicaColors.white}DD`,
                            width: { xs: 32, sm: 38 },
                            height: { xs: 32, sm: 38 },
                            '&:hover': {
                                bgcolor: isFavorite 
                                    ? vistelicaColors.accent 
                                    : vistelicaColors.white,
                                transform: 'scale(1.15)',
                            },
                            zIndex: 2,
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            boxShadow: `0 3px 10px ${vistelicaColors.shadow}40`,
                        }}
                        aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                    >
                        {isLoadingWishlist ? (
                            <CircularProgress
                                size={isMobile ? 16 : 18}
                                sx={{ color: isFavorite ? vistelicaColors.white : vistelicaColors.primary }}
                            />
                        ) : isFavorite ? (
                            <Favorite
                                sx={{
                                    color: vistelicaColors.white,
                                    fontSize: { xs: '1rem', sm: '1.2rem' },
                                }}
                            />
                        ) : (
                            <FavoriteBorder
                                sx={{
                                    color: vistelicaColors.primary,
                                    fontSize: { xs: '1rem', sm: '1.2rem' }
                                }}
                            />
                        )}
                    </IconButton>

                    {/* Botón de compra rápida (aparece al hacer hover) */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            opacity: isHovered ? 1 : 0,
                            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                            transition: 'all 0.3s ease',
                        }}
                    >
                    </Box>

                    {/* Badge de descuento */}
                    {hasDiscount && (
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 10,
                                left: 10,
                                bgcolor: `${vistelicaColors.secondary}E0`,
                                color: vistelicaColors.white,
                                px: 1.2,
                                py: 0.4,
                                borderRadius: '20px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                fontFamily: typography.fontFamily,
                                zIndex: 2,
                                boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
                            }}
                        >
                            -{product.discount_percentage}%
                        </Box>
                    )}
                </Box>

                {/* Contenido de la tarjeta */}
                <CardContent 
                    sx={{
                        p: 0,
                        pt: 1.5,
                        '&:last-child': { pb: 0 },
                    }}
                >
                    {/* Tamaños del producto */}
                    {product.sizes && (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 0.5,
                                flexWrap: 'wrap',
                                mb: 0.8,
                                mt: 0.2
                            }}
                        >
                            {product.sizes.slice(0, 3).map((size, idx) => (
                                <Chip
                                    key={idx}
                                    label={size}
                                    size="small"
                                    sx={{
                                        height: '18px',
                                        fontSize: '0.65rem',
                                        fontWeight: 500,
                                        backgroundColor: `${vistelicaColors.backgroundAccent}50`,
                                        color: vistelicaColors.textSecondary,
                                        '& .MuiChip-label': {
                                            px: 0.8
                                        },
                                        fontFamily: typography.fontFamily,
                                    }}
                                />
                            ))}
                            {product.sizes.length > 3 && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: vistelicaColors.textSecondary,
                                        fontWeight: 500,
                                        fontSize: '0.65rem',
                                    }}
                                >
                                    +{product.sizes.length - 3}
                                </Typography>
                            )}
                        </Box>
                    )}
                    
                    {/* Nombre del producto */}
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            mb: 0.8,
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            color: vistelicaColors.textPrimary,
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            fontFamily: typography.fontFamily,
                            minHeight: '2.6em'
                        }}
                    >
                        {product.name}
                    </Typography>

                    {/* Precios */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        mt: 0.8
                    }}>
                        <Box>
                            {hasDiscount && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: vistelicaColors.textSecondary,
                                        fontWeight: 400,
                                        fontSize: '0.75rem',
                                        textDecoration: 'line-through',
                                        display: 'block',
                                        fontFamily: typography.fontFamily,
                                        lineHeight: 1
                                    }}
                                >
                                    {formattedPrice}
                                </Typography>
                            )}
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    color: hasDiscount 
                                        ? vistelicaColors.secondary 
                                        : vistelicaColors.primary,
                                    fontFamily: typography.fontFamily,
                                }}
                            >
                                {hasDiscount ? discountedPrice : formattedPrice}
                            </Typography>
                        </Box>
                        
                        {/* Indicador de stock */}
                        <Box 
                            sx={{
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                color: vistelicaColors.success,
                                fontFamily: typography.fontFamily,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.3,
                                bgcolor: `${vistelicaColors.success}10`,
                                px: 0.7,
                                py: 0.3,
                                borderRadius: '4px',
                                border: `1px solid ${vistelicaColors.success}20`,
                            }}
                        >
                            <span style={{ 
                                width: 6, 
                                height: 6, 
                                borderRadius: '50%', 
                                backgroundColor: vistelicaColors.success,
                                display: 'inline-block'
                            }}></span>
                            Stock
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Link>
    );
};

export default ProductCard;
