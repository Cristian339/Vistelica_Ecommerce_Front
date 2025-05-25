import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Avatar,
    Button,
    TextField,
    Divider,
    IconButton,
    CircularProgress,
    Skeleton,
    Zoom,
    Menu,
    MenuItem,
    InputAdornment,
    Tooltip,
    Snackbar,
    Alert
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from '@/pages/shared-theme/themePrimitives';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import { updateUserProfile, getUserProfile } from '@/services/profileService';
import { motion } from 'framer-motion';

const AccountInfo = ({ userData, setUserData, loading }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);
    const [avatarMenu, setAvatarMenu] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarType, setAvatarType] = useState('url');
    const fileInputRef = useRef(null);
    const [originalData, setOriginalData] = useState({});
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success'
    });


    useEffect(() => {
        if (userData) {
            console.log('Datos del usuario originales:', userData);
        }
    }, [userData]);

    // Transforma los nombres de campos para que coincidan con lo que espera el backend
    const extractUserData = (data) => {
        if (!data) return {};
        const userObj = data.user || data || {};
        console.log("Foto" + userObj.avatar);
        return {
            name: userObj.name || userObj.nombre || '',
            lastName: userObj.lastName || userObj.apellido || '',
            email: userObj.email || userObj.correo || '',
            phone: userObj.phone || userObj.telefono || '',
            born_date: userObj.born_date || userObj.fechaNacimiento || null,
            avatar: userObj.avatar || userObj.profilePic || '',
            address: userObj.address || '',
        };

    };



    const handleEditClick = () => {
        const extractedData = extractUserData(userData);
        console.log('Datos extraídos para edición:', extractedData);

        setFormData(extractedData);
        setOriginalData(extractedData);
        setAvatarPreview(extractedData.avatar || '');
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            born_date: date
        });
    };

    const handleAvatarMenuClick = (event) => {
        setAvatarMenu(event.currentTarget);
    };

    const handleAvatarMenuClose = () => {
        setAvatarMenu(null);
    };

    const handleAvatarTypeChange = (type) => {
        setAvatarType(type);
        handleAvatarMenuClose();

        if (type === 'file') {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
                setFormData({
                    ...formData,
                    avatar: e.target.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarUrlChange = (e) => {
        const url = e.target.value;
        setAvatarPreview(url);
        setFormData({
            ...formData,
            avatar: url
        });
    };

    // Verificar si hay cambios en el formulario
    const hasChanges = useMemo(() => {
        if (!isEditing) return false;

        const fieldsToCheck = ['name', 'lastName', 'email', 'phone', 'avatar', 'address'];
        for (const field of fieldsToCheck) {
            if (formData[field] !== originalData[field]) {
                return true;
            }
        }

        // Verificar cambio de fecha de nacimiento
        if (formData.born_date && originalData.born_date) {
            const date1 = new Date(formData.born_date).toISOString().split('T')[0];
            const date2 = new Date(originalData.born_date).toISOString().split('T')[0];
            if (date1 !== date2) return true;
        } else if (formData.born_date !== originalData.born_date) {
            return true;
        }

        return false;
    }, [formData, originalData, isEditing]);

    const handleToastClose = () => {
        setToast({
            ...toast,
            open: false
        });
    };

    // Función de guardado siguiendo exactamente el patrón de AccountInfoEditable
    const handleSave = async () => {
        if (!hasChanges) {
            setToast({
                open: true,
                message: 'No hay cambios para guardar',
                severity: 'info'
            });
            return;
        }

        setSaving(true);
        try {
            // 1. Guardar cambios con el servicio (exactamente como AccountInfoEditable)
            await updateUserProfile(formData);

            // 2. Recargar datos frescos (exactamente como AccountInfoEditable)
            const updatedData = await getUserProfile();

            // 3. Actualizar estados
            if (setUserData) {
                setUserData(updatedData);
            }

            setIsEditing(false);
            setToast({
                open: true,
                message: 'Perfil actualizado correctamente',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
            setToast({
                open: true,
                message: `Error al guardar: ${error.message || 'Contacta al administrador'}`,
                severity: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setAvatarPreview(null);
    };

    if (loading) {
        return (
            <Paper elevation={0} sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Skeleton variant="circular" width={80} height={80} />
                    <Box sx={{ ml: 3 }}>
                        <Skeleton variant="text" width={200} height={40} />
                        <Skeleton variant="text" width={150} height={24} />
                    </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={12} sm={6} key={item}>
                            <Skeleton variant="text" width="100%" height={24} />
                            <Skeleton variant="text" width="80%" height={40} />
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        );
    }

    return (
        <Zoom in={!loading} style={{ transitionDelay: '100ms' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 4 },
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        background: 'linear-gradient(to bottom right, #fdfbf6, #fff)',
                        border: `1px solid ${vistelicaColors.divider}`,
                        overflow: 'hidden',
                        width: isEditing ? { xs: '100%', md: 'calc(100% + 150px)' } : '100%', // Aumentado de 80px a 150px
                        marginLeft: 10,  // Mantiene su posición a la izquierda
                        marginRight: isEditing ? { xs: 0, md: '-150px' } : 30, // Aumentado de -80px a -150px
                        transition: 'all 0.3s ease',
                        transformOrigin: 'left center',
                        zIndex: 0,
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        justifyContent: 'space-between',
                        mb: 3
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center',
                            mb: { xs: 2, sm: 0 }
                        }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={isEditing ? avatarPreview : userData?.avatar || userData?.profilePic}
                                    alt={userData?.name || 'Usuario'}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        border: `2px solid ${vistelicaColors.primary}`,
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                        backgroundColor: vistelicaColors.primary,
                                    }}
                                />
                                {isEditing && (
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: -10,
                                            backgroundColor: 'white',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                            '&:hover': {
                                                backgroundColor: vistelicaColors.primary,
                                                color: 'white'
                                            },
                                            width: 30,
                                            height: 30
                                        }}
                                        onClick={handleAvatarMenuClick}
                                    >
                                        <EditIcon sx={{ fontSize: 16, color: vistelicaColors.primary }} />
                                    </IconButton>
                                )}
                                <Menu
                                    anchorEl={avatarMenu}
                                    open={Boolean(avatarMenu)}
                                    onClose={handleAvatarMenuClose}
                                >
                                    <MenuItem onClick={() => handleAvatarTypeChange('url')}>
                                        <LinkIcon sx={{ mr: 1, fontSize: 18, color: vistelicaColors.primary }} />
                                        Usar URL de imagen
                                    </MenuItem>
                                    <MenuItem onClick={() => handleAvatarTypeChange('file')}>
                                        <ImageIcon sx={{ mr: 1, fontSize: 18, color: vistelicaColors.primary }} />
                                        Subir imagen
                                    </MenuItem>
                                </Menu>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </Box>

                            <Box sx={{
                                ml: { xs: 0, sm: 3 },
                                mt: { xs: 2, sm: 0 },
                                textAlign: { xs: 'center', sm: 'left' }
                            }}>
                                <Typography variant="h5" fontWeight="bold">
                                    {userData?.name || 'Usuario'} {userData?.lastName || ''}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: vistelicaColors.textSecondary,
                                        mt: 0.5
                                    }}
                                >
                                    Miembro desde {new Date(userData?.createdAt || new Date()).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>

                        {!isEditing ? (
                            <Button
                                startIcon={<EditIcon />}
                                variant="outlined"
                                sx={{
                                    borderColor: vistelicaColors.primary,
                                    color: vistelicaColors.primary,
                                    '&:hover': {
                                        borderColor: vistelicaColors.primary,
                                        backgroundColor: 'rgba(228, 176, 2, 0.04)',
                                    }
                                }}
                                onClick={handleEditClick}
                            >
                                Editar perfil
                            </Button>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title={!hasChanges ? "No hay cambios para guardar" : ""}>
                                    <span>
                                        <Button
                                            startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                                            variant="contained"
                                            disabled={saving || !hasChanges}
                                            sx={{
                                                backgroundColor: vistelicaColors.primary,
                                                '&:hover': {
                                                    backgroundColor: vistelicaColors.primary,
                                                },
                                                '&.Mui-disabled': {
                                                    backgroundColor: '#e0e0e0',
                                                    color: '#a0a0a0'
                                                }
                                            }}
                                            onClick={handleSave}
                                        >
                                            {saving ? 'Guardando' : 'Guardar'}
                                        </Button>
                                    </span>
                                </Tooltip>
                                <Button
                                    startIcon={<CancelIcon />}
                                    variant="outlined"
                                    sx={{
                                        borderColor: '#9e9e9e',
                                        color: '#757575',
                                        '&:hover': {
                                            borderColor: '#757575',
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        }
                                    }}
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancelar
                                </Button>
                            </Box>
                        )}
                    </Box>

                    {isEditing && avatarType === 'url' && (
                        <Box sx={{ mb: 3, maxWidth: '400px', mx: 'auto' }}>
                            <TextField
                                fullWidth
                                label="URL de imagen de perfil"
                                value={formData.avatar || ''}
                                name="avatar"
                                onChange={handleAvatarUrlChange}
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LinkIcon sx={{ color: vistelicaColors.primary }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: `${vistelicaColors.divider}`,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: `${vistelicaColors.primary}`,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: `${vistelicaColors.primary}`,
                                        },
                                    }
                                }}
                            />
                        </Box>
                    )}

                    <Divider sx={{
                        my: 3,
                        borderColor: `${vistelicaColors.divider}`,
                        opacity: 0.6
                    }} />

                    <Grid container spacing={4} component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Nombre */}
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PersonIcon sx={{ color: vistelicaColors.primary, mr: 1 }} />
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="500"
                                    sx={{ color: vistelicaColors.primary }}
                                >
                                    Nombres
                                </Typography>
                            </Box>
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: `${vistelicaColors.divider}`,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: `${vistelicaColors.primary}`,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: `${vistelicaColors.primary}`,
                                            },
                                        }
                                    }}
                                />
                            ) : (
                                <Typography variant="body1" sx={{ mt: 1.5, fontSize: '1.05rem' }}>
                                    {userData?.name || 'No especificado'}
                                </Typography>
                            )}
                        </Grid>

                        {/* Apellido */}
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PersonIcon sx={{ color: vistelicaColors.primary, mr: 1 }} />
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="500"
                                    sx={{ color: vistelicaColors.primary }}
                                >
                                    Apellidos
                                </Typography>
                            </Box>
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    name="lastName"
                                    value={formData.lastName || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: `${vistelicaColors.divider}`,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: `${vistelicaColors.primary}`,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: `${vistelicaColors.primary}`,
                                            },
                                        }
                                    }}
                                />
                            ) : (
                                <Typography variant="body1" sx={{ mt: 1.5, fontSize: '1.05rem' }}>
                                    {userData?.lastName || 'No especificado'}
                                </Typography>
                            )}
                        </Grid>

                        {/* Email */}
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <EmailIcon sx={{ color: vistelicaColors.primary, mr: 1 }} />
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="500"
                                    sx={{ color: vistelicaColors.primary }}
                                >
                                    Correo electrónico
                                </Typography>
                            </Box>
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: `${vistelicaColors.divider}`,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: `${vistelicaColors.primary}`,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: `${vistelicaColors.primary}`,
                                            },
                                        }
                                    }}
                                />
                            ) : (
                                <Typography variant="body1" sx={{ mt: 1.5, fontSize: '1.05rem' }}>
                                    {userData?.email || 'No especificado'}
                                </Typography>
                            )}
                        </Grid>

                        {/* Teléfono */}
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PhoneIcon sx={{ color: vistelicaColors.primary, mr: 1 }} />
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="500"
                                    sx={{ color: vistelicaColors.primary }}
                                >
                                    Teléfono
                                </Typography>
                            </Box>
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: `${vistelicaColors.divider}`,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: `${vistelicaColors.primary}`,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: `${vistelicaColors.primary}`,
                                            },
                                        }
                                    }}
                                />
                            ) : (
                                <Typography variant="body1" sx={{ mt: 1.5, fontSize: '1.05rem' }}>
                                    {userData?.phone || 'No especificado'}
                                </Typography>
                            )}
                        </Grid>

                        {/* Fecha de nacimiento */}
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CalendarMonthIcon sx={{ color: vistelicaColors.primary, mr: 1 }} />
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="500"
                                    sx={{ color: vistelicaColors.primary }}
                                >
                                    Fecha de nacimiento
                                </Typography>
                            </Box>
                            {isEditing ? (
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                    <DatePicker
                                        label="Fecha de nacimiento"
                                        value={formData.born_date ? new Date(formData.born_date) : null}
                                        onChange={handleDateChange}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                variant: "outlined",
                                                size: "small",
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        '&:hover fieldset': {borderColor: vistelicaColors.primary},
                                                        '&.Mui-focused fieldset': {borderColor: vistelicaColors.primary}
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: vistelicaColors.primary
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            ) : (
                                <Typography variant="body1" sx={{ mt: 1.5, fontSize: '1.05rem' }}>
                                    {userData?.born_date ? new Date(userData.born_date).toLocaleDateString('es-ES') : 'No especificado'}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>

                    {/* Toast de notificación */}
                    <Snackbar
                        open={toast.open}
                        autoHideDuration={6000}
                        onClose={handleToastClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert
                            onClose={handleToastClose}
                            severity={toast.severity}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {toast.message}
                        </Alert>
                    </Snackbar>
                </Paper>
            </Box>
        </Zoom>
    );
};

export default AccountInfo;