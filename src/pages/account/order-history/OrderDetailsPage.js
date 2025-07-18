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
import { vistelicaColors } from "@/components/shared/vistelicaColors";
import { typography } from '@/components/shared/themePrimitives';
import { motion } from 'framer-motion';

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
    const orderId = searchParams.get('id');

    const [userData, setUserData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

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


    const userAvatar = userData?.avatar || userData?.profilePic;
    const userName = userData?.name || 'Usuario';


    const handleGoBack = () => {
        router.push('/account/order-history/UserOrdersPage');
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
                backgroundColor: vistelicaColors.background
            }}>
                <CircularProgress sx={{ color: vistelicaColors.primary }} />
            </Box>
        );
    }

    if (error || !orderData) {
        return (
            <Box sx={{ backgroundColor: vistelicaColors.background, minHeight: '100vh' }}>
                <Navbar />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box textAlign="center" py={8}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: vistelicaColors.error,
                                ...typography.h6,
                                mb: 2
                            }}
                        >
                            {error || 'Pedido no encontrado'}
                        </Typography>
                        <IconButton
                            onClick={handleGoBack}
                            sx={{
                                color: vistelicaColors.primary,
                                '&:hover': {
                                    backgroundColor: vistelicaColors.primaryLight
                                }
                            }}
                            aria-label="Volver atrás"
                        >
                            <ArrowBack />
                        </IconButton>
                    </Box>
                </Container>
            </Box>
        );
    }

    const calculateSubtotal = () => {
        return orderData.details.reduce((sum, detail) => {
            return sum + (parseFloat(detail.price) * detail.quantity);
        }, 0);
    };

    return (
        <Box sx={{ backgroundColor: vistelicaColors.background, minHeight: '100vh' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                <Grid container spacing={2} sx={{
                    flexWrap: { xs: 'wrap', md: 'nowrap' }
                }}>
                    {/* Sidebar solo visible en desktop */}
                    {!isMobile && (
                        <Grid size={{ xs: 12, md: 3, lg: 5 }}>
                            <Box sx={{ position: 'sticky', top: 24 }}>
                                <SidebarMenu
                                    username={userName}
                                    avatarUrl={userAvatar}
                                    key="desktop-sidebar"
                                />
                            </Box>
                        </Grid>
                    )}

                    {/* Contenido principal */}
                    <Grid size={{ xs: 12, md: 9, lg: 9 }}>
                        <Box
                            component={motion.div}
                            initial="hidden"
                            animate="visible"
                            variants={contentVariants}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    p: { xs: 2, sm: 3 },
                                    borderRadius: 2,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    background: 'linear-gradient(to bottom right, #fdfbf6, #fff)',
                                    border: `1px solid ${vistelicaColors.divider}`,
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Header con botón de regreso */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <IconButton
                                        onClick={handleGoBack}
                                        sx={{
                                            mr: 2,
                                            color: vistelicaColors.primary,
                                            '&:hover': { backgroundColor: vistelicaColors.hoverLight }
                                        }}
                                        aria-label="Volver a la lista de pedidos"
                                    >
                                        <ArrowBack />
                                    </IconButton>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h5" component="h1" fontWeight="500">
                                            Pedido #{orderData.order_number}
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
                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                                            Productos
                                        </Typography>

                                        {orderData.details.map((detail, index) => (
                                            <Card key={detail.order_detail_id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                                                <CardContent>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid size={{ xs: 12, sm: 8 }}>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    fontSize: '1.1rem',
                                                                    mb: 1,
                                                                    ...typography.subtitle1,
                                                                    color: vistelicaColors.primary
                                                                }}
                                                            >
                                                                {detail.product.name}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    mb: 2,
                                                                    ...typography.body2,
                                                                    color: vistelicaColors.secondary
                                                                }}
                                                            >
                                                                {detail.product.description}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                <Chip
                                                                    label={`Talla: ${detail.size}`}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{
                                                                        borderColor: vistelicaColors.primary,
                                                                        ...typography.caption
                                                                    }}
                                                                />
                                                                <Chip
                                                                    label={`Color: ${detail.color}`}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{
                                                                        borderColor: vistelicaColors.primary,
                                                                        ...typography.caption
                                                                    }}
                                                                />
                                                                <Chip
                                                                    label={`Cantidad: ${detail.quantity}`}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{
                                                                        borderColor: vistelicaColors.primary,
                                                                        ...typography.caption
                                                                    }}
                                                                />
                                                                {detail.product.discount_percentage > 0 && (
                                                                    <Chip
                                                                        label={`-${detail.product.discount_percentage}%`}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: vistelicaColors.error,
                                                                            color: 'white',
                                                                            ...typography.caption
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Grid>
                                                        <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    ...typography.subtitle1,
                                                                    color: vistelicaColors.primary
                                                                }}
                                                            >
                                                                {(parseFloat(detail.price) * detail.quantity).toFixed(2)}€
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: vistelicaColors.secondary,
                                                                    ...typography.body2
                                                                }}
                                                            >
                                                                {detail.price}€ x {detail.quantity}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        ))}

                                        {/* Resumen de precios */}
                                        <Paper
                                            sx={{
                                                p: 2,
                                                mt: 3,
                                                backgroundColor: vistelicaColors.backgroundLight,
                                                borderRadius: 1,
                                                border: `1px solid ${vistelicaColors.borderLight}`
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography sx={{ ...typography.body1, color: vistelicaColors.secondary }}>
                                                    Subtotal:
                                                </Typography>
                                                <Typography sx={{ ...typography.body1, color: vistelicaColors.primary }}>
                                                    {calculateSubtotal().toFixed(2)}€
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography sx={{ ...typography.body1, color: vistelicaColors.secondary }}>
                                                    Envío:
                                                </Typography>
                                                <Typography sx={{ ...typography.body1, color: vistelicaColors.primary }}>
                                                    {parseFloat(orderData.shipping_cost) === 0 ? 'Gratis' : `${orderData.shipping_cost}€`}
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ my: 1, borderColor: vistelicaColors.divider }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 600,
                                                        ...typography.subtitle1,
                                                        color: vistelicaColors.primary
                                                    }}
                                                >
                                                    Total:
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 600,
                                                        ...typography.subtitle1,
                                                        color: vistelicaColors.primary
                                                    }}
                                                >
                                                    {parseFloat(orderData.total_price).toFixed(2)}€
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>

                                    {/* Información lateral */}
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        {/* Dirección de envío */}
                                        <Card
                                            sx={{
                                                mb: 2,
                                                border: `1px solid ${vistelicaColors.borderLight}`,
                                                borderRadius: 1,
                                                backgroundColor: vistelicaColors.surface
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <LocationOn sx={{ mr: 1, color: vistelicaColors.primary }} />
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontSize: '1rem',
                                                            fontWeight: 500,
                                                            ...typography.subtitle1,
                                                            color: vistelicaColors.primary
                                                        }}
                                                    >
                                                        Dirección de Envío
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ mb: 0.5, ...typography.body2 }}>
                                                    {orderData.address.label}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 0.5, ...typography.body2 }}>
                                                    {orderData.address.street}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 0.5, ...typography.body2 }}>
                                                    {orderData.address.city}, {orderData.address.state}
                                                </Typography>
                                                <Typography variant="body2" sx={{ ...typography.body2 }}>
                                                    {orderData.address.postal_code}, {orderData.address.country}
                                                </Typography>
                                            </CardContent>
                                        </Card>

                                        {/* Información de pago */}
                                        <Card
                                            sx={{
                                                mb: 2,
                                                border: `1px solid ${vistelicaColors.borderLight}`,
                                                borderRadius: 1,
                                                backgroundColor: vistelicaColors.surface
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Payment sx={{ mr: 1, color: vistelicaColors.primary }} />
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontSize: '1rem',
                                                            fontWeight: 500,
                                                            ...typography.subtitle1,
                                                            color: vistelicaColors.primary
                                                        }}
                                                    >
                                                        Información de Pago
                                                    </Typography>
                                                </Box>
                                                {orderData.payments.map((payment) => (
                                                    <Box key={payment.payment_id}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    ...typography.body2,
                                                                    color: vistelicaColors.secondary
                                                                }}
                                                            >
                                                                Método:
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    ...typography.body2,
                                                                    color: vistelicaColors.primary
                                                                }}
                                                            >
                                                                {payment.payment_method}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    ...typography.body2,
                                                                    color: vistelicaColors.secondary
                                                                }}
                                                            >
                                                                Estado:
                                                            </Typography>
                                                            <Chip
                                                                label={payment.payment_status}
                                                                color={getPaymentStatusColor(payment.payment_status)}
                                                                size="small"
                                                                sx={{ ...typography.caption }}
                                                            />
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    ...typography.body2,
                                                                    color: vistelicaColors.secondary
                                                                }}
                                                            >
                                                                Fecha:
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    ...typography.body2,
                                                                    color: vistelicaColors.primary
                                                                }}
                                                            >
                                                                {new Date(payment.payment_date).toLocaleDateString('es-ES')}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    ...typography.body2,
                                                                    color: vistelicaColors.secondary
                                                                }}
                                                            >
                                                                Monto:
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    ...typography.body2,
                                                                    color: vistelicaColors.primary
                                                                }}
                                                            >
                                                                {parseFloat(payment.amount).toFixed(2)}€
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </CardContent>
                                        </Card>

                                        {/* Estado de envío */}
                                        <Card
                                            sx={{
                                                border: `1px solid ${vistelicaColors.borderLight}`,
                                                borderRadius: 1,
                                                backgroundColor: vistelicaColors.surface
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <LocalShipping sx={{ mr: 1, color: vistelicaColors.primary }} />
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontSize: '1rem',
                                                            fontWeight: 500,
                                                            ...typography.subtitle1,
                                                            color: vistelicaColors.primary
                                                        }}
                                                    >
                                                        Estado de Envío
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            ...typography.body2,
                                                            color: vistelicaColors.secondary
                                                        }}
                                                    >
                                                        Estado actual:
                                                    </Typography>
                                                    <Chip
                                                        label={orderData.status}
                                                        color={getStatusColor(orderData.status)}
                                                        size="small"
                                                        sx={{ ...typography.caption }}
                                                    />
                                                </Box>
                                                {orderData.estimated_delivery_date && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                ...typography.body2,
                                                                color: vistelicaColors.secondary
                                                            }}
                                                        >
                                                            Entrega estimada:
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                ...typography.body2,
                                                                color: vistelicaColors.primary
                                                            }}
                                                        >
                                                            {new Date(orderData.estimated_delivery_date).toLocaleDateString('es-ES')}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {orderData.delivered_at && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                ...typography.body2,
                                                                color: vistelicaColors.secondary
                                                            }}
                                                        >
                                                            Entregado:
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 500,
                                                                ...typography.body2,
                                                                color: vistelicaColors.success
                                                            }}
                                                        >
                                                            {new Date(orderData.delivered_at).toLocaleDateString('es-ES')}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Botón flotante para mostrar sidebar en móvil */}
            {isMobile && (
                <Fab
                    aria-label="Abrir menú de usuario"
                    onClick={() => setSidebarOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        backgroundColor: vistelicaColors.primary,
                        color: 'white',
                        '&:hover': {
                            backgroundColor: vistelicaColors.secondary
                        },
                        transition: 'background-color 0.3s',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        zIndex: 1050
                    }}
                >
                    <MenuIcon />
                </Fab>
            )}

            {/* SidebarMenu para móvil como drawer */}
            {isMobile && (
                <SidebarMenu
                    username={userName}
                    avatarUrl={userAvatar}
                    drawerOpen={sidebarOpen}
                    setDrawerOpen={setSidebarOpen}
                    key="mobile-sidebar"
                />
            )}
        </Box>
    );
};

export default OrderDetailsPage;
