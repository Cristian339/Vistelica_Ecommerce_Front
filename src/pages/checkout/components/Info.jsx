"use client";

import * as React from 'react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import cartService from '@/services/cartService';
import { styled } from '@mui/material/styles';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { vistelicaColors } from "@/components/shared/vistelicaColors";
import { typography } from '@/components/shared/themePrimitives';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// Componentes estilizados
const OrderSummaryContainer = styled(Paper)(({ theme }) => ({
    borderRadius: '12px',
    padding: theme.spacing(3),
    boxShadow: '0 3px 15px rgba(0,0,0,0.07)',
    border: '1px solid #f0f0f0',
    backgroundColor: '#ffffff'
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(1.5, 0),
    '&:last-child': {
        paddingBottom: 0
    }
}));

const TotalListItem = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(2, 0),
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginTop: theme.spacing(1),
}));

const ProductName = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    color: '#303030',
    fontFamily: typography.fontFamily,
    lineHeight: 1.3
}));

// Título de sección con la paleta primary
const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: theme.spacing(2.5),
    color: '#212121',
    fontFamily: typography.fontFamily,
    position: 'relative',
    paddingBottom: theme.spacing(1),
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '50px',
        height: '3px',
        backgroundColor: vistelicaColors.primary,
        borderRadius: '2px'
    }
}));

// Convertir a componente memo para mejorar el rendimiento
const CartInfoSimplified = React.memo(function CartInfoSimplified() {
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Usar AbortController para cancelar requests al desmontar
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchCartData = async () => {
            try {
                setLoading(true);
                // Usar el controlador de aborto para cancelar la petición si es necesario
                const products = await cartService.getCurrentCartProducts();

                if (!isMounted) return;

                setCartData({ products });
                setLoading(false);
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch abortado');
                    return;
                }

                console.error('Error fetching cart data:', error);
                if (isMounted) {
                    setError(error.message || 'Error al obtener los productos del carrito');
                    setLoading(false);
                }
            }
        };

        fetchCartData();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    // Funciones memoizadas para optimizar rendimiento
    const calculateDiscountedPrice = useCallback((price, discountPercentage) => {
        const originalPrice = parseFloat(price);
        const discount = parseFloat(discountPercentage);
        return originalPrice * (1 - discount / 100);
    }, []);

    const calculateSubtotal = useCallback((products) => {
        if (!products || products.length === 0) return 0;
        return products.reduce((sum, item) => {
            const finalPrice = calculateDiscountedPrice(item.price, item.discount_percentage);
            return sum + (finalPrice * item.quantity);
        }, 0);
    }, [calculateDiscountedPrice]);

    const calculateShippingCost = useCallback((subtotal) => {
        return subtotal >= 50 ? 0 : 4.99;
    }, []);

    const formatPrice = useCallback((price) => {
        return Number(price).toFixed(2) + " €";
    }, []);

    // Calcular valores derivados de manera memoizada
    const cartValues = useMemo(() => {
        if (!cartData || !cartData.products) {
            return { subtotal: 0, shippingCost: 0, totalPrice: 0, isFreeShipping: false };
        }

        const subtotal = calculateSubtotal(cartData.products);
        const shippingCost = calculateShippingCost(subtotal);
        const totalPrice = subtotal + shippingCost;
        const isFreeShipping = subtotal >= 50;

        return { subtotal, shippingCost, totalPrice, isFreeShipping };
    }, [cartData, calculateSubtotal, calculateShippingCost]);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress size={40} sx={{ color: vistelicaColors.primary }} />
        </Box>
    );

    if (error) return (
        <Alert severity="error" sx={{ borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            {error}
        </Alert>
    );

    if (!cartData || !cartData.products || cartData.products.length === 0) {
        return (
            <Alert severity="info" sx={{ borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                No hay productos en el carrito
            </Alert>
        );
    }

    const { subtotal, shippingCost, totalPrice, isFreeShipping } = cartValues;

    return (
        <OrderSummaryContainer>
            <SectionTitle variant="h6" sx={{fontWeight:400}}>
                Resumen del pedido
            </SectionTitle>

            <List disablePadding>
                {cartData.products.map((item, index) => {
                    const originalPrice = parseFloat(item.price);
                    const finalPrice = calculateDiscountedPrice(item.price, item.discount_percentage);
                    const hasDiscount = parseFloat(item.discount_percentage) > 0;

                    return (
                        <React.Fragment key={`${item.product.product_id}-${index}`}>
                            <StyledListItem>
                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <Box sx={{ flex: 1, pr: 2 }}>
                                        <ProductName variant="body1">
                                            {item.product.name}
                                        </ProductName>
                                        <Box sx={{ mt: 0.5 }}>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                fontFamily={typography.fontFamily}
                                            >
                                                Cantidad: {item.quantity}
                                            </Typography>
                                            {hasDiscount && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#2e7d32',
                                                        fontFamily: typography.fontFamily,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 600,
                                                        mt: 0.5,
                                                        bgcolor: '#e8f5e9',
                                                        py: 0.2,
                                                        px: 0.8,
                                                        borderRadius: 1
                                                    }}
                                                >
                                                    -{item.discount_percentage}%
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                        {hasDiscount && (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    textDecoration: 'line-through',
                                                    color: 'text.secondary',
                                                    fontSize: '0.8rem',
                                                    fontFamily: typography.fontFamily
                                                }}
                                            >
                                                {formatPrice(originalPrice * item.quantity)}
                                            </Typography>
                                        )}
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: 600,
                                                fontFamily: typography.fontFamily,
                                                color: hasDiscount ? '#2e7d32' : 'text.primary'
                                            }}
                                        >
                                            {formatPrice(finalPrice * item.quantity)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </StyledListItem>
                            {index < cartData.products.length - 1 && (
                                <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                            )}
                        </React.Fragment>
                    );
                })}

                <Divider sx={{
                    my: 2,
                    borderColor: '#e0e0e0',
                    borderWidth: 1
                }} />

                <StyledListItem>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, fontFamily: typography.fontFamily }}
                        >
                            Subtotal
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: 600, fontFamily: typography.fontFamily }}
                        >
                            {formatPrice(subtotal)}
                        </Typography>
                    </Box>
                </StyledListItem>

                <StyledListItem>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocalShippingOutlinedIcon
                                    sx={{
                                        fontSize: 18,
                                        mr: 1,
                                        color: isFreeShipping ? '#2e7d32' : 'text.secondary'
                                    }}
                                />
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 500,
                                        fontFamily: typography.fontFamily,
                                        color: isFreeShipping ? '#2e7d32' : 'inherit'
                                    }}
                                >
                                    Gastos de envío
                                </Typography>
                            </Box>
                            {isFreeShipping && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        ml: 3.5,
                                        color: '#2e7d32',
                                        fontFamily: typography.fontFamily,
                                        fontWeight: 500
                                    }}
                                >
                                    ¡Envío gratis por compra superior a 50€!
                                </Typography>
                            )}
                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                            {isFreeShipping ? (
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            textDecoration: 'line-through',
                                            color: 'text.secondary',
                                            fontSize: '0.8rem',
                                            fontFamily: typography.fontFamily
                                        }}
                                    >
                                        4.99 €
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 600,
                                            color: '#2e7d32',
                                            fontFamily: typography.fontFamily
                                        }}
                                    >
                                        GRATIS
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 600,
                                        fontFamily: typography.fontFamily
                                    }}
                                >
                                    {formatPrice(shippingCost)}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </StyledListItem>

                <TotalListItem>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 2
                    }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                fontFamily: typography.fontFamily
                            }}
                        >
                            Total
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                fontFamily: typography.fontFamily,
                                color: vistelicaColors.primary
                            }}
                        >
                            {formatPrice(totalPrice)}
                        </Typography>
                    </Box>
                </TotalListItem>

                {isFreeShipping && (
                    <Box
                        sx={{
                            mt: 2,
                            p: 1.5,
                            backgroundColor: '#e8f5e9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#1b5e20',
                                fontWeight: 500,
                                textAlign: 'center',
                                fontFamily: typography.fontFamily
                            }}
                        >
                            ¡Genial! Tu pedido incluye envío gratuito
                        </Typography>
                    </Box>
                )}
            </List>
        </OrderSummaryContainer>
    );
});

// Añadir displayName para herramientas de desarrollo
CartInfoSimplified.displayName = 'CartInfoSimplified';
export default CartInfoSimplified;