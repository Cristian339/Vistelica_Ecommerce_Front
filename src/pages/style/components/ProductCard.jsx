'use client';
import React, { useState, useMemo, memo } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    IconButton,
    CircularProgress,
    Typography,
    Box,
    Chip,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { Favorite, FavoriteBorder, StarOutline } from '@mui/icons-material';
import Link from 'next/link';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const ProductCard = memo(({
                              product,
                              isFavorite,
                              isLoadingWishlist,
                              onToggleFavorite,
                              isMobile,
                              isTablet
                          }) => {
    // Hooks siempre en la misma posición y orden (regla importante de React)
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const theme = useTheme();

    // Hook que se ejecutará siempre, independientemente de props externas
    const isTouch = useMediaQuery('(hover: none)');

    // Valores precalculados - optimización de rendimiento
    const {
        formattedPrice,
        hasDiscount,
        discountedPrice,
        mainImage,
        productId,
        productName,
        sizes
    } = useMemo(() => {
        const formatted = `${product?.price || 0} €`;
        const discount = product?.discount_percentage && parseFloat(product?.discount_percentage) > 0;
        const discounted = discount
            ? `${(product?.price * (1 - parseFloat(product?.discount_percentage) / 100)).toFixed(2)} €`
            : null;
        const image = product?.main_image ||
            (product?.images?.find(img => img.is_main)?.image_url) ||
            "/api/placeholder/400";

        return {
            formattedPrice: formatted,
            hasDiscount: discount,
            discountedPrice: discounted,
            mainImage: image,
            productId: product?.product_id || '',
            productName: product?.name || 'Producto',
            sizes: product?.sizes || []
        };
    }, [product]);

    // Manejadores de eventos
    const handleTouchStart = () => {
        if (isTouch) setIsHovered(true);
    };

    const handleTouchEnd = () => {
        if (isTouch) setTimeout(() => setIsHovered(false), 1000);
    };

    const handleFocus = () => setIsHovered(true);
    const handleBlur = () => setIsHovered(false);

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true);
    };

    return (
        <Link
            href={`/product-detail/page?id=${productId}`}
            passHref
            style={{ textDecoration: 'none', width: '100%' }}
            aria-label={`Ver detalles de ${productName}${hasDiscount ? ' con descuento' : ''}`}
        >
            <Card
                sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '100%',
                    height: '100%',
                    bgcolor: 'transparent',
                    borderRadius: '16px',
                    overflow: 'visible',
                    boxShadow: 'none',
                    transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                    },
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { sm: 3 },
                }}
                onMouseEnter={() => !isTouch && setIsHovered(true)}
                onMouseLeave={() => !isTouch && setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onFocus={handleFocus}
                onBlur={handleBlur}
                tabIndex="0"
                role="article"
                aria-label={productName}
            >
                {/* Contenedor de imagen con efectos */}
                <Box sx={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: isFavorite
                        ? `0 12px 24px ${vistelicaColors.primary}40`
                        : isHovered
                            ? `0 16px 32px ${vistelicaColors.secondary}25`
                            : `0 8px 20px ${vistelicaColors.secondary}15`,
                    aspectRatio: '1/1',
                    width: { xs: '100%', sm: '45%', md: '40%' },
                    minWidth: { sm: '120px' },
                    height: { xs: 'auto', sm: 'auto' },
                    transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                    border: isFavorite
                        ? `3px solid ${vistelicaColors.primary}70`
                        : isHovered
                            ? `2px solid ${vistelicaColors.primary}30`
                            : `1px solid ${vistelicaColors.primaryDark}`,
                    backgroundColor: vistelicaColors.white,
                }}>
                    {/* Indicador de carga */}
                    {!imageLoaded && (
                        <Box sx={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: vistelicaColors.backgroundLight,
                            zIndex: 1
                        }}
                             aria-hidden="true"
                        >
                            <CircularProgress size={36} sx={{ color: vistelicaColors.primary }} />
                        </Box>
                    )}

                    <CardMedia
                        component="img"
                        image={imageError ? "/api/placeholder/400" : mainImage}
                        alt={productName}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={handleImageError}
                        sx={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)',
                            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                            filter: isHovered ? 'brightness(1.05)' : 'brightness(1)',
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
                            ? 'linear-gradient(to top, rgba(0,0,0,0.15), rgba(0,0,0,0) 60%)'
                            : 'linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0) 70%)',
                        transition: 'all 0.4s ease',
                        opacity: isHovered ? 0.9 : 0.7,
                    }}
                         aria-hidden="true"
                    />

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
                            top: 8,
                            right: 8,
                            bgcolor: isFavorite
                                ? vistelicaColors.primary
                                : `${vistelicaColors.white}DD`,
                            width: { xs: 40, sm: 44 },
                            height: { xs: 40, sm: 44 },
                            '&:hover': {
                                bgcolor: isFavorite
                                    ? vistelicaColors.primary
                                    : vistelicaColors.white,
                                transform: 'scale(1.15)',
                            },
                            zIndex: 2,
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            boxShadow: `0 4px 12px ${isFavorite ? vistelicaColors.primary + "50" : vistelicaColors.secondary + "40"}`,
                            border: isFavorite
                                ? `2px solid ${vistelicaColors.white}`
                                : `1px solid ${vistelicaColors.primaryDark}`,
                        }}
                        aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                        role="switch"
                        aria-checked={isFavorite}
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
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                }}
                            />
                        ) : (
                            <FavoriteBorder
                                sx={{
                                    color: vistelicaColors.primary,
                                    fontSize: { xs: '1rem', sm: '1.1rem' }
                                }}
                            />
                        )}
                    </IconButton>

                    {/* Badge de descuento */}
                    {hasDiscount && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                bgcolor: `${vistelicaColors.secondary}E5`,
                                color: vistelicaColors.white,
                                px: 1.2,
                                py: 0.4,
                                borderRadius: '20px',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                fontWeight: '700',
                                fontFamily: typography.fontFamily,
                                zIndex: 2,
                                boxShadow: `0 3px 8px ${vistelicaColors.secondary}50`,
                                border: `1px solid ${vistelicaColors.white}40`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.3,
                            }}
                            aria-label={`${product.discount_percentage}% de descuento`}
                        >
                            <StarOutline sx={{ fontSize: '0.8rem' }} aria-hidden="true" />
                            {product.discount_percentage}% OFF
                        </Box>
                    )}

                </Box>

                {/* Contenido de la tarjeta */}
                <CardContent
                    sx={{
                        p: 0,
                        pt: { xs: 1.8, sm: 0 },
                        px: { xs: 1.5, sm: 0 },
                        flex: { sm: 1 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        '&:last-child': { pb: 0 },
                    }}
                >
                    {/* Tamaños del producto */}
                    {sizes && sizes.length > 0 && (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 0.6,
                                flexWrap: 'wrap',
                                mb: 1.2,
                                mt: { xs: 0.5, sm: 0 }
                            }}
                            aria-label="Tallas disponibles"
                        >
                            {sizes.slice(0, 4).map((size, idx) => (
                                <Chip
                                    key={idx}
                                    label={size}
                                    size="small"
                                    sx={{
                                        height: '20px',
                                        fontSize: '0.7rem',
                                        fontWeight: 500,
                                        backgroundColor: isFavorite
                                            ? `${vistelicaColors.primary}15`
                                            : `${vistelicaColors.backgroundAccent}50`,
                                        color: isFavorite
                                            ? vistelicaColors.primary
                                            : vistelicaColors.textSecondary,
                                        '& .MuiChip-label': {
                                            px: 0.9
                                        },
                                        fontFamily: typography.fontFamily,
                                        border: isFavorite
                                            ? `1px solid ${vistelicaColors.primary}30`
                                            : `1px solid ${vistelicaColors.primaryDark}`,
                                    }}
                                />
                            ))}
                            {sizes.length > 4 && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: vistelicaColors.textSecondary,
                                        fontWeight: 500,
                                        fontSize: '0.7rem',
                                    }}
                                >
                                    +{sizes.length - 4}
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* Nombre del producto */}
                    <Typography
                        variant="body1"
                        component="h3"
                        sx={{
                            fontWeight: 600,
                            mb: 1.2,
                            fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.1rem' },
                            color: isFavorite
                                ? vistelicaColors.primary
                                : vistelicaColors.secondary,
                            lineHeight: 1.35,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            fontFamily: typography.fontFamily,
                            minHeight: { xs: '2.7em', sm: 'auto' },
                            transition: 'color 0.3s ease',
                            letterSpacing: '0.01em',
                        }}
                    >
                        {productName}
                    </Typography>

                    {/* Precios */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 1.5
                    }}>
                        <Box aria-label={hasDiscount ? `Precio rebajado: ${discountedPrice}` : `Precio: ${formattedPrice}`}>
                            {hasDiscount && (
                                <Typography
                                    variant="caption"
                                    component="span"
                                    sx={{
                                        color: vistelicaColors.textSecondary,
                                        fontWeight: 400,
                                        fontSize: '0.85rem',
                                        textDecoration: 'line-through',
                                        display: 'block',
                                        fontFamily: typography.fontFamily,
                                        lineHeight: 1.2
                                    }}
                                    aria-label="Precio original"
                                >
                                    {formattedPrice}
                                </Typography>
                            )}
                            <Typography
                                variant="body1"
                                component="span"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.25rem' },
                                    color: hasDiscount
                                        ? vistelicaColors.secondary
                                        : isFavorite
                                            ? vistelicaColors.primary
                                            : vistelicaColors.primary,
                                    fontFamily: typography.fontFamily,
                                    letterSpacing: '0.02em',
                                    transition: 'color 0.3s ease',
                                }}
                            >
                                {hasDiscount ? discountedPrice : formattedPrice}
                            </Typography>
                        </Box>


                    </Box>
                </CardContent>
            </Card>
        </Link>
    );
});

// Nombre para React DevTools
ProductCard.displayName = 'ProductCard';

export default ProductCard;