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
    Box
} from '@mui/material';
import { orderService } from '@/services/orderService';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Link from 'next/link';

const OrdersPage = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('User ID recibido:', userId); // Para depuración
        const fetchOrders = async () => {
            try {
                const userOrders = await orderService.getOrdersByUser(userId);
                console.log('Pedidos recibidos:', userOrders); // Para ver la estructura real
                setOrders(userOrders);
            } catch (err) {
                console.error('Error al obtener pedidos:', err); // Más detalle del error
                setError(err.message || 'Error al cargar los pedidos');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [userId]);

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

    if (loading) return <Typography>Cargando pedidos...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Mis Pedidos
            </Typography>

            {orders.length === 0 ? (
                <Box textAlign="center" py={4}>
                    <LocalShippingIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
                    <Typography variant="h6" color="text.secondary" mt={2}>
                        No tienes pedidos realizados
                    </Typography>
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>N° Pedido</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Dirección</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.order_id}>
                                    <TableCell>#{order.order_id}</TableCell>
                                    <TableCell>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status}
                                            color={getStatusColor(order.status)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {order.address || 'No especificada'}
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/account/orders/${order.order_id}`} passHref>
                                            <Button variant="outlined" size="small" sx={{ color: vistelicaColors.primary, borderColor: vistelicaColors.primary }}>
                                                Ver Detalle
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default OrdersPage;