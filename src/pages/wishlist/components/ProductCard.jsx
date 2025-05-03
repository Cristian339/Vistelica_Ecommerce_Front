"use client";
import { Card, CardMedia, CardContent, Typography, Button, Box, IconButton, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState } from 'react';
import wishlistService from '@/services/wishlistService';
import cartService from '@/services/cartService';
import { getCurrentUser } from '@/services/authService';

const ProductCard = ({
                         product,
                         onCardClick,
                         showWishlistButton = true,
                         isInWishlist = false,
                         onWishlistChange,
                         showAddToCart = true
                     }) => {
    const router = useRouter();
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleWishlistAction = async (e) => {
        e.stopPropagation();
        try {
            setLoadingWishlist(true);
            const user = await getCurrentUser();

            if (!user) {
                router.push('/sign-in-side/Sign-in-side');
                return;
            }

            if (isInWishlist) {
                await wishlistService.removeFromWishlist(product.product_id);
                setSnackbar({
                    open: true,
                    message: 'Producto eliminado de tu lista de deseos',
                    severity: 'info'
                });
            } else {
                await wishlistService.addToWishlist(product.product_id);
                setSnackbar({
                    open: true,
                    message: 'Producto añadido a tu lista de deseos',
                    severity: 'success'
                });
            }

            if (onWishlistChange) {
                onWishlistChange(product.product_id, !isInWishlist);
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al actualizar la lista de deseos',
                severity: 'error'
            });
        } finally {
            setLoadingWishlist(false);
        }
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        try {
            setAddingToCart(true);
            const user = await getCurrentUser();

            // Obtener o crear el carrito
            let cart;
            if (user) {
                cart = await cartService.getCart(user.user_id);
                if (!cart) {
                    cart = await cartService.createCart(user.user_id);
                }
            } else {
                const sessionId = cartService.getSessionId();
                cart = await cartService.getCart(null, sessionId);
                if (!cart) {
                    cart = await cartService.createCart(null, sessionId);
                }
            }

            // Añadir producto al carrito
            await cartService.addToCart(
                cart.order_id,
                product.product_id,
                1,
                product.price
            );

            // Si está en wishlist, eliminarlo
            if (isInWishlist) {
                await wishlistService.removeFromWishlist(product.product_id);
                if (onWishlistChange) {
                    onWishlistChange(product.product_id, false);
                }
            }

            setSnackbar({
                open: true,
                message: 'Producto añadido al carrito' + (isInWishlist ? ' y eliminado de tu lista de deseos' : ''),
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Error al añadir al carrito',
                severity: 'error'
            });
        } finally {
            setAddingToCart(false);
        }
    };

    const handleCardClick = () => {
        if (onCardClick) {
            onCardClick();
        } else {
            router.push(`/products/${product.product_id}`);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({...prev, open: false}));
    };

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    width: '280px',
                    minHeight: '400px',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                    }
                }}
                onClick={handleCardClick}
            >
                <Box position="relative" sx={{ height: '200px' }}>
                    <CardMedia
                        component="img"
                        image={product.image_url || '/placeholder-product.jpg'}
                        alt={product.name}
                        sx={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    {showWishlistButton && (
                        <IconButton
                            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                            onClick={handleWishlistAction}
                            disabled={loadingWishlist}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'background.paper',
                                '&:hover': {
                                    backgroundColor: 'action.hover'
                                }
                            }}
                        >
                            {loadingWishlist ? (
                                <CircularProgress size={24} />
                            ) : isInWishlist ? (
                                <FavoriteIcon color="error" />
                            ) : (
                                <FavoriteBorderIcon />
                            )}
                        </IconButton>
                    )}
                </Box>

                <CardContent sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <Box>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="h3"
                            sx={{
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
                            color="text.secondary"
                            sx={{
                                mb: 2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            {product.description}
                        </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" color='#E4B002'>
                            ${product.price}
                        </Typography>
                        {showAddToCart && (
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: '#E4B002',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#d4a000',
                                    },
                                    minWidth: '100px'
                                }}
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                            >
                                {addingToCart ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    'Añadir'
                                )}
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProductCard;