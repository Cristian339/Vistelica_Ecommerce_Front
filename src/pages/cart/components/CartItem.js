'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Box, Typography, Paper, IconButton, CircularProgress, Chip, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from "@/pages/shared-theme/themePrimitives";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import SavingsIcon from '@mui/icons-material/Savings';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ImageWithFallback from '@/pages/shared-components/ImageWithFallback';
import PaletteIcon from "@mui/icons-material/Palette";

const CartItem = React.memo(({
                                 item,
                                 onUpdateQuantity,
                                 onRemove,
                                 loading = false
                             }) => {
    const [quantity, setQuantity] = useState(item?.quantity || 1);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loadingImage, setLoadingImage] = useState(true);

    // Datos del producto con valores predeterminados
    const product = item?.product || {};
    const mainImage = product?.image_url || "https://via.placeholder.com/120";

    // Cálculos de precios y descuentos con memoización
    const hasDiscount = useMemo(() =>
            product.discount_percentage && parseFloat(product.discount_percentage) > 0
        , [product.discount_percentage]);

    const discountPercentage = useMemo(() =>
            hasDiscount ? parseFloat(product.discount_percentage) : 0
        , [hasDiscount, product.discount_percentage]);

    const originalPrice = useMemo(() =>
            parseFloat(product.price || 0)
        , [product.price]);

    const currentPrice = useMemo(() =>
            hasDiscount ? originalPrice * (1 - discountPercentage / 100) : originalPrice
        , [hasDiscount, originalPrice, discountPercentage]);

    // Calculamos el ahorro total
    const cartTotal = useMemo(() => ({
        totalSavings: hasDiscount ? (originalPrice - currentPrice) * quantity : 0
    }), [hasDiscount, originalPrice, currentPrice, quantity]);

    // Manejadores de eventos optimizados
    const handleQuantityChange = useCallback((newQuantity) => {
        if (newQuantity < 1 || newQuantity > 100 || loading) return;

        setQuantity(newQuantity);
        onUpdateQuantity && onUpdateQuantity(item.cart_detail_id, newQuantity);
    }, [item.cart_detail_id, onUpdateQuantity, loading]);

    const handleRemoveItem = useCallback(() => {
        if (loading) return;
        onRemove && onRemove(item.cart_detail_id);
    }, [item.cart_detail_id, onRemove, loading]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            layout
        >
            <Paper
                elevation={1}
                sx={{
                    borderRadius: 2.5,
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid rgba(0,0,0,0.06)',
                    transition: 'all 0.2s ease',
                    mb: 3,
                    '&:hover': {
                        boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
                    }
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    p: { xs: 2, md: 3 },
                    gap: 3,
                    alignItems: { xs: 'center', sm: 'flex-start' }
                }}>
                    <Box sx={{
                        width: { xs: '100%', sm: 120 },
                        height: { xs: 160, sm: 120 },
                        borderRadius: 2,
                        overflow: 'hidden',
                        flexShrink: 0
                    }}>
                        <ImageWithFallback
                            src={mainImage}
                            isLoading={loadingImage}
                            alt={item.product?.name || "Producto"}
                            productId={item.product?.product_id}
                            onLoad={() => setLoadingImage(false)}
                        />
                    </Box>

                    <Box sx={{
                        flexGrow: 1,
                        width: { xs: '100%', sm: 'auto' }
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 1, sm: 0 }
                        }}>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        fontFamily: typography.fontFamily.heading,
                                        fontSize: { xs: '1rem', sm: '1.1rem' },
                                    }}>
                                        {item.product?.name || "Producto"}
                                    </Typography>

                                    {hasDiscount && (
                                        <motion.div
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 15
                                            }}
                                        >
                                            <Tooltip title={`${discountPercentage}% de descuento`} arrow>
                                                <Chip
                                                    icon={<LocalOfferIcon fontSize="small" />}
                                                    label={`-${discountPercentage}%`}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: vistelicaColors.error,
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        '& .MuiChip-icon': {
                                                            color: 'white',
                                                            fontSize: '16px'
                                                        }
                                                    }}
                                                />
                                            </Tooltip>
                                        </motion.div>
                                    )}
                                </Box>

                                <Typography variant="caption" sx={{
                                    color: 'text.secondary',
                                    display: 'block',
                                    mb: 1
                                }}>
                                    Ref: {item.product?.product_id || "N/A"}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                    {item.size && (
                                        <Chip
                                            label={`Talla: ${item.size}`}
                                            size="small"
                                            sx={{
                                                backgroundColor: '#f5f5f5',
                                                fontFamily: typography.fontFamily.body
                                            }}
                                        />
                                    )}
                                    {item.color && (
                                        <Chip
                                            icon={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PaletteIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                                                    <Box
                                                        sx={{
                                                            width: 14,
                                                            height: 14,
                                                            borderRadius: '3px',
                                                            backgroundColor: getColorHex(item.color),
                                                            border: item.color.toUpperCase() === 'WHITE' ? '1px solid #ccc' : 'none',
                                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                </Box>
                                            }
                                            size="small"
                                            label={getColorTranslation(item.color)}
                                            sx={{
                                                borderRadius: 1.5,
                                                backgroundColor: `#f5f5f5`,
                                                color: getColorHex(item.color),
                                                fontFamily: typography.fontFamily.body,
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                border: `1px solid #e0e0e0`,
                                                textShadow: isLightColor(item.color) ? '0px 0px 1px rgba(0,0,0,0.2)' : 'none',
                                                '& .MuiChip-icon': {
                                                    color: vistelicaColors.secondary,
                                                    marginRight: '-6px'
                                                }
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'row', sm: 'column' },
                                alignItems: { xs: 'center', sm: 'flex-end' },
                                gap: { xs: 2, sm: 0.5 }
                            }}>
                                <Typography variant="body2" sx={{
                                    color: hasDiscount ? vistelicaColors.error : 'text.primary',
                                    fontWeight: 'bold',
                                    fontSize: { xs: '0.9rem', sm: '1rem' }
                                }}>
                                    {currentPrice.toFixed(2)}€
                                </Typography>
                                {hasDiscount && (
                                    <Typography variant="caption" sx={{
                                        color: 'text.secondary',
                                        textDecoration: 'line-through',
                                        fontSize: '0.8rem'
                                    }}>
                                        {originalPrice.toFixed(2)}€
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: { xs: 2, sm: 3 }
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid rgba(0,0,0,0.12)',
                                borderRadius: 5,
                                overflow: 'hidden',
                            }}>
                                <IconButton
                                    size="small"
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1 || loading}
                                    sx={{
                                        borderRadius: 0,
                                        height: 28,
                                        width: 28,
                                        color: quantity <= 1 ? 'text.disabled' : vistelicaColors.primary
                                    }}
                                >
                                    <RemoveIcon fontSize="small" />
                                </IconButton>

                                <Box sx={{
                                    px: 2,
                                    minWidth: 30,
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    {quantity}
                                </Box>

                                <IconButton
                                    size="small"
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={quantity >= 100 || loading}
                                    sx={{
                                        borderRadius: 0,
                                        height: 28,
                                        width: 28,
                                        color: quantity >= 100 ? 'text.disabled' : vistelicaColors.primary
                                    }}
                                >
                                    <AddIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <Typography sx={{
                                    fontFamily: typography.fontFamily.heading,
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    color: hasDiscount ? vistelicaColors.error : vistelicaColors.primary,
                                }}>
                                    {(currentPrice * quantity).toFixed(2)}€
                                </Typography>

                                <AnimatePresence mode="wait">
                                    {showDeleteConfirm ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.2 }}
                                            key="confirm"
                                        >
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Chip
                                                    label="Confirmar"
                                                    color="error"
                                                    size="small"
                                                    onClick={handleRemoveItem}
                                                    sx={{ fontWeight: 'bold' }}
                                                    disabled={loading}
                                                />
                                                <Chip
                                                    label="Cancelar"
                                                    color="default"
                                                    size="small"
                                                    onClick={() => setShowDeleteConfirm(false)}
                                                    disabled={loading}
                                                />
                                            </Box>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="delete">
                                            <IconButton
                                                size="small"
                                                onClick={() => setShowDeleteConfirm(true)}
                                                disabled={loading}
                                                sx={{
                                                    color: 'rgba(0,0,0,0.5)',
                                                    '&:hover': {
                                                        color: vistelicaColors.error,
                                                        backgroundColor: `${vistelicaColors.error}10`
                                                    }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Mensaje de ahorro con animación */}
                {cartTotal.totalSavings > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 4,
                                borderRadius: 3,
                                background: `linear-gradient(135deg, #ff4d4d90, #ff6b6bB0)`,
                                border: '1px solid rgba(255,255,255,0.5)',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(255,0,0,0.15)',
                                color: 'white',
                                transform: 'rotate(0deg)',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '35%',
                                    background: 'linear-gradient(rgba(255,255,255,0.2), transparent)',
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                    zIndex: 0,
                                }
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 3,
                                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                position: 'relative',
                                zIndex: 1,
                                textAlign: { xs: 'center', sm: 'left' }
                            }}>
                                <motion.div
                                    animate={{
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        repeatDelay: 6,
                                        duration: 1.2
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: '50%',
                                            width: 64,
                                            height: 64,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            border: '1px solid rgba(255,255,255,0.8)',
                                            mb: { xs: 1, sm: 0 }
                                        }}
                                    >
                                        <SavingsIcon
                                            sx={{
                                                fontSize: 34,
                                                color: vistelicaColors.error
                                            }}
                                        />
                                    </Box>
                                </motion.div>

                                <Box sx={{ mx: 'auto' }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 800,
                                            letterSpacing: 0.5,
                                            fontFamily: typography.fontFamily.heading,
                                            color: 'white',
                                            textAlign: 'center',
                                            textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                                            fontSize: '1.3rem',
                                            mb: 0.5
                                        }}
                                    >
                                        ¡FELICIDADES!
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: '1.05rem',
                                            fontWeight: 600,
                                            color: 'white',
                                            textAlign: 'center',
                                            textShadow: '0 1px 1px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        Has ahorrado{' '}
                                        <Box
                                            component="span"
                                            sx={{
                                                fontSize: '1.4rem',
                                                fontWeight: 800,
                                                px: 1.2,
                                                py: 0.2,
                                                mx: 0.5,
                                                borderRadius: 1.5,
                                                backgroundColor: 'white',
                                                color: vistelicaColors.error,
                                                display: 'inline-block',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                border: '1px solid rgba(255,255,255,0.9)',
                                            }}
                                        >
                                            {cartTotal.totalSavings.toFixed(2)}€
                                        </Box>{' '}
                                        con los descuentos aplicados
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </motion.div>
                )}

                {loading && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        p: 1,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 10
                    }}>
                        <Typography variant="caption" sx={{
                            fontWeight: 'medium',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <CircularProgress size={14} thickness={6} />
                            Actualizando...
                        </Typography>
                    </Box>
                )}
            </Paper>
        </motion.div>
    );
});

// Función para traducir colores del inglés al español
const getColorTranslation = (colorName) => {
    if (!colorName) return 'N/A';

    const colorTranslations = {
        'RED': 'Rojo',
        'BLACK': 'Negro',
        'WHITE': 'Blanco',
        'BLUE': 'Azul',
        'GREEN': 'Verde',
        'YELLOW': 'Amarillo',
        'ORANGE': 'Naranja',
        'PURPLE': 'Morado',
        'BROWN': 'Marrón',
        'GRAY': 'Gris',
        'PINK': 'Rosa',
        'BEIGE': 'Beige',
        'GOLD': 'Dorado',
        'SILVER': 'Plateado',
        'NAVY': 'Azul marino'
    };

    return colorTranslations[colorName.toUpperCase()] || colorName;
};

// Determinar si un color es claro
const isLightColor = (colorName) => {
    if (!colorName) return false;
    const lightColors = ['WHITE', 'YELLOW', 'BEIGE', 'GOLD', 'PINK'];
    return lightColors.includes(colorName.toUpperCase());
};

// Obtener color en formato HEX
const getColorHex = (colorName) => {
    if (!colorName) return '#CCCCCC';
    const colorMap = {
        RED: '#FF0000',
        BLACK: '#000000',
        WHITE: '#FFFFFF',
        BLUE: '#0000FF',
        GREEN: '#00FF00',
        YELLOW: '#FFFF00',
        ORANGE: '#FFA500',
        PURPLE: '#800080',
        BROWN: '#8B4513',
        GRAY: '#808080',
        PINK: '#FFC0CB',
        BEIGE: '#F5F5DC',
        GOLD: '#FFD700',
        SILVER: '#C0C0C0',
        NAVY: '#000080'
    };
    return colorMap[colorName.toUpperCase()] || '#CCCCCC';
};

CartItem.displayName = 'CartItem';

export default CartItem;