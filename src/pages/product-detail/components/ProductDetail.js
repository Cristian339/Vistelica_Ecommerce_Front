"use client";
import React, {useState, useEffect} from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import {
    Grid,
    Typography,
    Divider,
    Button,
    Box,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import productService from '@/services/productService'
import ProductGallery from './ProductGallery';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShareIcon from '@mui/icons-material/Share';
import SizeSelector from './SizeSelector';
import ColorSelector from './ColorSelector';
import ProductInfo from './ProductInfo';
import ShippingInfo from './ShippingInfo';
import ProductReviews from './ProductReviews';
import wishlistService from '@/services/wishlistService';
import { getToken } from '@/services/authService';

const ProductDetailContainer = styled('div')(({ theme }) => ({
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(3),
    },
}));

const CompactDetailBox = styled(Box)(({ theme }) => ({
    fontFamily: "'Amethysta', serif",
    '& .MuiTypography-root': {
        fontFamily: "'Amethysta', serif !important",
    },
    '& .MuiButton-root': {
        fontFamily: "'Amethysta', serif !important",
    },
    '& .MuiChip-label': {
        fontFamily: "'Amethysta', serif !important",
    },
    '& .MuiTypography-h4': {
        fontSize: '1.3rem',
        fontWeight: 600,
        [theme.breakpoints.up('md')]: {
            fontSize: '1.4rem'
        }
    },
    '& .MuiTypography-h3': {
        fontSize: '1.5rem',
        [theme.breakpoints.up('md')]: {
            fontSize: '1.6rem'
        }
    },
}));

const ProductDetail = ({
                           product,
                           availableSizes,
                           availableColors,
                           selectedSize,
                           selectedColor,
                           onSizeChange,
                           onColorChange,
                           onAddToCart,
                           addingToCart
                       }) => {
    const theme = useTheme();
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [errorReviews, setErrorReviews] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Verificar si el producto está en la wishlist al cargar el componente
    useEffect(() => {
        let isMounted = true;

        const checkWishlistStatus = async () => {
            try {
                setLoadingWishlist(true);
                const inWishlist = await wishlistService.checkProductInWishlist(product.product_id);

                if (inWishlist === null || inWishlist === undefined) {
                    const wishlist = await wishlistService.getWishlist();
                    const found = wishlist.some(item => item.product_id === product.product_id);
                    if (isMounted) setIsFavorite(found);
                } else {
                    if (isMounted) setIsFavorite(inWishlist);
                }
            } catch (error) {
                console.error('Error verificando wishlist:', error);
            } finally {
                if (isMounted) {
                    setLoadingWishlist(false);
                    setInitialized(true);
                }
            }
        };

        checkWishlistStatus();

        return () => {
            isMounted = false;
        };
    }, [product.product_id]);

    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const reviewsData = await productService.getReviewsByProductId(product?.product_id);
            setReviews(reviewsData);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setErrorReviews(error.message || "Error al cargar las reseñas");
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleReviewAdded = () => {
        fetchReviews();
    };

    useEffect(() => {
        if (product?.product_id) {
            fetchReviews();
        }
    }, [product?.product_id]);

    const handleToggleFavorite = async () => {
        const token = getToken();
        if (!token) {
            // Redirigir a login o mostrar modal
            console.log('Usuario no autenticado');
            return;
        }

        try {
            setLoadingWishlist(true);
            if (isFavorite) {
                await wishlistService.removeFromWishlist(product.product_id);
            } else {
                await wishlistService.addToWishlist(product.product_id);
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error actualizando wishlist:', error);
        } finally {
            setLoadingWishlist(false);
        }
    };

    const handleAddToCart = async () => {
        // Validar que se haya seleccionado talla y color si están disponibles
        if ((availableSizes.length > 0 && !selectedSize) ||
            (availableColors.length > 0 && !selectedColor)) {
            setErrorMessage('Por favor selecciona talla y color antes de añadir al carrito');
            return;
        }

        setErrorMessage(null);
        try {
            await onAddToCart({
                productId: product.product_id,
                quantity: 1,
                price: parseFloat(product.price),
                size: selectedSize,
                color: selectedColor
            });
        } catch (error) {
            setErrorMessage('Error al añadir al carrito');
            console.error('Error adding to cart:', error);
        }
    };

    if (!initialized) {
        return <CircularProgress />;
    }

    return (
        <ProductDetailContainer>
            <Grid container alignItems="flex-start" color={vistelicaColors.background}>
                <Grid item xs={12} md={7} lg={8}>
                    <ProductGallery productId={product.product_id} />
                </Grid>

                <Grid item xs={12} md={5} lg={4}>
                    <CompactDetailBox sx={{
                        width: 800,
                        position: 'sticky',
                        top: theme.spacing(2),
                        paddingLeft: { md: 2 },
                        maxHeight: { md: '100vh' },
                        overflowY: 'auto'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {product.name}
                            </Typography>

                            <IconButton
                                aria-label={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
                                onClick={handleToggleFavorite}
                                disabled={loadingWishlist}
                                sx={{
                                    color: isFavorite ? 'red' : 'inherit',
                                    '&:hover': {
                                        color: isFavorite ? 'darkred' : 'primary.main'
                                    }
                                }}
                            >
                                {loadingWishlist ? (
                                    <CircularProgress size={24} />
                                ) : isFavorite ? (
                                    <FavoriteIcon fontSize="medium" />
                                ) : (
                                    <FavoriteBorderIcon fontSize="medium" />
                                )}
                            </IconButton>
                        </Box>

                        <Typography variant="h3" sx={{
                            color: vistelicaColors.primary,
                            my: 1
                        }}>
                            {product.price}€
                            {product.discount_percentage !== "0.00" && (
                                <span style={{
                                    fontSize: '0.8rem',
                                    color: 'gray',
                                    textDecoration: 'line-through',
                                    marginLeft: '8px'
                                }}>
                                    {(parseFloat(product.price) / (1 - parseFloat(product.discount_percentage) / 100).toFixed(2))}€
                                </span>
                            )}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {availableSizes.length > 0 && (
                            <SizeSelector
                                sizes={availableSizes}
                                selectedSize={selectedSize}
                                onSizeChange={onSizeChange}
                            />
                        )}

                        {availableColors.length > 0 && (
                            <ColorSelector
                                colors={availableColors}
                                selectedColor={selectedColor}
                                onColorChange={onColorChange}
                            />
                        )}

                        {errorMessage && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {errorMessage}
                            </Alert>
                        )}

                        <ProductInfo description={product.description} sx={{maxWidth: 90}}/>

                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            mt: 2,
                            flexWrap: 'wrap'
                        }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="medium"
                                sx={{
                                    flex: 1,
                                    maxWidth: 650,
                                    backgroundColor: vistelicaColors.primary,
                                    '&:hover': {
                                        backgroundColor: vistelicaColors.primaryDark
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#e0e0e0'
                                    }
                                }}
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                startIcon={addingToCart ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartIcon />}
                            >
                                {addingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
                            </Button>
                            <Button
                                variant="outlined"
                                size="medium"
                                sx={{
                                    flex: 1,
                                    maxWidth: 350,
                                    color: vistelicaColors.primaryDark,
                                    borderColor: vistelicaColors.primaryDark,
                                }}
                            >
                                Compartir <ShareIcon />
                            </Button>
                        </Box>

                        <ShippingInfo />
                    </CompactDetailBox>
                </Grid>

                <Grid item xs={12} sx={{ mt: { xs: 2, md: 0 } , width: '100%'}}>
                    {loadingReviews ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : errorReviews ? (
                        <Typography color="error" textAlign="center" py={2}>
                            {errorReviews}
                        </Typography>
                    ) : (
                        <ProductReviews
                            reviews={reviews}
                            productId={product.product_id}
                            onReviewAdded={handleReviewAdded}
                        />
                    )}
                </Grid>
            </Grid>
        </ProductDetailContainer>
    );
};

export default ProductDetail;