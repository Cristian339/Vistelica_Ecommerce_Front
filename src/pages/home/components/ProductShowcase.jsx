import React, { useEffect, useState } from 'react';
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
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import { motion } from 'framer-motion';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// Estilos para el componente de tarjeta de producto
// TAMAÑO FIJO: Estilos actualizados para el componente de tarjeta de producto
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

// COBERTURA HORIZONTAL: Actualización del estilo de la imagen
const ProductImage = styled(CardMedia)(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover', // COBERTURA HORIZONTAL: Cambiado de 'contain' a 'cover' para que la imagen cubra todo el ancho
    transition: 'transform 0.5s ease',
}));

// Nuevo componente para información en hover
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

// Componente Skeleton para mostrar durante la carga
// Componente Skeleton mejorado para mostrar durante la carga
// TAMAÑO FIJO: Componente Skeleton actualizado para mantener consistencia
const ProductSkeleton = () => (
    <Card sx={{
        height: '450px', // Misma altura que ProductCardContainer
        width: '280px', // TAMAÑO FIJO: Mismo ancho que ProductCardContainer
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
);

const ProductCard = ({ product }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [imageError, setImageError] = useState(false);
    const colorCount = product.colors ? product.colors.replace(/[{}]/g, '').split(',').length : 0;

    const productId = product.product_id || product.id || product._id;
    const productDetailUrl = `/product-detail/page?id=${productId}`;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('Añadir al carrito:', productId);
    };

    // Generar stars para el rating
    const renderStars = (rating) => {
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
    };

    const imageUrl = !imageError ?
        (product.main_image || product.image_url || product.image || product.images?.[0] || "/images/placeholder-product.jpg") :
        "/images/placeholder-product.jpg";

    return (
        <Link href={productDetailUrl} passHref style={{ textDecoration: 'none' }}>
            <ProductCardContainer component={motion.div} whileHover={{ scale: 1.02 }}>
                <ImageContainer>
                    <ProductImage
                        component="img"
                        className="product-image"
                        image={imageUrl}
                        alt={product.name || 'Producto'}
                        onError={() => setImageError(true)}
                    />
                    {product.discount > 0 && (
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
                            {`-${product.discount}%`}
                        </Box>
                    )}

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
                            ${typeof product.price === 'number' ? product.price.toFixed(2) : (parseFloat(product.price) || 0).toFixed(2)}
                        </Typography>

                        {/* Reseñas */}
                        {product.average_rating !== null && product.average_rating !== undefined && (
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 0.5
                            }}>
                                {renderStars(product.average_rating)}
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
                            WebkitLineClamp: 2, // Cambiado de 1 a 2 para permitir 2 líneas
                            WebkitBoxOrient: 'vertical',
                            color: vistelicaColors.primary, // Nombre en amarillo
                            lineHeight: 1.2, // Ajustar el espaciado entre líneas
                            minHeight: '3rem' // Altura mínima para acomodar 2 líneas
                        }}
                    >
                        {product.name || 'Sin nombre'}
                    </Typography>
                </CardContent>
            </ProductCardContainer>
        </Link>
    );
};

const ProductShowcase = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

    // Animación para el contenedor
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    // Animación para cada elemento
    const itemVariants = {
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
    };

    return (
        <Box
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            sx={{
                py: { xs: 4, md: 6 },
                backgroundColor: '#FDFBF6',
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

                <Grid container spacing={2} sx={{ width: '100%' }}>
                    {loading ?
                        Array.from(new Array(4)).map((_, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                lg={6}
                                key={`skeleton-${index}`}
                                component={motion.div}
                                variants={itemVariants}
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
                            href="/products"
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
                        >
                            Ver más productos
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ProductShowcase;