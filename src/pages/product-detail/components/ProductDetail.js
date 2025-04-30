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
    Snackbar,
    Alert
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ProductGallery from './ProductGallery';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShareIcon from '@mui/icons-material/Share';
import SizeSelector from './SizeSelector';
import ColorSelector from './ColorSelector';
import ProductInfo from './ProductInfo';
import ShippingInfo from './ShippingInfo';
import ProductReviews from './ProductReviews';
import wishlistService from '@/services/wishlistService';
import { getCurrentUser } from '@/services/authService';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Verificar si el producto está en la wishlist al cargar el componente
    useEffect(() => {
        const checkWishlistStatus = async () => {
            try {
                const user = await getCurrentUser();
                if (!user) return;

                setLoadingWishlist(true);
                const isInWishlist = await wishlistService.isInWishlist(product.product_id);
                setIsFavorite(isInWishlist);
            } catch (error) {
                console.error("Error al verificar wishlist:", error);
            } finally {
                setLoadingWishlist(false);
            }
        };

        checkWishlistStatus();
    }, [product.product_id]);

    const handleToggleWishlist = async () => {
        try {
            const user = await getCurrentUser();
            if (!user) {
                router.push('/sign-in-side');
                return;
            }

            setLoadingWishlist(true);

            if (isFavorite) {
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

            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Error al actualizar la lista de deseos:", error);
            setSnackbar({
                open: true,
                message: 'Error al actualizar la lista de deseos',
                severity: 'error'
            });
        } finally {
            setLoadingWishlist(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({...prev, open: false}));
    };

    return (
        <ProductDetailContainer>
            <Grid container alignItems="flex-start" color={vistelicaColors.background}>
                <Grid item xs={12} md={7} lg={8}>
                    <ProductGallery images={[product.image_url]} />
                </Grid>

                <Grid item xs={12} md={5} lg={4}>
                    <CompactDetailBox sx={{
                        minWidth: '700px',
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
                                aria-label={isFavorite ? "Quitar de lista de deseos" : "Añadir a lista de deseos"}
                                onClick={handleToggleWishlist}
                                disabled={loadingWishlist}
                                sx={{
                                    padding: '8px',
                                    color: isFavorite ? vistelicaColors.primary : 'inherit',
                                    '&:hover': {
                                        color: vistelicaColors.primary
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
                                    {(parseFloat(product.price) / (1 - parseFloat(product.discount_percentage) / 100)).toFixed(2)}€
                                </span>
                            )}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <SizeSelector
                            sizes={availableSizes}
                            selectedSize={selectedSize}
                            onSizeChange={onSizeChange}
                        />

                        <ColorSelector
                            colors={availableColors}
                            selectedColor={selectedColor}
                            onColorChange={onColorChange}
                        />

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
                                onClick={onAddToCart}
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
            </Grid>

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
        </ProductDetailContainer>
    );
};

export default ProductDetail;