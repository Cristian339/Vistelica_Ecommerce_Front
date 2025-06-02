'use client';

import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Button,
    Collapse,
    List,
    ListItem,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    IconButton,
    Fab,
    useMediaQuery,
    useTheme, Paper
} from '@mui/material';
import SidebarMenu from '@/components/layout/SidebarMenu';
import { requestRefund, getDeliveredOrdersWithDetails } from '@/services/productService';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from '@/pages/shared-theme/themePrimitives';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Navbar from "@/components/layout/HeaderComponent";
import MenuIcon from '@mui/icons-material/Menu';

const RefundPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [refundDialog, setRefundDialog] = useState({
        open: false,
        orderDetailId: null,
        productName: ''
    });
    const [successDialog, setSuccessDialog] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [processingRefund, setProcessingRefund] = useState(false);

    // Obtener los pedidos entregados
    useEffect(() => {
        const fetchDeliveredOrders = async () => {
            try {
                setLoading(true);
                console.log("AQUI");
                const result = await getDeliveredOrdersWithDetails();
                console.log(JSON.stringify(result));
                if (result) {
                    console.log("ENTRO");
                    setOrders(result);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError('Error al cargar los pedidos');
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveredOrders();
    }, []);

    const handleToggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const handleOpenRefundDialog = (orderDetailId, productName) => {
        setRefundDialog({
            open: true,
            orderDetailId,
            productName
        });
    };

    const handleCloseRefundDialog = () => {
        setRefundDialog({
            open: false,
            orderDetailId: null,
            productName: ''
        });
        setRefundReason('');
    };

    const handleSubmitRefund = async () => {
        if (!refundReason.trim()) {
            setError('Por favor ingresa un motivo para la devolución');
            return;
        }

        try {
            setProcessingRefund(true);
            const result = await requestRefund(
                refundDialog.orderDetailId,
                refundReason
            );

            if (result.success) {
                // Actualizar el estado local con la devolución solicitada
                setOrders(orders.map(order => ({
                    ...order,
                    details: order.details.map(detail =>
                        detail.order_detail_id === refundDialog.orderDetailId
                            ? {
                                ...detail,
                                estado_devolucion: 'Revision',
                                motivo_devolucion: refundReason
                            }
                            : detail
                    )
                })));
                handleCloseRefundDialog();
                setSuccessDialog(true);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Error al procesar la devolución');
        } finally {
            setProcessingRefund(false);
        }
    };

    const getRefundStatusColor = (status) => {
        switch (status) {
            case 'Revision': return 'warning';
            case 'Aceptado': return 'success';
            case 'Rechazado': return 'error';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <div>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                <Grid container spacing={4}>
                    {/* Sidebar para desktop */}
                    {!isMobile && (
                        <Grid item md={3}>
                            <SidebarMenu />
                        </Grid>
                    )}

                    {/* Contenido principal */}
                    <Grid item xs={12} md={9}>
                        <Paper elevation={0} sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '12px',
                            p: { xs: 2, sm: 3 },
                            background: '#fff',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 3
                            }}>
                                <Typography variant="h4" component="h1" sx={{
                                    fontWeight: 600,
                                    color: vistelicaColors.primary,
                                    fontFamily: typography.fontFamily
                                }}>
                                    Mis Devoluciones
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3, borderColor: vistelicaColors.divider }} />

                            {loading ? (
                                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                                    <CircularProgress color="primary" />
                                </Box>
                            ) : error ? (
                                <Box
                                    bgcolor="error.light"
                                    p={2}
                                    borderRadius={2}
                                    textAlign="center"
                                    sx={{ borderLeft: `4px solid ${vistelicaColors.error}` }}
                                >
                                    <Typography color="error">{error}</Typography>
                                </Box>
                            ) : orders.length === 0 ? (
                                <Box
                                    textAlign="center"
                                    p={4}
                                    sx={{
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '8px',
                                        border: '1px dashed #e0e0e0'
                                    }}
                                >
                                    <AssignmentReturnIcon sx={{
                                        fontSize: 60,
                                        color: vistelicaColors.secondary,
                                        mb: 2
                                    }} />
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        No tienes pedidos entregados
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Cuando recibas un pedido, podrás solicitar devoluciones aquí.
                                    </Typography>
                                </Box>
                            ) : (
                                <List sx={{ width: '100%' }}>
                                    {orders.map((order) => (
                                        <Card
                                            key={order.order_id}
                                            sx={{
                                                mb: 3,
                                                borderRadius: '12px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                borderLeft: `4px solid ${vistelicaColors.primary}`,
                                                overflow: 'hidden',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                                                }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    p: 2,
                                                    backgroundColor: '#fafafa',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5'
                                                    }
                                                }}
                                                onClick={() => handleToggleOrder(order.order_id)}
                                            >
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="600">
                                                        Pedido #{order.order_number}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDate(order.created_at)} • ${order.total_price}
                                                    </Typography>
                                                </Box>
                                                <IconButton size="small">
                                                    {expandedOrder === order.order_id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                            </Box>

                                            <Collapse in={expandedOrder === order.order_id}>
                                                <Divider />
                                                <CardContent sx={{ p: 0 }}>
                                                    <List>
                                                        {order.details.map((detail) => (
                                                            <ListItem
                                                                key={detail.order_detail_id}
                                                                sx={{
                                                                    p: 2,
                                                                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                                                                    '&:last-child': { borderBottom: 'none' }
                                                                }}
                                                            >
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    width: '100%',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    <Box sx={{
                                                                        width: 60,
                                                                        height: 60,
                                                                        backgroundColor: '#f5f5f5',
                                                                        borderRadius: '8px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        mr: 2,
                                                                        flexShrink: 0
                                                                    }}>
                                                                        {/* Aquí iría la imagen del producto si estuviera disponible */}
                                                                        <AssignmentReturnIcon sx={{ color: vistelicaColors.secondary }} />
                                                                    </Box>

                                                                    <Box sx={{ flexGrow: 1 }}>
                                                                        <Typography variant="subtitle1" fontWeight="500">
                                                                            {detail.product.name}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Cantidad: {detail.quantity} • ${detail.price} c/u
                                                                        </Typography>
                                                                        {detail.estado_devolucion !== 'Nada' && (
                                                                            <Box sx={{ mt: 1 }}>
                                                                                <Chip
                                                                                    label={`Estado: ${detail.estado_devolucion}`}
                                                                                    color={getRefundStatusColor(detail.estado_devolucion)}
                                                                                    size="small"
                                                                                    sx={{
                                                                                        borderRadius: '4px',
                                                                                        fontWeight: 500
                                                                                    }}
                                                                                />
                                                                                {detail.motivo_devolucion && (
                                                                                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                                                                        "{detail.motivo_devolucion}"
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>
                                                                        )}
                                                                    </Box>

                                                                    {detail.estado_devolucion === 'Nada' && (
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="secondary"
                                                                            startIcon={<AssignmentReturnIcon />}
                                                                            onClick={() => handleOpenRefundDialog(
                                                                                detail.order_detail_id,
                                                                                detail.product.name
                                                                            )}
                                                                            sx={{
                                                                                ml: 2,
                                                                                minWidth: '120px',
                                                                                borderRadius: '8px',
                                                                                borderWidth: '2px',
                                                                                '&:hover': {
                                                                                    borderWidth: '2px'
                                                                                }
                                                                            }}
                                                                        >
                                                                            Devolver
                                                                        </Button>
                                                                    )}
                                                                </Box>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </CardContent>
                                            </Collapse>
                                        </Card>
                                    ))}
                                </List>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Diálogo para solicitar devolución */}
            <Dialog
                open={refundDialog.open}
                onClose={handleCloseRefundDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: vistelicaColors.primaryLight,
                    borderBottom: `1px solid ${vistelicaColors.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 2.5
                }}>
                    <AssignmentReturnIcon sx={{ color: vistelicaColors.primary }} />
                    <Typography variant="h6" fontWeight="600">
                        Solicitar devolución
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Estás solicitando la devolución de: <strong>{refundDialog.productName}</strong>
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Motivo de la devolución"
                        placeholder="Describe el motivo de tu devolución..."
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        disabled={processingRefund}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': { borderColor: vistelicaColors.primary },
                                '&.Mui-focused fieldset': { borderColor: vistelicaColors.primary }
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: vistelicaColors.primary
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{
                    p: 2,
                    borderTop: `1px solid ${vistelicaColors.divider}`,
                    bgcolor: '#fafafa'
                }}>
                    <Button
                        onClick={handleCloseRefundDialog}
                        disabled={processingRefund}
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.05)'
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmitRefund}
                        color="primary"
                        variant="contained"
                        disabled={processingRefund || !refundReason.trim()}
                        sx={{
                            backgroundColor: vistelicaColors.primary,
                            '&:hover': {
                                backgroundColor: vistelicaColors.secondary
                            },
                            px: 3,
                            borderRadius: '8px'
                        }}
                        startIcon={processingRefund ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {processingRefund ? 'Enviando...' : 'Solicitar Devolución'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de éxito */}
            <Dialog
                open={successDialog}
                onClose={() => setSuccessDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        overflow: 'hidden',
                        maxWidth: '500px'
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: '#e8f5e9',
                    borderBottom: `1px solid ${vistelicaColors.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 2.5
                }}>
                    <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    <Typography variant="h6" fontWeight="600">
                        Solicitud recibida
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Typography variant="body1">
                        Tu solicitud de devolución ha sido enviada correctamente y está en proceso de revisión.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                        Te notificaremos por email cuando tengamos una respuesta.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{
                    p: 2,
                    borderTop: `1px solid ${vistelicaColors.divider}`,
                    bgcolor: '#fafafa'
                }}>
                    <Button
                        onClick={() => setSuccessDialog(false)}
                        variant="contained"
                        color="primary"
                        sx={{
                            backgroundColor: vistelicaColors.primary,
                            '&:hover': {
                                backgroundColor: vistelicaColors.secondary
                            },
                            px: 3,
                            borderRadius: '8px'
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Botón flotante para móvil */}
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

            {/* Sidebar para móvil */}
            {isMobile && (
                <SidebarMenu
                    drawerOpen={sidebarOpen}
                    setDrawerOpen={setSidebarOpen}
                />
            )}
        </div>
    );
};

export default RefundPage;