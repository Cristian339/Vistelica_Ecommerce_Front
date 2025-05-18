"use client";

import * as React from 'react';
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import cartService from '@/services/cartService'; // Importamos el servicio de carrito

export default function CartInfo() {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const orders = await cartService.getUserOrders();

                // Filtrar solo el pedido con estado "Carrito"
                const cartOrder = orders.orders.find(order => order.status === "Carrito");
                setOrderData(cartOrder);
                setLoading(false);
            } catch (error) {
                setError(error.message || 'Error al obtener los pedidos del usuario');
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);

    // Función para calcular el total de todos los productos
    const calculateSubtotal = (items) => {
        if (!items || items.length === 0) return 0;
        return items.reduce((sum, item) => sum + (item.final_price * item.quantity), 0);
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
    if (!orderData) return <Typography variant="body1">No hay productos en el carrito</Typography>;

    const subtotal = calculateSubtotal(orderData.orderDetails);
    const shippingCost = calculateShippingCost(subtotal);
    const totalPrice = subtotal + shippingCost;

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Resumen del pedido
            </Typography>
            <List disablePadding>
                {orderData.orderDetails.map((item) => (
                    <ListItem key={item.order_detail_id} sx={{ py: 1, px: 0 }}>
                        <ListItemText
                            sx={{ mr: 2 }}
                            primary={item.product_name}
                            secondary={`Cantidad: ${item.quantity}`}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {formatPrice(item.final_price * item.quantity)}
                        </Typography>
                    </ListItem>
                ))}

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
                        secondary={subtotal >= 50 ? "¡Envío gratis!" : ""}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {formatPrice(shippingCost)}
                    </Typography>
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