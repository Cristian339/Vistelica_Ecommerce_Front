'use client';

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
    CircularProgress,
    Chip,
    Box,
    Grid,
    useMediaQuery,
    useTheme,
    Fab
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { orderService } from '@/services/orderService';
import { getUserProfile } from '@/services/profileService';
import SidebarMenu from '@/components/layout/SidebarMenu';
import Navbar from "@/components/layout/HeaderComponent";
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import Link from 'next/link';

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

const UserOrdersPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Intenta cargar el perfil pero no bloquees la carga de pedidos
                try {
                    const profile = await getUserProfile();
                    setUserData(profile);
                } catch (profileError) {
                    console.error('Error al cargar el perfil:', profileError);
                    // No interrumpimos el flujo si falla el perfil
                }

                // Cargar pedidos desde la API
                const userOrders = await orderService.getOrdersByUser();
                setOrders(userOrders.orders);
            } catch (err) {
                console.error('Error al cargar los pedidos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading && orders.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

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

                    {/* Contenido principal - ancho completo en móviles */}
                    <Grid item xs={12} md={9} lg={9}>
                        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', p: { xs: 2, sm: 3 }, height: '100%' }}>
                            <Typography variant="h5" component="h1" fontWeight="500" sx={{ mb: 2 }}>
                                Mis Pedidos
                            </Typography>

                            {error ? (
                                <Box textAlign="center" py={4}>
                                    <Typography color="error">{error}</Typography>
                                </Box>
                            ) : orders.length === 0 ? (
                                <Box textAlign="center" py={4}>
                                    <Typography variant="h6" color="text.secondary">
                                        No tienes pedidos aún.
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer component={Paper} sx={{ mt: 2 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Número de Pedido</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Fecha de reparto</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orders.map((order, index) => (
                                                <TableRow
                                                    key={order.order_id}
                                                    component={Link}
                                                    href={`/account/order-history/OrderDetailsPage?id=${order.order_id}`}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                                            cursor: 'pointer'
                                                        },
                                                        textDecoration: 'none',
                                                        color: 'inherit'
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Typography
                                                            sx={{
                                                                color: vistelicaColors.primary,
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {order.order_number}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={order.status}
                                                            color={getStatusColor(order.status)}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(order.estimated_delivery_date).toLocaleDateString('es-ES')}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                                                        {parseFloat(order.total_price).toFixed(2)}€
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
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

export default UserOrdersPage;