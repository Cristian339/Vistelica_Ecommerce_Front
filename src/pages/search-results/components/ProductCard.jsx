'use client';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Box } from '@mui/material';
import Link from 'next/link';

const ProductCard = ({ product }) => {
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
                href={`/product-detail/page?id=${product.product_id}`}
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
                            image={product.main_image}
                            alt={product.name}
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
                        />
                    </Box>

                    {/* Contenedor del texto con ajustes solicitados */}
                    <CardContent sx={{
                        width: '100%',
                        height: '30%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start', // Ajuste para subir el precio
                        px: 3,
                        py: 2,
                        borderTop: '1px solid #f0f0f0'
                    }}>
                        <Typography
                            variant="subtitle1"
                            component="h3"
                            sx={{
                                fontWeight: 700, // Más bold (600 es semi-bold, 700 es bold)
                                mb: 1, // Reducido el margen inferior para subir el precio
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
                            {product.name}
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
                            {product.price}€
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    );
};

export default ProductCard;