"use client";
import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {vistelicaColors} from "@/pages/shared-theme/vistelicaColors";
import {
    Grid,
    Typography,
    Divider,
    Button,
    Box,
    IconButton,
    CircularProgress
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
import productService from '@/services/productService';

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
                           onColorChange
                       }) => {
    const theme = useTheme();
    const [isFavorite, setIsFavorite] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [errorReviews, setErrorReviews] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoadingReviews(true);
                // Cambiamos para usar getReviewsByProductId con el product_id
                const reviewsData = await productService.getReviewsByProductId(product?.product_id);
                setReviews(reviewsData);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setErrorReviews(error.message || "Error al cargar las reseñas");
            } finally {
                setLoadingReviews(false);
            }
        };

        if (product?.product_id) {  // Cambiado de product?.name
            fetchReviews();
        }
    }, [product?.product_id]);

    return (
        <ProductDetailContainer>
            <Grid container alignItems="flex-start" color={vistelicaColors.background}>
                {/* Galería */}
                <Grid item xs={12} md={7} lg={8}>
                    <ProductGallery images={[product.image_url]} />
                </Grid>

                {/* Detalles compactos */}
                <Grid item xs={12} md={5} lg={4}>
                    <CompactDetailBox sx={{
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
                                aria-label="Añadir a lista de deseos"
                                onClick={() => setIsFavorite(!isFavorite)}
                                sx={{
                                    padding: '8px',
                                    color: isFavorite ? 'black' : 'inherit',
                                    '&:hover': {
                                        color: isFavorite ? 'black' : vistelicaColors.primary
                                    }
                                }}
                            >
                                {isFavorite ? (
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

                        {/* Selector de tallas */}
                        <SizeSelector
                            sizes={availableSizes}
                            selectedSize={selectedSize}
                            onSizeChange={onSizeChange}
                        />

                        {/* Selector de colores */}
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
                                sx={{ flex: 1, maxWidth: 650 , background: vistelicaColors.primary}}
                                onClick={() => {
                                    console.log('Añadir al carrito:', {
                                        productId: product.product_id,
                                        size: selectedSize,
                                        color: selectedColor,
                                        quantity: 1
                                    });
                                }}
                            >
                                Añadir al carrito <ShoppingCartIcon />
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
                        <ProductReviews reviews={reviews} />
                    )}
                </Grid>
            </Grid>
        </ProductDetailContainer>
    );
};

export default ProductDetail;