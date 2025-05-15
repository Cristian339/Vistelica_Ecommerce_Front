'use client';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    IconButton,
    Paper,
    Stack,
    Divider,
    List,
    ListItem,
    CircularProgress
} from '@mui/material';
import { Heart } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from "@/components/layout/HeaderComponent";
// Importamos el service
import { getStyleById } from "@/services/styleService";

// Componente principal para la página "Get the Look"
const StylePage = ({ params }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [styleData, setStyleData] = useState(null);
    const [favorites, setFavorites] = useState({});

    // Obtenemos el ID del estilo desde los parámetros
    const styleId = 20;

    useEffect(() => {
        const fetchStyleData = async () => {
            try {
                setLoading(true);
                // Pasamos el ID del estilo al método del servicio
                const data = await getStyleById(styleId);

                // Aquí procesamos los datos para asegurarnos de que los productos tengan la información correcta de imágenes
                const processedData = {
                    ...data,
                    products: data.products.map(product => {
                        // Buscar el producto correspondiente en relatedProducts para obtener sus imágenes
                        const relatedProduct = data.relatedProducts.find(rp => rp.product_id === product.product_id);

                        // Si encontramos el producto relacionado, agregamos la imagen principal
                        if (relatedProduct) {
                            return {
                                ...product,
                                main_image: relatedProduct.main_image,
                                images: relatedProduct.images
                            };
                        }
                        return product;
                    })
                };

                setStyleData(processedData);

                // Inicializar el estado de favoritos con los IDs de los productos
                const initialFavorites = {};
                processedData.products.forEach(product => {
                    initialFavorites[product.product_id] = false;
                });
                setFavorites(initialFavorites);

                setLoading(false);
            } catch (error) {
                console.error("Error al cargar el estilo:", error);
                setLoading(false);
            }
        };

        // Solo realizamos la petición si tenemos un ID válido
        if (styleId) {
            fetchStyleData();
        } else {
            console.error("No se proporcionó un ID de estilo válido");
            setLoading(false);
        }
    }, [styleId]);

    return (
        <>
            <Navbar />
            <Box>
                {loading ? (
                    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress />
                    </Container>
                ) : styleData ? (
                    <>
                        <HeaderComponent
                            title={styleData.name}
                            subtitle={styleData.description}
                            articleCount={`${styleData.products.length} artículos`}
                        />

                        <Box sx={{ width: '100%' }}>
                            <MainContentSection
                                mainImage={styleData.styleImages.find(img => img.is_main)?.image_url || "/api/placeholder/600/800"}
                                products={styleData.products}
                                favorites={favorites}
                                setFavorites={setFavorites}
                            />
                        </Box>

                    </>
                ) : (
                    <Container maxWidth="lg">
                        <Typography variant="h5" color="error" sx={{ py: 4 }}>
                            No se pudo cargar el estilo. Por favor, inténtalo más tarde.
                        </Typography>
                    </Container>
                )}
            </Box>
        </>
    );
};

// Componente para el encabezado de la página
const HeaderComponent = ({ title, subtitle, articleCount }) => {
    return (
        <Box sx={{
            width: '100%',
            borderBottom: '1px solid',
            borderColor: 'divider',
            py: 2,
            mb: 4
        }}>
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h5" fontWeight="bold">
                            {title}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            {subtitle}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {articleCount}
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

// Componente para la sección principal de contenido
const MainContentSection = ({ mainImage, products, favorites, setFavorites }) => {
    const toggleFavorite = (id) => {
        setFavorites(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <Container maxWidth="lg" disableGutters>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                ml: 0
            }}>
                {/* Imagen principal del outfit - Colocada completamente a la izquierda */}
                <Box
                    sx={{
                        width: '50%',
                        minWidth: 300,
                        maxWidth: 450,
                        bgcolor: 'grey.100',
                        borderRadius: 2,
                        overflow: 'hidden',
                        marginLeft: 0,
                        paddingLeft: 0,
                        position: 'relative',
                        left: 0
                    }}
                >
                    <Box
                        component="img"
                        src={mainImage}
                        alt="Model wearing the complete outfit"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover'
                        }}
                    />
                </Box>

                {/* Grid de productos */}
                <Box sx={{ flexGrow: 1, pl: 4 }}>
                    <Grid container spacing={2}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.product_id}>
                                <ProductCard
                                    product={product}
                                    isFavorite={favorites[product.product_id]}
                                    onToggleFavorite={() => toggleFavorite(product.product_id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};
// Componente de tarjeta de producto individual

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
    const formattedPrice = `${product.price} €`;
    const hasDiscount = product.discount_percentage && parseFloat(product.discount_percentage) > 0;

    // Obtener imagen principal
    const mainImage = product.main_image ||
        (product.images?.find(img => img.is_main)?.image_url) ||
        "/api/placeholder/400";

    return (
        <Card sx={{
            bgcolor: 'grey.50',
            borderRadius: 2,
            boxShadow: 0,
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%', // Asegura que las tarjetas se ajusten al tamaño del Grid
            transform: 'scale(0.9)', // Hace las tarjetas un poco más pequeñas
            transformOrigin: 'center'
        }}>
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    image={mainImage}
                    alt={product.name}
                    sx={{
                        aspectRatio: '1/1',
                        bgcolor: 'white',
                        objectFit: 'contain',
                        height: '250px' // Altura fija más pequeña
                    }}
                />
                <IconButton
                    onClick={onToggleFavorite}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'white',
                        opacity: 0.7,
                        '&:hover': {
                            bgcolor: 'white',
                            opacity: 1
                        },
                        padding: '4px' // Botón más pequeño
                    }}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    size="small" // Botón más pequeño
                >
                    <Heart
                        fill={isFavorite ? "black" : "none"}
                        stroke="black"
                        size={18} // Icono más pequeño
                    />
                </IconButton>

                {hasDiscount && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            bgcolor: 'error.main',
                            color: 'white',
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 1,
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                        }}
                    >
                        -{product.discount_percentage}%
                    </Box>
                )}
            </Box>

            <CardContent sx={{ py: 1, px: 1.5 }}> {/* Padding más pequeño */}
                {product.sizes && (
                    <Typography variant="caption" sx={{
                        color: 'orange',
                        fontWeight: 600,
                        display: 'block',
                        mb: 0.25,
                        fontSize: '0.65rem' // Texto más pequeño
                    }}>
                        {product.sizes.join(" · ")}
                    </Typography>
                )}
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.25, fontSize: '0.8rem' }}> {/* Texto más pequeño */}
                    {product.name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}> {/* Texto más pequeño */}
                    {formattedPrice}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default StylePage;