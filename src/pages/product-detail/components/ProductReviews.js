"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Typography,
    Rating,
    Button,
    Card,
    CardContent,
    Avatar,
    Chip,
    LinearProgress,
    Modal,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    Grid,
    Paper,
    Divider,
    IconButton,
    Fade,
    Grow,
    CircularProgress,
    Stack,
    useTheme,
    useMediaQuery,
    Menu,
    MenuItem,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Edit as EditIcon,
    Close as CloseIcon,
    Star as StarIcon,
    FilterList as FilterIcon,
    RateReview as ReviewIcon,
    MoreVert as MoreVertIcon,
    Flag as FlagIcon,
    Warning as WarningIcon,
    Block as BlockIcon,
    Report as ReportIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from "framer-motion";
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import productService from '@/services/productService';
import { getCurrentUser } from "@/services/authService";
import cartService from '@/services/cartService';

// Enum para las razones de reporte (debe coincidir con el backend)

const ReportReason = {
    IRRELEVANT: "No tiene que ver con el tema",
    INAPPROPRIATE: "Inapropiada",
    FALSE: "Falsa",
    OTHER: "Otro"
};
const ProductReviews = ({ reviews = [], productId, onReviewAdded }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Estados principales
    const [openModal, setOpenModal] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Estados para compra y autenticación
    const [hasPurchasedProduct, setHasPurchasedProduct] = useState(false);
    const [loadingPurchaseStatus, setLoadingPurchaseStatus] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Estados para reportes
    const [reportModal, setReportModal] = useState({
        open: false,
        reviewId: null,
        selectedReason: '',
        otherReasonText: '',
        submitting: false
    });
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedReviewForMenu, setSelectedReviewForMenu] = useState(null);

    // Estado para snackbar
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const reviewsPerPage = 10;
    const hasToken = typeof window !== 'undefined' && localStorage.getItem('token');

    // Verificar estado de entrega del producto y obtener usuario actual
    useEffect(() => {
        const checkProductDelivery = async () => {
            if (!hasToken) {
                setLoadingPurchaseStatus(false);
                return;
            }

            try {
                const [deliveredProducts, user] = await Promise.all([
                    cartService.getDeliveredProductsIds(),
                    getCurrentUser()
                ]);

                setHasPurchasedProduct(deliveredProducts.includes(Number(productId)));
                setCurrentUser(user);
            } catch (error) {
                console.error("Error verificando entrega:", error);
                setHasPurchasedProduct(false);
            } finally {
                setLoadingPurchaseStatus(false);
            }
        };

        checkProductDelivery();
    }, [productId, hasToken]);

    // Memoizar las estadísticas de calificaciones
    const ratingStats = useMemo(() => {
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
    }, [reviews]);

    // Memoizar reseñas filtradas
    const filteredReviews = useMemo(() => {
        if (selectedFilter === 'all') {
            return reviews;
        }
        const starValue = parseInt(selectedFilter);
        return reviews.filter(review => Math.round(review.rating) === starValue);
    }, [reviews, selectedFilter]);

    // Reiniciar página al cambiar filtro
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFilter]);

    // Funciones de manejo de eventos
    const handleOpenModal = useCallback(() => {
        if (!hasToken) {
            setSnackbar({
                open: true,
                message: 'Debes iniciar sesión para dejar una reseña',
                severity: 'warning'
            });
            return;
        }

        if (!hasPurchasedProduct) {
            setSnackbar({
                open: true,
                message: 'Debes haber recibido este producto para dejar una reseña',
                severity: 'warning'
            });
            return;
        }

        setOpenModal(true);
    }, [hasToken, hasPurchasedProduct]);

    const handleCloseModal = useCallback(() => {
        setOpenModal(false);
        setReviewText('');
        setRating(0);
    }, []);

    const handleSubmitReview = useCallback(async () => {
        if (!rating || !reviewText.trim()) {
            setSnackbar({
                open: true,
                message: 'Por favor, completa todos los campos',
                severity: 'warning'
            });
            return;
        }

        setSubmitting(true);
        try {
            const user = await getCurrentUser();
            await productService.createProductReview(productId, rating, reviewText.trim(), user.user_id);

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
    }, [rating, reviewText, productId, onReviewAdded, handleCloseModal]);

    // Funciones para reportes
    const handleMenuOpen = useCallback((event, review) => {
        if (!hasToken) {
            setSnackbar({
                open: true,
                message: 'Debes iniciar sesión para reportar una reseña',
                severity: 'warning'
            });
            return;
        }

        setMenuAnchor(event.currentTarget);
        setSelectedReviewForMenu(review);
    }, [hasToken]);

    const handleMenuClose = useCallback(() => {
        setMenuAnchor(null);
        setSelectedReviewForMenu(null);
    }, []);

    const handleOpenReportModal = useCallback(() => {
        setReportModal({
            open: true,
            reviewId: selectedReviewForMenu?.review_id,
            selectedReason: '',
            otherReasonText: '',
            submitting: false
        });
        handleMenuClose();
    }, [selectedReviewForMenu, handleMenuClose]);

    const handleCloseReportModal = useCallback(() => {
        setReportModal({
            open: false,
            reviewId: null,
            selectedReason: '',
            otherReasonText: '',
            submitting: false
        });
    }, []);

    const handleReportSubmit = useCallback(async () => {
        if (!reportModal.selectedReason) {
            setSnackbar({
                open: true,
                message: 'Por favor, selecciona una razón para el reporte',
                severity: 'warning'
            });
            return;
        }

        if (reportModal.selectedReason === 'Otro' && !reportModal.otherReasonText.trim()) {
            setSnackbar({
                open: true,
                message: 'Por favor, especifica la razón del reporte',
                severity: 'warning'
            });
            return;
        }

        setReportModal(prev => ({ ...prev, submitting: true }));

        try {
            const reportData = {
                reviewId: reportModal.reviewId,
                reason: reportModal.selectedReason, // debe ser "Inapropiada", "Falsa", etc.
                other_reason_text:
                    reportModal.selectedReason === 'Otro'
                        ? reportModal.otherReasonText.trim()
                        : ""
            };

            await productService.reportReview(reportData);

            setSnackbar({
                open: true,
                message: 'Reporte enviado correctamente. Gracias por ayudarnos a mantener la calidad del contenido.',
                severity: 'success'
            });

            handleCloseReportModal();
        } catch (error) {
            console.error('Error al enviar el reporte:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Error al enviar el reporte. Inténtalo de nuevo.',
                severity: 'error'
            });
        } finally {
            setReportModal(prev => ({ ...prev, submitting: false }));
        }
    }, [reportModal]);

    const handleCloseSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    const handleFilterClick = useCallback((filterValue) => {
        setSelectedFilter(filterValue);
    }, []);

    const formatDate = useCallback((dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }, []);

    const renderReviewButton = useCallback((isFirstReview = false) => {
        if (loadingPurchaseStatus) {
            return (
                <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={20} />
                    <Typography variant="body2">Cargando...</Typography>
                </Box>
            );
        }

        const buttonText = hasPurchasedProduct
            ? (isFirstReview ? 'Sé el primero en opinar' : 'Escribir opinión')
            : 'Compra el producto para opinar';

        const isDisabled = !hasPurchasedProduct || !hasToken;

        return (
            <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleOpenModal}
                disabled={isDisabled}
                fullWidth={isMobile}
                sx={{
                    backgroundColor: vistelicaColors.primary,
                    '&:hover': {
                        backgroundColor: vistelicaColors.primaryDark,
                    },
                    '&.Mui-disabled': {
                        backgroundColor: '#e0e0e0',
                        color: '#9e9e9e',
                    }
                }}
                title={!hasPurchasedProduct ? "Debes haber recibido este producto para dejar una reseña" : ""}
            >
                {buttonText}
            </Button>
        );
    }, [loadingPurchaseStatus, hasPurchasedProduct, hasToken, handleOpenModal, isMobile]);

    // Función para verificar si el usuario puede reportar una reseña
    const canReportReview = useCallback((review) => {
        // Solo usuarios autenticados pueden reportar
        if (!hasToken || !currentUser) return false;

        // Los usuarios no pueden reportar sus propias reseñas
        return review.user?.user_id !== currentUser.user_id;
    }, [hasToken, currentUser]);

    // Componente de reseña individual
    const ReviewCard = React.memo(({ review, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Card
                elevation={1}
                sx={{
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        elevation: 4,
                        transform: 'translateY(-2px)',
                    }
                }}
            >
                <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Avatar
                            sx={{
                                bgcolor: vistelicaColors.primary,
                                width: 40,
                                height: 40,
                                mr: 2
                            }}
                        >
                            {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                        <Box flex={1}>
                            <Typography variant="subtitle2" fontWeight={600}>
                                {review.user?.name || 'Usuario anónimo'}
                            </Typography>
                            <Rating value={review.rating} size="small" readOnly />
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="caption" color="text.secondary">
                                {formatDate(review.created_at)}
                            </Typography>
                            {canReportReview(review) && (
                                <Button
                                    size="small"
                                    startIcon={<FlagIcon fontSize="small" />}
                                    onClick={() => handleOpenReportModal(review)}
                                    sx={{
                                        color: 'text.secondary',
                                        minWidth: 'auto',
                                        px: 1,
                                        fontSize: '0.75rem',
                                        '&:hover': {
                                            color: 'warning.main',
                                            backgroundColor: 'rgba(255, 193, 7, 0.1)'
                                        }
                                    }}
                                >
                                    Reportar
                                </Button>
                            )}
                        </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.5 }}>
                        {review.review_text}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    ));

    return (
        <Box sx={{ mt: 4 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight={600} color={vistelicaColors.secondary}>
                    Opiniones de clientes
                </Typography>
                {reviews.length > 0 && (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Rating value={ratingStats.average} size="small" readOnly />
                        <Typography variant="body2" color={vistelicaColors.primary} fontWeight={500}>
                            ({ratingStats.totalRatings})
                        </Typography>
                    </Box>
                )}
            </Box>

            {reviews.length > 0 ? (
                <Grid container spacing={3}>
                    {/* Sidebar con estadísticas */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                                position: isMobile ? 'static' : 'sticky',
                                top: 20
                            }}
                        >
                            {/* Resumen de calificación */}
                            <Box textAlign="center" mb={3}>
                                <Typography variant="h3" fontWeight={700} color={vistelicaColors.secondary}>
                                    {ratingStats.average.toFixed(1)}
                                </Typography>
                                <Rating value={ratingStats.average} size="large" readOnly />
                                <Typography variant="body1" color={vistelicaColors.primary} fontWeight={500} mt={1}>
                                    {ratingStats.totalRatings} valoraciones
                                </Typography>
                            </Box>

                            {/* Desglose de calificaciones */}
                            <Box mb={3}>
                                {ratingStats.breakdown.map((item) => (
                                    <Box
                                        key={item.stars}
                                        display="flex"
                                        alignItems="center"
                                        mb={1}
                                        sx={{
                                            cursor: item.count > 0 ? 'pointer' : 'default',
                                            p: 1,
                                            borderRadius: 1,
                                            '&:hover': item.count > 0 ? {
                                                backgroundColor: 'rgba(0, 118, 253, 0.05)',
                                            } : {}
                                        }}
                                        onClick={() => item.count > 0 && handleFilterClick(item.stars.toString())}
                                    >
                                        <Box display="flex" alignItems="center" minWidth={50}>
                                            <Typography variant="body2" fontWeight={600}>
                                                {item.stars}
                                            </Typography>
                                            <StarIcon sx={{ fontSize: 16, ml: 0.5 }} />
                                        </Box>
                                        <Box flex={1} mx={2}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={item.percentage}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: '#eaeaea',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: vistelicaColors.primary,
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="caption" color={vistelicaColors.primary} fontWeight={500}>
                                            {item.count} ({item.percentage}%)
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            {renderReviewButton()}
                        </Paper>
                    </Grid>

                    {/* Área principal con reseñas */}
                    <Grid item xs={12} md={8}>
                        {/* Filtros */}
                        <Box mb={3}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <FilterIcon sx={{ mr: 1 }} />
                                <Typography variant="subtitle2" fontWeight={600} color={vistelicaColors.secondary}>
                                    Filtrar por valoración:
                                </Typography>
                            </Box>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                <Chip
                                    label={`Todas (${reviews.length})`}
                                    onClick={() => handleFilterClick('all')}
                                    sx={{
                                        backgroundColor: selectedFilter === 'all' ? vistelicaColors.primary : 'transparent',
                                        color: selectedFilter === 'all' ? '#fff' : vistelicaColors.primary,
                                        borderColor: vistelicaColors.primary,
                                        border: `1px solid ${vistelicaColors.primary}`,
                                        fontWeight: selectedFilter === 'all' ? 600 : 400,
                                        '&:hover': {
                                            backgroundColor: selectedFilter === 'all' ? vistelicaColors.primaryDark : vistelicaColors.primaryLight,
                                            color: selectedFilter === 'all' ? '#fff' : vistelicaColors.primaryDark,
                                        }
                                    }}
                                />
                                {ratingStats.breakdown.map((item) => (
                                    item.count > 0 && (
                                        <Chip
                                            key={item.stars}
                                            label={`${item.stars} ★ (${item.count})`}
                                            onClick={() => handleFilterClick(item.stars.toString())}
                                            sx={{
                                                backgroundColor: selectedFilter === item.stars.toString() ? vistelicaColors.primary : 'transparent',
                                                color: selectedFilter === item.stars.toString() ? '#fff' : vistelicaColors.primary,
                                                borderColor: vistelicaColors.primary,
                                                border: `1px solid ${vistelicaColors.primary}`,
                                                fontWeight: selectedFilter === item.stars.toString() ? 600 : 400,
                                                '&:hover': {
                                                    backgroundColor: selectedFilter === item.stars.toString() ? vistelicaColors.primaryDark : vistelicaColors.primaryLight,
                                                    color: selectedFilter === item.stars.toString() ? '#fff' : vistelicaColors.primaryDark,
                                                }
                                            }}
                                        />
                                    )
                                ))}
                            </Box>
                        </Box>

                        {/* Lista de reseñas */}
                        <AnimatePresence mode="wait">
                            {filteredReviews.length > 0 ? (
                                <Box key="reviews-list">
                                    {filteredReviews.slice(0, showAllReviews ? filteredReviews.length : 5).map((review, index) => (
                                        <ReviewCard key={review.review_id || index} review={review} index={index} />
                                    ))}
                                    {filteredReviews.length > 5 && !showAllReviews && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <Box display="flex" justifyContent="center" mt={2}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => setShowAllReviews(true)}
                                                    sx={{
                                                        borderColor: vistelicaColors.primary,
                                                        color: vistelicaColors.primary,
                                                        '&:hover': {
                                                            borderColor: vistelicaColors.primaryDark,
                                                            backgroundColor: 'rgba(0, 118, 253, 0.05)',
                                                        }
                                                    }}
                                                >
                                                    Ver todas las reseñas ({filteredReviews.length})
                                                </Button>
                                            </Box>
                                        </motion.div>
                                    )}
                                </Box>
                            ) : (
                                <motion.div
                                    key="empty-state"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Paper
                                        sx={{
                                            p: 4,
                                            textAlign: 'center',
                                            border: '2px dashed #dee2e6',
                                            backgroundColor: 'transparent'
                                        }}
                                    >
                                        <Typography variant="h6" color="text.secondary" mb={1}>
                                            {selectedFilter === 'all'
                                                ? 'Sin opiniones aún'
                                                : `No hay opiniones de ${selectedFilter} estrella${selectedFilter === '1' ? '' : 's'}`
                                            }
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" mb={2}>
                                            {selectedFilter === 'all'
                                                ? 'Sé el primero en dejar tu opinión'
                                                : 'Prueba con otro filtro o deja tu propia opinión'
                                            }
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Grid>
                </Grid>
            ) : (
                <Paper
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '2px dashed #dee2e6',
                        backgroundColor: 'transparent'
                    }}
                >
                    <ReviewIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" mb={1}>
                        Este producto aún no tiene opiniones
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Sé el primero en compartir tu experiencia
                    </Typography>
                    {renderReviewButton(true)}
                </Paper>
            )}

            {/* Menu contextual para reportar */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleOpenReportModal}>
                    <ListItemIcon>
                        <FlagIcon fontSize="small" color="warning" />
                    </ListItemIcon>
                    <ListItemText primary="Reportar reseña" />
                </MenuItem>
            </Menu>

            {/* Modal para escribir reseña */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
                TransitionComponent={Fade}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight={600} color={vistelicaColors.secondary}>
                        Escribe tu opinión
                    </Typography>
                    <IconButton onClick={handleCloseModal} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="body2" fontWeight={500} mb={1}>
                                ¿Cómo valorarías este producto?
                            </Typography>
                            <Rating
                                value={rating}
                                onChange={(event, newValue) => setRating(newValue)}
                                size="large"
                                sx={{ mb: 1 }}
                            />
                            {rating === 0 && (
                                <Typography variant="caption" color="error">
                                    Por favor, selecciona una valoración
                                </Typography>
                            )}
                        </Box>
                        <Box>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Tu opinión"
                                placeholder="¿Qué te ha parecido este producto? ¿Recomendarías su compra?"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                inputProps={{ maxLength: 1000 }}
                                helperText={`${reviewText.length}/1000 caracteres`}
                                error={!reviewText.trim() && reviewText.length > 0}
                            />
                            {!reviewText.trim() && reviewText.length > 0 && (
                                <Typography variant="caption" color="error">
                                    Por favor, escribe tu opinión
                                </Typography>
                            )}
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={handleCloseModal} variant="outlined">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmitReview}
                        variant="contained"
                        disabled={!rating || !reviewText.trim() || submitting}
                        sx={{
                            backgroundColor: vistelicaColors.primary,
                            '&:hover': {
                                backgroundColor: vistelicaColors.primaryDark,
                            }
                        }}
                    >
                        {submitting ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                Enviando...
                            </>
                        ) : (
                            'Publicar reseña'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal para reportar reseña */}
            <Dialog
                open={reportModal.open}
                onClose={handleCloseReportModal}
                maxWidth="sm"
                fullWidth
                TransitionComponent={Fade}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <ReportIcon color="warning" />
                        <Typography variant="h6" fontWeight={600} color={vistelicaColors.secondary}>
                            Reportar reseña
                        </Typography>
                    </Box>
                    <IconButton onClick={handleCloseReportModal} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="body2" mb={2} color="text.secondary">
                                ¿Por qué razón deseas reportar esta reseña? Tu reporte nos ayuda a mantener la calidad del contenido.
                            </Typography>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    value={reportModal.selectedReason}
                                    onChange={(e) => setReportModal(prev => ({
                                        ...prev,
                                        selectedReason: e.target.value
                                    }))}
                                >
                                    {Object.entries(ReportReason).map(([key, value]) => (
                                        <FormControlLabel
                                            key={key}
                                            value={value}
                                            control={<Radio size="small" />}
                                            label={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    {value === 'Inapropiada' && <WarningIcon fontSize="small" color="error" />}
                                                    {value === 'Falsa' && <BlockIcon fontSize="small" color="error" />}
                                                    {value === 'No tiene que ver con el tema' && <FlagIcon fontSize="small" color="warning" />}
                                                    {value === 'Otro' && <ReportIcon fontSize="small" color="action" />}
                                                    <Typography variant="body2">{value}</Typography>
                                                </Box>
                                            }
                                            sx={{ mb: 1 }}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Box>

                        {reportModal.selectedReason === 'Otro' && (
                            <Box>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Especifica la razón"
                                    placeholder="Por favor, describe el motivo del reporte..."
                                    value={reportModal.otherReasonText}
                                    onChange={(e) => setReportModal(prev => ({
                                        ...prev,
                                        otherReasonText: e.target.value
                                    }))}
                                    inputProps={{ maxLength: 500 }}
                                    helperText={`${reportModal.otherReasonText.length}/500 caracteres`}
                                    error={reportModal.selectedReason === 'Otro' && !reportModal.otherReasonText.trim()}
                                />
                            </Box>
                        )}

                        <Box
                            sx={{
                                p: 2,
                                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                borderRadius: 1,
                                border: '1px solid rgba(255, 193, 7, 0.3)'
                            }}
                        >
                            <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={1}>
                                <WarningIcon fontSize="small" color="warning" />
                                Los reportes falsos o malintencionados pueden resultar en la suspensión de tu cuenta.
                            </Typography>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={handleCloseReportModal} variant="outlined">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleReportSubmit}
                        variant="contained"
                        color="warning"
                        disabled={
                            !reportModal.selectedReason ||
                            (reportModal.selectedReason === 'Otro' && !reportModal.otherReasonText.trim()) ||
                            reportModal.submitting
                        }
                        startIcon={reportModal.submitting ? <CircularProgress size={16} /> : <FlagIcon />}
                    >
                        {reportModal.submitting ? 'Enviando...' : 'Enviar reporte'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={Grow}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// Agregar displayName para debugging
ProductReviews.displayName = 'ProductReviews';

export default ProductReviews;