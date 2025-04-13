"use client";

import React from 'react';
import {
    Box,
    Typography,
    Divider,
    Avatar,
    Rating,
    Button,
    Grid
} from '@mui/material';
import {vistelicaColors} from "@/pages/shared-theme/vistelicaColors";

const ProductReviews = ({ reviews }) => {
    // Datos de ejemplo para las estadísticas de valoraciones
    const ratingStats = {
        average: 4.0,
        totalRatings: 1034,
        breakdown: [
            { stars: 5, count: 720, percentage: 70 },
            { stars: 4, count: 210, percentage: 20 },
            { stars: 3, count: 80, percentage: 8 },
            { stars: 2, count: 15, percentage: 1.5 },
            { stars: 1, count: 9, percentage: 0.5 }
        ]
    };

    return (
        <Box mt={4}>
            <Typography variant="h5" gutterBottom sx={{ fontSize: '1.2rem', fontWeight: 600 }}>
                Opiniones de clientes
            </Typography>

            <Grid container spacing={4}>
                {/* Columna izquierda - Estadísticas de valoraciones */}
                <Grid item xs={12} md={5} sx={{
                    width: '100%', // Full width en móvil
                    '@media (min-width: 900px)': { // Aplicar solo en desktop
                        minWidth: '20%',
                        width: 'auto'
                    }
                }}>
                    <Box sx={{
                        backgroundColor: 'background.paper',
                        p: 3,
                        borderRadius: 1,
                        boxShadow: 1,
                        height: '100%'
                    }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                            {ratingStats.average.toFixed(1)}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                            <Rating
                                value={ratingStats.average}
                                precision={0.1}
                                readOnly
                                size="large"
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
                            {ratingStats.totalRatings} valoraciones
                        </Typography>

                        {ratingStats.breakdown.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ width: 40 }}>
                                    {item.stars} ★
                                </Typography>
                                <Box sx={{ flexGrow: 1, mx: 2 }}>
                                    <Box
                                        sx={{
                                            height: 8,
                                            backgroundColor: 'divider',
                                            borderRadius: 4,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: `${item.percentage}%`,
                                                height: '100%',
                                                backgroundColor: vistelicaColors.primary
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {item.count}
                                </Typography>
                            </Box>
                        ))}

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 3,
                                backgroundColor: vistelicaColors.primary,
                                color: vistelicaColors.secondary,
                                '&:hover': {
                                    backgroundColor: vistelicaColors.primaryDark
                                }
                            }}
                        >
                            Dejar reseña
                        </Button>
                    </Box>
                </Grid>

                {/* Columna derecha - Lista de opiniones */}
                <Grid item xs={12} md={7} sx={{
                    width: '100%', // Full width en móvil
                    '@media (min-width: 900px)': { // Ajuste para desktop
                        width: 'calc(100% - 20% - 32px)' // 100% - 20% - spacing
                    }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            {reviews.length} opiniones
                        </Typography>
                    </Box>

                    {/* Lista de reseñas sin acordeón */}
                    <Box sx={{
                        maxHeight: '600px',
                        overflowY: 'auto',
                        pr: 2,
                        '@media (max-width: 899px)': {
                            maxHeight: 'none' // Eliminar altura fija en móvil
                        }
                    }}>
                        {reviews.map((review, index) => (
                            <Box key={index} mb={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar sx={{
                                        width: 40,
                                        height: 40,
                                        mr: 2,
                                        backgroundColor: vistelicaColors.primary
                                    }}>
                                        {review.user.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2">{review.user}</Typography>
                                        <Rating
                                            value={review.rating}
                                            size="small"
                                            readOnly
                                            sx={{
                                                '& .MuiRating-iconFilled': {
                                                    color: vistelicaColors.primary
                                                }
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Typography variant="body2" paragraph>
                                    {review.comment}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {review.date}
                                </Typography>
                                {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductReviews;