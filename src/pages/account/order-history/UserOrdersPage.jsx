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
import { typography } from '@/pages/shared-theme/themePrimitives';
import Link from 'next/link';
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

const UserOrdersPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    width: '100%',
                }}
            >
                <CircularProgress sx={{ color: vistelicaColors.primary }} />
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: vistelicaColors.background, minHeight: '100vh' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                <Grid container spacing={2} sx={{
                    flexWrap: { xs: 'wrap', md: 'nowrap' }
                }}>
                    {/* Sidebar solo visible en desktop */}
                    {!isMobile && (
                        <Grid size={{ xs: 12, md: 3, lg: 5.5 }}>
                            <Box sx={{ position: 'sticky', top: 24 }}>
                                <SidebarMenu username={userData?.name || 'Usuario'} />
                            </Box>
                        </Grid>
                    )}

                    {/* Contenido principal - ancho completo en móviles */}
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
                                <Typography
                                    variant="h5"
                                    component="h1"
                                    sx={{
                                        mb: 2,
                                        color: vistelicaColors.primary,
                                        ...typography.h3
                                    }}
                                >
                                    Mis Pedidos
                                </Typography>

                                {error ? (
                                    <Box textAlign="center" py={4}>
                                        <Typography color="error">{error}</Typography>
                                    </Box>
                                ) : orders.length === 0 ? (
                                    <Box textAlign="center" py={4}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: vistelicaColors.secondary
                                            }}
                                        >
                                            No tienes pedidos aún.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            mt: 2,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            boxShadow: 'none',
                                            border: `1px solid ${vistelicaColors.primaryLight}`
                                        }}
                                    >
                                        <Table aria-label="Historial de pedidos">
                                            <TableHead sx={{ backgroundColor: vistelicaColors.primary }}>
                                                <TableRow>
                                                    <TableCell
                                                        sx={{
                                                            fontWeight: 400,
                                                            ...typography.subtitle1,
                                                            color: vistelicaColors.secondary
                                                        }}
                                                    >
                                                        Número de Pedido
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontWeight: 400,
                                                            ...typography.subtitle1,
                                                            color: vistelicaColors.secondary
                                                        }}
                                                    >
                                                        Estado
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontWeight: 400,
                                                            ...typography.subtitle1,
                                                            color: vistelicaColors.secondary
                                                        }}
                                                    >
                                                        Fecha de reparto
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{
                                                            fontWeight: 400,
                                                            ...typography.subtitle1,
                                                            color: vistelicaColors.secondary
                                                        }}
                                                    >
                                                        Total
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orders.map((order) => (
                                                    <TableRow
                                                        key={order.order_id}
                                                        component={Link}
                                                        href={`/account/order-history/OrderDetailsPage?id=${order.order_id}`}
                                                        sx={{
                                                            '&:hover': {
                                                                backgroundColor: vistelicaColors.hoverLight,
                                                                cursor: 'pointer'
                                                            },
                                                            textDecoration: 'none',
                                                            color: 'inherit',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <Typography
                                                                sx={{
                                                                    color: vistelicaColors.primary,
                                                                    fontWeight: 500,
                                                                    ...typography.body1
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
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    ...typography.caption
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ ...typography.body2 }}>
                                                            {new Date(order.estimated_delivery_date).toLocaleDateString('es-ES')}
                                                        </TableCell>
                                                        <TableCell
                                                            align="right"
                                                            sx={{
                                                                fontWeight: 400,
                                                                ...typography.body1,
                                                                color: vistelicaColors.primary
                                                            }}
                                                        >
                                                            {parseFloat(order.total_price).toFixed(2)}€
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Botón flotante para mostrar sidebar en móvil */}
            {isMobile && (
                <Fab
                    color="primary"
                    aria-label="Abrir menú de usuario"
                    onClick={() => setSidebarOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        backgroundColor: vistelicaColors.primary,
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
                    username={userData?.name || 'Usuario'}
                    drawerOpen={sidebarOpen}
                    setDrawerOpen={setSidebarOpen}
                />
            )}
        </Box>
    );
};

export default UserOrdersPage;