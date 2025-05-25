"use client";

import * as React from 'react';
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import cartService from '@/services/cartService';

export default function CartInfoSimplified() {
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                // Usar el nuevo método getCurrentCartProducts
                const products = await cartService.getCurrentCartProducts();
                console.log('Cart products:', products);

                setCartData({ products });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart data:', error);
                setError(error.message || 'Error al obtener los productos del carrito');
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);
    // Función para calcular el precio con descuento
    const calculateDiscountedPrice = (price, discountPercentage) => {
        const originalPrice = parseFloat(price);
        const discount = parseFloat(discountPercentage);
        return originalPrice * (1 - discount / 100);
    };

    // Función para calcular el total de todos los productos
    const calculateSubtotal = (products) => {
        if (!products || products.length === 0) return 0;
        return products.reduce((sum, item) => {
            const finalPrice = calculateDiscountedPrice(item.price, item.discount_percentage);
            return sum + (finalPrice * item.quantity);
        }, 0);
    };

    // Función para calcular los gastos de envío
    const calculateShippingCost = (subtotal) => {
        return subtotal >= 50 ? 0 : 4.99;
    };

    // Función para formatear precios con dos decimales
    const formatPrice = (price) => {
        return Number(price).toFixed(2) + " €";
    };

    if (loading) return <Typography variant="body1">Cargando datos del carrito...</Typography>;
    if (error) return <Typography variant="body1" color="error">{error}</Typography>;
    if (!cartData || !cartData.products || cartData.products.length === 0) {
        return <Typography variant="body1">No hay productos en el carrito</Typography>;
    }

    const subtotal = calculateSubtotal(cartData.products);
    const shippingCost = calculateShippingCost(subtotal);
    const totalPrice = subtotal + shippingCost;
    const isFreeShipping = subtotal >= 50;

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Resumen del pedido
            </Typography>
            <List disablePadding>
                {cartData.products.map((item, index) => {
                    const originalPrice = parseFloat(item.price);
                    const finalPrice = calculateDiscountedPrice(item.price, item.discount_percentage);
                    const hasDiscount = parseFloat(item.discount_percentage) > 0;

                    return (
                        <ListItem key={`${item.product.product_id}-${index}`} sx={{ py: 1, px: 0 }}>
                            <ListItemText
                                sx={{ mr: 2 }}
                                primary={item.product.name}
                                secondary={
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Cantidad: {item.quantity}
                                        </Typography>
                                        {hasDiscount && (
                                            <Typography variant="body2" color="success.main">
                                                Descuento: {item.discount_percentage}%
                                            </Typography>
                                        )}
                                    </Box>
                                }
                            />
                            <Box sx={{ textAlign: 'right' }}>
                                {hasDiscount && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            textDecoration: 'line-through',
                                            color: 'text.secondary',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        {formatPrice(originalPrice * item.quantity)}
                                    </Typography>
                                )}
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {formatPrice(finalPrice * item.quantity)}
                                </Typography>
                            </Box>
                        </ListItem>
                    );
                })}

                <Divider sx={{ my: 2 }} />

                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {formatPrice(subtotal)}
                    </Typography>
                </ListItem>

                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                        primary="Gastos de envío"
                        secondary={isFreeShipping ? "¡Envío gratis por compra superior a 50€!" : ""}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                        {isFreeShipping ? (
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        textDecoration: 'line-through',
                                        color: 'text.secondary',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    4.99 €
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 'medium',
                                        color: 'success.main'
                                    }}
                                >
                                    0.00 €
                                </Typography>
                            </Box>
                        ) : (
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {formatPrice(shippingCost)}
                            </Typography>
                        )}
                    </Box>
                </ListItem>

                <Divider sx={{ my: 1 }} />

                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Total" />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(totalPrice)}
                    </Typography>
                </ListItem>
            </List>
        </React.Fragment>
    );
}