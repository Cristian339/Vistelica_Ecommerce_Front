'use client';

import React, {useState, useEffect} from 'react';
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
    Menu,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {getUserProfile} from '@/services/profileService';
import addressService from '@/services/addressService';
import {Container} from '@mui/system';
import SidebarMenu from '@/components/layout/SidebarMenu';
import Navbar from "@/components/layout/HeaderComponent";
import {vistelicaColors} from "@/pages/shared-theme/vistelicaColors";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PlaceIcon from '@mui/icons-material/Place';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import FlagIcon from '@mui/icons-material/Flag';
import { motion } from 'framer-motion';

const AccountAddresses = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [editingAddress, setEditingAddress] = useState(null);
    const [errors, setErrors] = useState({
        label: false,
        street: false,
        postal_code: false,
        city: false,
        state: false,
        country: false
    });
    const [formData, setFormData] = useState({
        label: '',
        street: '',
        numero: '',
        postal_code: '',
        city: '',
        state: '',
        country: 'España',
        description: '',
        is_default: false,
        block: '',
        floor: '',
        door: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

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

                // Verificar dirección predeterminada SOLO si hay direcciones
                if (addressesData && addressesData.length > 0) {
                    try {
                        const defaultAddress = await addressService.getDefaultAddress();
                        console.log('Dirección predeterminada cargada:', defaultAddress);
                    } catch (error) {
                        // Manejar específicamente el error 404 (no tiene dirección predeterminada)
                        if (error.response && error.response.status === 404) {
                            console.log('El usuario no tiene dirección predeterminada configurada');
                        } else {
                            console.error('Error al cargar la dirección predeterminada:', error);
                        }
                    }
                } else {
                    console.log('El usuario no tiene direcciones guardadas');
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



    const userAvatar = userData?.avatar || userData?.profilePic;
    const userName = userData?.name || 'Usuario';


    const validateForm = () => {
        const newErrors = {
            label: !formData.label,
            street: !formData.street,
            postal_code: !formData.postal_code,
            city: !formData.city,
            state: !formData.state,
            country: !formData.country
        };

        setErrors(newErrors);

        // Retorna true si no hay errores
        return !Object.values(newErrors).some(error => error);
    };

    const handleOpenDialog = (address = null) => {
        if (address) {
            setEditingAddress(address);

            // Extraer número de la calle si existe
            let street = address.street || '';
            let numero = '';

            // Intentar extraer el número de la dirección
            const streetMatch = street.match(/(.*?)(?:\s+(\d+.*))?$/);
            if (streetMatch && streetMatch[2]) {
                street = streetMatch[1].trim();
                numero = streetMatch[2].trim();
            }

            setFormData({
                label: address.label || '',
                street: street,
                numero: numero,
                postal_code: address.postal_code || '',
                city: address.city || '',
                state: address.state || '',
                country: address.country || 'España',
                description: address.description || '',
                is_default: address.is_default || false,
                block: address.block || '',
                floor: address.floor || '',
                door: address.door || ''
            });
        } else {
            setEditingAddress(null);
            setFormData({
                label: '',
                street: '',
                numero: '',
                postal_code: '',
                city: '',
                state: '',
                country: 'España',
                description: '',
                is_default: false,
                block: '',
                floor: '',
                door: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleChange = (e) => {
        const {name, value, checked} = e.target;
        setFormData({
            ...formData,
            [name]: name === 'is_default' ? checked : value
        });

        // Validación en tiempo real para campos obligatorios
        if (['label', 'street', 'postal_code', 'city', 'state', 'country'].includes(name)) {
            setErrors({
                ...errors,
                [name]: !value
            });
        }
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

            if (!validateForm()) {
                setSnackbar({
                    open: true,
                    message: 'Por favor completa todos los campos obligatorios',
                    severity: 'error'
                });
                return;
            }

            // Combinar street y numero
            const combinedStreet = formData.numero
                ? `${formData.street} ${formData.numero}`.trim()
                : formData.street;

            const addressData = {
                ...formData,
                street: combinedStreet,
                state: formData.state
            };

            if (editingAddress) {
                // Actualizar dirección existente
                await addressService.updateAddress(editingAddress.id, addressData);

                // Si la dirección se marca como predeterminada, actualizar ese estado
                if (formData.is_default && !editingAddress.is_default) {
                    await addressService.setDefaultAddress(editingAddress.id);
                }

                setSnackbar({
                    open: true,
                    message: 'Dirección actualizada correctamente',
                    severity: 'success'
                });
            } else {
                // Crear nueva dirección
                const newAddress = await addressService.addAddress(addressData);

                // Si la dirección se marca como predeterminada, actualizar ese estado
                if (formData.is_default) {
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

    const getAddressIcon = (label) => {
        if (!label) return <LocationOnIcon/>;

        const normalizedAlias = label.toLowerCase();
        if (normalizedAlias.includes('casa') || normalizedAlias.includes('hogar')) {
            return <HomeIcon/>;
        } else if (normalizedAlias.includes('trabajo') || normalizedAlias.includes('oficina')) {
            return <BusinessIcon/>;
        }
        return <PlaceIcon/>;
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

    if (loading && addresses.length === 0) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%'
            }}>
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
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    background: 'linear-gradient(to bottom right, #fdfbf6, #fff)',
                                    border: `1px solid ${vistelicaColors.divider}`,
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
                                        Mis direcciones
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
                                        Nueva dirección
                                    </Button>
                                </Box>
                                <Divider sx={{ mb: { xs: 2, sm: 4 } }} />

                                {addresses.length === 0 ? (
                                    <Box sx={{textAlign: 'center', py: 4}}>
                                        <LocationOnIcon sx={{fontSize: 60, color: vistelicaColors.secondary, mb: 2}}/>
                                        <Typography variant="body1">
                                            No tienes direcciones guardadas
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon/>}
                                            sx={{mt: 2}}
                                            onClick={() => handleOpenDialog()}
                                            fullWidth={isMobile}
                                        >
                                            Añadir dirección
                                        </Button>
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}>
                                        {Array.isArray(addresses) && addresses.map((address) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={address.id}>
                                                <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                                                    <Card sx={{
                                                        position: 'relative',
                                                        border: address.is_default ? `2px solid ${vistelicaColors.primary}` : '1px solid #e0e0e0',
                                                        boxShadow: address.is_default ? `0 4px 12px rgba(228, 176, 2, 0.3)` : '0 1px 5px rgba(0, 0, 0, 0.05)',
                                                        borderRadius: '12px',
                                                        transition: 'all 0.3s ease',
                                                        transform: address.is_default ? 'scale(1.02)' : 'scale(1)',
                                                        '&:hover': {
                                                            boxShadow: '0 6px 14px rgba(0, 0, 0, 0.1)',
                                                            transform: address.is_default ? 'scale(1.03)' : 'scale(1.01)'
                                                        },
                                                        height: {xs: '280px', sm: '320px'}, // Altura fija tanto en móvil como en desktop
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        background: address.is_default ? 'linear-gradient(to bottom right, #fffdf7, #fff)' : '#fff',
                                                    }}>
                                                        <CardContent sx={{
                                                            pt: {xs: 2, sm: 3},
                                                            pb: 1,
                                                            flexGrow: 1,
                                                            overflow: 'auto'
                                                        }}>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                mb: 1.5
                                                            }}>
                                                                <Box sx={{
                                                                    mr: 1.5,
                                                                    backgroundColor: address.is_default ? 'rgba(228, 176, 2, 0.15)' : 'rgba(0, 0, 0, 0.04)',
                                                                    borderRadius: '50%',
                                                                    width: 36,
                                                                    height: 36,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: address.is_default ? vistelicaColors.primary : 'text.secondary',
                                                                    flexShrink: 0
                                                                }}>
                                                                    {getAddressIcon(address.label)}
                                                                </Box>
                                                                <Box sx={{width: '100%'}}>
                                                                    <Typography
                                                                        variant="h6"
                                                                        sx={{
                                                                            fontWeight: 600,
                                                                            color: address.is_default ? vistelicaColors.secondary : 'text.primary',
                                                                            mb: address.is_default ? 1 : 0
                                                                        }}
                                                                    >
                                                                        {address.label || 'Dirección sin nombre'}
                                                                    </Typography>
                                                                    {address.is_default && (
                                                                        <Box
                                                                            component="span"
                                                                            sx={{
                                                                                display: 'inline-flex',
                                                                                alignItems: 'center',
                                                                                color: vistelicaColors.primary,
                                                                                fontSize: '0.85rem', // Más grande
                                                                                fontWeight: 'bold',
                                                                                backgroundColor: 'rgba(228, 176, 2, 0.1)',
                                                                                px: 1.5, // Más padding horizontal
                                                                                py: 0.5, // Más padding vertical
                                                                                borderRadius: 1,
                                                                                width: 'fit-content'
                                                                            }}
                                                                        >
                                                                            <StarIcon fontSize="small" sx={{mr: 0.5}}/>
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
                                                                {/* Dirección completa */}
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'flex-start',
                                                                    gap: 1
                                                                }}>
                                                                    <LocationOnIcon
                                                                        sx={{color: vistelicaColors.secondary, mt: 0.3}}
                                                                        fontSize="small"/>
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{fontWeight: 500}}>
                                                                            {address.street || 'Sin calle'}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {address.city || 'Sin ciudad'}, {address.state || 'Sin provincia'}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {address.country || 'España'}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>

                                                                {(address.block || address.floor || address.door) && (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                                        <HomeIcon sx={{ mr: 1, color: 'text.primary' }} />
                                                                        <Typography variant="body2" color="text.primary">
                                                                            {address.block && (
                                                                                <>
                                                                                    <Box component="span" sx={{ fontWeight: 600 }}>
                                                                                        Bloque:
                                                                                    </Box> {address.block}
                                                                                </>
                                                                            )}
                                                                            {address.floor && (
                                                                                <>
                                                                                    {address.block && ', '}
                                                                                    <Box component="span" sx={{ fontWeight: 600 }}>
                                                                                        Piso:
                                                                                    </Box> {address.floor}
                                                                                </>
                                                                            )}
                                                                            {address.door && (
                                                                                <>
                                                                                    {(address.block || address.floor) && ', '}
                                                                                    <Box component="span" sx={{ fontWeight: 600 }}>
                                                                                        Puerta:
                                                                                    </Box> {address.door}
                                                                                </>
                                                                            )}
                                                                        </Typography>
                                                                    </Box>
                                                                )}


                                                                {/* Código postal */}
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 1,
                                                                    mt: 0.5
                                                                }}>
                                                                    <MarkunreadMailboxIcon
                                                                        sx={{color: vistelicaColors.secondary}}
                                                                        fontSize="small"/>
                                                                    <Typography variant="body2">
                                                                        <Box component="span" sx={{
                                                                            color: vistelicaColors.primary,
                                                                            fontWeight: 600
                                                                        }}>
                                                                            Código postal:
                                                                        </Box> {address.postal_code || 'No especificado'}
                                                                    </Typography>
                                                                </Box>

                                                                {/* País */}
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 1,
                                                                    mt: 0.5
                                                                }}>
                                                                    <FlagIcon sx={{color: vistelicaColors.secondary}}
                                                                              fontSize="small"/>
                                                                    <Typography variant="body2">
                                                                        <Box component="span" sx={{
                                                                            color: vistelicaColors.primary,
                                                                            fontWeight: 600
                                                                        }}>
                                                                            País:
                                                                        </Box> {address.country || 'No especificado'}
                                                                    </Typography>
                                                                </Box>


                                                                {/* Fecha de creación */}
                                                                {address.created_at && (
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1,
                                                                        mt: 0.5
                                                                    }}>
                                                                        <AccessTimeIcon
                                                                            sx={{color: vistelicaColors.secondary}}
                                                                            fontSize="small"/>
                                                                        <Typography variant="body2" fontSize="0.75rem">
                                                                            <Box component="span" sx={{
                                                                                color: vistelicaColors.primary,
                                                                                fontWeight: 600
                                                                            }}>
                                                                                Fecha de creación:
                                                                            </Box> {formatDate(address.created_at)}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        </CardContent>

                                                        <Divider sx={{mx: 2, opacity: 0.6, my: 0.5}}/>

                                                        <CardActions sx={{
                                                            justifyContent: 'space-between',
                                                            p: {xs: 0.5, sm: 1},
                                                            backgroundColor: address.is_default ? 'rgba(228, 176, 2, 0.03)' : 'transparent',
                                                            flexDirection: 'row',
                                                            flexWrap: 'nowrap'
                                                        }}>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                width: '100%',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center'
                                                            }}>
                                                                {!address.is_default && (
                                                                    <Tooltip
                                                                        title="Establecer como dirección predeterminada">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => handleSetDefaultAddress(address.id)}
                                                                            sx={{
                                                                                color: vistelicaColors.primary,
                                                                                '&:hover': {
                                                                                    backgroundColor: 'rgba(228, 176, 2, 0.1)',
                                                                                    transform: 'scale(1.1)'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <StarIcon/>
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}

                                                                {address.is_default && <Box sx={{width: '36px'}}></Box>}

                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    gap: 1,
                                                                    justifyContent: 'flex-end'
                                                                }}>
                                                                    <Tooltip title="Editar dirección">
                                                                        <Button
                                                                            size="small"
                                                                            onClick={() => handleOpenDialog(address)}
                                                                            startIcon={<EditIcon/>}
                                                                            sx={{
                                                                                color: vistelicaColors.secondary,
                                                                                minWidth: {xs: '36px', sm: '64px'},
                                                                                px: {xs: 0.5, sm: 1}
                                                                            }}
                                                                        >
                                                                            {!isMobile && 'Editar'}
                                                                        </Button>
                                                                    </Tooltip>
                                                                    <Tooltip
                                                                        title={address.is_default ? "No se puede eliminar la dirección predeterminada" : "Eliminar dirección"}>
                                        <span>
                                            <Button
                                                size="small"
                                                onClick={() => openConfirmDeleteDialog(address)}
                                                disabled={address.is_default}
                                                startIcon={<DeleteIcon/>}
                                                sx={{
                                                    color: address.is_default ? 'rgba(0,0,0,0.26)' : vistelicaColors.error,
                                                    minWidth: {xs: '36px', sm: '64px'},
                                                    px: {xs: 0.5, sm: 1}
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
                    username={userName}
                    avatarUrl={userAvatar}
                    drawerOpen={sidebarOpen}
                    setDrawerOpen={setSidebarOpen}
                    key="mobile-sidebar"
                />
            )}

            {/* Dialog para añadir/editar dirección */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        overflow: 'hidden',
                        maxWidth: {xs: '95%', sm: '700px'},
                        margin: '0 auto',
                        width: '100%'
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: editingAddress?.is_default ? 'rgba(228, 176, 2, 0.08)' : 'transparent',
                        borderBottom: '1px solid #eaeaea',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 2.5,
                        mb: {xs: 1, sm: 3},
                        position: 'relative',
                        zIndex: 1,
                        px: {xs: 2, sm: 3}
                    }}
                >
                    <LocationOnIcon sx={{color: vistelicaColors.primary}}/>
                    <Typography variant="h6" fontWeight="400" fontSize={{xs: '1.1rem', sm: '1.25rem',color: vistelicaColors.primary}}>
                        {editingAddress ? 'Editar dirección' : 'Añadir nueva dirección'}
                    </Typography>
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        px: {xs: 2, sm: 4},
                        py: {xs: 2, sm: 4},
                        mt: {xs: 0, sm: 2},
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        '&.MuiDialogContent-root': {
                            paddingTop: {xs: '24px', sm: '24px'}
                        }
                    }}
                >
                    <Box sx={{
                        width: '100%',
                        maxWidth: '550px',
                        mx: 'auto',
                        textAlign: 'center'
                    }}>
                        <Grid container spacing={{ xs: 2, sm: 3.5 }} justifyContent="center">
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    name="label"
                                    label="Nombre de la dirección"
                                    placeholder="Ej: Casa, Trabajo, etc."
                                    value={formData.label}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={errors.label}
                                    helperText={errors.label ? "Este campo es obligatorio" : ""}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {borderColor: vistelicaColors.primary},
                                            '&.Mui-focused fieldset': {borderColor: vistelicaColors.primary}
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: vistelicaColors.primary
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    name="street"
                                    label="Calle"
                                    value={formData.street}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={errors.street}
                                    helperText={errors.street ? "Este campo es obligatorio" : ""}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {borderColor: vistelicaColors.primary},
                                            '&.Mui-focused fieldset': {borderColor: vistelicaColors.primary}
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: vistelicaColors.primary
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    name="numero"
                                    label="Número"
                                    value={formData.numero}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {borderColor: vistelicaColors.primary},
                                            '&.Mui-focused fieldset': {borderColor: vistelicaColors.primary}
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: vistelicaColors.primary
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    name="postal_code"
                                    label="Código postal"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={errors.postal_code}
                                    helperText={errors.postal_code ? "Este campo es obligatorio" : ""}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {borderColor: vistelicaColors.primary},
                                            '&.Mui-focused fieldset': {borderColor: vistelicaColors.primary}
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: vistelicaColors.primary
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    name="city"
                                    label="Ciudad"
                                    value={formData.city}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={errors.city}
                                    helperText={errors.city ? "Este campo es obligatorio" : ""}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {borderColor: vistelicaColors.primary},
                                            '&.Mui-focused fieldset': {borderColor: vistelicaColors.primary}
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: vistelicaColors.primary
                                        }
                                    }}
                                />
                            </Grid>
                            {/* Dentro del Grid container del DialogContent, después del campo de número */}
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    name="block"
                                    label="Bloque"
                                    value={formData.block}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {borderColor: vistelicaColors.primary},
                                            '&.Mui-focused fieldset': {borderColor: vistelicaColors.primary}
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: vistelicaColors.primary
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    name="floor"
                                    label="Piso"
                                    value={formData.floor}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {borderColor: vistelicaColors.primary},
                                            '&.Mui-focused fieldset': {borderColor: vistelicaColors.primary}
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: vistelicaColors.primary
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    name="door"
                                    label="Puerta"
                                    value={formData.door}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {borderColor: vistelicaColors.primary},
                                            '&.Mui-focused fieldset': {borderColor: vistelicaColors.primary}
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: vistelicaColors.primary
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    name="state"
                                    label="Provincia"
                                    value={formData.state}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={errors.state}
                                    helperText={errors.state ? "Este campo es obligatorio" : ""}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {borderColor: vistelicaColors.primary},
                                            '&.Mui-focused fieldset': {borderColor: vistelicaColors.primary}
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: vistelicaColors.primary
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    name="country"
                                    label="País"
                                    value={formData.country}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={errors.country}
                                    helperText={errors.country ? "Este campo es obligatorio" : ""}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {borderColor: vistelicaColors.primary},
                                            '&.Mui-focused fieldset': {borderColor: vistelicaColors.primary}
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: vistelicaColors.primary
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    name="description"
                                    label="Instrucciones de entrega"
                                    value={formData.description}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="Ej: Puerta derecha, timbre roto, llamar por teléfono antes de entregar, etc."
                                    helperText="Información útil para el repartidor"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {borderColor: vistelicaColors.primary},
                                            '&.Mui-focused fieldset': {borderColor: vistelicaColors.primary}
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: vistelicaColors.primary
                                        }
                                    }}
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
                        onClick={handleSaveAddress}
                        variant="contained"
                        disabled={loading || Object.values(errors).some(error => error)}
                        sx={{
                            backgroundColor: vistelicaColors.primary,
                            '&:hover': {
                                backgroundColor: vistelicaColors.secondary,
                            },
                            px: { xs: 2, sm: 3 },
                            mx: { xs: 1, sm: 2 }
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : editingAddress ? 'Actualizar' : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog para confirmar eliminación */}
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
                    <DeleteIcon sx={{color: '#d32f2f'}}/>
                    <Typography variant="h6" fontWeight="400" fontSize={{color: vistelicaColors.error }}>
                        Confirmar eliminación
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{px: 3, py: 3, mt: 1}}>
                    <Box sx={{display: 'flex', alignItems: 'flex-start', gap: 2}}>
                        <InfoOutlinedIcon sx={{color: 'text.secondary', mt: 0.5}}/>
                        <DialogContentText id="alert-dialog-description" sx={{m: 0}}>
                            ¿Estás seguro de que deseas eliminar la dirección <b>"{addressToDelete?.label || ''}"</b>?
                            <br/>
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
                            '&:hover': {bgcolor: 'rgba(0,0,0,0.05)'}
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDeleteAddress}
                        variant="contained"
                        disabled={loading}
                        startIcon={<DeleteIcon/>}
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
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{width: '100%'}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AccountAddresses;
