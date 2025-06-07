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
    useTheme,
    Paper,
    Avatar,
    Badge,
    Tooltip
} from '@mui/material';
import SidebarMenu from '@/components/layout/SidebarMenu';
import { requestRefund, getDeliveredOrdersWithDetails } from '@/services/productService';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from '@/pages/shared-theme/themePrimitives';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Close from '@mui/icons-material/Close';
import Navbar from "@/components/layout/HeaderComponent";
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { motion, AnimatePresence } from 'framer-motion';
import {getUserProfile} from "@/services/profileService";

const RefundPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userData, setUserData] = useState(null);
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
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const profile = await getUserProfile();
                console.log(JSON.stringify(profile));
                setUserData(profile);

                // Guardar datos en localStorage para persistencia
                if (typeof window !== 'undefined') {
                    localStorage.setItem('userData', JSON.stringify({
                        name: profile.name,
                        avatar: profile.avatar || profile.profilePic
                    }));
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);



    // Datos del usuario para pasar a los componentes
    const userAvatar = userData?.avatar || userData?.profilePic;
    const userName = userData?.name || 'Usuario';

    const fetchDeliveredOrders = async () => {
        try {
            setLoading(true);
            const result = await getDeliveredOrdersWithDetails();
            if (result) {
                setOrders(result);
                setError(null);
            } else {
                setError(result?.message || 'No se pudieron cargar los pedidos');
            }
        } catch (err) {
            setError('Error al cargar los pedidos');
            console.error('Error fetching delivered orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen no debe superar los 5MB');
                return;
            }

            if (!file.type.match('image.*')) {
                setError('Por favor sube solo archivos de imagen (JPEG, PNG)');
                return;
            }

            setSelectedImage(file);
            setError(null);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleCloseRefundDialog = () => {
        setRefundDialog({
            open: false,
            orderDetailId: null,
            productName: ''
        });
        setRefundReason('');
        setSelectedImage(null);
        setImagePreview(null);
        setError(null);
    };

    const handleSubmitRefund = async () => {
        if (!refundReason.trim()) {
            setError('Por favor ingresa un motivo para la devolución');
            return;
        }

        if (refundReason.trim().length < 10) {
            setError('El motivo debe tener al menos 10 caracteres');
            return;
        }

        try {
            setProcessingRefund(true);
            const result = await requestRefund(
                refundDialog.orderDetailId,
                refundReason,
                selectedImage
            );



            // Cerrar el diálogo primero
            handleCloseRefundDialog();
            // Mostrar mensaje de éxito
            setSuccessDialog(true);
            // Recargar los pedidos para mostrar el estado actualizado
            await fetchDeliveredOrders();

        } catch (err) {
            setError(err.message || 'Error al procesar la devolución');
            console.error('Error submitting refund:', err);
        } finally {
            setProcessingRefund(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'revision':
                return <HourglassEmptyIcon sx={{ color: '#ff9800' }} />;
            case 'aceptado':
                return <ThumbUpIcon sx={{ color: '#4caf50' }} />;
            case 'rechazado':
                return <ThumbDownIcon sx={{ color: '#f44336' }} />;
            default:
                return <AssignmentReturnIcon sx={{ color: vistelicaColors.secondary }} />;
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

    if (loading && orders.length === 0) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%'
            }}>
                <CircularProgress sx={{ color: vistelicaColors.primary }} />
            </Box>
        );
    }

    return (
        <div>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                <Grid container spacing={4}>
                    {!isMobile && (
                        <Grid size={{ xs: 12, md: 3, lg: 4.5 }}>
                            <Box sx={{ position: 'sticky', top: 24 }}>
                                <SidebarMenu
                                    username={userName}
                                    avatarUrl={userAvatar}
                                    key="desktop-sidebar"
                                />
                            </Box>
                        </Grid>
                    )}

                    <Grid size={{ xs: 12, md: 9, lg: 7 }}>
                        <Box
                            component={motion.div}
                            initial="hidden"
                            animate="visible"
                            variants={contentVariants}
                        >
                            <Paper elevation={2} sx={{
                                borderRadius: '12px',
                                p: { xs: 2, sm: 3 },
                                background: 'linear-gradient(to bottom right, #fdfbf6, #fff)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                border: `1px solid ${vistelicaColors.divider}`,
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 3
                                }}>
                                    <Typography variant="h5" component="h1" sx={{
                                        fontWeight: 400,
                                        color: vistelicaColors.primary,
                                        fontFamily: typography.fontFamily,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <AssignmentReturnIcon sx={{ color: vistelicaColors.primary }} />
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
                                        <Button
                                            onClick={fetchDeliveredOrders}
                                            variant="outlined"
                                            sx={{ mt: 1 }}
                                        >
                                            Reintentar
                                        </Button>
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
                                            <motion.div
                                                key={order.order_id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                layout
                                            >
                                                <Card
                                                    sx={{
                                                        mb: 3,
                                                        borderRadius: '12px',
                                                        boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                                                        background: 'linear-gradient(145deg, #ffffff, #f9f7f0)',
                                                        borderLeft: `4px solid ${vistelicaColors.primary}`,
                                                        overflow: 'hidden',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: '0 6px 15px rgba(0,0,0,0.12)',
                                                            transform: 'translateY(-2px)'
                                                        }
                                                    }}
                                                >
                                                    <Box
                                                        onClick={() => handleToggleOrder(order.order_id)}
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            p: { xs: 1.5, sm: 2 },
                                                            cursor: 'pointer',
                                                            backgroundColor: expandedOrder === order.order_id ? 'rgba(228, 176, 2, 0.05)' : 'transparent',
                                                            transition: 'background-color 0.2s ease',
                                                            borderBottom: expandedOrder === order.order_id ? `1px solid ${vistelicaColors.divider}` : 'none',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(228, 176, 2, 0.08)'
                                                            }
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: vistelicaColors.primaryLight,
                                                                    color: vistelicaColors.primary,
                                                                    mr: 2
                                                                }}
                                                            >
                                                                <ShoppingBagIcon sx={{ color: vistelicaColors.secondary}}/>
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="subtitle1" fontWeight="400" sx={{ color: vistelicaColors.primary }}>
                                                                    Pedido #{order.order_number}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 0.5 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <CalendarTodayIcon sx={{ color: vistelicaColors.secondary, fontSize: '0.9rem', mr: 0.5 }} />
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {formatDate(order.created_at)}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <AttachMoneyIcon sx={{ color: vistelicaColors.secondary, fontSize: '1rem', mr: 0.5 }} />
                                                                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                                                                            {parseFloat(order.total_price).toFixed(2)}€
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Badge
                                                                badgeContent={order.details.length}
                                                                sx={{
                                                                    mr: 1,
                                                                    '& .MuiBadge-badge': {
                                                                        backgroundColor: vistelicaColors.primary,
                                                                        color: '#fff',
                                                                    },
                                                                }}
                                                            >
                                                                <ShoppingBagIcon sx={{ color: vistelicaColors.secondary }} />
                                                            </Badge>

                                                            <IconButton
                                                                size="small"
                                                                sx={{
                                                                    transition: 'transform 0.2s ease',
                                                                    transform: expandedOrder === order.order_id ? 'rotate(180deg)' : 'rotate(0deg)'
                                                                }}
                                                            >
                                                                <ExpandMoreIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>

                                                    <AnimatePresence>
                                                        {expandedOrder === order.order_id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <CardContent sx={{ p: 0 }}>
                                                                    <List sx={{
                                                                        py: 0,
                                                                        background: 'linear-gradient(to bottom, rgba(249, 247, 240, 0.4), rgba(255, 255, 255, 0.8))'
                                                                    }}>
                                                                        {order.details.map((detail) => (
                                                                            <ListItem
                                                                                key={detail.order_detail_id}
                                                                                sx={{
                                                                                    p: { xs: 1.5, sm: 2 },
                                                                                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                                                                                    '&:last-child': { borderBottom: 'none' },
                                                                                    transition: 'background-color 0.2s',
                                                                                    '&:hover': {
                                                                                        backgroundColor: 'rgba(0,0,0,0.01)'
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <Box sx={{
                                                                                    display: 'flex',
                                                                                    width: '100%',
                                                                                    flexDirection: { xs: 'column', sm: 'row' },
                                                                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                                                                    gap: 2
                                                                                }}>
                                                                                    <Box sx={{
                                                                                        width: { xs: 60, sm: 70 },
                                                                                        height: { xs: 60, sm: 70 },
                                                                                        backgroundColor: detail.estado_devolucion !== 'Nada'
                                                                                            ? getStatusBackground(detail.estado_devolucion)
                                                                                            : '#f5f5f5',
                                                                                        borderRadius: '10px',
                                                                                        display: 'flex',
                                                                                        flexDirection: 'column',
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'center',
                                                                                        flexShrink: 0,
                                                                                        border: '1px solid rgba(0,0,0,0.05)',
                                                                                        boxShadow: detail.estado_devolucion !== 'Nada'
                                                                                            ? '0 2px 8px rgba(0,0,0,0.1)'
                                                                                            : 'none'
                                                                                    }}>
                                                                                        {detail.estado_devolucion !== 'Nada'
                                                                                            ? getStatusIcon(detail.estado_devolucion)
                                                                                            : <AssignmentReturnIcon sx={{ color: vistelicaColors.secondary }} />
                                                                                        }
                                                                                        {detail.estado_devolucion !== 'Nada' && (
                                                                                            <Typography
                                                                                                variant="caption"
                                                                                                sx={{
                                                                                                    mt: 0.5,
                                                                                                    fontWeight: 'bold',
                                                                                                    fontSize: '0.65rem',
                                                                                                    color: getStatusColor(detail.estado_devolucion)
                                                                                                }}
                                                                                            >
                                                                                                {detail.estado_devolucion}
                                                                                            </Typography>
                                                                                        )}
                                                                                    </Box>

                                                                                    <Box sx={{ flexGrow: 1 }}>
                                                                                        <Typography
                                                                                            variant="subtitle1"
                                                                                            fontWeight="500"
                                                                                            sx={{
                                                                                                color: detail.estado_devolucion !== 'Nada'
                                                                                                    ? getStatusColor(detail.estado_devolucion)
                                                                                                    : 'text.primary'
                                                                                            }}
                                                                                        >
                                                                                            {detail.product.name}
                                                                                        </Typography>

                                                                                        <Box sx={{
                                                                                            display: 'flex',
                                                                                            flexWrap: 'wrap',
                                                                                            gap: 1,
                                                                                            mt: 0.5
                                                                                        }}>
                                                                                            <Chip
                                                                                                label={`Cantidad: ${detail.quantity}`}
                                                                                                size="small"
                                                                                                variant="outlined"
                                                                                                sx={{
                                                                                                    borderColor: vistelicaColors.divider,
                                                                                                    fontSize: '0.75rem'
                                                                                                }}
                                                                                            />
                                                                                            <Chip
                                                                                                label={`${parseFloat(detail.price).toFixed(2)}€ c/u`}
                                                                                                size="small"
                                                                                                variant="outlined"
                                                                                                sx={{
                                                                                                    borderColor: vistelicaColors.divider,
                                                                                                    fontSize: '0.75rem'
                                                                                                }}
                                                                                            />
                                                                                            {detail.product.description && (
                                                                                                <Tooltip title={detail.product.description}>
                                                                                                    <Chip
                                                                                                        icon={<InfoOutlinedIcon fontSize="small" />}
                                                                                                        label="Detalles"
                                                                                                        size="small"
                                                                                                        variant="outlined"
                                                                                                        sx={{
                                                                                                            borderColor: vistelicaColors.divider,
                                                                                                            fontSize: '0.75rem'
                                                                                                        }}
                                                                                                    />
                                                                                                </Tooltip>
                                                                                            )}
                                                                                        </Box>

                                                                                        {detail.estado_devolucion !== 'Nada' && (
                                                                                            <Box sx={{ mt: 1.5, pl: 1, borderLeft: `3px solid ${getStatusBorderColor(detail.estado_devolucion)}` }}>
                                                                                                {detail.motivo_devolucion && (
                                                                                                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                                                                                        "{detail.motivo_devolucion}"
                                                                                                    </Typography>
                                                                                                )}
                                                                                                {detail.foto_devolucion_url && (
                                                                                                    <Box sx={{ mt: 1.5 }}>
                                                                                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
                                                                                                            Imagen adjunta:
                                                                                                        </Typography>
                                                                                                        <Box
                                                                                                            component="img"
                                                                                                            src={detail.foto_devolucion_url}
                                                                                                            alt="Foto de devolución"
                                                                                                            sx={{
                                                                                                                maxWidth: '120px',
                                                                                                                height: 'auto',
                                                                                                                borderRadius: '6px',
                                                                                                                border: '1px solid #e0e0e0',
                                                                                                                boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                                                                                                                transition: 'transform 0.2s',
                                                                                                                cursor: 'pointer',
                                                                                                                '&:hover': {
                                                                                                                    transform: 'scale(1.02)'
                                                                                                                }
                                                                                                            }}
                                                                                                            onClick={() => {
                                                                                                                window.open(detail.foto_devolucion_url, '_blank');
                                                                                                            }}
                                                                                                        />
                                                                                                    </Box>
                                                                                                )}
                                                                                            </Box>
                                                                                        )}
                                                                                    </Box>

                                                                                    {detail.estado_devolucion === 'Nada' && (
                                                                                        <Button
                                                                                            variant="contained"
                                                                                            startIcon={<AssignmentReturnIcon />}
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                handleOpenRefundDialog(
                                                                                                    detail.order_detail_id,
                                                                                                    detail.product.name
                                                                                                );
                                                                                            }}
                                                                                            sx={{
                                                                                                ml: { xs: 0, sm: 2 },
                                                                                                mt: { xs: 1, sm: 0 },
                                                                                                alignSelf: { xs: 'flex-start', sm: 'center' },
                                                                                                backgroundColor: vistelicaColors.secondary,
                                                                                                color: '#fff',
                                                                                                borderRadius: '8px',
                                                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                                                                                '&:hover': {
                                                                                                    backgroundColor: vistelicaColors.primary,
                                                                                                    transform: 'translateY(-2px)',
                                                                                                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                                                                                                },
                                                                                                transition: 'all 0.2s ease'
                                                                                            }}
                                                                                        >
                                                                                            Solicitar devolución
                                                                                        </Button>
                                                                                    )}
                                                                                </Box>
                                                                            </ListItem>
                                                                        ))}
                                                                    </List>
                                                                </CardContent>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </List>
                                )}
                            </Paper>
                        </Box>
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
                    <AssignmentReturnIcon sx={{ color: vistelicaColors.secondary }} />
                    <Typography variant="h6" fontWeight="400">
                        Solicitar devolución
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Box sx={{
                        p: 2,
                        mb: 2,
                        border: `1px solid ${vistelicaColors.divider}`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <ShoppingBagIcon sx={{ color: vistelicaColors.primary }} />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            <Box component="span" sx={{ color: vistelicaColors.primary }}>{refundDialog.productName}</Box>
                        </Typography>
                    </Box>

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Motivo de la devolución*"
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
                            },
                            mb: 3
                        }}
                        error={!!error && error.includes('motivo')}
                        helperText={error && error.includes('motivo') ? error : ''}
                    />

                    <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhotoCamera sx={{ color: vistelicaColors.secondary, fontSize: '1.2rem' }} />
                        Adjunta una foto del producto (opcional):
                    </Typography>

                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="refund-image-upload"
                        type="file"
                        onChange={handleImageChange}
                        disabled={processingRefund}
                    />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <label htmlFor="refund-image-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<PhotoCamera />}
                                disabled={processingRefund}
                                fullWidth
                                sx={{
                                    borderColor: vistelicaColors.primary,
                                    color: vistelicaColors.primary,
                                    borderWidth: '1.5px',
                                    py: 1.2,
                                    '&:hover': {
                                        borderColor: vistelicaColors.secondary,
                                        backgroundColor: 'rgba(118, 179, 167, 0.04)'
                                    }
                                }}
                            >
                                Seleccionar Imagen
                            </Button>
                        </label>

                        {imagePreview && (
                            <Box sx={{
                                position: 'relative',
                                display: 'inline-block',
                                maxWidth: '100%',
                                mx: 'auto',
                                mt: 1
                            }}>
                                <Box
                                    component="img"
                                    src={imagePreview}
                                    alt="Preview"
                                    sx={{
                                        width: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'contain',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={handleRemoveImage}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.8)'
                                        }
                                    }}
                                >
                                    <Close fontSize="small" />
                                </IconButton>
                            </Box>
                        )}

                        {error && error.includes('imagen') && (
                            <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                                {error}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9',
                        border: '1px dashed #ddd'
                    }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InfoOutlinedIcon sx={{ fontSize: '1rem' }} />
                            Sube una foto que muestre el problema con el producto (máx. 5MB, formatos: JPG, PNG)
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    p: 2,
                    borderTop: `1px solid ${vistelicaColors.divider}`,
                    bgcolor: '#fafafa',
                    gap: 2,
                    justifyContent: 'center'
                }}>
                    <Button
                        onClick={handleCloseRefundDialog}
                        disabled={processingRefund}
                        variant="outlined"
                        sx={{
                            color: 'text.secondary',
                            borderColor: '#ddd',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                borderColor: '#ccc'
                            },
                            minWidth: '120px'
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
                            py: 1,
                            borderRadius: '8px',
                            fontWeight: 600,
                            minWidth: '180px'
                        }}
                        startIcon={processingRefund ? <CircularProgress size={20} color="inherit" /> : <AssignmentReturnIcon />}
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
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        py: 2
                    }}>
                        <Avatar sx={{
                            bgcolor: '#e8f5e9',
                            width: 60,
                            height: 60,
                            mb: 2
                        }}>
                            <CheckCircleIcon sx={{ color: '#4caf50', fontSize: '2rem' }} />
                        </Avatar>

                        <Typography variant="h6" gutterBottom>
                            ¡Gracias por tu solicitud!
                        </Typography>

                        <Typography variant="body1">
                            Tu solicitud de devolución ha sido enviada correctamente y está en proceso de revisión.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    p: 2,
                    borderTop: `1px solid ${vistelicaColors.divider}`,
                    bgcolor: '#fafafa',
                    justifyContent: 'center'
                }}>
                    <Button
                        onClick={() => setSuccessDialog(false)}
                        variant="contained"
                        color="primary"
                        startIcon={<CheckCircleIcon />}
                        sx={{
                            backgroundColor: '#4caf50',
                            '&:hover': {
                                backgroundColor: '#3d8b40'
                            },
                            px: 4,
                            py: 1,
                            borderRadius: '8px',
                            fontWeight: 600
                        }}
                    >
                        Entendido
                    </Button>
                </DialogActions>
            </Dialog>

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

            {isMobile && (
                <SidebarMenu
                    username={userName}
                    avatarUrl={userAvatar}
                    drawerOpen={sidebarOpen}
                    setDrawerOpen={setSidebarOpen}
                    key="mobile-sidebar"
                />
            )}
        </div>
    );

    // Funciones auxiliares para los colores según el estado
    function getStatusBackground(status) {
        switch (status.toLowerCase()) {
            case 'revision': return 'rgba(255, 152, 0, 0.1)';
            case 'aceptado': return 'rgba(76, 175, 80, 0.1)';
            case 'rechazado': return 'rgba(244, 67, 54, 0.1)';
            default: return '#f5f5f5';
        }
    }

    function getStatusColor(status) {
        switch (status.toLowerCase()) {
            case 'revision': return '#ff9800';
            case 'aceptado': return '#4caf50';
            case 'rechazado': return '#f44336';
            default: return 'text.primary';
        }
    }

    function getStatusBorderColor(status) {
        switch (status.toLowerCase()) {
            case 'revision': return '#ff9800';
            case 'aceptado': return '#4caf50';
            case 'rechazado': return '#f44336';
            default: return vistelicaColors.divider;
        }
    }
};

export default RefundPage;
