"use client";

import React, { useState, useEffect } from 'react'; // Añadimos useEffect
import { styled, useTheme } from '@mui/material/styles';
import {vistelicaColors} from "@/pages/shared-theme/vistelicaColors";
import {
    Grid,
    Typography,
    Divider,
    Button,
    Chip,
    Box,
    IconButton,
    CircularProgress // Para el loading
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
    fontFamily: "'Amethysta', serif", // Asegura que herede la fuente
    '& .MuiTypography-root': { // Aplica a todos los Typography
        fontFamily: "'Amethysta', serif !important",
    },
    '& .MuiButton-root': { // Aplica a los botones
        fontFamily: "'Amethysta', serif !important",
    },
    '& .MuiChip-label': { // Aplica a los chips
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
                const reviewsData = await productService.getReviewsByProductName(product.name);
                setReviews(reviewsData);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setErrorReviews(error.message || "Error al cargar las reseñas");
            } finally {
                setLoadingReviews(false);
            }
        };

        if (product?.name) {
            fetchReviews();
        }
    }, [product?.name]);

    return (
        <ProductDetailContainer>
            <Grid container alignItems="flex-start" color={vistelicaColors.background}>
                {/* Galería */}
                <Grid item xs={12} md={7} lg={8}>
                    <ProductGallery images={product.images || []} />
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

                            {/* Icono de corazón */}
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
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {/* Selector de tallas actualizado */}
                        <SizeSelector
                            sizes={availableSizes}
                            selectedSize={selectedSize}
                            onSizeChange={onSizeChange}
                        />

                        {/* Nuevo selector de colores */}
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
                            >
                                Añadir al carrito <ShoppingCartIcon />
                            </Button>
                            <Button
                                variant="outlined"
                                size="medium"
                                sx={{
                                    flex: 1,
                                    maxWidth: 350,
                                    color: vistelicaColors.primaryDark, // Color del texto
                                    borderColor: vistelicaColors.primaryDark, // Color del borde
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