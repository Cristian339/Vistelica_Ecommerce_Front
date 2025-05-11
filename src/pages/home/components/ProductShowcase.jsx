import React, {useEffect, useState} from 'react';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box
} from '@mui/material';
import productService, {getTopRatedFeaturedProducts} from "@/services/productService";
import {useRouter} from "next/router";
import {router} from "next/client";

const ProductCard = ({ product }) => {

    const [isHovered, setIsHovered] = useState(false);
    const colorCount = product.colors ? product.colors.replace(/[{}]/g, '').split(',').length : 0;


    const handleProductClick = () => {
        router.push(`/product-detail/page?id=${product.product_id}`);
    };
    return (
        <Card
            onClick={handleProductClick}
            sx={{
                position: 'relative',
                height: '350px', // Reducido de 400px a 350px
                maxWidth: '100%', // Asegura que no supere el ancho del contenedor
                transition: 'box-shadow 0.3s',
                '&:hover': {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                },
                margin: '0 auto' // Centra la card en su contenedor
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            elevation={isHovered ? 6 : 1}
        >
            {/* Contenedor de imagen con tamaño reducido */}
            <Box sx={{
                width: '100%',
                height: '300px', // Reducido de 320px a 270px
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <CardMedia
                    component="img"
                    image={product.main_image}
                    alt={product.name}
                    sx={{
                        width: '100%', // Ensures the image takes the full width of the container
                        height: '100%', // Fixed height for uniformity
                        objectFit: 'cover', // Ensures the image fills the container without distortion
                    }}
                />
            </Box>

            <CardContent sx={{ p: 2 }}>
                <Typography
                    variant="subtitle2"
                    component="h3"
                    sx={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        WebkitLineClamp: 2,
                        height: '3em',
                    }}
                >
                    {product.name}
                </Typography>
            </CardContent>

            {/* Info overlay que se muestra al pasar el ratón */}
            {isHovered && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        p: 2,
                        transition: 'opacity 0.3s',
                        borderBottomLeftRadius: 4,
                        borderBottomRightRadius: 4
                    }}
                >
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                        Desde ${product.price}
                    </Typography>

                    {product.average_rating !== null && product.average_rating !== undefined && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Typography component="span" color="warning.main" mr={0.5}>★</Typography>
                            <Typography variant="body2" component="span">
                                {product.average_rating.toFixed(1)}
                            </Typography>
                            <Typography variant="caption" component="span" color="text.secondary" ml={0.5}>
                                ({product.reviews_count || 0} reseñas)
                            </Typography>
                        </Box>
                    )}

                    {colorCount > 0 && (
                        <Typography variant="caption" color="text.secondary">
                            {colorCount} variantes de color
                        </Typography>
                    )}
                </Box>
            )}
        </Card>
    );
};

const ProductShowcase = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const data = await productService.getTopRatedFeaturedProducts();
                // Limitar los productos a 6
                setProducts(data.slice(0, 8));
            } catch (error) {
                console.error('Error al cargar productos destacados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);


    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h5" component="h2" fontWeight={500} mb={3} sx={{ fontFamily: 'Amethysta, sans-serif' }}>
                Productos destacados
            </Typography>

            {/* Contenedor de productos con Grid modificado */}
            <Grid container spacing={3}>
                {products.map(product => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ProductShowcase;