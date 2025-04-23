"use client";
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Divider,
    Avatar,
    Rating,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Snackbar,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import productService from '@/services/productService';
import TextField from "@mui/material/TextField";
import {getCurrentUser} from "@/services/authService";

const ProductReviews = ({ reviews = [], productId, onReviewAdded }) => {
    const [openModal, setOpenModal] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });


    const calculateStats = () => {
        if (reviews.length === 0) {
            return {
                average: 0,
                totalRatings: 0,
                breakdown: [
                    { stars: 5, count: 0, percentage: 0 },
                    { stars: 4, count: 0, percentage: 0 },
                    { stars: 3, count: 0, percentage: 0 },
                    { stars: 2, count: 0, percentage: 0 },
                    { stars: 1, count: 0, percentage: 0 }
                ]
            };
        }

        const total = reviews.length;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / total;

        const breakdown = [5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => Math.round(r.rating) === star).length;
            return {
                stars: star,
                count,
                percentage: Math.round((count / total) * 100)
            };
        });

        return {
            average,
            totalRatings: total,
            breakdown
        };
    };

    const ratingStats = calculateStats();

    const handleOpenModal = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setSnackbar({
                open: true,
                message: 'Debes iniciar sesión para dejar una reseña',
                severity: 'warning'
            });
            return;
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setReviewText('');
        setRating(0);
    };

    const handleSubmitReview = async () => {
        setSubmitting(true);
        try {
            const user = await getCurrentUser();
            await productService.createProductReview(productId, rating, reviewText,user.user_id);

            setSnackbar({
                open: true,
                message: 'Reseña enviada con éxito',
                severity: 'success'
            });

            handleCloseModal();

            if (onReviewAdded) {
                onReviewAdded();
            }
        } catch (error) {
            console.error('Error al enviar la reseña:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || error.message || 'Error al enviar la reseña',
                severity: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <Box mt={4}>
            <Typography variant="h5" gutterBottom sx={{ fontSize: '1.2rem', fontWeight: 600 }}>
                Opiniones de clientes
            </Typography>

            {reviews.length === 0 ? (
                <Typography variant="body1" textAlign="center" py={4}>
                    No hay reseñas disponibles para este producto.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {/* Columna izquierda - Estadísticas de valoraciones */}
                    <Grid item xs={12} md={5} sx={{
                        width: '100%',
                        '@media (min-width: 900px)': {
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
                                onClick={handleOpenModal}
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
                        width: '100%',
                        '@media (min-width: 900px)': {
                            width: 'calc(100% - 20% - 32px)'
                        }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                {reviews.length} opiniones
                            </Typography>
                        </Box>

                        <Box sx={{
                            maxHeight: '600px',
                            overflowY: 'auto',
                            pr: 2,
                            '@media (max-width: 899px)': {
                                maxHeight: 'none'
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
                                            {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2">
                                                {review.user?.name || 'Usuario anónimo'}
                                            </Typography>
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
                                        {review.review_text}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(review.created_at)}
                                    </Typography>
                                    {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            )}

            {/* Modal para dejar reseña */}
            <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Escribe tu reseña
                    <IconButton onClick={handleCloseModal}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, mb: 3 }}>
                        <Typography variant="body1" gutterBottom>
                            ¿Cómo valorarías este producto?
                        </Typography>
                        <Rating
                            value={rating}
                            onChange={(event, newValue) => setRating(newValue)}
                            size="large"
                            sx={{
                                '& .MuiRating-iconFilled': {
                                    color: vistelicaColors.primary
                                }
                            }}
                        />
                    </Box>
                    <TextField
                        label="Tu reseña"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Comparte tu experiencia con este producto..."
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={handleCloseModal}
                        sx={{ color: vistelicaColors.primaryDark }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmitReview}
                        variant="contained"
                        disabled={!rating || !reviewText || submitting}
                        sx={{
                            backgroundColor: vistelicaColors.primary,
                            color: vistelicaColors.secondary,
                            '&:hover': {
                                backgroundColor: vistelicaColors.primaryDark
                            },
                            '&:disabled': {
                                backgroundColor: '#e0e0e0'
                            }
                        }}
                    >
                        {submitting ? 'Enviando...' : 'Enviar reseña'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductReviews;