'use client';
import { vistelicaColors } from '../shared-theme/vistelicaColors';
import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    Box,
    CircularProgress,
    Divider
} from '@mui/material';
import { orderService } from '@/services/orderService';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const OrderDetailsPage = ({ params }) => {
    const { id } = params;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const orderDetails = await orderService.getOrderDetails(id);
                setOrder(orderDetails);
            } catch (err) {
                console.error('Error al obtener detalles del pedido:', err);
                setError(err.message || 'Error al cargar los detalles del pedido');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completado':
                return 'success';
            case 'suspender pedido':
                return 'warning';
            case 'En Proceso':
                return 'info';
            case 'Carrito':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const calculateTotal = () => {
        if (!order?.details) return 0;
        return order.details.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" py={4}>
                <Typography color="error">{error}</Typography>
                <Link href="/order-history" passHref>
                    <Button
                        variant="outlined"
                        sx={{ mt: 2, color: vistelicaColors.primary, borderColor: vistelicaColors.primary }}
                    >
                        Volver a mis pedidos
                    </Button>
                </Link>
            </Box>
        );
    }

    if (!order) {
        return (
            <Box textAlign="center" py={4}>
                <LocalShippingIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
                <Typography variant="h6" color="text.secondary" mt={2}>
                    No se encontró el pedido
                </Typography>
                <Link href="/account/orders" passHref>
                    <Button
                        variant="outlined"
                        sx={{ mt: 2, color: vistelicaColors.primary, borderColor: vistelicaColors.primary }}
                    >
                        Volver a mis pedidos
                    </Button>
                </Link>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Link href="/account/orders" passHref>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        sx={{ mb: 2, color: vistelicaColors.primary }}
                    >
                        Volver a mis pedidos
                    </Button>
                </Link>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4">
                        Detalles del Pedido #{order.order_id}
                    </Typography>
                    <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="medium"
                    />
                </Box>

                <TableContainer component={Paper} sx={{ mb: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell align="right">Precio Unitario</TableCell>
                                <TableCell align="right">Cantidad</TableCell>
                                <TableCell align="right">Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.details.map((item) => (
                                <TableRow key={item.product_id}>
                                    <TableCell>
                                        <Typography fontWeight="medium">
                                            {item.product_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ID: {item.product_id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        {parseFloat(item.price).toFixed(2)}€
                                    </TableCell>
                                    <TableCell align="right">
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell align="right">
                                        {(parseFloat(item.price) * item.quantity).toFixed(2)}€
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box display="flex" justifyContent="flex-end" mb={4}>
                    <Box sx={{ width: 300 }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography>Subtotal:</Typography>
                            <Typography>{calculateTotal().toFixed(2)}€</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography>Envío:</Typography>
                            <Typography>Gratis</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6">{calculateTotal().toFixed(2)}€</Typography>
                        </Box>
                    </Box>
                </Box>

                {order.status === 'Carrito' && (
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                            variant="outlined"
                            sx={{ color: vistelicaColors.primary, borderColor: vistelicaColors.primary }}
                        >
                            Continuar comprando
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: vistelicaColors.primary }}
                        >
                            Proceder al pago
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default OrderDetailsPage;