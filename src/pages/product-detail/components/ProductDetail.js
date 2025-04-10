"use client";

import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    Grid,
    Typography,
    Divider,
    Button,
    Chip,
    Box
} from '@mui/material';
import ProductGallery from './ProductGallery';
import SizeSelector from './SizeSelector';
import ProductInfo from './ProductInfo';
import PromotionBanner from './PromotionBanner';
import ShippingInfo from './ShippingInfo';
import CompositionCare from './CompositionCare';
import ProductReviews from './ProductReviews';

const ProductDetailContainer = styled('div')(({ theme }) => ({
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(3),
    },
}));

const CompactDetailBox = styled(Box)(({ theme }) => ({
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
    '& .MuiButton-root': {
        padding: theme.spacing(1),
        fontSize: '0.875rem'
    }
}));

const ProductDetail = ({ product }) => {
    const theme = useTheme();

    const reviews = [
        {
            user: "Ana Pérez",
            rating: 5,
            comment: "El producto es exactamente como se muestra en las fotos. La talla es perfecta y la calidad excelente.",
            date: "15/03/2023"
        },
        {
            user: "Carlos Ruiz",
            rating: 4,
            comment: "Muy contento con la compra, aunque la talla viene un poco justa. Recomendaría tallar una talla más.",
            date: "02/02/2023"
        }
    ];

    return (
        <ProductDetailContainer>
            <Grid container alignItems="flex-start">
                {/* Galería - Ocupa más espacio */}
                <Grid item xs={12} md={7} lg={8}>
                    <Box sx={{ height: '100%' }}> {/* Añade este Box */}
                        <ProductGallery images={product.images} />
                    </Box>
                </Grid>

                {/* Detalles compactos */}
                <Grid item xs={12} md={5} lg={4}>
                    <CompactDetailBox sx={{
                        position: 'sticky',
                        top: theme.spacing(2),
                        paddingLeft: { md: 2 },
                        maxHeight: { md: '100vh' }, // Limita la altura máxima
                        overflowY: 'auto' // Añade scroll si es necesario
                    }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {product.name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Ref.: {product.reference}
                        </Typography>

                        <Typography variant="h3" sx={{
                            color: 'primary.main',
                            my: 1
                        }}>
                            {product.price}€
                        </Typography>

                        <Chip label="Disponible" color="secondary" size="small" sx={{ mb: 1 }} />

                        <Divider sx={{ my: 2 }} />

                        <SizeSelector sizes={product.sizes} />

                        <PromotionBanner
                            offer="TRAJE + CAMISA + CORBATA + PAÑUELO"
                            price="148,95€"
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
                                sx={{ flex: 1, maxWidth: 500 }}
                            >
                                Añadir al carrito
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="medium"
                                sx={{ flex: 1, maxWidth: 500 }}
                            >
                                Comprar
                            </Button>
                        </Box>

                        <ShippingInfo />
                        <CompositionCare composition={product.composition} />
                    </CompactDetailBox>
                </Grid>

                <Grid item xs={12} sx={{ mt: { xs: 2, md: 0 } , width: '100%'}}>
                    <ProductReviews reviews={reviews} />
                </Grid>
            </Grid>
        </ProductDetailContainer>
    );
};

export default ProductDetail;