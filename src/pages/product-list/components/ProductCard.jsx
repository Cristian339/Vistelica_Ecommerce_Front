import React, { useState, useEffect } from 'react';
import { Box, Typography, Rating, styled, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { isInLocalWishlist } from '@/utils/localStorageHelpers';

// Corrección de estilos para eliminar la advertencia de largeView
const ProductCardContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'largeView'
})(({ theme, largeView }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: largeView ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
    '&:hover': {
        '& .heart-icon': {
            opacity: 1
        },
        '& .product-image': {
            transform: 'scale(1.05)'
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
    borderRadius: '8px 8px 0 0',
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
    transition: 'transform 0.5s ease',
    backgroundColor: largeView ? 'transparent' : '#f9f9f9', // Fondo solo para contain
}));

const FavoriteButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
    transition: 'all 0.2s ease',
    opacity: 0,
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        transform: 'scale(1.1)'
    },
    '&.active': {
        opacity: 1,
    }
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'scale(1.1)'
    },
}));

const ProductCard = ({ product, largeView = false, onAddToWishlist, onRemove, onAddToCart, isWishlistPage = false }) => {
    const theme = useTheme();
    const [imageError, setImageError] = useState(false);
    const [isInFavorites, setIsInFavorites] = useState(false);

    // Verificar si el producto está en favoritos al cargar el componente
    useEffect(() => {
        if (product && product.id) {
            setIsInFavorites(isInLocalWishlist(product.id));
        }
    }, [product]);

    // Si el producto no existe, no renderizar nada
    if (!product) return null;

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

    // Usar imageUrl como fuente principal de imagen
    const imageUrl = !imageError ?
        (product.imageUrl || product.image || product.images?.[0] || '/images/placeholder-product.jpg') :
        '/images/placeholder-product.jpg';

    // ID del producto para el enlace - usar cualquier formato disponible
    const productId = product.product_id || product.id || product._id || '';

    return (
        <ProductCardContainer largeView={largeView}>
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

            <Link href={`/product/${productId}`} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <ImageContainer largeView={largeView}>
                        <ProductImage
                            src={imageUrl}
                            alt={product.name || 'Producto'}
                            className="product-image"
                            onError={() => setImageError(true)}
                            largeView={largeView}
                        />
                    </ImageContainer>

                    <Box sx={{ p: largeView ? 2.5 : 1.5, flexGrow: 1 }}>
                        <Typography
                            variant={largeView ? "subtitle1" : "subtitle2"}
                            color="text.secondary"
                        >
                            {product.brand || ''}
                        </Typography>
                        <Typography
                            variant={largeView ? "h5" : "h6"}
                            component="h3"
                            sx={{
                                fontWeight: 500,
                                mb: 1,
                                fontSize: largeView ? '1.25rem' : '1rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            {product.name || 'Producto sin nombre'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating
                                value={product.rating || 0}
                                precision={0.5}
                                size={largeView ? "medium" : "small"}
                                readOnly
                            />
                            <Typography variant={largeView ? "body1" : "body2"} sx={{ ml: 1 }}>
                                ({product.numReviews || 0})
                            </Typography>
                        </Box>
                        <Typography
                            variant={largeView ? "h5" : "h6"}
                            fontWeight="bold"
                            color="primary"
                            sx={{ fontSize: largeView ? '1.5rem' : '1.1rem' }}
                        >
                            {(parseFloat(product.price) || 0).toFixed(2)}€
                        </Typography>

                        {largeView && product.description && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 2,
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
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
                    borderTop: `1px solid ${theme.palette.divider}`
                }}>
                    <ActionButton
                        onClick={() => onRemove?.(product.id || product.product_id)}
                        color="error"
                        size="medium"
                        sx={{ mr: 1 }}
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
        </ProductCardContainer>
    );
};

export default ProductCard;