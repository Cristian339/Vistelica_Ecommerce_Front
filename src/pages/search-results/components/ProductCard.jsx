'use client';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Box } from '@mui/material';
import Link from 'next/link';

const ProductCard = ({ product }) => {
    // ✅ Validación principal - si product no existe, no renderizar nada
    if (!product) {
        return null;
    }

    // ✅ Valores por defecto para propiedades que podrían no existir
    const {
        product_id,
        main_image = '/images/placeholder.jpg', // Imagen por defecto
        name = 'Producto sin nombre',
        price = '0'
    } = product;

    // ✅ Validación adicional para product_id (requerido para el link)
    if (!product_id) {
        return null;
    }

    return (
        <Card sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 450,
            maxHeight: 450,
            minWidth: 320,
            maxWidth: 320,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }
        }}>
            <Link
                href={`/product-detail/page?id=${product_id}`}
                passHref
                style={{ textDecoration: 'none', color: 'inherit', height: '100%' }}
            >
                <CardActionArea sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    {/* Contenedor de la imagen */}
                    <Box sx={{
                        width: '100%',
                        height: '70%',
                        minHeight: '70%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                        backgroundColor: '#f9f9f9',
                        overflow: 'hidden'
                    }}>
                        <CardMedia
                            component="img"
                            image={main_image}
                            alt={name}
                            sx={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                                minHeight: '100%',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)'
                                }
                            }}
                            // ✅ Manejo de error de imagen
                            onError={(e) => {
                                e.target.src = '/images/placeholder.jpg';
                            }}
                        />
                    </Box>

                    {/* Contenedor del texto con ajustes solicitados */}
                    <CardContent sx={{
                        width: '100%',
                        height: '30%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        px: 3,
                        py: 2,
                        borderTop: '1px solid #f0f0f0'
                    }}>
                        <Typography
                            variant="subtitle1"
                            component="h3"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                                height: '3em',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: '1.5em',
                                paddingLeft: '8px'
                            }}
                        >
                            {name}
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                color: '#E4B002',
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                paddingLeft: '8px',
                                marginTop: '-10px',
                                alignSelf: 'flex-start'
                            }}
                        >
                            {price}€
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    );
};

export default ProductCard;