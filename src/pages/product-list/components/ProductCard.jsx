import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Rating, styled, IconButton, Chip, Skeleton } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import Link from 'next/link';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { motion } from 'framer-motion';
import { isInLocalWishlist } from '@/utils/localStorageHelpers';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from "@/pages/shared-theme/themePrimitives";

// Corrección de estilos para eliminar la advertencia de largeView
const ProductCardContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'largeView'
})(({ theme, largeView }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: largeView ? '0 6px 16px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.08)',
    backgroundColor: '#fff',
    '&:hover': {
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        transform: 'translateY(-4px)',
        '& .heart-icon': {
            opacity: 1
        },
        '& .product-image': {
            transform: 'scale(1.05)'
        },
        '& .quick-actions': {
            opacity: 1,
            transform: 'translateY(0)'
        }
    }
}));

const ImageContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'largeView'
})(({ largeView }) => ({
    position: 'relative',
    width: '100%',
    paddingTop: largeView ? '100%' : '133%', // Más cuadrado en vista grande
    overflow: 'hidden',
    borderRadius: '12px 12px 0 0',
    backgroundColor: '#f9f9f9',
}));

const ProductImage = styled('img', {
    shouldForwardProp: (prop) => prop !== 'largeView'
})(({ largeView }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: largeView ? 'cover' : 'contain',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: largeView ? 'transparent' : '#f9f9f9', // Fondo solo para contain
}));

const FavoriteButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 10,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 0,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '&:hover': {
        backgroundColor: '#ffffff',
        transform: 'scale(1.1)'
    },
    '&.active': {
        opacity: 1,
    }
}));

const DiscountBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: vistelicaColors?.primary || theme.palette.error.main,
    color: 'white',
    padding: '6px 10px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    zIndex: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: typography?.fontFamily,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: alpha((vistelicaColors?.primary || theme.palette.primary.main), 0.1),
    color: vistelicaColors?.primary || theme.palette.primary.main,
    '&:hover': {
        backgroundColor: alpha((vistelicaColors?.primary || theme.palette.primary.main), 0.2),
        transform: 'scale(1.1)'
    },
}));

const SizesContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '10px',
    marginBottom: '10px',
}));

const SizeChip = styled(Chip)(({ theme }) => ({
    fontSize: '0.7rem',
    height: '22px',
    borderColor: alpha((vistelicaColors?.secondary || theme.palette.text.secondary), 0.3),
    '& .MuiChip-label': {
        padding: '0 8px',
        fontFamily: typography?.fontFamily,
    }
}));

// Componente para indicador de stock
const StockIndicator = React.memo(({ stock }) => {
    if (stock === undefined) return null;

    const isLowStock = stock > 0 && stock <= 5;
    const isOutOfStock = stock === 0;

    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                zIndex: 5,
                display: 'flex',
                alignItems: 'center',
                bgcolor: isOutOfStock
                    ? 'rgba(0,0,0,0.7)'
                    : isLowStock
                        ? 'rgba(255,152,0,0.9)'
                        : 'rgba(76,175,80,0.9)',
                color: '#fff',
                py: 0.5,
                px: 1.5,
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 400,
                fontFamily: typography?.fontFamily,
            }}
        >
            <LocalShippingOutlinedIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
            {isOutOfStock
                ? 'Agotado'
                : isLowStock
                    ? `¡Solo ${stock}!`
                    : 'En stock'}
        </Box>
    );
});

StockIndicator.displayName = 'StockIndicator';

const ProductCard = React.memo(({
                                    product,
                                    largeView = false,
                                    onAddToWishlist,
                                    onRemove,
                                    onAddToCart,
                                    isWishlistPage = false
                                }) => {
    const theme = useTheme();
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isInFavorites, setIsInFavorites] = useState(false);

    // Verificar si el producto está en favoritos al cargar el componente
    useEffect(() => {
        if (product && product.id) {
            setIsInFavorites(isInLocalWishlist(product.id));
        }
    }, [product]);

    // Si el producto no existe, no renderizar nada
    if (!product) return null;

    // Datos derivados (memoizados para mejor rendimiento)
    const productData = useMemo(() => {
        // Imagen principal
        const imageUrl = !imageError ?
            (product.imageUrl || product.image || product.images?.[0] || '/images/placeholder-product.jpg') :
            '/images/placeholder-product.jpg';

        // ID del producto
        const productId = product.product_id || product.id || product._id || '';

        // Precios y descuentos
        const originalPrice = parseFloat(product.price) || 0;
        const discountPercentage = parseFloat(product.discount_percentage) || 0;
        const hasDiscount = discountPercentage > 0;
        const discountedPrice = hasDiscount
            ? originalPrice * (1 - discountPercentage / 100)
            : originalPrice;

        return {
            imageUrl,
            productId,
            originalPrice,
            discountPercentage,
            hasDiscount,
            discountedPrice
        };
    }, [product, imageError]);

    const toggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onAddToWishlist) {
            onAddToWishlist(product, isInFavorites);
        } else {
            // Actualizar solo el estado local si no hay función de manejo
            setIsInFavorites(!isInFavorites);
        }
    };

    return (
        <ProductCardContainer largeView={largeView}>
            {productData.hasDiscount && (
                <DiscountBadge>
                    -{productData.discountPercentage}%
                </DiscountBadge>
            )}

            {product.stock !== undefined && (
                <StockIndicator stock={product.stock} />
            )}

            {!isWishlistPage && (
                <FavoriteButton
                    className={`heart-icon ${isInFavorites ? 'active' : ''}`}
                    onClick={toggleFavorite}
                    size={largeView ? "medium" : "small"}
                    aria-label="añadir a favoritos"
                    color="error"
                    sx={{ opacity: isInFavorites ? 1 : undefined }}
                >
                    {isInFavorites ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </FavoriteButton>
            )}

            <Link
                href={`/product-detail/page/${productData.productId}`}
                as={`/product-detail/page?id=${productData.productId}`}
                passHref
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <ImageContainer largeView={largeView}>
                        {!imageLoaded && (
                            <Skeleton
                                variant="rectangular"
                                width="100%"
                                height="100%"
                                sx={{ position: 'absolute', top: 0, left: 0 }}
                            />
                        )}
                        <ProductImage
                            src={productData.imageUrl}
                            alt={product.name || 'Producto'}
                            className="product-image"
                            onError={() => setImageError(true)}
                            onLoad={() => setImageLoaded(true)}
                            largeView={largeView}
                        />
                    </ImageContainer>

                    <Box sx={{
                        p: largeView ? 2.5 : 1.8,
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Typography
                            variant={largeView ? "subtitle1" : "subtitle2"}
                            color="text.secondary"
                            fontFamily={typography?.fontFamily}
                            sx={{ opacity: 0.8 }}
                        >
                            {product.brand || ''}
                        </Typography>
                        <Typography
                            variant={largeView ? "h5" : "h6"}
                            component="h3"
                            sx={{
                                fontWeight: 400,
                                mb: 1,
                                fontSize: largeView ? '1.25rem' : '1rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                fontFamily: typography?.fontFamily,
                                color: vistelicaColors?.secondary || theme.palette.text.primary
                            }}
                        >
                            {product.name || 'Producto sin nombre'}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating
                                value={product.average_rating || 0}
                                precision={0.5}
                                size={largeView ? "medium" : "small"}
                                readOnly
                            />
                            <Typography variant={largeView ? "body1" : "body2"} sx={{ ml: 1 }}>
                                ({product.reviews_count || 0})
                            </Typography>
                        </Box>

                        {/* Precios con descuento */}
                        <Box sx={{ mb: 1 }}>
                            {productData.hasDiscount ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                        variant={largeView ? "h5" : "h6"}
                                        fontWeight="bold"
                                        sx={{
                                            fontSize: largeView ? '1.5rem' : '1.1rem',
                                            color: vistelicaColors?.primary || '#E4B002',
                                            fontFamily: typography?.fontFamily,
                                        }}
                                    >
                                        {productData.discountedPrice.toFixed(2)}€
                                    </Typography>
                                    <Typography
                                        variant={largeView ? "body1" : "body2"}
                                        color="text.secondary"
                                        sx={{
                                            textDecoration: 'line-through',
                                            fontSize: largeView ? '1rem' : '0.85rem',
                                            fontFamily: typography?.fontFamily,
                                        }}
                                    >
                                        {productData.originalPrice.toFixed(2)}€
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography
                                    variant={largeView ? "h5" : "h6"}
                                    fontWeight="bold"
                                    sx={{
                                        fontSize: largeView ? '1.5rem' : '1.1rem',
                                        color: vistelicaColors?.primary || '#E4B002',
                                        fontFamily: typography?.fontFamily,
                                    }}
                                >
                                    {productData.originalPrice.toFixed(2)}€
                                </Typography>
                            )}
                        </Box>

                        {/* Tallas disponibles */}
                        {product.sizes && product.sizes.length > 0 && (
                            <SizesContainer>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        mr: 1,
                                        alignSelf: 'center',
                                        fontFamily: typography?.fontFamily,
                                    }}
                                >
                                    Tallas:
                                </Typography>
                                {product.sizes.slice(0, largeView ? 6 : 4).map((size, index) => (
                                    <SizeChip
                                        key={index}
                                        label={size}
                                        size="small"
                                        variant="outlined"
                                    />
                                ))}
                                {product.sizes.length > (largeView ? 6 : 4) && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            alignSelf: 'center',
                                            fontFamily: typography?.fontFamily,
                                        }}
                                    >
                                        +{product.sizes.length - (largeView ? 6 : 4)} más
                                    </Typography>
                                )}
                            </SizesContainer>
                        )}

                        {largeView && product.description && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 2,
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    fontFamily: typography?.fontFamily,
                                }}
                            >
                                {product.description}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Link>

            {isWishlistPage && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    gap: 1,
                }}>
                    <ActionButton
                        onClick={() => onRemove?.(product.id || product.product_id)}
                        color="error"
                        size="medium"
                        aria-label="Eliminar de favoritos"
                    >
                        <DeleteIcon />
                    </ActionButton>

                    <ActionButton
                        onClick={() => onAddToCart?.(product)}
                        color="primary"
                        size="medium"
                        aria-label="Añadir al carrito"
                    >
                        <AddShoppingCartIcon />
                    </ActionButton>
                </Box>
            )}

            {/* Botón de acción rápida para añadir al carrito (cuando no es página de favoritos) */}
            {!isWishlistPage && onAddToCart && (
                <Box
                    className="quick-actions"
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 1.5,
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        justifyContent: 'center',
                        opacity: 0,
                        transform: 'translateY(100%)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    <ActionButton
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        color="primary"
                        size="medium"
                        aria-label="Añadir al carrito rápidamente"
                        fullWidth
                        sx={{ borderRadius: '8px', py: 0.5 }}
                    >
                        <AddShoppingCartIcon sx={{ mr: 1 }} />
                        <Typography fontFamily={typography?.fontFamily}>
                            Añadir al carrito
                        </Typography>
                    </ActionButton>
                </Box>
            )}
        </ProductCardContainer>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;