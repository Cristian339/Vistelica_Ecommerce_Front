'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Button,
    Tooltip,
    Zoom,
    Skeleton,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import productService from "@/services/productService";
import Link from 'next/link';
import { vistelicaColors } from '../../../components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";
import { motion } from 'framer-motion';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// Manteniendo los estilos exactamente igual que antes
const ProductCardContainer = styled(Card)(({ theme }) => ({
    position: 'relative',
    height: '450px', // Altura fija para todas las tarjetas
    width: '350px', // TAMAÑO FIJO: Ancho fijo para todas las tarjetas
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    margin: '0 auto', // Centrado horizontal
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '10px',
    overflow: 'hidden',
    border: `1px solid ${vistelicaColors.primary}`,
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 20px rgba(0,0,0,0.12)',
        '& .product-image': {
            transform: 'scale(1.05)',
        },
        '& .hover-info': {
            transform: 'translateY(0)',
            opacity: 1
        }
    }
}));

const ImageContainer = styled(Box)(() => ({
    position: 'relative',
    width: '100%',
    height: '420px', // Altura fija para todas las imágenes
    overflow: 'hidden',
    borderRadius: '8px 8px 0 0',
    paddingLeft: '2.5%',
    paddingRight: '2.5%',
    boxSizing: 'border-box',
    backgroundColor: '#f8f8f8', // Fondo para todas las imágenes
}));

const ProductImage = styled(CardMedia)(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover', // COBERTURA HORIZONTAL
    transition: 'transform 0.5s ease',
}));

const HoverInfoOverlay = styled(Box)(() => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '20px',
    backdropFilter: 'blur(4px)',
    transform: 'translateY(100%)',
    opacity: 0,
    transition: 'transform 0.4s ease, opacity 0.4s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    borderTop: `1px solid ${vistelicaColors.primary}`,
    zIndex: 10
}));

// Componente de Estrellas de Valoración memoizado
const RatingStars = React.memo(({ rating }) => {
    const renderStars = useMemo(() => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <StarIcon key={`full-${i}`} sx={{ color: vistelicaColors.primary, fontSize: '1rem' }} />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <StarIcon key="half" sx={{ color: vistelicaColors.primary, fontSize: '1rem' }} />
            );
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <StarBorderIcon key={`empty-${i}`} sx={{ color: vistelicaColors.primary, fontSize: '1rem' }} />
            );
        }

        return stars;
    }, [rating]);

    return <>{renderStars}</>;
});

// Componente Skeleton memoizado
const ProductSkeleton = React.memo(() => (
    <Card sx={{
        height: '450px', // Misma altura que ProductCardContainer
        width: '350px', // TAMAÑO FIJO mantenido
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '10px',
        overflow: 'hidden',
        border: `1px solid ${vistelicaColors.primary}`,
        margin: '0 auto', // Centrado horizontal
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    }}>
        <Box sx={{
            position: 'relative',
            width: '100%',
            height: '320px', // Misma altura que ImageContainer
            backgroundColor: '#f8f8f8'
        }}>
            <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{ transform: 'scale(1)', opacity: 0.8 }}
            />
            <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                <Skeleton variant="rectangular" width={60} height={30} animation="wave" sx={{ borderRadius: '4px' }} />
            </Box>
        </Box>
        <CardContent sx={{ p: 2.5, flexGrow: 1, height: '130px' }}>
            <Skeleton variant="text" width="40%" height={24} animation="wave" />
            <Box sx={{ mt: 1, mb: 1.5 }}>
                <Skeleton variant="text" width="85%" height={32} animation="wave" />
                <Skeleton variant="text" width="65%" height={32} animation="wave" />
            </Box>
            <Skeleton variant="text" width="40%" height={28} animation="wave" />
        </CardContent>
    </Card>
));

// Componente de badge de descuento memoizado
const DiscountBadge = React.memo(({ discount }) => {
    if (!discount || discount <= 0) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                backgroundColor: vistelicaColors.primary,
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '0.8rem'
            }}
        >
            {`-${discount}%`}
        </Box>
    );
});

// Hook personalizado para manejar productos
const useProductData = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const data = await productService.getTopRatedFeaturedProducts();
                setProducts(data.slice(0, 8));
            } catch (error) {
                console.error('Error al cargar productos destacados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return { products, loading };
};

// Componente de tarjeta de producto memoizado
const ProductCard = React.memo(({ product }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [imageError, setImageError] = useState(false);

    const colorCount = useMemo(() =>
            product.colors ? product.colors.replace(/[{}]/g, '').split(',').length : 0
        , [product.colors]);

    const productId = product.product_id || product.id || product._id;
    const productDetailUrl = `/product-detail/page?id=${productId}`;

    const handleAddToCart = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('Añadir al carrito:', productId);
    }, [productId]);

    const imageUrl = !imageError ?
        (product.main_image || product.image_url || product.image || product.images?.[0] || "/images/placeholder-product.jpg") :
        "/images/placeholder-product.jpg";

    const handleImageError = useCallback(() => setImageError(true), []);

    return (
        <Link href={productDetailUrl} passHref style={{ textDecoration: 'none' }}>
            <ProductCardContainer
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                role="article"
                aria-label={`Producto: ${product.name || 'Sin nombre'}`}
            >
                <ImageContainer>
                    <ProductImage
                        component="img"
                        className="product-image"
                        image={imageUrl}
                        alt={product.name || 'Producto'}
                        onError={handleImageError}
                        loading="lazy"
                    />
                    <DiscountBadge discount={product.discount} />

                    {/* Overlay con información en hover */}
                    <HoverInfoOverlay className="hover-info">
                        {/* Precio */}
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: vistelicaColors.primary,
                                fontFamily: typography.fontFamily,
                                textAlign: 'center',
                                backgroundColor: vistelicaColors.tertiary,
                                py: 1,
                                px: 2,
                                borderRadius: '6px',
                                display: 'block',
                                margin: '0 auto'
                            }}
                        >
                            {typeof product.price === 'number' ? product.price.toFixed(2) : (parseFloat(product.price) || 0).toFixed(2)}€
                        </Typography>

                        {/* Reseñas */}
                        {product.average_rating !== null && product.average_rating !== undefined && (
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 0.5
                            }}>
                                <RatingStars rating={product.average_rating} />
                                <Typography variant="body2" component="span" color="text.secondary" ml={1}>
                                    ({product.reviews_count || 0} reseñas)
                                </Typography>
                            </Box>
                        )}

                        {/* Variantes de color */}
                        {colorCount > 0 && (
                            <Typography
                                variant="body1"
                                sx={{
                                    textAlign: 'center',
                                    color: vistelicaColors.secondary,
                                    fontFamily: typography.fontFamily
                                }}
                            >
                                {colorCount} {colorCount === 1 ? 'variante de color disponible' : 'variantes de color disponibles'}
                            </Typography>
                        )}

                        {/* Botón de añadir al carrito */}

                    </HoverInfoOverlay>
                </ImageContainer>

                <CardContent sx={{
                    p: { xs: 1.5, sm: 2, md: 2.5 },
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{
                            fontSize: { xs: '0.85rem', md: '0.95rem' },
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
                            fontSize: { xs: '1.1rem', md: '1.25rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            color: vistelicaColors.primary,
                            lineHeight: 1.2,
                            minHeight: '3rem'
                        }}
                    >
                        {product.name || 'Sin nombre'}
                    </Typography>
                </CardContent>
            </ProductCardContainer>
        </Link>
    );
});

const ProductShowcase = () => {
    const { products, loading } = useProductData();
    const theme = useTheme();

    // Animaciones memoizadas
    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    }), []);

    const itemVariants = useMemo(() => ({
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                duration: 0.4
            }
        }
    }), []);

    return (
        <Box
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            sx={{
                py: { xs: 4, md: 6 },
                backgroundColor: '#ffffff',
                borderRadius: { xs: 0, md: '20px' },
                my: { xs: 2, md: 4 },
                px: { xs: 2, md: 4 }
            }}
        >
            <Container maxWidth="xl" sx={{ px: { xs: 1, md: 3 } }}>
                <Typography
                    variant="h4"
                    component={motion.h2}
                    variants={itemVariants}
                    sx={{
                        fontFamily: typography.fontFamily,
                        fontWeight: 600,
                        mb: 4,
                        textAlign: 'center',
                        color: vistelicaColors.secondary,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '3px',
                            backgroundColor: vistelicaColors.primary
                        }
                    }}
                >
                    Productos Destacados
                </Typography>

                <Grid container spacing={2} sx={{ width: '100%' }} role="list">
                    {loading ?
                        Array.from(new Array(4)).map((_, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                lg={3}
                                key={`skeleton-${index}`}
                                component={motion.div}
                                variants={itemVariants}
                                role="listitem"
                                aria-label="Cargando producto"
                            >
                                <ProductSkeleton />
                            </Grid>
                        ))
                        :
                        products.map((product, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                lg={3}
                                key={product.product_id || index}
                                component={motion.div}
                                variants={itemVariants}
                                role="listitem"
                            >
                                <ProductCard product={product} />
                            </Grid>
                        ))
                    }
                </Grid>

                {products.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 4
                        }}
                        component={motion.div}
                        variants={itemVariants}
                    >
                        <Button
                            variant="outlined"
                            component={Link}
                            href="/product-list/productList?filter=topRated"
                            sx={{
                                borderColor: vistelicaColors.primary,
                                color: vistelicaColors.primary,
                                fontFamily: typography.fontFamily,
                                px: 4,
                                py: 1,
                                borderRadius: '30px',
                                '&:hover': {
                                    backgroundColor: vistelicaColors.tertiary
                                }
                            }}
                            aria-label="Ver más productos"
                        >
                            Ver más productos destacados
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

// Añadimos displayNames para mejor depuración
RatingStars.displayName = 'RatingStars';
ProductSkeleton.displayName = 'ProductSkeleton';
DiscountBadge.displayName = 'DiscountBadge';
ProductCard.displayName = 'ProductCard';

export default React.memo(ProductShowcase);