"use client";

import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import cartService from '@/services/cartService';
import { getProfileAndAddresses } from '@/services/profileService';

export default function Review({ paymentData, shippingData = null }) {
    const [cartData, setCartData] = useState(null);
    const [addressData, setAddressData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Obtener datos del carrito
                const products = await cartService.getCurrentCartProducts();
                setCartData({ products });

                // Obtener datos de dirección si no se proporcionan
                if (!shippingData) {
                    const profileData = await getProfileAndAddresses();
                    const defaultAddress = profileData.addresses.find(address => address.is_default === true) ||
                        (profileData.addresses.length > 0 ? profileData.addresses[0] : null);

                    setAddressData({
                        firstName: profileData.name || '',
                        lastName: profileData.lastName || '',
                        address: defaultAddress
                    });
                } else {
                    setAddressData(shippingData);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error al cargar los datos');
                setLoading(false);
            }
        };

        fetchData();
    }, [shippingData]);

    // Función para calcular el precio con descuento
    const calculateDiscountedPrice = (price, discountPercentage) => {
        const originalPrice = parseFloat(price);
        const discount = parseFloat(discountPercentage);
        return originalPrice * (1 - discount / 100);
    };

    // Función para calcular el subtotal
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

    // Función para formatear precios
    const formatPrice = (price) => {
        return Number(price).toFixed(2) + " €";
    };

    // Función simplificada para obtener el nombre del método de pago
    const getPaymentMethodName = () => {
        if (!paymentData || !paymentData.type) {
            return 'Tarjeta de crédito'; // Default
        }

        switch (paymentData.type) {
            case 'creditCard':
                return 'Tarjeta de crédito';
            case 'paypal':
                return 'PayPal';
            case 'applePay':
                return 'Apple Pay';
            case 'googlePay':
                return 'Google Pay';
            case 'bankTransfer':
                return 'Transferencia bancaria';
            default:
                return 'Método de pago seleccionado';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">{error}</Alert>
        );
    }

    if (!cartData || !cartData.products || cartData.products.length === 0) {
        return (
            <Alert severity="warning">No hay productos en el carrito</Alert>
        );
    }

    const subtotal = calculateSubtotal(cartData.products);
    const shippingCost = calculateShippingCost(subtotal);
    const totalPrice = subtotal + shippingCost;
    const totalProducts = cartData.products.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Stack spacing={2}>
            <List disablePadding>
                {/* Resumen de costos */}
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                        primary="Productos"
                        secondary={`${totalProducts} producto${totalProducts !== 1 ? 's' : ''} seleccionado${totalProducts !== 1 ? 's' : ''}`}
                    />
                    <Typography variant="body2">{formatPrice(subtotal)}</Typography>
                </ListItem>

                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                        primary="Envío"
                        secondary={subtotal >= 50 ? "Envío gratuito" : "Gastos de envío"}
                    />
                    <Typography variant="body2">{formatPrice(shippingCost)}</Typography>
                </ListItem>

                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {formatPrice(totalPrice)}
                    </Typography>
                </ListItem>
            </List>

            <Divider />

            <Stack
                direction="column"
                divider={<Divider flexItem />}
                spacing={2}
                sx={{ my: 2 }}
            >
                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        Detalles de envío
                    </Typography>
                    {addressData ? (
                        <>
                            <Typography gutterBottom>
                                {addressData.firstName} {addressData.lastName}
                            </Typography>
                            {addressData.address ? (
                                <Typography gutterBottom sx={{ color: 'text.secondary' }}>
                                    {addressData.address.street}
                                    {addressData.address.label && `, ${addressData.address.label}`}
                                    <br />
                                    {addressData.address.city}, {addressData.address.state}, {addressData.address.postal_code}
                                    <br />
                                    {addressData.address.country || 'España'}
                                </Typography>
                            ) : (
                                <Typography gutterBottom sx={{ color: 'text.secondary' }}>
                                    Dirección no disponible
                                </Typography>
                            )}
                        </>
                    ) : (
                        <Typography gutterBottom sx={{ color: 'text.secondary' }}>
                            Cargando datos de envío...
                        </Typography>
                    )}
                </div>

                {/* Sección simplificada de método de pago */}
                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        Método de pago
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {getPaymentMethodName()}
                    </Typography>

                    {/* Mostrar información adicional solo si es necesario */}
                    {paymentData?.type === 'paypal' && paymentData?.details?.email && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Email: {paymentData.details.email}
                        </Typography>
                    )}
                </div>
            </Stack>


        </Stack>
    );
}