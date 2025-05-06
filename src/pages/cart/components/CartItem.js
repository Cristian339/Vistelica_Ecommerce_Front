'use client';
import { Box, Typography, IconButton, Avatar, CircularProgress, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import cartService from '@/services/cartService';
import productService from '@/services/productService';
import { useState, useEffect } from 'react';

export default function CartItem({ item, setCartItems, setTotal, userId, sessionId }) {
    const [quantity, setQuantity] = useState(item.quantity);
    const [mainImage, setMainImage] = useState(item.product?.image_url || "https://via.placeholder.com/80");
    const [loadingImage, setLoadingImage] = useState(false);
    // Asegurarnos que price es un número
    const price = typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price) || 0;

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
        try {
            await cartService.updateCartItem(item.order_detail_id, newQuantity, item.size, item.color);
            setQuantity(newQuantity);

            setCartItems(prev => prev.map(i =>
                i.order_detail_id === item.order_detail_id
                    ? { ...i, quantity: newQuantity }
                    : i
            ));

            const totalData = await cartService.getCartTotal(userId || null, !userId ? sessionId : null);
            setTotal({
                totalPrice: totalData.totalPrice,
                itemCount: totalData.itemCount
            });
        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
        }
    };

    const handleRemoveItem = async () => {
        try {
            await cartService.removeFromCart(item.order_detail_id);
            setCartItems(prev => prev.filter(i => i.order_detail_id !== item.order_detail_id));

            const totalData = await cartService.getCartTotal(userId || null, !userId ? sessionId : null);
            setTotal({
                totalPrice: totalData.totalPrice,
                itemCount: totalData.itemCount
            });
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            py: 2,
            borderBottom: '1px solid #eee',
            gap: 3
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
                <Typography variant="body1" sx={{
                    fontWeight: 500,
                    fontFamily: "'Amethysta', serif",
                    mb: 1
                }}>
                    {item.product?.name || "Producto"}
                </Typography>

                {/* Mostrar talla y color si existen */}
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
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
                        <Chip
                            label={`Color: ${item.color}`}
                            size="small"
                            sx={{
                                backgroundColor: '#f5f5f5',
                                fontFamily: "'Amethysta', serif"
                            }}
                        />
                    )}
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {price.toFixed(2)}€ c/u
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Typography sx={{
                    fontFamily: "'Amethysta', serif",
                    fontWeight: 500,
                    minWidth: 80,
                    textAlign: 'right'
                }}>
                    {(price * quantity).toFixed(2)}€
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                    >
                        <RemoveIcon />
                    </IconButton>

                    <Typography>{quantity}</Typography>

                    <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(quantity + 1)}
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