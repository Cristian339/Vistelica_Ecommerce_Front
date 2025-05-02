import React from 'react';
import {
    Card, CardMedia, CardContent, Typography, CardActions,
    Button, IconButton, Box, Tooltip, Zoom, useTheme, useMediaQuery
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/router';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const ProductCard = ({ product, onRemoveFromWishlist, showRemoveWishlist }) => {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleViewDetail = () => {
        router.push(`/product/${product.id}`);
    };

    return (
        <Card
            elevation={2}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${vistelicaColors.border}`,
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                }
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height={isMobile ? "180" : "220"}
                    image={product.image_url || "https://via.placeholder.com/200"}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                />
                {showRemoveWishlist && (
                    <IconButton
                        onClick={() => onRemoveFromWishlist(product.id)}
                        color="error"
                        aria-label="eliminar de favoritos"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s'
                        }}
                    >
                        <FavoriteIcon />
                    </IconButton>
                )}
            </Box>

            <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    noWrap
                    sx={{
                        fontFamily: typography.fontFamily,
                        fontWeight: 600,
                        color: vistelicaColors.text.primary,
                        mb: 1
                    }}
                >
                    {product.name}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: vistelicaColors.text.secondary,
                        fontFamily: typography.fontFamily,
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        height: '40px'
                    }}
                >
                    {product.description?.substring(0, 100) || "No hay descripción disponible"}
                    {product.description?.length > 100 ? "..." : ""}
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: vistelicaColors.primary.main,
                        fontFamily: typography.fontFamily,
                    }}
                >
                    ${product.price?.toFixed(2)}
                </Typography>
            </CardContent>

            <CardActions
                sx={{
                    justifyContent: 'flex-end',
                    p: 2,
                    pt: 0,
                    borderTop: `1px solid ${vistelicaColors.divider}`
                }}
            >
                <Tooltip title="Ver detalle" TransitionComponent={Zoom} arrow>
                    <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={handleViewDetail}
                        startIcon={<VisibilityIcon />}
                        sx={{
                            borderRadius: 2,
                            backgroundColor: vistelicaColors.primary.main,
                            '&:hover': {
                                backgroundColor: vistelicaColors.primary.dark,
                            },
                            fontFamily: typography.fontFamily,
                            textTransform: 'none',
                        }}
                    >
                        Ver detalle
                    </Button>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default ProductCard;