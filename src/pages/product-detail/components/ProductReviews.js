"use client";
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Divider, Avatar, Rating, Button,
    Grid, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Snackbar, Alert, Paper, Chip, CircularProgress,
    Card, CardContent, Container, Pagination, Stack, Tooltip, TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import productService from '@/services/productService';
import { getCurrentUser } from "@/services/authService";
import { motion, AnimatePresence } from "framer-motion";
import cartService from '@/services/cartService';

const ProductReviews = ({ reviews = [], productId, onReviewAdded }) => {
    const [openModal, setOpenModal] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [hasPurchasedProduct, setHasPurchasedProduct] = useState(false);
    const [loadingPurchaseStatus, setLoadingPurchaseStatus] = useState(true);

    const reviewsPerPage = 10;
    const hasToken = typeof window !== 'undefined' && localStorage.getItem('token');

    useEffect(() => {
        const checkProductDelivery = async () => {
            try {
                const deliveredProducts = await cartService.getDeliveredProductsIds();
                setHasPurchasedProduct(deliveredProducts.includes(Number(productId)));
            } catch (error) {
                console.error("Error verificando entrega:", error);
            } finally {
                setLoadingPurchaseStatus(false);
            }
        };

        if (hasToken) {
            checkProductDelivery();
        } else {
            setLoadingPurchaseStatus(false);
        }
    }, [productId, hasToken]);

    const handleOpenModal = () => {
        if (!hasToken) {
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
            await productService.createProductReview(productId, rating, reviewText, user.user_id);

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

    const displayedReviews = reviews.slice(0, 3);
    const hasMoreReviews = reviews.length > 3;

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        const reviewsSection = document.getElementById('reviews-section');
        if (reviewsSection) {
            reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const renderReview = (review, index, isAnimated = true) => {
        const Component = isAnimated ? motion.div : Box;
        const props = isAnimated ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3, delay: index * 0.1 },
            exit: { opacity: 0, y: -20 }
        } : {};

        return (
            <Component {...props} key={`review-${review.review_id || index}`}>
                <Card
                    elevation={1}
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        transition: "transform 0.3s, box-shadow 0.3s",
                        width: 700,
                        maxWidth: 'none',
                        '&:hover': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar sx={{
                                width: 44,
                                height: 44,
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
                            <Box sx={{ flexGrow: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                                {formatDate(review.created_at)}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', mt: 1 }}>
                            <FormatQuoteIcon
                                sx={{
                                    color: 'rgba(0,0,0,0.1)',
                                    fontSize: '1.5rem',
                                    mr: 1,
                                    transform: 'rotate(180deg)'
                                }}
                            />
                            <Typography variant="body2" sx={{ flex: 1 }}>
                                {review.review_text}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Component>
        );
    };

    const renderReviewButton = (isFirstReview = false) => {
        if (loadingPurchaseStatus) {
            return <CircularProgress size={24} />;
        }

        const buttonText = hasPurchasedProduct
            ? (isFirstReview ? 'Sé el primero en opinar' : 'Escribir opinión')
            : 'Compra el producto para opinar';

        return (
            <Tooltip
                title={!hasPurchasedProduct ? "Debes haber recibido este producto para dejar una reseña" : ""}
                placement="top"
            >
                <span>
                    <Button
                        variant="contained"
                        onClick={handleOpenModal}
                        startIcon={<CreateIcon />}
                        disabled={!hasPurchasedProduct || !hasToken}
                        sx={{
                            bgcolor: vistelicaColors.primary,
                            color: 'white',
                            '&:hover': {
                                bgcolor: vistelicaColors.primaryDark
                            },
                            '&:disabled': {
                                bgcolor: '#e0e0e0',
                                color: '#9e9e9e'
                            }
                        }}
                    >
                        {buttonText}
                    </Button>
                </span>
            </Tooltip>
        );
    };

    if (!showAllReviews) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box mt={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: '1.3rem',
                                fontWeight: 600,
                                color: vistelicaColors.secondary
                            }}
                        >
                            Opiniones de clientes
                        </Typography>

                        {reviews.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Rating
                                    value={ratingStats.average}
                                    precision={0.1}
                                    readOnly
                                    size="small"
                                    sx={{
                                        mr: 1,
                                        '& .MuiRating-iconFilled': {
                                            color: vistelicaColors.primary
                                        }
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: vistelicaColors.primary,
                                        fontWeight: 500
                                    }}
                                >
                                    ({ratingStats.totalRatings})
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <AnimatePresence>
                        {reviews.length > 0 ? (
                            <>
                                <Box sx={{ mb: 3 }}>
                                    {displayedReviews.map((review, index) => renderReview(review, index))}
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                    {hasMoreReviews && (
                                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => setShowAllReviews(true)}
                                                endIcon={<ExpandMoreIcon />}
                                                sx={{
                                                    color: vistelicaColors.primary,
                                                    borderColor: vistelicaColors.primary,
                                                    '&:hover': {
                                                        borderColor: vistelicaColors.primaryDark
                                                    }
                                                }}
                                            >
                                                Ver todas las opiniones
                                            </Button>
                                        </motion.div>
                                    )}

                                    {renderReviewButton()}
                                </Box>
                            </>
                        ) : (
                            <Box sx={{
                                textAlign: 'center',
                                py: 4,
                                border: '1px dashed',
                                borderColor: 'divider',
                                borderRadius: 2
                            }}>
                                <Typography variant="body1" gutterBottom>
                                    Este producto aún no tiene opiniones
                                </Typography>
                                {renderReviewButton(true)}
                            </Box>
                        )}
                    </AnimatePresence>
                </Box>

                <Dialog
                    open={openModal}
                    onClose={handleCloseModal}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <DialogTitle sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: vistelicaColors.secondary }}>
                                Escribe tu opinión
                            </Typography>
                            <IconButton onClick={handleCloseModal} edge="end">
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
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
                                label="Tu opinión"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="¿Qué te ha parecido este producto? ¿Recomendarías su compra?"
                            />
                        </DialogContent>

                        <DialogActions sx={{ px: 3, py: 3, justifyContent: 'space-between' }}>
                            <Button
                                onClick={handleCloseModal}
                                sx={{
                                    color: vistelicaColors.secondaryDark,
                                    fontWeight: 500
                                }}
                            >
                                Cancelar
                            </Button>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    onClick={handleSubmitReview}
                                    variant="contained"
                                    disabled={!rating || !reviewText || submitting}
                                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
                                    sx={{
                                        bgcolor: vistelicaColors.primary,
                                        '&:hover': {
                                            bgcolor: vistelicaColors.primaryDark
                                        }
                                    }}
                                >
                                    {submitting ? 'Enviando...' : 'Publicar reseña'}
                                </Button>
                            </motion.div>
                        </DialogActions>
                    </motion.div>
                </Dialog>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </motion.div>
        );
    }

    return (
        <Dialog
            fullScreen
            open={showAllReviews}
            onClose={() => setShowAllReviews(false)}
            TransitionComponent={motion.div}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <Box sx={{
                    p: 3,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    bgcolor: 'white',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: vistelicaColors.primary }}>
                        Todas las opiniones ({reviews.length})
                    </Typography>
                    <IconButton onClick={() => setShowAllReviews(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={5} lg={4}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 4,
                                        borderRadius: 2,
                                        background: `linear-gradient(145deg, #ffffff, #f5f5f5)`,
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                                        position: 'sticky',
                                        top: 100,
                                        mx: { xs: 0, md: 2 }
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                                        <Typography
                                            variant="h2"
                                            sx={{
                                                fontWeight: 700,
                                                color: vistelicaColors.secondary,
                                                mb: 2
                                            }}
                                        >
                                            {ratingStats.average.toFixed(1)}
                                        </Typography>

                                        <Rating
                                            value={ratingStats.average}
                                            precision={0.1}
                                            readOnly
                                            size="large"
                                            sx={{
                                                mb: 2,
                                                fontSize: '2rem',
                                                '& .MuiRating-iconFilled': {
                                                    color: vistelicaColors.primary
                                                }
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                color: vistelicaColors.primary,
                                                fontWeight: 500,
                                                fontSize: '1.2rem',
                                                mb: 2
                                            }}
                                        >
                                            {ratingStats.totalRatings} valoraciones
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 3 }} />

                                    <Box sx={{ my: 4 }}>
                                        {ratingStats.breakdown.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Typography variant="body1" sx={{ width: 40, fontWeight: 600 }}>
                                                        {item.stars} <StarIcon sx={{ fontSize: 18, mb: -0.3, color: vistelicaColors.primary }} />
                                                    </Typography>
                                                    <Box sx={{ flexGrow: 1, mx: 1.5 }}>
                                                        <Box
                                                            sx={{
                                                                height: 10,
                                                                backgroundColor: '#eaeaea',
                                                                borderRadius: 4,
                                                                overflow: 'hidden',
                                                                width: '100%',
                                                                border: '1px solid',
                                                                borderColor: vistelicaColors.primary
                                                            }}
                                                        >
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${item.percentage}%` }}
                                                                transition={{ duration: 1, delay: index * 0.1 }}
                                                                style={{
                                                                    height: '100%',
                                                                    backgroundColor: vistelicaColors.primary
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ width: 40, textAlign: 'right', fontWeight: 500, color: vistelicaColors.primary }}>
                                                        {item.percentage}%
                                                    </Typography>
                                                </Box>
                                            </motion.div>
                                        ))}
                                    </Box>

                                    {renderReviewButton()}
                                </Paper>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={7} lg={8}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 'calc(100vh - 200px)'
                                }}>
                                    <Box sx={{
                                        flex: 1,
                                        overflowY: 'auto',
                                        pr: 2,
                                        mb: 2,
                                        '&::-webkit-scrollbar': {
                                            width: '6px'
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: '#f1f1f1',
                                            borderRadius: '10px'
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: vistelicaColors.primary,
                                            borderRadius: '10px',
                                            '&:hover': {
                                                background: vistelicaColors.primaryDark
                                            }
                                        }
                                    }} id="reviews-section">
                                        {currentReviews.map((review, index) => renderReview(review, index))}

                                        {reviews.length === 0 && (
                                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Sin opiniones aún
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    Sé el primero en dejar tu opinión
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    {reviews.length > reviewsPerPage && (
                                        <Box sx={{
                                            py: 2,
                                            position: 'sticky',
                                            bottom: 0,
                                            backgroundColor: 'background.paper',
                                            borderTop: '1px solid',
                                            borderColor: 'divider',
                                            zIndex: 1
                                        }}>
                                            <Pagination
                                                count={totalPages}
                                                page={currentPage}
                                                onChange={handlePageChange}
                                                color="primary"
                                                sx={{
                                                    '& .MuiPaginationItem-root': {
                                                        color: vistelicaColors.primary,
                                                        '&.Mui-selected': {
                                                            backgroundColor: vistelicaColors.primary,
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: vistelicaColors.primaryDark
                                                            }
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 118, 253, 0.1)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </motion.div>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default ProductReviews;