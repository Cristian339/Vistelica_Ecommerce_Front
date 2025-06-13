import React, { useState, useEffect } from 'react';
import {
    CardMedia, CardContent, Typography, CardActions,
    Button, IconButton, Box, Tooltip, Zoom, useTheme, useMediaQuery, styled,
    CircularProgress
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/router';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import { isInLocalWishlist } from '../../../utils/localStorageHelpers';
import Link from 'next/link';
import cartService from '@/services/cartService';
import wishlistService from '@/services/wishlistService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCurrentUser } from '@/services/authService';

// Componente de tarjeta con tamaño uniforme
const ProductCardContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '690px',
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

const ProductCard = ({ product, onRemoveFromWishlist, showRemoveWishlist }) => {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isInFavorites, setIsInFavorites] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    // Early return si product no existe o es null/undefined
    if (!product) {
        return null;
    }

    // Definir valores por defecto para evitar errores
    const productData = {
        id: product.id || product.product_id || product._id || '',
        name: product.name || 'Producto sin nombre',
        description: product.description || 'No hay descripción disponible',
        price: product.price || 0,
        image_url: product.image_url || product.image || (product.images && product.images[0]) || '/images/placeholder-product.jpg',
        images: product.images || []
    };

    useEffect(() => {
        if (productData.id) {
            setIsInFavorites(isInLocalWishlist(productData.id));
        }
    }, [productData.id]);

    const handleViewDetail = (e) => {
        e.preventDefault();
        if (productData.id) {
            router.push(`/product-detail/page?id=${productData.id}`);
        }
    };

    const handleRemoveFromWishlist = async (e) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (!productData.id) return;

        try {
            // Eliminar de favoritos sin esperar respuesta del servidor
            try {
                await wishlistService.removeFromWishlist(productData.id);
            } catch (error) {
                console.log('El producto ya no estaba en la wishlist del servidor');
            }

            // Actualizar UI localmente
            setIsInFavorites(false);

            if (onRemoveFromWishlist) {
                onRemoveFromWishlist(productData.id);
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!productData.id) return;

        setAddingToCart(true);
        try {
            const user = await getCurrentUser();
            const sessionId = cartService.getSessionId();

            // Obtener o crear el carrito
            let cart = await cartService.getCart(user?.user_id, sessionId);
            if (!cart) {
                cart = await cartService.createCart(user?.user_id, sessionId);
            }

            console.log("Carrituuuuuu " + JSON.stringify(cart));

            // Añadir producto al carrito
            await cartService.addToCart(
                cart.cart_id,
                productData.id,
                1,
                parseFloat(productData.price),
                null, // Talla
                null  // Color
            );

            toast.success('✅ Producto añadido al carrito', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        } catch (error) {
            console.error('Error al añadir al carrito:', error);
            toast.error(`❌ ${error.message || 'Error al añadir al carrito'}`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setAddingToCart(false);
        }
    };

    const imageUrl = !imageError ? productData.image_url : "/images/placeholder-product.jpg";

    // Validar que tengamos al menos un ID válido antes de renderizar
    if (!productData.id) {
        return null;
    }

    return (
        <ProductCardContainer>
            <Link
                href={`/product-detail/page/${productData.id}`}
                as={`/product-detail/page?id=${productData.id}`}
                passHref
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <ImageContainer>
                    <ProductImage
                        component="img"
                        className="product-image"
                        image={imageUrl}
                        alt={productData.name}
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
            </Link>

            <CardContent sx={{
                p: { xs: 1, sm: 1.5, md: 2 },
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100px',
                overflow: 'hidden'
            }}>

                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        fontFamily: typography.fontFamily,
                        fontWeight: 500,
                        mb: 0.5,
                        fontSize: { xs: '1.1rem', md: '1.25rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: { xs: 1, md: 2 }, // 1 línea en móvil, 2 en desktop
                        WebkitBoxOrient: 'vertical',
                        minHeight: { xs: '1.5em', md: '3em' }, // Altura mínima para evitar saltos
                        lineHeight: '1.5em'
                    }}
                >
                    {productData.name}
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
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            lineHeight: '1.2em'
                        }}
                    >
                        {productData.description.substring(0, 80)}
                        {productData.description.length > 80 ? "..." : ""}
                    </Typography>
                </Box>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: vistelicaColors.primary,
                        fontFamily: typography.fontFamily,
                        fontSize: { xs: '1.3rem', md: '1.3rem' },
                        mt: 'auto'
                    }}
                >
                    {typeof productData.price === 'number' ?
                        productData.price.toFixed(2) :
                        (parseFloat(productData.price) || 0).toFixed(2)
                    }€
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
                        disabled={addingToCart}
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
                        {addingToCart ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <AddShoppingCartIcon fontSize="medium" sx={{ color: vistelicaColors.primary }} />
                        )}
                    </IconButton>
                </Tooltip>

                <Link
                    href={`/product-detail/page/${productData.id}`}
                    as={`/product-detail/page?id=${productData.id}`}
                    passHref
                    style={{ textDecoration: 'none' }}
                >
                    <Tooltip title="Ver detalle" TransitionComponent={Zoom} arrow>
                        <Button
                            variant="contained"
                            size={isMobile ? "medium" : "large"}
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
                                fontSize: { xs: '0.85rem', md: '0.9rem' }
                            }}
                        >
                            Ver detalle
                        </Button>
                    </Tooltip>
                </Link>
            </CardActions>
        </ProductCardContainer>
    );
};

export default ProductCard;