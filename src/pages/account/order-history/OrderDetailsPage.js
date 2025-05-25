'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Divider,
    Chip,
    CircularProgress,
    IconButton,
    Card,
    CardContent,
    Avatar,
    useMediaQuery,
    useTheme,
    Fab
} from '@mui/material';
import {
    ArrowBack,
    LocationOn,
    Payment,
    LocalShipping,
    Schedule,
    Menu as MenuIcon
} from '@mui/icons-material';
import { orderService } from '@/services/orderService';
import { getUserProfile } from '@/services/profileService';
import SidebarMenu from '@/components/layout/SidebarMenu';
import Navbar from "@/components/layout/HeaderComponent";
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'completado':
            return 'success';
        case 'suspender pedido':
            return 'warning';
        case 'en proceso':
            return 'info';
        case 'carrito':
            return 'secondary';
        case 'almacen':
            return 'primary';
        default:
            return 'default';
    }
};

const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'completado':
            return 'success';
        case 'pendiente':
            return 'warning';
        case 'fallido':
            return 'error';
        default:
            return 'default';
    }
};

const OrderDetailsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id'); // Cambio aquí

    const [userData, setUserData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!orderId) {
                setError('ID de pedido no encontrado');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Cargar perfil de usuario
                try {
                    const profile = await getUserProfile();
                    setUserData(profile);
                } catch (profileError) {
                    console.error('Error al cargar el perfil:', profileError);
                }

                // Cargar detalles del pedido
                const orderDetails = await orderService.getOrderDetails(orderId);
                setOrderData(orderDetails.order);
            } catch (err) {
                console.error('Error al cargar los detalles del pedido:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [orderId]);

    const handleGoBack = () => {
        router.push('/account/order-history/UserOrdersPage'); // Asegúrate de que esta ruta sea correcta
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !orderData) {
        return (
            <div>
                <Navbar />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box textAlign="center" py={8}>
                        <Typography variant="h6" color="error" gutterBottom>
                            {error || 'Pedido no encontrado'}
                        </Typography>
                        <IconButton onClick={handleGoBack} sx={{ mt: 2 }}>
                            <ArrowBack />
                        </IconButton>
                    </Box>
                </Container>
            </div>
        );
    }

    const calculateSubtotal = () => {
        return orderData.details.reduce((sum, detail) => {
            return sum + (parseFloat(detail.price) * detail.quantity);
        }, 0);
    };

    return (
        <div>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                <Grid container spacing={2} sx={{
                    flexWrap: { xs: 'wrap', md: 'nowrap' }
                }}>
                    {/* Sidebar solo visible en desktop */}
                    {!isMobile && (
                        <Grid item md={3} lg={3}>
                            <SidebarMenu username={userData?.name || 'Usuario'} />
                        </Grid>
                    )}

                    {/* Contenido principal */}
                    <Grid item xs={12} md={9} lg={9}>
                        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', p: { xs: 2, sm: 3 } }}>
                            {/* Header con botón de regreso */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <IconButton
                                    onClick={handleGoBack}
                                    sx={{ mr: 2, color: vistelicaColors.primary }}
                                >
                                    <ArrowBack />
                                </IconButton>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" component="h1" fontWeight="500">
                                        Pedido #{orderData.order_id}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Realizado el {new Date(orderData.created_at).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={orderData.status}
                                    color={getStatusColor(orderData.status)}
                                    sx={{ fontWeight: 500 }}
                                />
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                {/* Información del pedido */}
                                <Grid item xs={12} md={8}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                                        Productos
                                    </Typography>

                                    {orderData.details.map((detail, index) => (
                                        <Card key={detail.order_detail_id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                                            <CardContent>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={12} sm={8}>
                                                        <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>
                                                            {detail.product.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                            {detail.product.description}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                            <Chip label={`Talla: ${detail.size}`} size="small" variant="outlined" />
                                                            <Chip label={`Color: ${detail.color}`} size="small" variant="outlined" />
                                                            <Chip label={`Cantidad: ${detail.quantity}`} size="small" variant="outlined" />
                                                            {detail.product.discount_percentage > 0 && (
                                                                <Chip
                                                                    label={`-${detail.product.discount_percentage}%`}
                                                                    size="small"
                                                                    color="error"
                                                                />
                                                            )}
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            {(parseFloat(detail.price) * detail.quantity).toFixed(2)}€
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {detail.price}€ x {detail.quantity}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {/* Resumen de precios */}
                                    <Paper sx={{ p: 2, mt: 3, backgroundColor: '#f9f9f9' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography>Subtotal:</Typography>
                                            <Typography>{calculateSubtotal().toFixed(2)}€</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography>Envío:</Typography>
                                            <Typography>
                                                {parseFloat(orderData.shipping_cost) === 0 ? 'Gratis' : `${orderData.shipping_cost}€`}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                Total:
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {parseFloat(orderData.total_price).toFixed(2)}€
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Información lateral */}
                                <Grid item xs={12} md={4}>
                                    {/* Dirección de envío */}
                                    <Card sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <LocationOn sx={{ mr: 1, color: vistelicaColors.primary }} />
                                                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                                                    Dirección de Envío
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                {orderData.address.label}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                {orderData.address.street}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                {orderData.address.city}, {orderData.address.state}
                                            </Typography>
                                            <Typography variant="body2">
                                                {orderData.address.postal_code}, {orderData.address.country}
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    {/* Información de pago */}
                                    <Card sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Payment sx={{ mr: 1, color: vistelicaColors.primary }} />
                                                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                                                    Información de Pago
                                                </Typography>
                                            </Box>
                                            {orderData.payments.map((payment, index) => (
                                                <Box key={payment.payment_id}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="body2">Método:</Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {payment.payment_method}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="body2">Estado:</Typography>
                                                        <Chip
                                                            label={payment.payment_status}
                                                            color={getPaymentStatusColor(payment.payment_status)}
                                                            size="small"
                                                        />
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="body2">Fecha:</Typography>
                                                        <Typography variant="body2">
                                                            {new Date(payment.payment_date).toLocaleDateString('es-ES')}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="body2">Monto:</Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {parseFloat(payment.amount).toFixed(2)}€
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Estado de envío */}
                                    <Card sx={{ border: '1px solid #e0e0e0' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <LocalShipping sx={{ mr: 1, color: vistelicaColors.primary }} />
                                                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                                                    Estado de Envío
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2">Estado actual:</Typography>
                                                <Chip
                                                    label={orderData.status}
                                                    color={getStatusColor(orderData.status)}
                                                    size="small"
                                                />
                                            </Box>
                                            {orderData.estimated_delivery_date && (
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2">Entrega estimada:</Typography>
                                                    <Typography variant="body2">
                                                        {new Date(orderData.estimated_delivery_date).toLocaleDateString('es-ES')}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {orderData.delivered_at && (
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Entregado:</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {new Date(orderData.delivered_at).toLocaleDateString('es-ES')}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Botón flotante para mostrar sidebar en móvil */}
            {isMobile && (
                <Fab
                    color="primary"
                    aria-label="menu"
                    onClick={() => setSidebarOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        backgroundColor: vistelicaColors.primary,
                        '&:hover': {
                            backgroundColor: vistelicaColors.secondary
                        },
                        zIndex: 1050
                    }}
                >
                    <MenuIcon />
                </Fab>
            )}

            {/* SidebarMenu para móvil como drawer */}
            {isMobile && (
                <SidebarMenu
                    username={userData?.name || 'Usuario'}
                    drawerOpen={sidebarOpen}
                    setDrawerOpen={setSidebarOpen}
                />
            )}
        </div>
    );
};

export default OrderDetailsPage;