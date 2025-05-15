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
    IconButton,
    Tooltip,
    Zoom,
    Skeleton,
    useMediaQuery,
    useTheme,
    CardActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import productService from "@/services/productService";
import Link from 'next/link';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import { motion } from 'framer-motion';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// Estilos para el componente de tarjeta de producto
const ProductCardContainer = styled(Card)(({ theme }) => ({
    position: 'relative',
    height: '700px',
    maxWidth: '100%',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    margin: '0 auto',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '10px',
    overflow: 'hidden',
    border: `1px solid ${vistelicaColors.divider}`,
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 20px rgba(0,0,0,0.12)',
        '& .product-image': {
            transform: 'scale(1.05)',
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

// Componente Skeleton para mostrar durante la carga
const ProductSkeleton = () => (
    <Card sx={{
        height: '650px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '10px',
        overflow: 'hidden',
        border: `1px solid ${vistelicaColors.divider}`,
    }}>
        <Skeleton variant="rectangular" width="100%" height={460} animation="wave" />
        <CardContent sx={{ flexGrow: 1, p: 2, height: '100px' }}>
            <Skeleton variant="text" width="40%" height={24} animation="wave" />
            <Skeleton variant="text" width="90%" height={32} animation="wave" />
            <Skeleton variant="text" width="70%" height={20} animation="wave" />
            <Box sx={{ mt: 'auto' }}>
                <Skeleton variant="text" width="30%" height={32} animation="wave" />
            </Box>
        </CardContent>
        <CardActions sx={{ p: 1.5, height: '70px', borderTop: `1px solid ${vistelicaColors.divider}` }}>
            <Skeleton variant="circular" width={45} height={45} animation="wave" />
            <Skeleton variant="rectangular" width={130} height={42} animation="wave" sx={{ borderRadius: 2 }} />
        </CardActions>
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

    const handleViewDetail = (e) => {
        e.preventDefault();
        window.location.href = productDetailUrl;
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
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {product.name || 'Sin nombre'}
                    </Typography>

                    <Box sx={{
                        flexGrow: 0,
                        mb: 0.5,
                        minHeight: '40px',
                        overflow: 'visible'
                    }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: vistelicaColors.secondary,
                                fontFamily: typography.fontFamily,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: { xs: '0.9rem', md: '1rem' },
                                lineHeight: '1.2em'
                            }}
                        >
                            {product.name || 'Sin nombre de producto'}
                        </Typography>
                    </Box>

                    {colorCount > 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            {colorCount} {colorCount === 1 ? 'variante de color' : 'variantes de color'}
                        </Typography>
                    )}

                    {product.average_rating !== null && product.average_rating !== undefined && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            {renderStars(product.average_rating)}
                            <Typography variant="caption" component="span" color="text.secondary" ml={0.5}>
                                ({product.reviews_count || 0})
                            </Typography>
                        </Box>
                    )}

                    {/* Precio destacado con fondo de color */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: vistelicaColors.primary,
                            fontFamily: typography.fontFamily,
                            fontSize: { xs: '1.3rem', md: '1.3rem' },
                            mt: 'auto',
                            backgroundColor: vistelicaColors.tertiary,
                            py: 0.5,
                            px: 1,
                            borderRadius: '4px',
                            display: 'inline-block'
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
                </CardActions>
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
                // No necesitamos procesar la descripción ahora
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

                <Grid container spacing={3}>
                    {loading ?
                        Array.from(new Array(8)).map((_, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                lg={3}
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