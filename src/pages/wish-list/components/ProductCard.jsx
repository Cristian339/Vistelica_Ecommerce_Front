import React, { useState, useEffect } from 'react';
import {
    CardMedia, CardContent, Typography, CardActions,
    Button, IconButton, Box, Tooltip, Zoom, useTheme, useMediaQuery, styled
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/router';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import { isInLocalWishlist } from '../../../utils/localStorageHelpers';

// Componente de tarjeta con tamaño uniforme (aumentado)
const ProductCardContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '690px', // Mantener altura
    width: '100%',
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: `1px solid ${vistelicaColors.border}`,
    backgroundColor: '#ffffff',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        '& .product-image': {
            transform: 'scale(1.05)'
        }
    }
}));

// Contenedor de imagen con proporción aumentada y padding lateral
const ImageContainer = styled(Box)(() => ({
    position: 'relative',
    width: '100%',
    height: '460px',
    overflow: 'hidden',
    borderRadius: '8px 8px 0 0',
    paddingLeft: '2.5%',
    paddingRight: '2.5%',
    boxSizing: 'border-box',
}));

const ProductImage = styled(CardMedia)(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
}));


const ProductCard = ({ product, onRemoveFromWishlist, showRemoveWishlist, onAddToCart }) => {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isInFavorites, setIsInFavorites] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (product && (product.id || product.product_id)) {
            const productId = product.id || product.product_id;
            setIsInFavorites(isInLocalWishlist(productId));
        }
    }, [product]);

    const handleViewDetail = () => {
        const productId = product.id || product.product_id || product._id;
        router.push(`/product/${productId}`);
    };

    const handleRemoveFromWishlist = () => {
        if (onRemoveFromWishlist) {
            onRemoveFromWishlist(product.id || product.product_id);
        }
    };

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(product);
        }
    };

    if (!product) return null;

    const imageUrl = !imageError ?
        (product.image_url || product.image || product.images?.[0] || "/images/placeholder-product.jpg") :
        "/images/placeholder-product.jpg";

    return (
        <ProductCardContainer>
            <ImageContainer>
                <ProductImage
                    component="img"
                    className="product-image"
                    image={imageUrl}
                    alt={product.name || 'Producto'}
                    onClick={handleViewDetail}
                    onError={() => setImageError(true)}
                />
                {showRemoveWishlist && (
                    <IconButton
                        onClick={handleRemoveFromWishlist}
                        color="error"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <FavoriteIcon fontSize="small" />
                    </IconButton>
                )}
            </ImageContainer>

            <CardContent sx={{
                p: { xs: 1, sm: 1.5, md: 2 },
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100px',
                overflow: 'hidden'
            }}>
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{
                        fontSize: { xs: '0.85rem', md: '0.95rem' }, // Aumentado
                        mb: 0.5
                    }}
                >
                    {product.brand || ''}
                </Typography>

                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        fontFamily: typography.fontFamily,
                        fontWeight: 500,
                        mb: 0.5,
                        fontSize: { xs: '1.1rem', md: '1.25rem' }, // Aumentado
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {product.name || 'Sin nombre'}
                </Typography>

                <Box sx={{ flexGrow: 0, mb: 0.5 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: vistelicaColors.secondary,
                            fontFamily: typography.fontFamily,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: { xs: '0.9rem', md: '1rem' }, // Aumentado
                            lineHeight: '1.2em'
                        }}
                    >
                        {product.description?.substring(0, 80) || "No hay descripción disponible"}
                        {product.description?.length > 80 ? "..." : ""}
                    </Typography>
                </Box>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: vistelicaColors.primary,
                        fontFamily: typography.fontFamily,
                        fontSize: { xs: '1.3rem', md: '1.3rem' }, // Aumentado
                        mt: 'auto'
                    }}
                >
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : (parseFloat(product.price) || 0).toFixed(2)}
                </Typography>
            </CardContent>

            <CardActions
                sx={{
                    justifyContent: 'space-between',
                    p: { xs: 1, sm: 1.5, md: 1.5 },
                    height: '70px',
                    borderTop: `1px solid ${vistelicaColors.divider}`
                }}
            >
                <Tooltip title="Añadir al carrito" TransitionComponent={Zoom} arrow>
                    <IconButton
                        color="primary"
                        onClick={handleAddToCart}
                        size="medium"
                        sx={{
                            backgroundColor: vistelicaColors.tertiary,
                            padding: { xs: '8px', md: '10px' },
                            borderRadius: '50%',
                            '&:hover': {
                                backgroundColor: vistelicaColors.quaternary,
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <AddShoppingCartIcon fontSize="medium" sx={{ color: vistelicaColors.primary }} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Ver detalle" TransitionComponent={Zoom} arrow>
                    <Button
                        variant="contained"
                        size={isMobile ? "medium" : "large"} // Aumentado
                        color="primary"
                        onClick={handleViewDetail}
                        startIcon={<VisibilityIcon />}
                        sx={{
                            borderRadius: 2,
                            px: { xs: 1.5, md: 2 },
                            py: { xs: 0.8, md: 1 },
                            backgroundColor: vistelicaColors.primary,
                            '&:hover': {
                                backgroundColor: vistelicaColors.primary,
                                opacity: 0.9
                            },
                            fontFamily: typography.fontFamily,
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                            fontSize: { xs: '0.85rem', md: '0.9rem' } // Aumentado
                        }}
                    >
                        Ver detalle
                    </Button>
                </Tooltip>
            </CardActions>
        </ProductCardContainer>
    );
};

export default ProductCard;