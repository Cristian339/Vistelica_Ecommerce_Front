"use client";

import * as React from 'react';
import { useEffect, useState } from 'react';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import { getProfileAndAddresses } from '@/services/profileService';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';

const FormGrid = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
}));

export default function AddressForm({ onDataChange }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        block: '',
        floor: '',
        door: ''
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Función para enviar datos al componente padre
    const sendDataToParent = (addressId, formDataToSend) => {
        if (onDataChange) {
            onDataChange({
                selectedAddressId: addressId,
                formData: formDataToSend
            });
        }
    };

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);
                const data = await getProfileAndAddresses();

                // Extraer el nombre y apellido del perfil
                const { name, lastName } = data;

                // Guardar todas las direcciones para usar en el modal
                setAddresses(data.addresses || []);

                // Encontrar la dirección predeterminada
                const defaultAddress = data.addresses.find(address => address.is_default === true) ||
                    (data.addresses.length > 0 ? data.addresses[0] : null);

                if (defaultAddress) {
                    const newFormData = {
                        firstName: name || '',
                        lastName: lastName || '',
                        address1: defaultAddress.street || '',
                        address2: defaultAddress.label || '',
                        city: defaultAddress.city || '',
                        state: defaultAddress.state || '',
                        zip: defaultAddress.postal_code || '',
                        country: defaultAddress.country || '',
                        block: defaultAddress.block || '',
                        floor: defaultAddress.floor || '',
                        door: defaultAddress.door || ''
                    };

                    setFormData(newFormData);
                    setSelectedAddressId(defaultAddress.id);
                    sendDataToParent(defaultAddress.id, newFormData);
                } else {
                    // Si no hay dirección predeterminada, al menos establecer nombre y apellido
                    const newFormData = {
                        firstName: name || '',
                        lastName: lastName || '',
                        address1: '',
                        address2: '',
                        city: '',
                        state: '',
                        zip: '',
                        country: '',
                        block: '',
                        floor: '',
                        door: ''
                    };

                    setFormData(newFormData);
                    sendDataToParent(null, newFormData);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error al cargar los datos del usuario:', err);
                setError('No se pudieron cargar los datos del usuario. Por favor, inténtelo de nuevo más tarde.');
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        const newFormData = {
            ...formData,
            [name]: value
        };

        setFormData(newFormData);

        // Cuando el usuario modifica manualmente el formulario,
        // consideramos que ya no está usando una dirección guardada
        setSelectedAddressId(null);
        sendDataToParent(null, newFormData);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
        setSearchTerm('');
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSelectAddress = (address) => {
        const newFormData = {
            ...formData,
            address1: address.street || '',
            address2: address.label || '',
            city: address.city || '',
            state: address.state || '',
            zip: address.postal_code || '',
            country: address.country || '',
            block: address.block || '',
            floor: address.floor || '',
            door: address.door || ''
        };

        setFormData(newFormData);
        setSelectedAddressId(address.id);
        sendDataToParent(address.id, newFormData);

        handleCloseDialog();
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

    const filteredAddresses = addresses.filter(address => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (address.label && address.label.toLowerCase().includes(searchLower)) ||
            (address.street && address.street.toLowerCase().includes(searchLower)) ||
            (address.city && address.city.toLowerCase().includes(searchLower)) ||
            (address.state && address.state.toLowerCase().includes(searchLower)) ||
            (address.block && address.block.toLowerCase().includes(searchLower)) ||
            (address.floor && address.floor.toLowerCase().includes(searchLower)) ||
            (address.door && address.door.toLowerCase().includes(searchLower))
        );
    });

    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                <CircularProgress />
            </Grid>
        );
    }

    if (error) {
        return (
            <Alert severity="error">{error}</Alert>
        );
    }

    return (
        <>
            <Grid container spacing={3}>

                <FormGrid item xs={12} md={6}>
                    <FormLabel htmlFor="firstName" required>
                        Nombre
                    </FormLabel>
                    <OutlinedInput
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Juan"
                        autoComplete="given-name"
                        required
                        size="small"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </FormGrid>
                <FormGrid item xs={12} md={6}>
                    <FormLabel htmlFor="lastName" required>
                        Apellido
                    </FormLabel>
                    <OutlinedInput
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Pérez"
                        autoComplete="family-name"
                        required
                        size="small"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </FormGrid>
                <FormGrid item xs={12}>
                    <FormLabel htmlFor="address1" required>
                        Dirección línea 1
                    </FormLabel>
                    <OutlinedInput
                        id="address1"
                        name="address1"
                        type="text"
                        placeholder="Nombre de calle y número"
                        autoComplete="shipping address-line1"
                        required
                        size="small"
                        value={formData.address1}
                        onChange={handleChange}
                    />
                </FormGrid>
                <FormGrid item xs={12}>
                    <FormLabel htmlFor="address2">Dirección línea 2</FormLabel>
                    <OutlinedInput
                        id="address2"
                        name="address2"
                        type="text"
                        placeholder="Apartamento, suite, unidad, etc. (opcional)"
                        autoComplete="shipping address-line2"
                        size="small"
                        value={formData.address2}
                        onChange={handleChange}
                    />
                </FormGrid>
                <FormGrid item xs={6}>
                    <FormLabel htmlFor="city" required>
                        Ciudad
                    </FormLabel>
                    <OutlinedInput
                        id="city"
                        name="city"
                        type="text"
                        placeholder="Madrid"
                        autoComplete="shipping address-level2"
                        required
                        size="small"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </FormGrid>
                <FormGrid item xs={6}>
                    <FormLabel htmlFor="state" required>
                        Provincia
                    </FormLabel>
                    <OutlinedInput
                        id="state"
                        name="state"
                        type="text"
                        placeholder="Madrid"
                        autoComplete="shipping address-level1"
                        required
                        size="small"
                        value={formData.state}
                        onChange={handleChange}
                    />
                </FormGrid>
                <FormGrid item xs={6}>
                    <FormLabel htmlFor="zip" required>
                        Código Postal
                    </FormLabel>
                    <OutlinedInput
                        id="zip"
                        name="zip"
                        type="text"
                        placeholder="28001"
                        autoComplete="shipping postal-code"
                        required
                        size="small"
                        value={formData.zip}
                        onChange={handleChange}
                    />
                </FormGrid>
                <FormGrid item xs={6}>
                    <FormLabel htmlFor="country" required>
                        País
                    </FormLabel>
                    <OutlinedInput
                        id="country"
                        name="country"
                        type="text"
                        placeholder="España"
                        autoComplete="shipping country"
                        required
                        size="small"
                        value={formData.country}
                        onChange={handleChange}
                    />
                </FormGrid>
                <FormGrid item xs={12} md={4}>
                    <FormLabel htmlFor="block">Bloque</FormLabel>
                    <OutlinedInput
                        id="block"
                        name="block"
                        type="text"
                        placeholder="Bloque (opcional)"
                        size="small"
                        value={formData.block}
                        onChange={handleChange}
                    />
                </FormGrid>
                <FormGrid item xs={12} md={4}>
                    <FormLabel htmlFor="floor">Piso</FormLabel>
                    <OutlinedInput
                        id="floor"
                        name="floor"
                        type="text"
                        placeholder="Piso (opcional)"
                        size="small"
                        value={formData.floor}
                        onChange={handleChange}
                    />
                </FormGrid>
                <FormGrid item xs={12} md={4}>
                    <FormLabel htmlFor="door">Puerta</FormLabel>
                    <OutlinedInput
                        id="door"
                        name="door"
                        type="text"
                        placeholder="Puerta (opcional)"
                        size="small"
                        value={formData.door}
                        onChange={handleChange}
                    />
                </FormGrid>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleOpenDialog}
                            startIcon={<SearchIcon />}
                            sx={{
                                borderColor: '#E4B002',
                                color: '#E4B002',
                                fontWeight: 'bold',
                                '&:hover': {
                                    borderColor: '#A67D00',
                                    backgroundColor: 'rgba(228, 176, 2, 0.04)',
                                }
                            }}
                        >
                            Buscar mis direcciones
                        </Button>
                    </Box>
                </Grid>


                {selectedAddressId && (
                    <Grid item xs={12}>
                        <Box sx={{
                            p: 2,
                            bgcolor: 'rgba(228, 176, 2, 0.08)',
                            borderRadius: 1,
                            border: '1px solid rgba(228, 176, 2, 0.3)'
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                ✓ Usando dirección guardada (ID: {selectedAddressId})
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            {/* Modal para seleccionar direcciones */}
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
                        bgcolor: 'rgba(228, 176, 2, 0.08)',
                        borderBottom: '1px solid #eaeaea',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 2.5,
                        position: 'relative',
                        zIndex: 1,
                        px: {xs: 2, sm: 3}
                    }}
                >
                    <LocationOnIcon sx={{ color: '#E4B002' }}/>
                    <Typography variant="h6" fontWeight="600" fontSize={{xs: '1.1rem', sm: '1.25rem'}}>
                        Seleccionar dirección
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Buscar dirección..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {borderColor: '#E4B002'},
                                    '&.Mui-focused fieldset': {borderColor: '#E4B002'}
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#E4B002'
                                }
                            }}
                        />
                    </Box>

                    {filteredAddresses.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <LocationOnIcon sx={{ fontSize: 60, color: '#E4B002', mb: 2 }}/>
                            <Typography variant="body1">
                                No tienes direcciones guardadas
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2} sx={{ maxHeight: '400px', overflow: 'auto' }}>
                            {filteredAddresses.map((address) => (
                                <Grid item xs={12} key={address.id}>
                                    <Card
                                        sx={{
                                            border: address.is_default ? `2px solid #E4B002` : '1px solid #e0e0e0',
                                            boxShadow: address.is_default ? `0 2px 8px rgba(228, 176, 2, 0.2)` : '0 1px 5px rgba(0, 0, 0, 0.05)',
                                            borderRadius: '8px',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                                transform: 'translateY(-2px)'
                                            },
                                            background: address.is_default ? 'linear-gradient(to bottom right, #fffdf7, #fff)' : '#fff',
                                        }}
                                    >
                                        <CardActionArea onClick={() => handleSelectAddress(address)}>
                                            <CardContent sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                    <Box sx={{
                                                        mr: 1.5,
                                                        backgroundColor: address.is_default ? 'rgba(228, 176, 2, 0.15)' : 'rgba(0, 0, 0, 0.04)',
                                                        borderRadius: '50%',
                                                        width: 36,
                                                        height: 36,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: address.is_default ? '#E4B002' : 'text.secondary',
                                                        flexShrink: 0
                                                    }}>
                                                        {getAddressIcon(address.label)}
                                                    </Box>
                                                    <Box sx={{ width: '100%' }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                            <Typography variant="subtitle1" fontWeight="600" color={address.is_default ? '#E4B002' : 'text.primary'}>
                                                                {address.label || 'Dirección sin nombre'}
                                                            </Typography>
                                                            {address.is_default && (
                                                                <Box component="span" sx={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    color: '#E4B002',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 'bold',
                                                                    backgroundColor: 'rgba(228, 176, 2, 0.1)',
                                                                    px: 1,
                                                                    py: 0.5,
                                                                    borderRadius: 1
                                                                }}>
                                                                    <StarIcon fontSize="small" sx={{ mr: 0.5 }}/>
                                                                    Predeterminada
                                                                </Box>
                                                            )}
                                                        </Box>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                            {address.street}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {address.city}, {address.state}, {address.postal_code}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {address.country || 'España'}
                                                        </Typography>
                                                        {address.block && (
                                                            <Typography variant="body2" color="text.secondary">
                                                                <Box component="span" sx={{ fontWeight: 600 }}>Bloque:</Box> {address.block}
                                                            </Typography>
                                                        )}
                                                        {address.floor && (
                                                            <Typography variant="body2" color="text.secondary">
                                                                <Box component="span" sx={{ fontWeight: 600 }}>Piso:</Box> {address.floor}
                                                            </Typography>
                                                        )}
                                                        {address.door && (
                                                            <Typography variant="body2" color="text.secondary">
                                                                <Box component="span" sx={{ fontWeight: 600 }}>Puerta:</Box> {address.door}
                                                            </Typography>
                                                        )}
                                                        <Typography variant="caption" color="text.disabled">
                                                            ID: {address.id}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{
                    px: 3,
                    py: 2,
                    borderTop: '1px solid #eaeaea',
                    bgcolor: '#fafafa',
                    justifyContent: 'center'
                }}>
                    <Button
                        onClick={handleCloseDialog}
                        variant="outlined"
                        sx={{
                            borderColor: '#999',
                            color: '#666',
                            '&:hover': {
                                borderColor: '#666',
                                backgroundColor: 'rgba(0,0,0,0.05)'
                            },
                            px: 3
                        }}
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}