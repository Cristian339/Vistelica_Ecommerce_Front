"use client";

import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Box, Typography, Button, Chip,
    Divider, IconButton, Snackbar, Alert, CircularProgress,
    Paper, Tooltip
} from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart, Favorite, FavoriteBorder, Add, Remove, Share,
    LocalShipping, Check, TouchApp
} from '@mui/icons-material';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import productService from '@/services/productService';
import wishlistService from '@/services/wishlistService';
import { getToken } from '@/services/authService';

// Importar componentes
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import CompositionCare from './CompositionCare';
import ShippingInfo from './ShippingInfo';
import ProductReviews from './ProductReviews';
import PromotionBanner from './PromotionBanner';
import SocialShare from './SocialShare';
import ProductBreadcrumb from './ProductBreadcrumb';

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

    // Cargar reseñas
    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const reviewsData = await productService.getReviewsByProductId(product?.product_id);
            setReviews(reviewsData);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setErrorReviews(error.message || "Error al cargar las reseñas");
        } finally {
            setLoadingReviews(false);
        }
    };

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

    const handleReviewAdded = () => {
        fetchReviews();
    };

    useEffect(() => {
        if (product?.product_id) {
            fetchReviews();
        }
    }, [product?.product_id]);

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
        try {
            await onAddToCart({
                productId: product.product_id,
                quantity: quantity,
                price: parseFloat(hasDiscount ? discountedPrice : originalPrice),
                size: selectedSize,
                color: selectedColor,
                discount_percentage: hasDiscount ? parseFloat(product.discount_percentage) : null
            });
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
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <ProductBreadcrumb product={product} />
            </motion.div>

            <Grid container spacing={4}>
                {/* Columna izquierda - Galería de imágenes */}
                <Grid item xs={12} md={7}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                    >
                        <ProductGallery productId={product?.product_id} />
                    </motion.div>
                </Grid>

                {/* Columna derecha - Información del producto */}
                <Grid item xs={12} md={5}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerItems}
                    >
                        {/* Título del producto y acciones */}
                        <motion.div variants={itemFade}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 600,
                                        fontFamily: typography.fontFamily,
                                        color: vistelicaColors.secondary
                                    }}
                                >
                                    {product?.name || product?.product_name || 'Nombre del producto'}
                                </Typography>
                                <Box>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <IconButton
                                            onClick={handleFavoriteToggle}
                                            disabled={loadingWishlist}
                                            sx={{
                                                color: isFavorite ? vistelicaColors.error : 'text.secondary',
                                                '&:hover': {
                                                    color: isFavorite ? 'darkred' : vistelicaColors.primary
                                                }
                                            }}
                                        >
                                            {loadingWishlist ? (
                                                <CircularProgress size={24} />
                                            ) : isFavorite ? (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                                >
                                                    <Favorite />
                                                </motion.div>
                                            ) : (
                                                <FavoriteBorder />
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
                                        variant="h4"
                                        sx={{
                                            fontWeight: 600,
                                            color: vistelicaColors.secondary,
                                            fontFamily: typography.fontFamily
                                        }}
                                    >
                                        {hasDiscount ?
                                            `${parseFloat(discountedPrice).toFixed(2)}€` :
                                            `${originalPrice.toFixed(2)}€`
                                        }
                                    </Typography>
                                </motion.div>

                                {hasDiscount && (
                                    <Box sx={{ml: 2, display: 'flex', flexDirection: 'column'}}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                textDecoration: 'line-through',
                                                color: 'text.secondary',
                                                fontWeight: 400
                                            }}
                                        >
                                            {originalPrice.toFixed(2)}€
                                        </Typography>
                                        <motion.div
                                            animate={{ rotate: [0, -5, 0, 5, 0] }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        >
                                            <Chip
                                                label={`-${product.discount_percentage}%`}
                                                size="small"
                                                sx={{
                                                    bgcolor: vistelicaColors.error,
                                                    color: 'white',
                                                    fontSize: '0.75rem',
                                                    height: 24
                                                }}
                                            />
                                        </motion.div>
                                    </Box>
                                )}
                            </Box>
                        </motion.div>

                        {/* Banner de promoción si hay descuento */}
                        <AnimatePresence>
                            {hasDiscount && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    variants={itemFade}
                                >
                                    <PromotionBanner
                                        price={`¡Ahorras ${discountAmount}€!`}
                                        offer="Oferta por tiempo limitado"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Selector de color mejorado */}
                        <motion.div variants={itemFade}>
                            {availableColors?.length > 0 && (
                                <motion.div
                                    animate={highlightedSection === 'color' ? pulseAnimation : {}}
                                >
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            my: 3,
                                            p: 2.5,
                                            borderRadius: '12px',
                                            background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {/* Decoración de fondo */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: '80px',
                                                height: '80px',
                                                background: `linear-gradient(225deg, ${vistelicaColors.primary}15, transparent)`,
                                                borderRadius: '0 0 0 100%',
                                                zIndex: 0
                                            }}
                                        />

                                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    mb: 1.5,
                                                    fontFamily: typography.fontFamily,
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    color: vistelicaColors.secondary
                                                }}
                                            >
                                                <motion.div
                                                    initial={{ scale: 1 }}
                                                    animate={{ scale: [1, 1.15, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
                                                    style={{ display: 'inline-flex', marginRight: '8px' }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: '50%',
                                                            background: 'conic-gradient(from 0deg, red, orange, yellow, green, blue, indigo, violet, red)',
                                                            mr: 1.5
                                                        }}
                                                    />
                                                </motion.div>
                                                Color: {selectedColor ? (
                                                <Chip
                                                    label={availableColors.find(c => c.code === selectedColor || c.value === selectedColor || c === selectedColor)?.name || selectedColor}
                                                    size="small"
                                                    sx={{
                                                        ml: 1,
                                                        backgroundColor: selectedColor === 'white' || selectedColor === '#FFFFFF' ? '#f0f0f0' : selectedColor,
                                                        color: selectedColor === 'white' || selectedColor === '#FFFFFF' ||
                                                        selectedColor === 'yellow' || selectedColor === '#FFFF00' ? 'black' : 'white',
                                                        fontWeight: 500,
                                                        px: 1
                                                    }}
                                                />
                                            ) : (
                                                <Typography component="span" sx={{ color: 'text.secondary', ml: 0.5, fontWeight: 400 }}>
                                                    Seleccionar
                                                </Typography>
                                            )}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 1.5,
                                                    flexWrap: 'wrap',
                                                    mt: 2
                                                }}
                                            >
                                                {availableColors.map((color, index) => {
                                                    // Manejar diferentes estructuras de datos de color
                                                    const colorCode = typeof color === 'object'
                                                        ? (color.code || color.value || color.color || color.hex || '#cccccc')
                                                        : color;
                                                    const colorName = typeof color === 'object' ? (color.name || colorCode) : colorCode;
                                                    const isSelected = colorCode === selectedColor || color === selectedColor;

                                                    const isLight = colorCode === 'white' || colorCode === '#FFFFFF' ||
                                                        colorCode === 'yellow' || colorCode === '#FFFF00';

                                                    return (
                                                        <Tooltip title={colorName} arrow key={index}>
                                                            <motion.div
                                                                whileHover={{
                                                                    scale: 1.15,
                                                                    y: -5,
                                                                    boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                                                                }}
                                                                whileTap={{ scale: 0.9 }}
                                                                initial={{ opacity: 0, scale: 0.5 }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    scale: 1,
                                                                    rotate: isSelected ? [0, 10, -10, 0] : 0
                                                                }}
                                                                transition={{
                                                                    delay: index * 0.07,
                                                                    duration: 0.25,
                                                                    rotate: { duration: 0.5, ease: "easeInOut" }
                                                                }}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    position: 'relative',
                                                                    zIndex: isSelected ? 2 : 1
                                                                }}
                                                            >
                                                                <Box
                                                                    onClick={() => onColorChange(colorCode)}
                                                                    sx={{
                                                                        width: 46,
                                                                        height: 46,
                                                                        borderRadius: '50%',
                                                                        backgroundColor: colorCode,
                                                                        border: `2px solid ${isSelected ? vistelicaColors.primary : 'transparent'}`,
                                                                        outline: isSelected ? `2px solid ${vistelicaColors.primary}` : 'none',
                                                                        outlineOffset: 3,
                                                                        boxShadow: isSelected
                                                                            ? '0 0 0 2px white, 0 0 15px rgba(0,0,0,0.2)'
                                                                            : '0 3px 6px rgba(0,0,0,0.1)',
                                                                        transition: 'all 0.3s ease',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        position: 'relative'
                                                                    }}
                                                                >
                                                                    {isSelected && (
                                                                        <motion.div
                                                                            initial={{ scale: 0, opacity: 0 }}
                                                                            animate={{ scale: 1, opacity: 1 }}
                                                                            transition={{ duration: 0.3 }}
                                                                        >
                                                                            <Check
                                                                                sx={{
                                                                                    color: isLight ? 'black' : 'white',
                                                                                    fontSize: '1.5rem'
                                                                                }}
                                                                            />
                                                                        </motion.div>
                                                                    )}
                                                                </Box>
                                                            </motion.div>
                                                        </Tooltip>
                                                    );
                                                })}
                                            </Box>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Selector de talla mejorado */}
                        <motion.div variants={itemFade}>
                            {availableSizes?.length > 0 && (
                                <motion.div
                                    animate={highlightedSection === 'size' ? pulseAnimation : {}}
                                >
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            my: 3,
                                            p: 2.5,
                                            borderRadius: '12px',
                                            background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {/* Decoración de fondo */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width: '80px',
                                                height: '80px',
                                                background: `linear-gradient(45deg, ${vistelicaColors.primary}15, transparent)`,
                                                borderRadius: '0 100% 0 0',
                                                zIndex: 0
                                            }}
                                        />

                                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontFamily: typography.fontFamily,
                                                        fontWeight: 600,
                                                        color: vistelicaColors.secondary,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <motion.div
                                                        animate={{ scale: [1, 1.1, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                                        style={{ display: 'inline-flex', marginRight: '8px' }}
                                                    >
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                mr: 1,
                                                                p: 0.5,
                                                                border: `1px solid ${vistelicaColors.primary}30`,
                                                                borderRadius: '4px'
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    fontSize: '0.9rem',
                                                                    color: vistelicaColors.primary
                                                                }}
                                                            >
                                                                S-XL
                                                            </Typography>
                                                        </Box>
                                                    </motion.div>

                                                    Talla: {selectedSize ? (
                                                    <Typography
                                                        component="span"
                                                        sx={{
                                                            fontWeight: 700,
                                                            ml: 1,
                                                            color: vistelicaColors.primary
                                                        }}
                                                    >
                                                        {selectedSize}
                                                    </Typography>
                                                ) : (
                                                    <Typography component="span" sx={{ color: 'text.secondary', ml: 0.5, fontWeight: 400 }}>
                                                        Seleccionar
                                                    </Typography>
                                                )}
                                                </Typography>

                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    onClick={() => setShowSizeGuide(true)}
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 500,
                                                        color: vistelicaColors.primary
                                                    }}
                                                >
                                                    Guía de tallas
                                                </Button>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 1.2,
                                                    mt: 2
                                                }}
                                            >
                                                {availableSizes.map((size, index) => {
                                                    const sizeName = typeof size === 'object' ? size.name : size;
                                                    const isOutOfStock = typeof size === 'object' ? !size.stock || size.stock <= 0 : false;
                                                    const isSelected = sizeName === selectedSize;

                                                    return (
                                                        <motion.div
                                                            key={sizeName}
                                                            whileHover={{
                                                                scale: isOutOfStock ? 1 : 1.08,
                                                                y: isOutOfStock ? 0 : -3,
                                                                boxShadow: isOutOfStock ? 'none' : '0 6px 12px rgba(0,0,0,0.1)'
                                                            }}
                                                            whileTap={{ scale: isOutOfStock ? 1 : 0.95 }}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{
                                                                delay: index * 0.05,
                                                                duration: 0.25,
                                                                type: "spring",
                                                                stiffness: 300
                                                            }}
                                                        >
                                                            <Paper
                                                                elevation={isSelected ? 4 : 1}
                                                                onClick={() => !isOutOfStock && onSizeChange(sizeName)}
                                                                sx={{
                                                                    width: 46,
                                                                    height: 46,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                                                    borderRadius: '12px',
                                                                    backgroundColor: isSelected
                                                                        ? vistelicaColors.primary
                                                                        : isOutOfStock
                                                                            ? '#f5f5f5'
                                                                            : 'white',
                                                                    border: isSelected
                                                                        ? 'none'
                                                                        : `1px solid ${isOutOfStock ? '#e0e0e0' : '#d0d0d0'}`,
                                                                    color: isSelected
                                                                        ? 'white'
                                                                        : isOutOfStock
                                                                            ? '#aaa'
                                                                            : vistelicaColors.secondary,
                                                                    fontWeight: isSelected ? 600 : 500,
                                                                    fontSize: '0.9rem',
                                                                    position: 'relative',
                                                                    overflow: 'hidden',
                                                                    transition: 'all 0.3s ease'
                                                                }}
                                                            >
                                                                {isSelected && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            background: `radial-gradient(circle, ${vistelicaColors.primary} 0%, ${vistelicaColors.primaryDark} 100%)`,
                                                                            zIndex: 0
                                                                        }}
                                                                    />
                                                                )}

                                                                <Typography
                                                                    sx={{
                                                                        fontWeight: isSelected ? 600 : 500,
                                                                        position: 'relative',
                                                                        zIndex: 1,
                                                                        fontSize: '0.9rem'
                                                                    }}
                                                                >
                                                                    {sizeName}
                                                                </Typography>

                                                                {isOutOfStock && (
                                                                    <Box
                                                                        sx={{
                                                                            position: 'absolute',
                                                                            top: '50%',
                                                                            left: '0',
                                                                            width: '100%',
                                                                            height: '1px',
                                                                            backgroundColor: '#bbb',
                                                                            transform: 'rotate(-45deg)'
                                                                        }}
                                                                    />
                                                                )}
                                                            </Paper>
                                                        </motion.div>
                                                    );
                                                })}
                                            </Box>

                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: 'block',
                                                    mt: 1.5,
                                                    color: 'text.secondary',
                                                    fontStyle: 'italic'
                                                }}
                                            >
                                                Selecciona tu talla habitual
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </motion.div>
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

                        {/* Selector de cantidad mejorado */}
                        <motion.div variants={itemFade}>
                            <Box sx={{ my: 3 }}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        borderRadius: '12px',
                                        background: 'linear-gradient(145deg, #ffffff, #f8f8f8)'
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: typography.fontFamily,
                                            fontWeight: 600,
                                            mb: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: vistelicaColors.secondary
                                        }}
                                    >
                                        <TouchApp sx={{ mr: 1, color: vistelicaColors.primary }} />
                                        Cantidad
                                    </Typography>

                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '180px',
                                            height: '55px',
                                            borderRadius: '28px',
                                            background: 'linear-gradient(145deg, #f8f8f8, #ffffff)',
                                            boxShadow: '5px 5px 10px #d9d9d9, -5px -5px 10px #ffffff',
                                            padding: '6px'
                                        }}>
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                                            >
                                                <IconButton
                                                    size="large"
                                                    onClick={() => handleQuantityChange(-1)}
                                                    disabled={quantity <= 1}
                                                    sx={{
                                                        backgroundColor: quantity <= 1 ? '#f0f0f0' : vistelicaColors.primary,
                                                        color: quantity <= 1 ? '#aaa' : 'white',
                                                        '&:hover': {
                                                            backgroundColor: quantity <= 1 ? '#f0f0f0' : vistelicaColors.primaryDark,
                                                        },
                                                        width: 40,
                                                        height: 40
                                                    }}
                                                >
                                                    <Remove />
                                                </IconButton>
                                            </motion.div>

                                            <motion.div
                                                key={quantity}
                                                initial={{ scale: 0.8, opacity: 0.5 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 700,
                                                    damping: 30
                                                }}
                                                style={{ flex: 1 }}
                                            >
                                                <Typography
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontFamily: typography.fontFamily,
                                                        fontWeight: 700,
                                                        fontSize: '1.5rem',
                                                        color: vistelicaColors.secondary
                                                    }}
                                                >
                                                    {quantity}
                                                </Typography>
                                            </motion.div>

                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                                            >
                                                <IconButton
                                                    size="large"
                                                    onClick={() => handleQuantityChange(1)}
                                                    sx={{
                                                        backgroundColor: vistelicaColors.primary,
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: vistelicaColors.primaryDark,
                                                        },
                                                        width: 40,
                                                        height: 40
                                                    }}
                                                >
                                                    <Add />
                                                </IconButton>
                                            </motion.div>
                                        </Box>
                                    </motion.div>
                                </Paper>
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
                                        backgroundColor: vistelicaColors.primaryDark,
                                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                                    }
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
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                                >
                                    <LocalShipping sx={{ mr: 1 }} />
                                </motion.div>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    ¡Envío gratis en pedidos superiores a 50€!
                                </Typography>
                            </Box>
                        </motion.div>

                        {/* Información adicional */}
                        <motion.div variants={itemFade}>
                            <Box sx={{ mt: 3 }}>
                                <ShippingInfo />
                                <ProductInfo description={product?.description || 'Descripción no disponible'} />
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