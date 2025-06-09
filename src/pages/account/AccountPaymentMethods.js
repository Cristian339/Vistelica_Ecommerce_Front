'use client';

import React, { useState, useEffect } from 'react';
import {
    Typography,
    Divider,
    Box,
    Paper,
    Button,
    Grid,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    CircularProgress,
    Card,
    CardContent,
    CardActions,
    Snackbar,
    Alert,
    DialogContentText,
    Tooltip,
    Zoom,
    useMediaQuery,
    useTheme,
    Fab,
    InputAdornment,
    Select,
    MenuItem as SelectMenuItem,
    FormControl,
    FormLabel
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Container } from '@mui/system';
import SidebarMenu from '@/components/layout/SidebarMenu';
import Navbar from "@/components/layout/HeaderComponent";
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import StarIcon from '@mui/icons-material/Star';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import paymentMethodService from '@/services/paymentMethodService';
import { getCurrentUser } from '@/services/authService';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from "@mui/material/FormControlLabel";
import { motion } from 'framer-motion';
import {getUserProfile} from "@/services/profileService";

const AccountPaymentMethods = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const [methodToDelete, setMethodToDelete] = useState(null);
    const [editingMethod, setEditingMethod] = useState(null);
    const [formData, setFormData] = useState({
        type: 'credit_card',
        provider: 'visa',
        card_last_four: '',
        card_holder_name: '',
        expiry_month: '',
        expiry_year: '',
        is_default: false
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const cardProviders = [
        { value: 'visa', label: 'Visa' },
        { value: 'mastercard', label: 'MasterCard' },
        { value: 'amex', label: 'American Express' }
    ];

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const user = await getCurrentUser();
                setUserData(user);

                const methods = await paymentMethodService.getUserPaymentMethods();
                setPaymentMethods(methods);



                const profile = await getUserProfile();
                setUserData(profile);

                // Guardar datos en localStorage para persistencia
                if (typeof window !== 'undefined') {
                    localStorage.setItem('userData', JSON.stringify({
                        name: profile.name,
                        avatar: profile.avatar || profile.profilePic
                    }));
                }
            } catch (error) {
                console.error('Error al cargar los métodos de pago:', error);
                setSnackbar({
                    open: true,
                    message: 'Error al cargar los métodos de pago',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const userAvatar = userData?.avatar;
    const userName = userData?.name;

    const handleOpenDialog = (method = null) => {
        if (method) {
            setEditingMethod(method);
            setFormData({
                type: method.type,
                provider: method.provider,
                card_last_four: method.card_last_four || '',
                card_holder_name: method.card_holder_name || '',
                expiry_month: method.expiry_month || '',
                expiry_year: method.expiry_year || '',
                is_default: method.is_default
            });
        } else {
            setEditingMethod(null);
            setFormData({
                type: 'credit_card',
                provider: 'visa',
                card_last_four: '',
                card_holder_name: '',
                expiry_month: '',
                expiry_year: '',
                is_default: false
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'is_default' ? checked : value
        });
    };

    const openConfirmDeleteDialog = (method) => {
        setMethodToDelete(method);
        setConfirmDeleteDialog(true);
    };

    const closeConfirmDeleteDialog = () => {
        setConfirmDeleteDialog(false);
        setMethodToDelete(null);
    };

    const handleSavePaymentMethod = async () => {
        try {
            setLoading(true);

            if (editingMethod) {
                await paymentMethodService.updatePaymentMethod(editingMethod.payment_method_id, formData);

                if (formData.is_default && !editingMethod.is_default) {
                    await paymentMethodService.setDefaultPaymentMethod(editingMethod.payment_method_id);
                }

                setSnackbar({
                    open: true,
                    message: 'Tarjeta actualizada correctamente',
                    severity: 'success'
                });
            } else {
                const newMethod = await paymentMethodService.createPaymentMethod(formData);

                if (formData.is_default) {
                    await paymentMethodService.setDefaultPaymentMethod(newMethod.payment_method_id);
                }

                setSnackbar({
                    open: true,
                    message: 'Tarjeta añadida correctamente',
                    severity: 'success'
                });
            }

            const updatedMethods = await paymentMethodService.getUserPaymentMethods();
            setPaymentMethods(updatedMethods);
            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar la tarjeta:', error);
            setSnackbar({
                open: true,
                message: 'Error al guardar la tarjeta',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePaymentMethod = async () => {
        if (!methodToDelete) return;

        try {
            setLoading(true);
            await paymentMethodService.deletePaymentMethod(methodToDelete.payment_method_id);

            const updatedMethods = await paymentMethodService.getUserPaymentMethods();
            setPaymentMethods(updatedMethods);

            setSnackbar({
                open: true,
                message: 'Tarjeta eliminada correctamente',
                severity: 'success'
            });

            closeConfirmDeleteDialog();
        } catch (error) {
            console.error('Error al eliminar la tarjeta:', error);
            setSnackbar({
                open: true,
                message: 'Error al eliminar la tarjeta',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSetDefaultMethod = async (methodId) => {
        try {
            setLoading(true);
            await paymentMethodService.setDefaultPaymentMethod(methodId);

            const updatedMethods = await paymentMethodService.getUserPaymentMethods();
            setPaymentMethods(updatedMethods);

            setSnackbar({
                open: true,
                message: 'Tarjeta predeterminada actualizada',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error al establecer la tarjeta predeterminada:', error);
            setSnackbar({
                open: true,
                message: 'Error al establecer la tarjeta predeterminada',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };


    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return '';
        }
    };

    if (loading && paymentMethods.length === 0) {
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
                <Grid container spacing={3} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    {!isMobile && (
                        <Grid size={{ xs: 12, md: 3, lg: 5.5 }}>
                            <Box sx={{ position: 'sticky', top: 24 }}>
                                <SidebarMenu
                                    username={userName}
                                    avatarUrl={userAvatar}
                                    key="desktop-sidebar"
                                />
                            </Box>
                        </Grid>
                    )}

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
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    background: 'linear-gradient(to bottom right, #fdfbf6, #fff)',
                                    border: `1px solid ${vistelicaColors.divider}`,
                                    overflow: 'hidden',
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    color: vistelicaColors.primary,
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 2, sm: 0 },
                                    mb: 2
                                }}>
                                    <Typography variant="h5" component="h1" fontWeight="500">
                                        Mis tarjetas de crédito
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenDialog()}
                                        fullWidth={isMobile}
                                        sx={{
                                            backgroundColor: vistelicaColors.primary,
                                            '&:hover': {
                                                backgroundColor: vistelicaColors.secondary,
                                            }
                                        }}
                                    >
                                        Nueva tarjeta
                                    </Button>
                                </Box>
                                <Divider sx={{ mb: { xs: 2, sm: 4 } }} />

                                {paymentMethods.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <CreditCardIcon sx={{ fontSize: 60, color: vistelicaColors.secondary, mb: 2 }} />
                                        <Typography variant="body1">
                                            No tienes tarjetas guardadas
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            sx={{ mt: 2 }}
                                            onClick={() => handleOpenDialog()}
                                            fullWidth={isMobile}
                                        >
                                            Añadir tarjeta
                                        </Button>
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}>
                                        {paymentMethods.map((method) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={method.payment_method_id}>
                                                <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                                                    <Card sx={{
                                                        position: 'relative',
                                                        border: method.is_default ? `2px solid ${vistelicaColors.primary}` : '1px solid #e0e0e0',
                                                        boxShadow: method.is_default ? `0 4px 12px rgba(228, 176, 2, 0.3)` : '0 1px 5px rgba(0, 0, 0, 0.05)',
                                                        borderRadius: '12px',
                                                        transition: 'all 0.3s ease',
                                                        transform: method.is_default ? 'scale(1.02)' : 'scale(1)',
                                                        '&:hover': {
                                                            boxShadow: '0 6px 14px rgba(0, 0, 0, 0.1)',
                                                            transform: method.is_default ? 'scale(1.03)' : 'scale(1.01)'
                                                        },
                                                        height: { xs: '280px', sm: '320px' },
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        background: method.is_default ? 'linear-gradient(to bottom right, #fffdf7, #fff)' : '#fff',
                                                    }}>
                                                        <CardContent sx={{
                                                            pt: { xs: 2, sm: 3 },
                                                            pb: 1,
                                                            flexGrow: 1,
                                                            overflow: 'auto'
                                                        }}>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                mb: 1.5
                                                            }}>
                                                                <CreditCardIcon sx={{ color: vistelicaColors.secondary }} fontSize="large" />
                                                                <Box sx={{ width: '100%' }}>
                                                                    <Typography
                                                                        variant="h6"
                                                                        sx={{
                                                                            fontWeight: 600,
                                                                            color: method.is_default ? vistelicaColors.secondary : 'text.primary',
                                                                            mb: method.is_default ? 1 : 0
                                                                        }}
                                                                    >
                                                                        Tarjeta de crédito
                                                                    </Typography>
                                                                    {method.is_default && (
                                                                        <Box
                                                                            component="span"
                                                                            sx={{
                                                                                display: 'inline-flex',
                                                                                alignItems: 'center',
                                                                                color: vistelicaColors.primary,
                                                                                fontSize: '0.85rem',
                                                                                fontWeight: 'bold',
                                                                                backgroundColor: 'rgba(228, 176, 2, 0.1)',
                                                                                px: 1.5,
                                                                                py: 0.5,
                                                                                borderRadius: 1,
                                                                                width: 'fit-content'
                                                                            }}
                                                                        >
                                                                            <StarIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                                            Predeterminada
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            </Box>

                                                            <Box sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: 1.2,
                                                                mt: 2
                                                            }}>
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 1,
                                                                    mt: 0.5
                                                                }}>
                                                                    <CreditCardIcon sx={{ color: vistelicaColors.secondary }} fontSize="small" />
                                                                    <Typography variant="body2">
                                                                        <Box component="span" sx={{
                                                                            color: vistelicaColors.primary,
                                                                            fontWeight: 600
                                                                        }}>
                                                                            Tarjeta:
                                                                        </Box> {method.provider} •••• {method.card_last_four}
                                                                    </Typography>
                                                                </Box>

                                                                {method.card_holder_name && (
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1,
                                                                        mt: 0.5
                                                                    }}>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            <Box component="span" sx={{
                                                                                color: vistelicaColors.primary,
                                                                                fontWeight: 600
                                                                            }}>
                                                                                Titular:
                                                                            </Box> {method.card_holder_name}
                                                                        </Typography>
                                                                    </Box>
                                                                )}

                                                                {method.expiry_month && method.expiry_year && (
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1,
                                                                        mt: 0.5
                                                                    }}>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            <Box component="span" sx={{
                                                                                color: vistelicaColors.primary,
                                                                                fontWeight: 600
                                                                            }}>
                                                                                Vence:
                                                                            </Box> {method.expiry_month.toString().padStart(2, '0')}/{method.expiry_year.toString().slice(-2)}
                                                                        </Typography>
                                                                    </Box>
                                                                )}

                                                                {method.created_at && (
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1,
                                                                        mt: 0.5
                                                                    }}>
                                                                        <AccessTimeIcon
                                                                            sx={{ color: vistelicaColors.secondary }}
                                                                            fontSize="small" />
                                                                        <Typography variant="body2" fontSize="0.75rem">
                                                                            <Box component="span" sx={{
                                                                                color: vistelicaColors.primary,
                                                                                fontWeight: 600
                                                                            }}>
                                                                                Fecha de creación:
                                                                            </Box> {formatDate(method.created_at)}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        </CardContent>

                                                        <Divider sx={{ mx: 2, opacity: 0.6, my: 0.5 }} />

                                                        <CardActions sx={{
                                                            justifyContent: 'space-between',
                                                            p: { xs: 0.5, sm: 1 },
                                                            backgroundColor: method.is_default ? 'rgba(228, 176, 2, 0.03)' : 'transparent',
                                                            flexDirection: 'row',
                                                            flexWrap: 'nowrap'
                                                        }}>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                width: '100%',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center'
                                                            }}>
                                                                {!method.is_default && (
                                                                    <Tooltip title="Establecer como predeterminada">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => handleSetDefaultMethod(method.payment_method_id)}
                                                                            sx={{
                                                                                color: vistelicaColors.primary,
                                                                                '&:hover': {
                                                                                    backgroundColor: 'rgba(228, 176, 2, 0.1)',
                                                                                    transform: 'scale(1.1)'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <StarIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}

                                                                {method.is_default && <Box sx={{ width: '36px' }}></Box>}

                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    gap: 1,
                                                                    justifyContent: 'flex-end'
                                                                }}>
                                                                    <Tooltip title="Editar tarjeta">
                                                                        <Button
                                                                            size="small"
                                                                            onClick={() => handleOpenDialog(method)}
                                                                            startIcon={<EditIcon />}
                                                                            sx={{
                                                                                color: vistelicaColors.secondary,
                                                                                minWidth: { xs: '36px', sm: '64px' },
                                                                                px: { xs: 0.5, sm: 1 }
                                                                            }}
                                                                        >
                                                                            {!isMobile && 'Editar'}
                                                                        </Button>
                                                                    </Tooltip>
                                                                    <Tooltip
                                                                        title={method.is_default ? "No se puede eliminar la tarjeta predeterminada" : "Eliminar tarjeta"}>
                                                                        <span>
                                                                            <Button
                                                                                size="small"
                                                                                onClick={() => openConfirmDeleteDialog(method)}
                                                                                disabled={method.is_default}
                                                                                startIcon={<DeleteIcon />}
                                                                                sx={{
                                                                                    color: method.is_default ? 'rgba(0,0,0,0.26)' : vistelicaColors.error,
                                                                                    minWidth: { xs: '36px', sm: '64px' },
                                                                                    px: { xs: 0.5, sm: 1 }
                                                                                }}
                                                                            >
                                                                                {!isMobile && 'Eliminar'}
                                                                            </Button>
                                                                        </span>
                                                                    </Tooltip>
                                                                </Box>
                                                            </Box>
                                                        </CardActions>
                                                    </Card>
                                                </Zoom>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

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

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        overflow: 'hidden',
                        maxWidth: { xs: '95%', sm: '600px' },
                        margin: '0 auto',
                        width: '100%'
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: editingMethod?.is_default ? 'rgba(228, 176, 2, 0.08)' : 'transparent',
                        borderBottom: '1px solid #eaeaea',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 2.5,
                        mb: { xs: 1, sm: 3 },
                        position: 'relative',
                        zIndex: 1,
                        px: { xs: 2, sm: 3 }
                    }}
                >
                    <CreditCardIcon sx={{ color: vistelicaColors.primary }} />
                    <Typography variant="h6" fontWeight="400" fontSize={{ xs: '1.1rem', sm: '1.25rem',color: vistelicaColors.primary }}>
                        {editingMethod ? 'Editar tarjeta' : 'Añadir nueva tarjeta'}
                    </Typography>
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        px: { xs: 2, sm: 4 },
                        py: { xs: 2, sm: 4 },
                        mt: { xs: 0, sm: 2 },
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        '&.MuiDialogContent-root': {
                            paddingTop: { xs: '24px', sm: '24px' }
                        }
                    }}
                >
                    <Box sx={{
                        width: '100%',
                        maxWidth: '500px',
                        mx: 'auto',
                        textAlign: 'center'
                    }}>
                        <Grid container spacing={{ xs: 2, sm: 3.5 }} justifyContent="center">
                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel component="legend" sx={{ textAlign: 'left', mb: 1, fontWeight: 500 }}>
                                        Tipo de tarjeta
                                    </FormLabel>
                                    <Select
                                        name="provider"
                                        value={formData.provider}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&:hover fieldset': { borderColor: vistelicaColors.primary },
                                                '&.Mui-focused fieldset': { borderColor: vistelicaColors.primary }
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: vistelicaColors.primary
                                            },
                                            textAlign: 'left'
                                        }}
                                    >
                                        {cardProviders.map((provider) => (
                                            <SelectMenuItem key={provider.value} value={provider.value}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {provider.label}
                                                </Box>
                                            </SelectMenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    name="card_last_four"
                                    label="Últimos 4 dígitos"
                                    value={formData.card_last_four}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    inputProps={{
                                        maxLength: 4,
                                        pattern: '[0-9]*'
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                ••••
                                            </InputAdornment>
                                        ),
                                    }}
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
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    name="card_holder_name"
                                    label="Nombre del titular"
                                    value={formData.card_holder_name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
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
                            </Grid>

                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    name="expiry_month"
                                    label="Mes de expiración"
                                    value={formData.expiry_month}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="MM"
                                    inputProps={{
                                        maxLength: 2,
                                        pattern: '[0-9]*'
                                    }}
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
                            </Grid>

                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    name="expiry_year"
                                    label="Año de expiración"
                                    value={formData.expiry_year}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="AAAA"
                                    inputProps={{
                                        maxLength: 4,
                                        pattern: '[0-9]*'
                                    }}
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
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="is_default"
                                            checked={formData.is_default}
                                            onChange={handleChange}
                                            sx={{
                                                color: vistelicaColors.primary,
                                                '&.Mui-checked': {
                                                    color: vistelicaColors.primary,
                                                },
                                            }}
                                        />
                                    }
                                    label="Establecer como método de pago predeterminado"
                                    sx={{ justifyContent: 'flex-start', ml: 0 }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1.5, sm: 2 },
                    borderTop: '1px solid #eaeaea',
                    bgcolor: '#fafafa',
                    justifyContent: 'center'
                }}>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            color: 'text.secondary',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
                            mx: { xs: 1, sm: 2 }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSavePaymentMethod}
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: vistelicaColors.primary,
                            '&:hover': {
                                backgroundColor: vistelicaColors.secondary,
                            },
                            px: { xs: 2, sm: 3 },
                            mx: { xs: 1, sm: 2 }
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : editingMethod ? 'Actualizar' : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={confirmDeleteDialog}
                onClose={closeConfirmDeleteDialog}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        overflow: 'hidden',
                        maxWidth: '500px',
                        margin: '0 auto'
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: 'rgba(239, 83, 80, 0.08)',
                        borderBottom: '1px solid #eaeaea',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 2.5,
                        position: 'relative'
                    }}
                >
                    <DeleteIcon sx={{ color: '#d32f2f' }} />
                    <Typography variant="h6" fontWeight="600">
                        Confirmar eliminación
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ px: 3, py: 3, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <InfoOutlinedIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
                        <DialogContentText id="alert-dialog-description" sx={{ m: 0 }}>
                            ¿Estás seguro de que deseas eliminar esta tarjeta?
                            <br />
                            Esta acción no se puede deshacer.
                        </DialogContentText>
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    px: 3,
                    py: 2,
                    borderTop: '1px solid #eaeaea',
                    bgcolor: '#fafafa'
                }}>
                    <Button
                        onClick={closeConfirmDeleteDialog}
                        sx={{
                            color: 'text.secondary',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDeletePaymentMethod}
                        variant="contained"
                        disabled={loading}
                        startIcon={<DeleteIcon />}
                        sx={{
                            backgroundColor: '#d32f2f',
                            '&:hover': {
                                backgroundColor: '#b71c1c',
                            },
                            px: 3
                        }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AccountPaymentMethods;
