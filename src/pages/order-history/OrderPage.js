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
    Dialog,
    DialogTitle,
    DialogContent,
    Divider,
    IconButton
} from '@mui/material';
import { orderService } from '@/services/orderService';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Link from 'next/link';
import CloseIcon from '@mui/icons-material/Close';

const OrdersPage = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userOrders = await orderService.getOrdersByUser(userId);
                setOrders(userOrders);
            } catch (err) {
                console.error('Error al obtener pedidos:', err);
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
            case 'Completado': return 'success';
            case 'suspender pedido': return 'warning';
            case 'En Proceso': return 'info';
            case 'Carrito': return 'secondary';
            default: return 'default';
        }
    };

    const handleViewDetails = async (order) => {
        setDetailsLoading(true);
        setModalOpen(true);
        try {
            const orderDetails = await orderService.getOrderDetails(order.order_id);
            setSelectedOrder(orderDetails);
        } catch (err) {
            console.error('Error al cargar detalles:', err);
            setError('Error al cargar los detalles del pedido');
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    const calculateTotal = (order) => {
        if (!order?.details || !Array.isArray(order.details)) return 0;
        return order.details.reduce((total, item) => {
            return total + (parseFloat(item.price || 0) * (item.quantity || 0));
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
                <Button
                    onClick={() => window.location.reload()}
                    sx={{ mt: 2 }}
                >
                    Reintentar
                </Button>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box my={4}>
                <Typography variant="h4" gutterBottom sx={{
                    color: vistelicaColors.primaryDark,
                    fontWeight: 'bold',
                    mb: 4,
                    position: 'relative',
                    '&:after': {
                        content: '""',
                        display: 'block',
                        width: '80px',
                        height: '4px',
                        backgroundColor: vistelicaColors.primary,
                        mt: 1
                    }
                }}>
                    Mis Pedidos
                </Typography>

                {orders.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <LocalShippingIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
                        <Typography variant="h6" color="text.secondary" mt={2}>
                            No tienes pedidos realizados
                        </Typography>
                        <Link href="/products" passHref>
                            <Button
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    backgroundColor: vistelicaColors.primary,
                                    '&:hover': {
                                        backgroundColor: vistelicaColors.primaryDark
                                    }
                                }}
                            >
                                Ver productos
                            </Button>
                        </Link>
                    </Box>
                ) : (
                    <TableContainer
                        component={Paper}
                        sx={{
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            overflow: 'hidden'
                        }}
                    >
                        <Table>
                            <TableHead sx={{ backgroundColor: vistelicaColors.tertiaryLight }}>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        color: vistelicaColors.primaryDark
                                    }}>N° Pedido</TableCell>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        color: vistelicaColors.primaryDark
                                    }}>Fecha</TableCell>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        color: vistelicaColors.primaryDark
                                    }}>Estado</TableCell>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        color: vistelicaColors.primaryDark
                                    }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow
                                        key={order.order_id}
                                        sx={{
                                            '&:nth-of-type(even)': {
                                                backgroundColor: '#f9f9f9'
                                            },
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5'
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 'medium' }}>
                                            #{order.order_id}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(order.created_at).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.status}
                                                color={getStatusColor(order.status)}
                                                sx={{
                                                    fontWeight: 'medium',
                                                    minWidth: 120
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    color: vistelicaColors.primary,
                                                    borderColor: vistelicaColors.primary,
                                                    '&:hover': {
                                                        backgroundColor: vistelicaColors.tertiary,
                                                        borderColor: vistelicaColors.primaryDark
                                                    },
                                                    fontWeight: 'medium',
                                                    textTransform: 'none',
                                                    borderRadius: 1,
                                                    px: 2,
                                                    py: 1
                                                }}
                                                onClick={() => handleViewDetails(order)}
                                            >
                                                Ver Detalle
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>

            {/* Modal de Detalles (sin cambios) */}
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            Productos del Pedido #{selectedOrder?.order_id || ''}
                        </Typography>
                        <IconButton onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {detailsLoading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        selectedOrder && (
                            <>
                                <Box mb={3}>
                                    <Typography component="span" sx={{ mr: 1 }}>Estado:</Typography>
                                    <Chip
                                        label={selectedOrder.status}
                                        color={getStatusColor(selectedOrder.status)}
                                        size="small"
                                    />
                                </Box>

                                {selectedOrder.details?.length > 0 ? (
                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                        gap: 2,
                                        mt: 2
                                    }}>
                                        {selectedOrder.details.map((item) => (
                                            <Paper
                                                key={`${item.product_id}`}
                                                elevation={2}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    borderLeft: `4px solid ${vistelicaColors.primary}`,
                                                    transition: 'transform 0.2s',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: 3
                                                    }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Box sx={{
                                                        width: 40,
                                                        height: 40,
                                                        bgcolor: vistelicaColors.tertiaryLight,
                                                        borderRadius: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mr: 2
                                                    }}>
                                                        <LocalShippingIcon fontSize="small" />
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            variant="subtitle1"
                                                            fontWeight="medium"
                                                            sx={{
                                                                color: vistelicaColors.primaryDark,
                                                                lineHeight: 1.2
                                                            }}
                                                        >
                                                            {item.product_name}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{ display: 'block' }}
                                                        >
                                                            ID: {item.product_id}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Divider sx={{ my: 1 }} />

                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    mt: 1
                                                }}>
                                                    <Typography variant="body2">
                                                        <Box component="span" sx={{ color: 'text.secondary' }}>Cantidad:</Box> {item.quantity}
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {parseFloat(item.price || 0).toFixed(2)}€
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Box>
                                ) : (
                                    <Box textAlign="center" py={4}>
                                        <Typography color="text.secondary">
                                            No hay productos en este pedido
                                        </Typography>
                                    </Box>
                                )}
                            </>
                        )
                    )}
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default OrdersPage;