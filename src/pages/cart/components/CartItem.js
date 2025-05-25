'use client';
import { Box, Typography, IconButton, Avatar, CircularProgress, Chip, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import cartService from '@/services/cartService';
import productService from '@/services/productService';
import { useState, useEffect } from 'react';
import { getCurrentUser } from "@/services/authService";
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";

// Función para mapear nombres de colores a valores HEX
const getColorHex = (colorName) => {
    const colorMap = {
        RED: '#FF0000',
        BLACK: '#000000',
        WHITE: '#FFFFFF',
        BLUE: '#0000FF',
        GREEN: '#00FF00',
        YELLOW: '#FFFF00',
        ORANGE: '#FFA500',
        PURPLE: '#800080',
        BROWN: '#715638',
        GRAY: '#808080',
        PINK: '#FFC0CB',
        BEIGE: '#F5F5DC',
        GOLD: '#FFD700',
        SILVER: '#C0C0C0',
        NAVY: '#000080'
    };
    return colorMap[colorName] || '#CCCCCC'; // Color por defecto si no se encuentra
};

export default function CartItem({ item, onUpdate, userId, sessionId }) {
    const [quantity, setQuantity] = useState(item.quantity);
    const [mainImage, setMainImage] = useState(item.product?.image_url || "https://via.placeholder.com/80");
    const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(false);

    // Verificar si el producto tiene descuento
    const hasDiscount = item.product?.discount_percentage && parseFloat(item.product.discount_percentage) > 0;
    const discountPercentage = hasDiscount ? parseFloat(item.product.discount_percentage) : 0;

    // Precios calculados
    const originalPrice = parseFloat(item.product?.price || item.price);
    const currentPrice = hasDiscount
        ? originalPrice * (1 - discountPercentage / 100)
        : originalPrice;

    // Efecto para cargar la imagen principal
    useEffect(() => {
        const loadMainImage = async () => {
            if (item.product?.product_id && !item.product?.image_url) {
                try {
                    setLoadingImage(true);
                    const imageData = await productService.getMainImageByProductId(item.product.product_id);
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
    }, [item.product?.product_id, item.product?.image_url]);

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity < 1 || newQuantity > 100) return;

        try {
            setLoading(true);
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

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            py: 2,
            borderBottom: '1px solid #eee',
            gap: 3,
            opacity: loading ? 0.7 : 1,
            pointerEvents: loading ? 'none' : 'auto'
        }}>
            {loadingImage ? (
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.05)'
                    }}
                >
                    <CircularProgress size={24} />
                </Box>
            ) : (
                <Avatar
                    variant="square"
                    src={mainImage}
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 1
                    }}
                />
            )}

            <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body1" sx={{
                        fontWeight: 500,
                        fontFamily: "'Amethysta', serif"
                    }}>
                        {item.product?.name || "Producto"}
                    </Typography>

                    {hasDiscount && (
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
                    )}
                </Box>

                {/* Mostrar talla y color si existen */}
                <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                    {item.size && (
                        <Chip
                            label={`Talla: ${item.size}`}
                            size="small"
                            sx={{
                                backgroundColor: '#f5f5f5',
                                fontFamily: "'Amethysta', serif"
                            }}
                        />
                    )}
                    {item.color && (
                        <Tooltip title={item.color} arrow>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                <Box sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    backgroundColor: getColorHex(item.color),
                                    border: item.color === 'WHITE' ? '1px solid #ccc' : 'none',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }} />
                                <Typography variant="caption" sx={{
                                    fontFamily: "'Amethysta', serif",
                                    ml: 0.5
                                }}>
                                    Color
                                </Typography>
                            </Box>
                        </Tooltip>
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{
                        color: hasDiscount ? vistelicaColors.error : 'text.secondary',
                        fontWeight: hasDiscount ? 'bold' : 'normal'
                    }}>
                        {currentPrice.toFixed(2)}€
                    </Typography>
                    {hasDiscount && (
                        <Typography variant="body2" sx={{
                            color: 'text.secondary',
                            textDecoration: 'line-through',
                            fontSize: '0.8rem'
                        }}>
                            {originalPrice.toFixed(2)}€
                        </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        c/u
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Typography sx={{
                    fontFamily: "'Amethysta', serif",
                    fontWeight: 500,
                    minWidth: 80,
                    textAlign: 'right'
                }}>
                    {(currentPrice * quantity).toFixed(2)}€
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                    >
                        <RemoveIcon />
                    </IconButton>

                    <Typography>{quantity}</Typography>

                    <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= 100}
                    >
                        <AddIcon />
                    </IconButton>

                    <IconButton
                        size="small"
                        sx={{ color: 'black' }}
                        onClick={handleRemoveItem}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}