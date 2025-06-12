"use client";

import * as React from 'react';
import { useEffect, useState, useCallback, useMemo } from 'react';
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { vistelicaColors } from "@/components/shared/vistelicaColors";
import { typography } from '@/components/shared/themePrimitives';
import StarIcon from '@mui/icons-material/Star';

const FormGrid = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
}));

// Estilo personalizado para los inputs
const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
    borderRadius: '8px',
    transition: 'all 0.2s',
    '&.MuiOutlinedInput-root': {
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: vistelicaColors.primary,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: vistelicaColors.primary,
            boxShadow: `0 0 0 3px ${vistelicaColors.primary}20`,
        }
    }
}));

// Estilo para las etiquetas
const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
    fontFamily: typography.fontFamily,
    marginBottom: '6px',
    fontWeight: 500,
    fontSize: '0.9rem',
    color: '#424242',
}));

// Título de sección con la paleta primary
const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
    color: '#212121',
    fontFamily: typography.fontFamily,
    position: 'relative',
    paddingBottom: theme.spacing(1),
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '50px',
        height: '3px',
        backgroundColor: vistelicaColors.primary,
        borderRadius: '2px'
    }
}));

// Convertir a componente memo para mejorar el rendimiento
const AddressForm = React.memo(function AddressForm({ onDataChange }) {
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
    const sendDataToParent = useCallback((addressId, formDataToSend) => {
        if (onDataChange) {
            onDataChange({
                selectedAddressId: addressId,
                formData: formDataToSend
            });
        }
    }, [onDataChange]);

    // Corrección: Removida la dependencia sendDataToParent para evitar el bucle infinito
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

                    // Llamamos a la función directamente en vez de usar la versión memoizada
                    if (onDataChange) {
                        onDataChange({
                            selectedAddressId: defaultAddress.id,
                            formData: newFormData
                        });
                    }
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

                    // Llamamos a la función directamente en vez de usar la versión memoizada
                    if (onDataChange) {
                        onDataChange({
                            selectedAddressId: null,
                            formData: newFormData
                        });
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error('Error al cargar los datos del usuario:', err);
                setError('No se pudieron cargar los datos del usuario. Por favor, inténtelo de nuevo más tarde.');
                setLoading(false);
            }
        };

        loadUserData();
    }, []); // Eliminamos sendDataToParent de las dependencias

    const handleChange = useCallback((event) => {
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
    }, [formData, sendDataToParent]);

    const handleOpenDialog = useCallback(() => {
        setOpenDialog(true);
        setSearchTerm('');
    }, []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialog(false);
    }, []);

    const handleSelectAddress = useCallback((address) => {
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
    }, [formData, handleCloseDialog, sendDataToParent]);

    const getAddressIcon = useCallback((alias) => {
        if (!alias) return <LocationOnIcon />;

        const normalizedAlias = alias.toLowerCase();
        if (normalizedAlias.includes('casa') || normalizedAlias.includes('hogar')) {
            return <HomeIcon />;
        } else if (normalizedAlias.includes('trabajo') || normalizedAlias.includes('oficina')) {
            return <BusinessIcon />;
        }
        return <PlaceIcon />;
    }, []);

    // Filtrado de direcciones memoizado
    const filteredAddresses = useMemo(() => addresses.filter(address => {
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
    }), [addresses, searchTerm]);

    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '200px' }}>
                <CircularProgress sx={{ color: vistelicaColors.primary }} aria-label="Cargando datos de dirección" />
            </Grid>
        );
    }

    if (error) {
        return (
            <Alert severity="error" role="alert"
                   sx={{
                       borderRadius: '8px',
                       boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                       marginBottom: 2
                   }}
            >
                {error}
            </Alert>
        );
    }

    return (
        <>
            <SectionTitle variant="h6">
                Dirección de envío
            </SectionTitle>

            <Grid container spacing={3}>
                <FormGrid item xs={12} md={6}>
                    <StyledFormLabel htmlFor="firstName" required>
                        Nombre
                    </StyledFormLabel>
                    <StyledOutlinedInput
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Juan"
                        autoComplete="given-name"
                        required
                        size="small"
                        value={formData.firstName}
                        onChange={handleChange}
                        aria-required="true"
                        fullWidth
                    />
                </FormGrid>
                <FormGrid item xs={12} md={6}>
                    <StyledFormLabel htmlFor="lastName" required>
                        Apellido
                    </StyledFormLabel>
                    <StyledOutlinedInput
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Pérez"
                        autoComplete="family-name"
                        required
                        size="small"
                        value={formData.lastName}
                        onChange={handleChange}
                        aria-required="true"
                        fullWidth
                    />
                </FormGrid>
                <FormGrid item xs={12}>
                    <StyledFormLabel htmlFor="address1" required>
                        Dirección línea 1
                    </StyledFormLabel>
                    <StyledOutlinedInput
                        id="address1"
                        name="address1"
                        type="text"
                        placeholder="Nombre de calle y número"
                        autoComplete="shipping address-line1"
                        required
                        size="small"
                        value={formData.address1}
                        onChange={handleChange}
                        aria-required="true"
                        fullWidth
                    />
                </FormGrid>
                <FormGrid item xs={12}>
                    <StyledFormLabel htmlFor="address2">
                        Dirección línea 2
                    </StyledFormLabel>
                    <StyledOutlinedInput
                        id="address2"
                        name="address2"
                        type="text"
                        placeholder="Apartamento, suite, unidad, etc. (opcional)"
                        autoComplete="shipping address-line2"
                        size="small"
                        value={formData.address2}
                        onChange={handleChange}
                        fullWidth
                    />
                </FormGrid>
                <FormGrid item xs={12} sm={6}>
                    <StyledFormLabel htmlFor="city" required>
                        Ciudad
                    </StyledFormLabel>
                    <StyledOutlinedInput
                        id="city"
                        name="city"
                        type="text"
                        placeholder="Madrid"
                        autoComplete="shipping address-level2"
                        required
                        size="small"
                        value={formData.city}
                        onChange={handleChange}
                        aria-required="true"
                        fullWidth
                    />
                </FormGrid>
                <FormGrid item xs={12} sm={6}>
                    <StyledFormLabel htmlFor="state" required>
                        Provincia
                    </StyledFormLabel>
                    <StyledOutlinedInput
                        id="state"
                        name="state"
                        type="text"
                        placeholder="Madrid"
                        autoComplete="shipping address-level1"
                        required
                        size="small"
                        value={formData.state}
                        onChange={handleChange}
                        aria-required="true"
                        fullWidth
                    />
                </FormGrid>
                <FormGrid item xs={12} sm={6}>
                    <StyledFormLabel htmlFor="zip" required>
                        Código Postal
                    </StyledFormLabel>
                    <StyledOutlinedInput
                        id="zip"
                        name="zip"
                        type="text"
                        placeholder="28001"
                        autoComplete="shipping postal-code"
                        required
                        size="small"
                        value={formData.zip}
                        onChange={handleChange}
                        aria-required="true"
                        fullWidth
                    />
                </FormGrid>
                <FormGrid item xs={12} sm={6}>
                    <StyledFormLabel htmlFor="country" required>
                        País
                    </StyledFormLabel>
                    <StyledOutlinedInput
                        id="country"
                        name="country"
                        type="text"
                        placeholder="España"
                        autoComplete="shipping country"
                        required
                        size="small"
                        value={formData.country}
                        onChange={handleChange}
                        aria-required="true"
                        fullWidth
                    />
                </FormGrid>
                <FormGrid item xs={12} sm={4}>
                    <StyledFormLabel htmlFor="block">
                        Bloque
                    </StyledFormLabel>
                    <StyledOutlinedInput
                        id="block"
                        name="block"
                        type="text"
                        placeholder="Bloque (opcional)"
                        size="small"
                        value={formData.block}
                        onChange={handleChange}
                        fullWidth
                    />
                </FormGrid>
                <FormGrid item xs={12} sm={4}>
                    <StyledFormLabel htmlFor="floor">
                        Piso
                    </StyledFormLabel>
                    <StyledOutlinedInput
                        id="floor"
                        name="floor"
                        type="text"
                        placeholder="Piso (opcional)"
                        size="small"
                        value={formData.floor}
                        onChange={handleChange}
                        fullWidth
                    />
                </FormGrid>
                <FormGrid item xs={12} sm={4}>
                    <StyledFormLabel htmlFor="door">
                        Puerta
                    </StyledFormLabel>
                    <StyledOutlinedInput
                        id="door"
                        name="door"
                        type="text"
                        placeholder="Puerta (opcional)"
                        size="small"
                        value={formData.door}
                        onChange={handleChange}
                        fullWidth
                    />
                </FormGrid>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button
                            variant="outlined"
                            onClick={handleOpenDialog}
                            startIcon={<SearchIcon />}
                            sx={{
                                borderRadius: '30px',
                                borderColor: vistelicaColors.primary,
                                color: vistelicaColors.primary,
                                fontWeight: 600,
                                padding: '8px 24px',
                                fontFamily: typography.fontFamily,
                                transition: 'all 0.3s',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                '&:hover': {
                                    borderColor: vistelicaColors.secondary,
                                    backgroundColor: `${vistelicaColors.primary}10`,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transform: 'translateY(-2px)'
                                },
                            }}
                        >
                            Buscar mis direcciones
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            {/* Modal para seleccionar direcciones */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                aria-labelledby="dialog-title"
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        overflow: 'hidden',
                        maxWidth: {xs: '95%', sm: '700px'},
                        margin: '0 auto',
                        width: '100%',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                    }
                }}
            >
                <DialogTitle
                    id="dialog-title"
                    sx={{
                        background: `linear-gradient(45deg, ${vistelicaColors.primary}15, ${vistelicaColors.secondary}05)`,
                        borderBottom: '1px solid #eaeaea',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 2.5,
                        position: 'relative',
                        zIndex: 1,
                        px: {xs: 2, sm: 3},
                        fontFamily: typography.fontFamily
                    }}
                >
                    <LocationOnIcon sx={{
                        color: vistelicaColors.primary,
                        fontSize: '28px'
                    }}/>
                    <Typography
                        variant="h6"
                        fontWeight="600"
                        fontSize={{xs: '1.1rem', sm: '1.25rem'}}
                        fontFamily={typography.fontFamily}
                    >
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
                                sx: {
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                }
                            }}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {borderColor: vistelicaColors.primary},
                                    '&.Mui-focused fieldset': {
                                        borderColor: vistelicaColors.primary,
                                        boxShadow: `0 0 0 3px ${vistelicaColors.primary}20`
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: vistelicaColors.primary
                                },
                                fontFamily: typography.fontFamily
                            }}
                        />
                    </Box>

                    {filteredAddresses.length === 0 ? (
                        <Box sx={{
                            textAlign: 'center',
                            py: 6,
                            backgroundColor: '#f9f9f9',
                            borderRadius: '12px'
                        }}>
                            <LocationOnIcon sx={{
                                fontSize: 70,
                                color: '#bdbdbd',
                                mb: 2,
                                opacity: 0.7
                            }}/>
                            <Typography
                                variant="body1"
                                fontFamily={typography.fontFamily}
                                sx={{ color: '#757575' }}
                            >
                                No tienes direcciones guardadas
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2} sx={{ maxHeight: '400px', overflow: 'auto', pr: 1 }}>
                            {filteredAddresses.map((address) => (
                                <Grid item xs={12} key={address.id}>
                                    <Card
                                        sx={{
                                            border: address.is_default ? `2px solid ${vistelicaColors.primary}` : '1px solid #e0e0e0',
                                            boxShadow: address.is_default ? `0 3px 10px ${vistelicaColors.primary}30` : '0 2px 8px rgba(0, 0, 0, 0.06)',
                                            borderRadius: '12px',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.12)',
                                                transform: 'translateY(-2px)'
                                            },
                                            background: address.is_default
                                                ? `linear-gradient(to right, ${vistelicaColors.primary}05, #fff)`
                                                : '#fff',
                                            overflow: 'visible',
                                        }}
                                    >
                                        <CardActionArea
                                            onClick={() => handleSelectAddress(address)}
                                            sx={{
                                                borderRadius: '12px',
                                                height: '100%'
                                            }}
                                        >
                                            <CardContent sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                    <Box sx={{
                                                        mr: 1.5,
                                                        backgroundColor: address.is_default
                                                            ? `${vistelicaColors.primary}15`
                                                            : 'rgba(0, 0, 0, 0.05)',
                                                        borderRadius: '12px',
                                                        width: 42,
                                                        height: 42,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: address.is_default ? vistelicaColors.primary : '#666',
                                                        flexShrink: 0,
                                                        boxShadow: address.is_default
                                                            ? `0 2px 8px ${vistelicaColors.primary}30`
                                                            : 'none'
                                                    }}>
                                                        {getAddressIcon(address.label)}
                                                    </Box>
                                                    <Box sx={{ width: '100%' }}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mb: 0.5
                                                        }}>
                                                            <Typography
                                                                variant="subtitle1"
                                                                fontWeight="600"
                                                                color={address.is_default ? vistelicaColors.primary : 'text.primary'}
                                                                fontFamily={typography.fontFamily}
                                                            >
                                                                {address.label || 'Dirección sin nombre'}
                                                            </Typography>
                                                            {address.is_default && (
                                                                <Box component="span" sx={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    color: vistelicaColors.primary,
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 'bold',
                                                                    backgroundColor: `${vistelicaColors.primary}15`,
                                                                    px: 1.5,
                                                                    py: 0.5,
                                                                    borderRadius: 10,
                                                                    fontFamily: typography.fontFamily,
                                                                    boxShadow: `0 2px 5px ${vistelicaColors.primary}20`
                                                                }}>
                                                                    <CheckCircleOutlineIcon
                                                                        fontSize="small"
                                                                        sx={{ mr: 0.5, fontSize: '14px' }}
                                                                    />
                                                                    Predeterminada
                                                                </Box>
                                                            )}
                                                        </Box>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.primary"
                                                            sx={{ mb: 0.5, fontWeight: 500 }}
                                                            fontFamily={typography.fontFamily}
                                                        >
                                                            {address.street}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            fontFamily={typography.fontFamily}
                                                        >
                                                            {address.city}, {address.state}, {address.postal_code}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            fontFamily={typography.fontFamily}
                                                        >
                                                            {address.country || 'España'}
                                                        </Typography>

                                                        {/* Información adicional con mejor diseño */}
                                                        {(address.block || address.floor || address.door) && (
                                                            <Box
                                                                sx={{
                                                                    mt: 1,
                                                                    pt: 1,
                                                                    borderTop: '1px dashed #e0e0e0',
                                                                    display: 'flex',
                                                                    flexWrap: 'wrap',
                                                                    gap: 1
                                                                }}
                                                            >
                                                                {address.block && (
                                                                    <Box component="span" sx={{
                                                                        backgroundColor: '#f5f5f5',
                                                                        px: 1,
                                                                        py: 0.3,
                                                                        borderRadius: 1,
                                                                        fontSize: '0.75rem',
                                                                        color: '#666'
                                                                    }}>
                                                                        Bloque: {address.block}
                                                                    </Box>
                                                                )}

                                                                {address.floor && (
                                                                    <Box component="span" sx={{
                                                                        backgroundColor: '#f5f5f5',
                                                                        px: 1,
                                                                        py: 0.3,
                                                                        borderRadius: 1,
                                                                        fontSize: '0.75rem',
                                                                        color: '#666'
                                                                    }}>
                                                                        Piso: {address.floor}
                                                                    </Box>
                                                                )}

                                                                {address.door && (
                                                                    <Box component="span" sx={{
                                                                        backgroundColor: '#f5f5f5',
                                                                        px: 1,
                                                                        py: 0.3,
                                                                        borderRadius: 1,
                                                                        fontSize: '0.75rem',
                                                                        color: '#666'
                                                                    }}>
                                                                        Puerta: {address.door}
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        )}
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
                            borderRadius: '8px',
                            borderColor: '#999',
                            color: '#666',
                            fontFamily: typography.fontFamily,
                            fontWeight: 600,
                            px: 4,
                            py: 1,
                            '&:hover': {
                                borderColor: '#666',
                                backgroundColor: 'rgba(0,0,0,0.05)'
                            },
                        }}
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});

// Añadir displayName para herramientas de desarrollo
AddressForm.displayName = 'AddressForm';
export default AddressForm;
