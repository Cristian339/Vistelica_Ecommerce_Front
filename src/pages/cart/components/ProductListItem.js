'use client';
import { Box, Typography, Paper, IconButton, CircularProgress, Chip, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from "@/pages/shared-theme/themePrimitives";
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CategoryIcon from '@mui/icons-material/Category';
import StraightenIcon from '@mui/icons-material/Straighten';
import PaletteIcon from '@mui/icons-material/Palette';
import { useState, useEffect } from 'react';
import cartService from '@/services/cartService';
import productService from '@/services/productService';
import ProductImageComponent from './ProductImageComponent';
import ProductActionButtons from './ProductActionButtons';

export default function ProductListItem({
                                            item,
                                            index,
                                            isActive,
                                            setActive,
                                            clearActive,
                                            onUpdate,
                                            userId,
                                            sessionId
                                        }) {
    const [quantity, setQuantity] = useState(item.quantity);
    const [mainImage, setMainImage] = useState(item.product?.image_url || "https://via.placeholder.com/80");
    const [loadingImage, setLoadingImage] = useState(!item.product?.image_url);
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [animatePrice, setAnimatePrice] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);

    // Función para determinar si un color es claro y necesita sombra de texto
    const isLightColor = (colorName) => {
        if (!colorName) return false;
        const lightColors = ['WHITE', 'YELLOW', 'BEIGE', 'GOLD', 'PINK'];
        return lightColors.includes(colorName.toUpperCase());
    };

    // Estructura del item basada en la versión original
    const product = item.product || {};

    // Verificar si el producto tiene descuento
    const hasDiscount = product.discount_percentage && parseFloat(product.discount_percentage) > 0;
    const discountPercentage = hasDiscount ? parseFloat(product.discount_percentage) : 0;

    // Precios calculados
    const originalPrice = parseFloat(product.price || 0);
    const currentPrice = hasDiscount
        ? originalPrice * (1 - discountPercentage / 100)
        : originalPrice;

    // Efecto para cargar la imagen principal
    useEffect(() => {
        const loadMainImage = async () => {
            if (product.product_id && !product.image_url) {
                try {
                    setLoadingImage(true);
                    const imageData = await productService.getMainImageByProductId(product.product_id);
                    if (imageData && imageData.image_url) {
                        setMainImage(imageData.image_url);
                    }
                } catch (error) {
                    console.error('Error loading product image:', error);
                } finally {
                    setLoadingImage(false);
                }
            }
        };

        loadMainImage();
    }, [product.product_id, product.image_url]);

    // Efecto para mostrar detalles del producto con delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowProductDetails(true);
        }, 200 + index * 80);

        return () => clearTimeout(timer);
    }, [index]);

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity < 1 || newQuantity > 100) return;

        try {
            setLoading(true);
            setAnimatePrice(true);
            await cartService.updateCartItem(
                item.cart_detail_id,
                newQuantity
            );

            setQuantity(newQuantity);
            onUpdate && onUpdate();

        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
        } finally {
            setLoading(false);
            setTimeout(() => setAnimatePrice(false), 700);
        }
    };

    const handleRemoveItem = async () => {
        try {
            setLoading(true);
            await cartService.removeFromCart(item.cart_detail_id);
            onUpdate && onUpdate();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        } finally {
            setLoading(false);
        }
    };
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                    delay: index * 0.08
                }
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            layout
            onHoverStart={() => setActive && setActive(item.cart_detail_id)}
            onHoverEnd={clearActive}
            whileHover={{ scale: 1.01 }}
        >
            <Paper
                elevation={isActive ? 4 : 1}
                sx={{
                    position: 'relative',
                    borderRadius: 3,
                    mb: 2.5,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: isActive
                        ? `${vistelicaColors.primary}60`
                        : 'rgba(0,0,0,0.04)',
                    background: isActive
                        ? `linear-gradient(135deg, ${vistelicaColors.backgroundLight}15, white, ${vistelicaColors.backgroundLight}30)`
                        : 'white',
                    boxShadow: isActive
                        ? `0 8px 20px -10px ${vistelicaColors.primary}40`
                        : '0 2px 8px rgba(0,0,0,0.04)'
                }}
            >
                {/* Borde superior decorativo con gradiente */}
                <Box sx={{
                    height: 4,
                    width: '100%',
                    background: `linear-gradient(90deg, ${vistelicaColors.primary}, ${vistelicaColors.secondary})`
                }} />

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    p: { xs: 2, md: 3 },
                    gap: { xs: 2, md: 3 },
                    position: 'relative',
                    zIndex: 1
                }}>
                    {/* Componente de imagen de producto */}
                    <ProductImageComponent
                        mainImage={mainImage}
                        loadingImage={loadingImage}
                        productName={product.name}
                        hasDiscount={hasDiscount}
                        discountPercentage={discountPercentage}
                    />

                    {/* Información del producto */}
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        textAlign: { xs: 'center', sm: 'left' }
                    }}>
                        <AnimatePresence>
                            {showProductDetails && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    style={{ width: '100%' }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 400,
                                            color: vistelicaColors.secondary,
                                            fontFamily: typography.fontFamily.heading,
                                            fontSize: '1.15rem',
                                            mb: 1.5,
                                            lineHeight: 1.2,
                                            borderLeft: `3px solid ${vistelicaColors.primary}`,
                                            pl: 1.5,
                                            py: 0.5
                                        }}
                                    >
                                        {product.name || "Producto"}
                                    </Typography>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Atributos del producto con diseño mejorado */}
                        <AnimatePresence>
                            {showProductDetails && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    style={{ width: '100%' }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 1.2,
                                        flexWrap: 'wrap',
                                        mb: 2
                                    }}>
                                        {/* Referencia mejorada */}
                                        <Chip
                                            icon={<CategoryIcon sx={{ fontSize: '0.9rem' }} />}
                                            size="small"
                                            label={`Ref: ${product.product_id || "N/A"}`}
                                            sx={{
                                                borderRadius: 1.5,
                                                backgroundColor: `${vistelicaColors.primary}15`,
                                                color: vistelicaColors.primary,
                                                fontFamily: typography.fontFamily.body,
                                                fontSize: '0.8rem',
                                                fontWeight: 500,
                                                border: `1px solid ${vistelicaColors.primary}30`,
                                                '& .MuiChip-icon': {
                                                    color: vistelicaColors.secondary
                                                }
                                            }}
                                        />

                                        {/* Talla mejorada */}
                                        {item.size && (
                                            <Chip
                                                icon={<StraightenIcon sx={{ fontSize: '0.9rem' }} />}
                                                size="small"
                                                label={`Talla: ${item.size}`}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    backgroundColor: `${vistelicaColors.primary}15`,
                                                    color: vistelicaColors.primary,
                                                    fontFamily: typography.fontFamily.body,
                                                    fontSize: '0.8rem',
                                                    fontWeight: 500,
                                                    border: `1px solid ${vistelicaColors.secondary}30`,
                                                    '& .MuiChip-icon': {
                                                        color: vistelicaColors.secondary
                                                    }
                                                }}
                                            />
                                        )}

                                        {/* Color mejorado */}
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
                                                    backgroundColor: vistelicaColors.quaternary,
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

                                        {/* Badge de calidad mejorado */}
                                        <Tooltip title="Producto verificado con garantía de calidad" arrow placement="top">
                                            <Chip
                                                size="small"
                                                icon={<VerifiedUserIcon sx={{ fontSize: '0.9rem' }} />}
                                                label="Calidad Premium"
                                                sx={{
                                                    borderRadius: 1.5,
                                                    backgroundColor: `${vistelicaColors.success}15`,
                                                    color: vistelicaColors.success,
                                                    fontFamily: typography.fontFamily.body,
                                                    fontSize: '0.8rem',
                                                    fontWeight: 400,
                                                    border: `1px solid ${vistelicaColors.success}30`,
                                                    '& .MuiChip-icon': {
                                                        color: vistelicaColors.success
                                                    }
                                                }}
                                            />
                                        </Tooltip>
                                    </Box>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Precio y acciones */}
                        <AnimatePresence>
                            {showProductDetails && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    style={{ width: '100%' }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '100%',
                                        mt: 'auto',
                                        pt: 1,
                                        borderTop: '1px dashed rgba(0,0,0,0.08)'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <motion.div animate={animatePrice ? { scale: [1, 1.1, 1] } : {}}>
                                                <Typography sx={{
                                                    fontWeight: 600,
                                                    fontSize: '1.2rem',
                                                    fontFamily: typography.fontFamily.heading,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    background: vistelicaColors.primary,
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}>
                                                    {currentPrice.toFixed(2)}€
                                                </Typography>
                                            </motion.div>

                                            {hasDiscount && (
                                                <Box sx={{
                                                    display: 'inline-flex',
                                                    position: 'relative',
                                                    ml: 2,
                                                    backgroundColor: vistelicaColors.primaryLight,
                                                    borderRadius: 1.5,
                                                    px: 1,
                                                    py: 0.3,
                                                    border: '1px dashed rgba(0,0,0,0.1)',
                                                    alignItems: 'center'
                                                }}>
                                                    <Typography sx={{
                                                        color: vistelicaColors.secondary,
                                                        fontWeight: 600,
                                                        fontSize: '0.85rem',
                                                    }}>
                                                        {originalPrice.toFixed(2)}€
                                                    </Typography>
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: 0,
                                                        right: 0,
                                                        height: 2,
                                                        backgroundColor: vistelicaColors.error,
                                                        transform: 'translateY(-50%) rotate(-8deg)',
                                                        borderRadius: 1
                                                    }} />
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Componente de botones de acción */}
                                        <ProductActionButtons
                                            quantity={quantity}
                                            handleQuantityChange={handleQuantityChange}
                                            loading={loading}
                                        />
                                    </Box>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>

                    {/* Botón de eliminar mejorado */}
                    <Tooltip title="Eliminar producto" arrow placement="left">
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                color: 'rgba(0,0,0,0.3)',
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                border: '1px solid rgba(0,0,0,0.1)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                '&:hover': {
                                    color: 'white',
                                    backgroundColor: vistelicaColors.error,
                                    transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => setShowDeleteConfirm(true)}
                            size="small"
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Diálogo de confirmación de eliminación mejorado */}
                {showDeleteConfirm && (
                    <Box sx={{
                        p: 1.8,
                        borderTop: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        backgroundColor: `${vistelicaColors.error}08`,
                        gap: 1.5,
                        backdropFilter: 'blur(4px)'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Typography variant="body2" sx={{
                                fontWeight: 500,
                                color: vistelicaColors.error,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                <DeleteIcon fontSize="small" />
                                ¿Eliminar este producto?
                            </Typography>
                        </motion.div>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <IconButton
                                size="small"
                                onClick={handleRemoveItem}
                                sx={{
                                    color: 'white',
                                    backgroundColor: vistelicaColors.error,
                                    boxShadow: '0 2px 5px rgba(239,83,80,0.3)',
                                    '&:hover': {
                                        backgroundColor: `${vistelicaColors.error}DD`
                                    }
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </motion.div>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <IconButton
                                size="small"
                                onClick={() => setShowDeleteConfirm(false)}
                                sx={{
                                    color: 'rgba(0,0,0,0.6)',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    '&:hover': {
                                        backgroundColor: 'white'
                                    }
                                }}
                            >
                                <Box sx={{ fontWeight: 'bold', fontSize: '16px', lineHeight: 1 }}>×</Box>
                            </IconButton>
                        </motion.div>
                    </Box>
                )}

                {/* Indicador de carga mejorado */}
                {loading && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        p: 1,
                        backgroundColor: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 10,
                        borderBottom: `1px solid ${vistelicaColors.primary}20`
                    }}>
                        <Typography variant="caption" sx={{
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: vistelicaColors.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '0.7rem'
                        }}>
                            <CircularProgress size={14} thickness={6} color="inherit" />
                            Actualizando producto...
                        </Typography>
                    </Box>
                )}
            </Paper>
        </motion.div>
    );
}