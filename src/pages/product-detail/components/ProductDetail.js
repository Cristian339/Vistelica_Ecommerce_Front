"use client";

import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Box, Typography, Button, Chip,
    Divider, IconButton, Snackbar, Alert, CircularProgress,
    Paper, Tooltip
} from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart, Favorite, FavoriteBorder, Share,
    LocalShipping, Check, TouchApp
} from '@mui/icons-material';
import { vistelicaColors } from '@/components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";

// Importar componentes
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import productService from '@/services/productService';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import CompositionCare from './CompositionCare';
import ShippingInfo from './ShippingInfo';
import ProductReviews from './ProductReviews';
import PromotionBanner from './PromotionBanner';
import SocialShare from './SocialShare';
import ProductBreadcrumb from './ProductBreadcrumb';
import wishlistService from '@/services/wishlistService';
import { getToken } from '@/services/authService';
import { isInLocalWishlist, addToLocalWishlist2, removeFromLocalWishlist } from "@/utils/localStorageHelpers";

// Nuevos componentes modularizados
import SizeSelector from './SizeSelector';
import ColorSelector from './ColorSelector';
import QuantitySelector from './QuantitySelector';

const ProductDetail = ({
                           product,
                           availableSizes = [],
                           availableColors = [],
                           selectedSize,
                           selectedColor,
                           onSizeChange,
                           onColorChange,
                           onAddToCart,
                           addingToCart = false
                       }) => {
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [errorReviews, setErrorReviews] = useState(null);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const [errorMessage, setErrorMessage] = useState(null);
    const [highlightedSection, setHighlightedSection] = useState(null);
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    // Calculate prices correctly
    const hasDiscount = product?.discount_percentage && parseFloat(product.discount_percentage) > 0;
    const originalPrice = product?.price ? parseFloat(product.price) : 0;
    const discountedPrice = hasDiscount
        ? (originalPrice * (1 - parseFloat(product.discount_percentage) / 100)).toFixed(2)
        : originalPrice;
    const discountAmount = hasDiscount
        ? (originalPrice - parseFloat(discountedPrice)).toFixed(2)
        : 0;

    // Verificar si el producto está en la wishlist al cargar el componente
    useEffect(() => {
        let isMounted = true;
        const checkWishlistStatus = async () => {
            const token = getToken();

            if (!token) {
                // Para usuarios invitados: verificar localStorage
                const inWishlist = isInLocalWishlist(product.product_id);
                if (isMounted) setIsFavorite(inWishlist);
                setInitialized(true);
                return;
            }

            // Para usuarios registrados: verificar API
            try {
                setLoadingWishlist(true);
                const inWishlist = await wishlistService.checkProductInWishlist(product.product_id);

                if (inWishlist === null || inWishlist === undefined) {
                    const wishlist = await wishlistService.getWishlist();
                    const found = wishlist.some(item => item.product_id === product.product_id);
                    if (isMounted) setIsFavorite(found);
                } else {
                    if (isMounted) setIsFavorite(inWishlist);
                }
            } catch (error) {
                console.error('Error verificando wishlist:', error);
            } finally {
                if (isMounted) {
                    setLoadingWishlist(false);
                    setInitialized(true);
                }
            }
        };

        if (product?.product_id) {
            checkWishlistStatus();
        } else {
            setInitialized(true);
        }

        return () => {
            isMounted = false;
        };
    }, [product?.product_id]);

    // Cargar reseñas - FIXED: Moved fetchReviews inside useEffect
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoadingReviews(true);
                const reviewsData = await productService.getReviewsByProductId(product?.product_id);
                setReviews(reviewsData);
                setErrorReviews(null);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setErrorReviews(error.message || "Error al cargar las reseñas");
            } finally {
                setLoadingReviews(false);
            }
        };

        if (product?.product_id) {
            fetchReviews();
        }
    }, [product?.product_id]);

    // Handler para reseñas añadidas
    const handleReviewAdded = () => {
        // Trigger a re-fetch of reviews by updating the product_id dependency
        if (product?.product_id) {
            // Force re-fetch by temporarily changing loading state
            setLoadingReviews(true);
            productService.getReviewsByProductId(product.product_id)
                .then(reviewsData => {
                    setReviews(reviewsData);
                    setErrorReviews(null);
                })
                .catch(error => {
                    console.error("Error fetching reviews:", error);
                    setErrorReviews(error.message || "Error al cargar las reseñas");
                })
                .finally(() => {
                    setLoadingReviews(false);
                });
        }
    };

    const handleOpenModal = () => {
        const hasToken = getToken();
        if (!hasToken) {
            setToast({
                open: true,
                message: 'Debes iniciar sesión para dejar una reseña',
                severity: 'warning'
            });
            return;
        }
        // setOpenModal(true); // Uncomment if you have modal state
    };

    // Gestionar cambio de cantidad
    const handleQuantityChange = (change) => {
        const newQuantity = Math.max(1, quantity + change);
        setQuantity(newQuantity);
    };

    // Gestionar favoritos
    const handleFavoriteToggle = async () => {
        const token = getToken();
        if (!token) {
            setToast({
                open: true,
                message: 'Inicia sesión para guardar productos en favoritos',
                severity: 'warning'
            });
            // Para usuarios invitados: usar localStorage
            const newFavStatus = !isFavorite;
            setIsFavorite(newFavStatus);

            if (newFavStatus) {
                addToLocalWishlist2(product);
            } else {
                removeFromLocalWishlist(product.product_id);
            }
            return;
        }

        try {
            setLoadingWishlist(true);
            if (isFavorite) {
                await wishlistService.removeFromWishlist(product.product_id);
            } else {
                await wishlistService.addToWishlist(product.product_id);
            }
            setIsFavorite(!isFavorite);
            setToast({
                open: true,
                message: isFavorite
                    ? 'Producto eliminado de favoritos'
                    : 'Producto añadido a favoritos',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error actualizando wishlist:', error);
            setToast({
                open: true,
                message: 'Error al actualizar favoritos',
                severity: 'error'
            });
        } finally {
            setLoadingWishlist(false);
        }
    };

    // Añadir al carrito
    const handleAddToCart = async () => {
        if ((availableSizes?.length > 0 && !selectedSize) ||
            (availableColors?.length > 0 && !selectedColor)) {

            // Destacar secciones faltantes
            if (availableSizes?.length > 0 && !selectedSize) {
                setHighlightedSection('size');
            }
            if (availableColors?.length > 0 && !selectedColor) {
                setHighlightedSection('color');
            }

            setToast({
                open: true,
                message: 'Por favor selecciona talla y color',
                severity: 'warning'
            });
            return;
        }

        setErrorMessage(null);
        console.log("El numero " + quantity);
        try {
            await onAddToCart(quantity);
        } catch (error) {
            setErrorMessage('Error al añadir al carrito');
            console.error('Error adding to cart:', error);
        }
    };

    // Animaciones
    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const staggerItems = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemFade = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    const pulseAnimation = {
        scale: [1, 1.05, 1],
        boxShadow: [
            '0 0 0 0 rgba(0,0,0,0)',
            '0 0 0 10px rgba(255,122,122,0.2)',
            '0 0 0 0 rgba(0,0,0,0)'
        ],
        transition: { duration: 1.5, repeat: 2, repeatDelay: 0.5 }
    };

    // Reset highlighted section after animation
    useEffect(() => {
        if (highlightedSection) {
            const timer = setTimeout(() => {
                setHighlightedSection(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [highlightedSection]);

    if (!initialized) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <CircularProgress size={60} />
                </motion.div>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <ProductBreadcrumb product={product} />
            </motion.div>

            <Grid container spacing={4}>
                {/* Columna izquierda - Galería de imágenes y Envíos */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                    >
                        <ProductGallery productId={product?.product_id} />

                        {/* Sección de envíos y devoluciones debajo del carrusel */}
                        <Box sx={{ mt: 3 }}>
                            <ShippingInfo />
                        </Box>
                    </motion.div>
                </Grid>

                {/* Columna derecha - Información del producto */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerItems}
                    >
                        {/* Título y botones de acción */}
                        <motion.div variants={itemFade}>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: {xs: 'wrap', sm: 'nowrap'},
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: 2
                            }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontFamily: typography.fontFamily,
                                        fontWeight: 600,
                                        color: vistelicaColors.secondary,
                                        mr: 2,
                                        flexGrow: 1
                                    }}
                                >
                                    {product?.name || product?.product_name || 'Nombre del producto'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', mt: {xs: 1, sm: 0} }}>
                                    <motion.div
                                        initial={false}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <IconButton
                                            onClick={handleFavoriteToggle}
                                            disabled={loadingWishlist}
                                            title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                                            aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                                            sx={{
                                                color: isFavorite ? 'error.main' : 'grey.500',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(233, 30, 99, 0.08)'
                                                }
                                            }}
                                        >
                                            {loadingWishlist ? (
                                                <CircularProgress size={20} />
                                            ) : isFavorite ? (
                                                <FavoriteIcon />
                                            ) : (
                                                <FavoriteBorderIcon />
                                            )}
                                        </IconButton>
                                    </motion.div>
                                    <SocialShare product={product} />
                                </Box>
                            </Box>
                        </motion.div>

                        {/* Precio */}
                        <motion.div variants={itemFade}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                                <motion.div
                                    initial={false}
                                    animate={hasDiscount ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            color: hasDiscount ? 'error.main' : vistelicaColors.secondary,
                                            fontFamily: typography.fontFamily
                                        }}
                                    >
                                        {hasDiscount ? `${discountedPrice}€` : `${originalPrice}€`}
                                    </Typography>
                                </motion.div>

                                {hasDiscount && (
                                    <Box sx={{ml: 2, display: 'flex', flexDirection: 'column'}}>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                textDecoration: 'line-through',
                                                color: 'text.secondary',
                                                fontFamily: typography.fontFamily
                                            }}
                                        >
                                            {originalPrice}€
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'success.main',
                                                fontWeight: 600,
                                                fontFamily: typography.fontFamily
                                            }}
                                        >
                                            {product.discount_percentage}% dto.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </motion.div>

                        {/* Banner de promoción si hay descuento - CORREGIDO */}
                        {hasDiscount && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        bgcolor: 'error.light',
                                        color: 'error.contrastText',
                                        p: 1.5,
                                        borderRadius: 2,
                                        mb: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                        {product.discount_percentage}% OFF OFERTA Ahorra {discountAmount}€ en este producto
                                    </Typography>
                                </Paper>
                            </motion.div>
                        )}

                        {/* Selector de color - MODULARIZADO */}
                        <motion.div variants={itemFade}>
                            {availableColors?.length > 0 && (
                                <ColorSelector
                                    availableColors={availableColors}
                                    selectedColor={selectedColor}
                                    onColorChange={onColorChange}
                                    highlightedSection={highlightedSection === 'color'}
                                    pulseAnimation={pulseAnimation}
                                />
                            )}
                        </motion.div>

                        {/* Selector de talla - MODULARIZADO */}
                        <motion.div variants={itemFade}>
                            {availableSizes?.length > 0 && (
                                <SizeSelector
                                    availableSizes={availableSizes}
                                    selectedSize={selectedSize}
                                    onSizeChange={onSizeChange}
                                    showSizeGuide={showSizeGuide}
                                    setShowSizeGuide={setShowSizeGuide}
                                    highlightedSection={highlightedSection === 'size'}
                                    pulseAnimation={pulseAnimation}
                                />
                            )}
                        </motion.div>

                        <AnimatePresence>
                            {errorMessage && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {errorMessage}
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Selector de cantidad - MODULARIZADO */}
                        <motion.div variants={itemFade}>
                            <Box sx={{ my: 3 }}>
                                <QuantitySelector
                                    quantity={quantity}
                                    onQuantityChange={handleQuantityChange}
                                />
                            </Box>
                        </motion.div>

                        <Divider sx={{ my: 3 }} />

                        {/* Botón añadir al carrito */}
                        <motion.div
                            variants={itemFade}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                        >
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                startIcon={addingToCart ? <CircularProgress size={20} color="inherit" /> : <ShoppingCart />}
                                sx={{
                                    py: 1.8,
                                    backgroundColor: vistelicaColors.primary,
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    '&:hover': {
                                        backgroundColor: `${vistelicaColors.primaryDark}`
                                    },
                                    '&:active': {
                                        transform: 'scale(0.98)'
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {addingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
                            </Button>
                        </motion.div>

                        {/* Información de envío premium */}
                        <motion.div
                            variants={itemFade}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mt: 2,
                                color: vistelicaColors.success,
                                p: 1
                            }}>
                                <motion.div
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                                >
                                    <LocalShipping sx={{ mr: 1, color: vistelicaColors.success }} />
                                </motion.div>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Envío gratis en 24-48h
                                </Typography>
                            </Box>
                        </motion.div>

                        {/* Información adicional - sin ShippingInfo */}
                        <motion.div variants={itemFade}>
                            <Box sx={{ mt: 3 }}>
                                <ProductInfo product={product || 'Descripción no disponible'} />
                                <CompositionCare composition={product?.composition || '100% Algodón'} />
                            </Box>
                        </motion.div>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Opiniones del producto */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
            >
                <Box sx={{ mt: 6, mb: 4 }}>
                    <ProductReviews
                        productId={product?.product_id}
                        reviews={reviews}
                        onReviewAdded={handleReviewAdded}
                        loading={loadingReviews}
                        error={errorReviews}
                    />
                </Box>
            </motion.div>

            {/* Toast de notificaciones */}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setToast({ ...toast, open: false })}
                    severity={toast.severity}
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProductDetail;