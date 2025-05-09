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
    Checkbox,
    FormControlLabel,
    Snackbar,
    Alert,
    DialogContentText,
    Tooltip,
    Zoom,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getUserProfile } from '@/services/profileService';
import addressService from '@/services/addressService';
import { Container } from '@mui/system';
import SidebarMenu from '@/components/layout/SidebarMenu';
import Navbar from "@/components/layout/HeaderComponent";
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PlaceIcon from '@mui/icons-material/Place';

const AccountAddresses = () => {
    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        alias: '',
        street: '',
        number: '',
        postalCode: '',
        city: '',
        province: '',
        country: 'España',
        description: '',
        isDefault: false
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);

                // Intenta cargar el perfil pero no bloquees la carga de direcciones
                try {
                    const profile = await getUserProfile();
                    setUserData(profile);
                } catch (profileError) {
                    console.error('Error al cargar el perfil:', profileError);
                    // No interrumpimos el flujo si falla el perfil
                }

                // Cargar direcciones desde la API (independiente del perfil)
                const addressesData = await addressService.getAddresses();
                setAddresses(addressesData);

                // Verificar dirección predeterminada
                try {
                    const defaultAddress = await addressService.getDefaultAddress();
                    console.log('Dirección predeterminada cargada:', defaultAddress);
                } catch (error) {
                    console.error('Error al cargar la dirección predeterminada:', error);
                }
            } catch (error) {
                console.error('Error al cargar las direcciones:', error);
                setSnackbar({
                    open: true,
                    message: 'Error al cargar las direcciones',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleOpenDialog = (address = null) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                alias: address.alias,
                street: address.street,
                number: address.number,
                postalCode: address.postalCode,
                city: address.city,
                province: address.province,
                country: address.country || 'España',
                description: address.description || '',
                isDefault: address.isDefault
            });
        } else {
            setEditingAddress(null);
            setFormData({
                alias: '',
                street: '',
                number: '',
                postalCode: '',
                city: '',
                province: '',
                country: 'España',
                description: '',
                isDefault: false
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
            [name]: name === 'isDefault' ? checked : value
        });
    };

    const openConfirmDeleteDialog = (address) => {
        setAddressToDelete(address);
        setConfirmDeleteDialog(true);
    };

    const closeConfirmDeleteDialog = () => {
        setConfirmDeleteDialog(false);
        setAddressToDelete(null);
    };

    const handleSaveAddress = async () => {
        try {
            setLoading(true);

            if (editingAddress) {
                // Actualizar dirección existente
                await addressService.updateAddress(editingAddress.id, formData);

                // Si la dirección se marca como predeterminada, actualizar ese estado
                if (formData.isDefault && !editingAddress.isDefault) {
                    await addressService.setDefaultAddress(editingAddress.id);
                }

                setSnackbar({
                    open: true,
                    message: 'Dirección actualizada correctamente',
                    severity: 'success'
                });
            } else {
                // Crear nueva dirección
                const newAddress = await addressService.addAddress(formData);

                // Si la dirección se marca como predeterminada, actualizar ese estado
                if (formData.isDefault) {
                    await addressService.setDefaultAddress(newAddress.id);
                }

                setSnackbar({
                    open: true,
                    message: 'Dirección añadida correctamente',
                    severity: 'success'
                });
            }

            // Recargar la lista de direcciones
            const updatedAddresses = await addressService.getAddresses();
            setAddresses(updatedAddresses);

            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar la dirección:', error);
            setSnackbar({
                open: true,
                message: 'Error al guardar la dirección',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async () => {
        if (!addressToDelete) return;

        try {
            setLoading(true);
            await addressService.deleteAddress(addressToDelete.id);

            // Recargar la lista de direcciones
            const updatedAddresses = await addressService.getAddresses();
            setAddresses(updatedAddresses);

            setSnackbar({
                open: true,
                message: 'Dirección eliminada correctamente',
                severity: 'success'
            });

            closeConfirmDeleteDialog();
        } catch (error) {
            console.error('Error al eliminar la dirección:', error);
            setSnackbar({
                open: true,
                message: 'Error al eliminar la dirección',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSetDefaultAddress = async (addressId) => {
        try {
            setLoading(true);
            await addressService.setDefaultAddress(addressId);

            // Recargar la lista de direcciones
            const updatedAddresses = await addressService.getAddresses();
            setAddresses(updatedAddresses);

            setSnackbar({
                open: true,
                message: 'Dirección predeterminada actualizada',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error al establecer la dirección predeterminada:', error);
            setSnackbar({
                open: true,
                message: 'Error al establecer la dirección predeterminada',
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

    const getAddressIcon = (alias) => {
        if (!alias) return <LocationOnIcon />;

        const normalizedAlias = alias.toLowerCase();
        if (normalizedAlias.includes('casa') || normalizedAlias.includes('hogar')) {
            return <HomeIcon />;
        } else if (normalizedAlias.includes('trabajo') || normalizedAlias.includes('oficina')) {
            return <BusinessIcon />;
        }
        return <PlaceIcon />;
    };

    if (loading && addresses.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={2} sx={{ flexWrap: { xs: 'nowrap' } }}>
                    <Grid item xs={4} sm={3} md={3} lg={3} sx={{ minWidth: { xs: '200px' } }}>
                        <SidebarMenu username={userData?.name || 'Usuario'} />
                    </Grid>
                    <Grid item xs={8} sm={9} md={9} lg={9} sx={{ flexGrow: 1 }}>
                        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', p: 3, height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h5" component="h1" fontWeight="500">
                                    Mis direcciones
                                </Typography>
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
                                    Nueva dirección
                                </Button>
                            </Box>
                            <Divider sx={{ mb: 4 }} />

                            {addresses.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <LocationOnIcon sx={{ fontSize: 60, color: vistelicaColors.secondary, mb: 2 }} />
                                    <Typography variant="body1">
                                        No tienes direcciones guardadas
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        sx={{ mt: 2 }}
                                        onClick={() => handleOpenDialog()}
                                    >
                                        Añadir dirección
                                    </Button>
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {Array.isArray(addresses) && addresses.map((address) => (
                                        <Grid item xs={12} sm={6} key={address.id}>
                                            <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                                                <Card
                                                    sx={{
                                                        position: 'relative',
                                                        border: address.isDefault ? `2px solid ${vistelicaColors.primary}` : '1px solid #e0e0e0',
                                                        boxShadow: address.isDefault ? `0 4px 12px rgba(228, 176, 2, 0.3)` : '0 1px 5px rgba(0, 0, 0, 0.05)',
                                                        borderRadius: '12px',
                                                        transition: 'all 0.3s ease',
                                                        transform: address.isDefault ? 'scale(1.02)' : 'scale(1)',
                                                        '&:hover': {
                                                            boxShadow: '0 6px 14px rgba(0, 0, 0, 0.1)',
                                                            transform: address.isDefault ? 'scale(1.03)' : 'scale(1.01)'
                                                        },
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        background: address.isDefault ? 'linear-gradient(to bottom right, #fffdf7, #fff)' : '#fff',
                                                    }}
                                                >
                                                    {address.isDefault && (
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 12,
                                                                right: 12,
                                                                backgroundColor: vistelicaColors.primary,
                                                                color: 'white',
                                                                px: 1.5,
                                                                py: 0.6,
                                                                borderRadius: 2,
                                                                fontSize: '0.8rem',
                                                                fontWeight: 'bold',
                                                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5,
                                                                zIndex: 1,
                                                                animation: 'pulse 2s infinite ease-in-out',
                                                                '@keyframes pulse': {
                                                                    '0%': { boxShadow: '0 0 0 0 rgba(228, 176, 2, 0.4)' },
                                                                    '70%': { boxShadow: '0 0 0 10px rgba(228, 176, 2, 0)' },
                                                                    '100%': { boxShadow: '0 0 0 0 rgba(228, 176, 2, 0)' }
                                                                }
                                                            }}
                                                        >
                                                            <LocationOnIcon fontSize="small" />
                                                            Predeterminada
                                                        </Box>
                                                    )}

                                                    <CardContent sx={{ pt: 3, pb: 1, flexGrow: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            {getAddressIcon(address.alias)}
                                                            <Typography variant="h6" sx={{
                                                                fontWeight: 600,
                                                                color: address.isDefault ? vistelicaColors.secondary : 'text.primary',
                                                                pr: address.isDefault ? 10 : 0,
                                                            }}>
                                                                {address.alias}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2.5 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                                <LocationOnIcon sx={{ color: vistelicaColors.secondary, mt: 0.3 }} fontSize="small" />
                                                                <Box>
                                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                        {address.street}, {address.number}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {address.city}, {address.province}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {address.postalCode}, {address.country}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>

                                                            {address.description && (
                                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.5 }}>
                                                                    <InfoOutlinedIcon sx={{ color: vistelicaColors.secondary, mt: 0.3 }} fontSize="small" />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {address.description}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {address.createdAt && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                                    <AccessTimeIcon sx={{ color: vistelicaColors.secondary }} fontSize="small" />
                                                                    <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                                                                        Creada: {new Date(address.createdAt).toLocaleDateString('es-ES', {
                                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                                    })}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </CardContent>

                                                    <Divider sx={{ mx: 2, opacity: 0.6, my: 1 }} />

                                                    <CardActions sx={{
                                                        justifyContent: 'space-between',
                                                        p: 1.5,
                                                        backgroundColor: address.isDefault ? 'rgba(228, 176, 2, 0.03)' : 'transparent'
                                                    }}>
                                                        {!address.isDefault && (
                                                            <Button
                                                                size="small"
                                                                onClick={() => handleSetDefaultAddress(address.id)}
                                                                sx={{
                                                                    color: vistelicaColors.primary,
                                                                    '&:hover': { backgroundColor: 'rgba(228, 176, 2, 0.1)' }
                                                                }}
                                                                startIcon={<StarIcon />}
                                                            >
                                                                Predeterminar
                                                            </Button>
                                                        )}
                                                        <Box sx={{ display: 'flex', gap: 1, ml: address.isDefault ? 'auto' : 0 }}>
                                                            <Tooltip title="Editar dirección" arrow placement="top">
                                                                <Button
                                                                    size="small"
                                                                    onClick={() => handleOpenDialog(address)}
                                                                    startIcon={<EditIcon />}
                                                                    sx={{ color: vistelicaColors.secondary }}
                                                                >
                                                                    Editar
                                                                </Button>
                                                            </Tooltip>
                                                            <Tooltip
                                                                title={address.isDefault ? "No puedes eliminar la dirección predeterminada" : "Eliminar dirección"}
                                                                arrow
                                                                placement="top"
                                                            >
                                                                <span>
                                                                    <Button
                                                                        size="small"
                                                                        onClick={() => openConfirmDeleteDialog(address)}
                                                                        disabled={address.isDefault}
                                                                        startIcon={<DeleteIcon />}
                                                                        sx={{
                                                                            color: address.isDefault ? 'rgba(0,0,0,0.26)' : vistelicaColors.error,
                                                                            '&:hover': {
                                                                                backgroundColor: address.isDefault ? 'transparent' : 'rgba(211, 47, 47, 0.04)'
                                                                            }
                                                                        }}
                                                                    >
                                                                        Eliminar
                                                                    </Button>
                                                                </span>
                                                            </Tooltip>
                                                        </Box>
                                                    </CardActions>
                                                </Card>
                                            </Zoom>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Dialog para añadir/editar dirección */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingAddress ? 'Editar dirección' : 'Añadir nueva dirección'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <TextField
                                name="alias"
                                label="Nombre de la dirección"
                                placeholder="Ej: Casa, Trabajo, etc."
                                value={formData.alias}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                name="street"
                                label="Calle"
                                value={formData.street}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="number"
                                label="Número"
                                value={formData.number}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="postalCode"
                                label="Código postal"
                                value={formData.postalCode}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                name="city"
                                label="Ciudad"
                                value={formData.city}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="province"
                                label="Provincia"
                                value={formData.province}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="country"
                                label="País"
                                value={formData.country}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Descripción (opcional)"
                                placeholder="Instrucciones adicionales de entrega..."
                                value={formData.description || ''}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.isDefault}
                                        onChange={handleChange}
                                        name="isDefault"
                                        color="primary"
                                    />
                                }
                                label="Establecer como dirección predeterminada"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSaveAddress}
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: vistelicaColors.primary,
                            '&:hover': {
                                backgroundColor: vistelicaColors.secondary,
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog para confirmar eliminación */}
            <Dialog
                open={confirmDeleteDialog}
                onClose={closeConfirmDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirmar eliminación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Estás seguro de que deseas eliminar la dirección "{addressToDelete?.alias}"? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDeleteAddress}
                        color="error"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        autoFocus
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
        </div>
    );
};

export default AccountAddresses;