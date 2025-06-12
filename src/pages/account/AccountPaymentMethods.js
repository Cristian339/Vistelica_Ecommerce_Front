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
    FormLabel,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StarIcon from '@mui/icons-material/Star';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Container } from '@mui/system';
import { motion } from 'framer-motion';
import { vistelicaColors } from "@/components/shared/vistelicaColors";
import SidebarMenu from '@/components/layout/SidebarMenu';
import Navbar from "@/components/layout/HeaderComponent";
import paymentMethodService from '@/services/paymentMethodService';
import { getCurrentUser } from '@/services/authService';
import { getUserProfile } from "@/services/profileService";

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
    const [showFullNumbers, setShowFullNumbers] = useState(false);
    const [formErrors, setFormErrors] = useState({
        card_number: '',
        expiry_month: '',
        expiry_year: ''
    });
    const [formData, setFormData] = useState({
        type: 'credit_card',
        provider: 'visa',
        card_number: '',
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
                const methods = await paymentMethodService.getUserPaymentMethods();
                const profile = await getUserProfile();

                setUserData(profile);
                setPaymentMethods(methods);

                if (typeof window !== 'undefined') {
                    localStorage.setItem('userData', JSON.stringify({
                        name: profile.name,
                        avatar: profile.avatar || profile.profilePic
                    }));
                }
            } catch (error) {
                console.error('Error cargando métodos de pago:', error);
                setSnackbar({
                    open: true,
                    message: 'Error cargando métodos de pago',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatCardNumber = (number) => {
        if (!number) return '';
        if (!showFullNumbers) return `•••• •••• •••• ${number.slice(-4)}`;
        return number.replace(/(\d{4})/g, '$1 ').trim();
    };

    const validateForm = () => {
        const errors = {
            card_number: '',
            expiry_month: '',
            expiry_year: ''
        };
        let isValid = true;


        const cardNumberDigits = formData.card_number.replace(/\s/g, '').length;
        if (cardNumberDigits !== 16) {
            errors.card_number = 'El número de tarjeta debe tener 16 dígitos';
            isValid = false;
        }

        // Validar número de tarjeta (mínimo 4 dígitos)
        if (formData.card_number.replace(/\s/g, '').length < 4) {
            errors.card_number = 'El número de tarjeta debe tener al menos 4 dígitos';
            isValid = false;
        }

        // Validar mes de expiración (1-12)
        const month = parseInt(formData.expiry_month);
        if (isNaN(month) || month < 1 || month > 12) {
            errors.expiry_month = 'Mes inválido (1-12)';
            isValid = false;
        }

        // Validar año de expiración (>= año actual)
        const currentYear = new Date().getFullYear();
        const year = parseInt(formData.expiry_year);
        if (isNaN(year) || year < currentYear) {
            errors.expiry_year = `El año debe ser ${currentYear} o mayor`;
            isValid = false;
        }

        // Si el año es el actual, validar que el mes no sea pasado
        if (year === currentYear && month < new Date().getMonth() + 1) {
            errors.expiry_month = 'El mes no puede ser anterior al actual';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleOpenDialog = (method = null) => {
        if (method) {
            setEditingMethod(method);
            setFormData({
                type: method.type,
                provider: method.provider,
                card_number: method.card_number || '',
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
                card_number: '',
                card_holder_name: '',
                expiry_month: '',
                expiry_year: '',
                is_default: false
            });
        }
        setFormErrors({
            card_number: '',
            expiry_month: '',
            expiry_year: ''
        });
        setOpenDialog(true);
    };


    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        // Limpiar espacios en blanco del número de tarjeta
        const processedValue = name === 'card_number'
            ? value.replace(/\s/g, '')
            : value;

        setFormData({
            ...formData,
            [name]: name === 'is_default' ? checked : processedValue
        });

        // Validación en tiempo real para el número de tarjeta
        if (name === 'card_number') {
            const digits = processedValue.replace(/\s/g, '').length;
            if (digits > 0 && digits !== 16) {
                setFormErrors({
                    ...formErrors,
                    card_number: 'El número de tarjeta debe tener 16 dígitos'
                });
            } else {
                setFormErrors({
                    ...formErrors,
                    card_number: ''
                });
            }
        }

        // Validación en tiempo real para el mes
        if (name === 'expiry_month') {
            const month = parseInt(processedValue);
            if (processedValue && (isNaN(month) || month < 1 || month > 12)) {
                setFormErrors({
                    ...formErrors,
                    expiry_month: 'Mes inválido (1-12)'
                });
            } else {
                setFormErrors({
                    ...formErrors,
                    expiry_month: ''
                });
            }
        }

        // Validación en tiempo real para el año
        if (name === 'expiry_year') {
            const year = parseInt(processedValue);
            const currentYear = new Date().getFullYear();
            if (processedValue && (isNaN(year) || year < currentYear)) {
                setFormErrors({
                    ...formErrors,
                    expiry_year: `El año debe ser ${currentYear} o mayor`
                });
            } else {
                setFormErrors({
                    ...formErrors,
                    expiry_year: ''
                });
            }
        }
    };

    const handleSavePaymentMethod = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            if (editingMethod) {
                await paymentMethodService.updatePaymentMethod(
                    editingMethod.payment_method_id,
                    formData
                );

                if (formData.is_default && !editingMethod.is_default) {
                    await paymentMethodService.setDefaultPaymentMethod(
                        editingMethod.payment_method_id
                    );
                }

                setSnackbar({
                    open: true,
                    message: 'Método de pago actualizado correctamente',
                    severity: 'success'
                });
            } else {
                const newMethod = await paymentMethodService.createPaymentMethod(formData);

                if (formData.is_default) {
                    await paymentMethodService.setDefaultPaymentMethod(
                        newMethod.payment_method_id
                    );
                }

                setSnackbar({
                    open: true,
                    message: 'Método de pago añadido correctamente',
                    severity: 'success'
                });
            }

            const updatedMethods = await paymentMethodService.getUserPaymentMethods();
            setPaymentMethods(updatedMethods);
            handleCloseDialog();
        } catch (error) {
            console.error('Error guardando método de pago:', error);
            setSnackbar({
                open: true,
                message: 'Error guardando método de pago',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePaymentMethod = async () => {
        try {
            setLoading(true);
            await paymentMethodService.deletePaymentMethod(methodToDelete.payment_method_id);

            const updatedMethods = await paymentMethodService.getUserPaymentMethods();
            setPaymentMethods(updatedMethods);

            setSnackbar({
                open: true,
                message: 'Payment method deleted',
                severity: 'success'
            });

            closeConfirmDeleteDialog();
        } catch (error) {
            console.error('Error deleting payment method:', error);
            setSnackbar({
                open: true,
                message: 'Error deleting payment method',
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
                message: 'Default payment method updated',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error setting default method:', error);
            setSnackbar({
                open: true,
                message: 'Error setting default method',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const openConfirmDeleteDialog = (method) => {
        setMethodToDelete(method);
        setConfirmDeleteDialog(true);
    };

    const closeConfirmDeleteDialog = () => {
        setConfirmDeleteDialog(false);
        setMethodToDelete(null);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };


    return (
        <div>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                <Grid container spacing={3} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    {!isMobile && (
                        <Grid size={{ xs: 12, md: 3, lg: 5.5 }}>
                            <Box sx={{ position: 'sticky', top: 24 }}>
                                <SidebarMenu
                                    username={userData?.name}
                                    avatarUrl={userData?.avatar}
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
                                        Mis Métodos de Pago
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={showFullNumbers}
                                                    onChange={(e) => setShowFullNumbers(e.target.checked)}
                                                    sx={{
                                                        color: vistelicaColors.primary,
                                                        '&.Mui-checked': {
                                                            color: vistelicaColors.primary,
                                                        },
                                                    }}
                                                />
                                            }
                                            label="Mostrar números completos"
                                        />

                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={() => handleOpenDialog()}
                                            sx={{
                                                backgroundColor: vistelicaColors.primary,
                                                '&:hover': {
                                                    backgroundColor: vistelicaColors.secondary,
                                                }
                                            }}
                                        >
                                            Añadir Nuevo
                                        </Button>
                                    </Box>
                                </Box>
                                <Divider sx={{ mb: { xs: 2, sm: 4 } }} />

                                {paymentMethods.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <CreditCardIcon sx={{ fontSize: 60, color: vistelicaColors.secondary, mb: 2 }} />
                                        <Typography variant="body1">
                                            No tienes métodos de pago guardados
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            sx={{ mt: 2 }}
                                            onClick={() => handleOpenDialog()}
                                        >
                                            Añadir Método de Pago
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
                                                        height: '100%',
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
                                                                        {method.type === 'credit_card' ? 'Tarjeta de Crédito' : 'Método de Pago'}
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
                                                                            Predeterminado
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
                                                                        </Box> {method.provider} {formatCardNumber(method.card_number)}
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
                                                                                Expira:
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
                                                                                Creado:
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
                                                                    <Tooltip title="Establecer como predeterminado">
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
                                                                    <Tooltip title="Editar">
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
                                                                        title={method.is_default ? "No se puede eliminar el método predeterminado" : "Eliminar"}>
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

            {/* Diálogo para añadir/editar método de pago */}
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
                    <Typography variant="h6" fontWeight="400" fontSize={{ xs: '1.1rem', sm: '1.25rem' }} color={vistelicaColors.primary}>
                        {editingMethod ? 'Editar Método de Pago' : 'Añadir Nuevo Método de Pago'}
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
                                        Tipo de Tarjeta
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
                                    name="card_number"
                                    label="Número de Tarjeta"
                                    value={formData.card_number}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={!!formErrors.card_number}
                                    helperText={formErrors.card_number}
                                    inputProps={{
                                        maxLength: 19,
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
                                <TextField
                                    name="card_holder_name"
                                    label="Nombre del Titular"
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
                                    label="Mes de Expiración"
                                    value={formData.expiry_month}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={!!formErrors.expiry_month}
                                    helperText={formErrors.expiry_month}
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
                                    label="Año de Expiración"
                                    value={formData.expiry_year}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={!!formErrors.expiry_year}
                                    helperText={formErrors.expiry_year}
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
                        Confirmar Eliminación
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ px: 3, py: 3, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <InfoOutlinedIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
                        <DialogContentText id="alert-dialog-description" sx={{ m: 0 }}>
                            ¿Estás seguro de que deseas eliminar este método de pago?
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

            {/* Snackbar para notificaciones */}
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

            {/* Botón para abrir sidebar en móvil */}
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
                    username={userData?.name}
                    avatarUrl={userData?.avatar}
                    drawerOpen={sidebarOpen}
                    setDrawerOpen={setSidebarOpen}
                    key="mobile-sidebar"
                />
            )}
        </div>
    );
};

export default AccountPaymentMethods;