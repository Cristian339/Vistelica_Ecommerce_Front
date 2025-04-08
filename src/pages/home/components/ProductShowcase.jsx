import React, { useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box
} from '@mui/material';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card
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
                height: '240px', // Reducido de 320px a 270px
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <CardMedia
                    component="img"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{
                        objectFit: 'contain',
                        maxHeight: '100%',
                        maxWidth: '100%'
                    }}
                />
            </Box>

            <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" component="h3">
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

                    {product.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Typography component="span" color="warning.main" mr={0.5}>★</Typography>
                            <Typography variant="body2" component="span">
                                {product.rating}
                            </Typography>
                            <Typography variant="caption" component="span" color="text.secondary" ml={0.5}>
                                ({product.reviews} reseñas)
                            </Typography>
                        </Box>
                    )}

                    {product.variants && (
                        <Typography variant="caption" color="text.secondary">
                            {product.variants} variantes
                        </Typography>
                    )}
                </Box>
            )}
        </Card>
    );
};

const ProductShowcase = () => {
    const products = [
        {
            id: 1,
            name: "Anillo Inspirado en Vintage con Zafiro",
            price: "420.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
            rating: "4.85",
            reviews: "11",
            variants: "5"
        },
        {
            id: 2,
            name: "Altavoz Bluetooth de Malla Redondo",
            price: "215.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
            rating: "4.7",
            reviews: "24",
            variants: "3"
        },
        {
            id: 3,
            name: "Parlante Portátil Minimalista",
            price: "145.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
            variants: "2"
        },
        {
            id: 4,
            name: "Gafas de Sol Clásicas",
            price: "95.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
            rating: "4.9",
            reviews: "37",
            variants: "4"
        },
        {
            id: 5,
            name: "Plato Decorativo Mármol",
            price: "125.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
            variants: "1"
        },
        {
            id: 6,
            name: "Jarrón Plateado Moderno",
            price: "175.00",
            imageUrl: "https://res.cloudinary.com/dhyv4dpk2/image/upload/v1743794098/vistelica/cardproductos/vonzkijgon1kakqvr5vy.png",
            rating: "4.6",
            reviews: "8",
            variants: "2"
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h5" component="h2" fontWeight={500} mb={3} sx={{ fontFamily: 'Amethysta, sans-serif' }}>
                Productos destacados
            </Typography>

            {/* Contenedor de productos con Grid modificado */}
            <Grid container spacing={3}>
                {products.map(product => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ProductShowcase;