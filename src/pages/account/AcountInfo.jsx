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
    Alert,
    Stepper,
    Step,
    StepLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
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
import { verifyPassword, changePassword, requestEmailChange, confirmEmailChange } from '@/services/authService';

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
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStep, setPasswordStep] = useState(0);
    const [passwordError, setPasswordError] = useState('');

    const [emailChangeOpen, setEmailChangeOpen] = useState(false);
    const [emailChangeStep, setEmailChangeStep] = useState(0);
    const [verificationCode, setVerificationCode] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [emailChangeError, setEmailChangeError] = useState('');

    useEffect(() => {
        if (userData) {
            console.log('Datos del usuario originales:', userData);
        }
    }, [userData]);

    const extractUserData = (data) => {
        if (!data) return {};
        const userObj = data.user || data || {};
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

    const handleEmailChangeOpen = () => {
        setEmailChangeOpen(true);
        setEmailChangeStep(0);
        setCurrentPassword('');
        setVerificationCode('');
        setNewEmail('');
        setEmailChangeError('');
    };

    const handleEmailChangeClose = () => {
        setEmailChangeOpen(false);
    };

    const handleSendVerificationCode = async () => {
        try {
            if(await requestEmailChange(currentPassword)){
                setEmailChangeStep(1);
                setEmailChangeError('');
                setToast({
                    open: true,
                    message: 'Código enviado a tu email actual',
                    severity: 'success'
                });
            }else{
                setEmailChangeError('Contraseña incorrecta');
            }

        } catch (error) {
            setEmailChangeError(error.message);
        }
    };

    const handleConfirmEmailChange = async () => {
        try {
            await confirmEmailChange(verificationCode, newEmail);
            setEmailChangeOpen(false);
            setToast({
                open: true,
                message: 'Email actualizado correctamente',
                severity: 'success'
            });

            // Actualizar los datos del usuario
            const updatedData = await getUserProfile();
            if (setUserData) {
                setUserData(updatedData);
            }
        } catch (error) {
            setEmailChangeError(error.message);
        }
    };

    const handleEditClick = () => {
        const extractedData = extractUserData(userData);
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

    const hasChanges = useMemo(() => {
        if (!isEditing) return false;

        const fieldsToCheck = ['name', 'lastName', 'email', 'phone', 'avatar', 'address'];
        for (const field of fieldsToCheck) {
            if (formData[field] !== originalData[field]) {
                return true;
            }
        }

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
            await updateUserProfile(formData);
            const updatedData = await getUserProfile();

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
        setPasswordStep(0);
        setAvatarPreview(null);
    };

    const handlePasswordCancel = () => {
        setPasswordStep(0);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
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
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative', transition: 'all 0.3s ease' }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 4 },
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        background: 'linear-gradient(to bottom right, #fdfbf6, #fff)',
                        border: `1px solid ${vistelicaColors.divider}`,
                        overflow: 'hidden',
                        width: isEditing ? { xs: '100%', md: 'calc(100% + 150px)' } : '100%',
                        marginLeft: 10,
                        marginRight: isEditing ? { xs: 0, md: '-150px' } : 30,
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
                                <>
                                    <Typography variant="body1" sx={{ mt: 1.5, fontSize: '1.05rem' }}>
                                        {userData?.email || 'No especificado'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                borderColor: vistelicaColors.primary,
                                                color: vistelicaColors.primary,
                                                '&:hover': {
                                                    borderColor: vistelicaColors.primary,
                                                    backgroundColor: 'rgba(228, 176, 2, 0.04)',
                                                }
                                            }}
                                            onClick={handleEmailChangeOpen}
                                        >
                                            Cambiar email
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                borderColor: vistelicaColors.primary,
                                                color: vistelicaColors.primary,
                                                '&:hover': {
                                                    borderColor: vistelicaColors.primary,
                                                    backgroundColor: 'rgba(228, 176, 2, 0.04)',
                                                }
                                            }}
                                            onClick={() => setPasswordStep(1)}
                                        >
                                            Cambiar contraseña
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <Typography variant="body1" sx={{ mt: 1.5, fontSize: '1.05rem' }}>
                                    {userData?.email || 'No especificado'}
                                </Typography>
                            )}
                        </Grid>

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

                {isEditing && passwordStep > 0 && (
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999
                        }}
                    >
                        <Paper
                            sx={{
                                p: 4,
                                width: '100%',
                                maxWidth: '500px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                            }}
                        >
                            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: vistelicaColors.primary }}>
                                {passwordStep === 1 ? 'Verifica tu contraseña actual' : 'Ingresa tu nueva contraseña'}
                            </Typography>

                            {passwordStep === 1 ? (
                                <>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Contraseña actual"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        sx={{ mb: 3 }}
                                    />
                                    {passwordError && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            {passwordError}
                                        </Alert>
                                    )}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={handlePasswordCancel}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: vistelicaColors.primary }}
                                            onClick={async () => {
                                                try {
                                                    if(await verifyPassword(currentPassword)){
                                                        setPasswordStep(2);
                                                        setPasswordError('');
                                                    }else{
                                                        setPasswordError('Contraseña incorrecta');
                                                    }

                                                } catch (error) {
                                                    setPasswordError(error.message);
                                                }
                                            }}
                                        >
                                            Continuar
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Nueva contraseña"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Confirmar nueva contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        sx={{ mb: 3 }}
                                        error={newPassword !== confirmPassword && confirmPassword !== ''}
                                        helperText={
                                            newPassword !== confirmPassword && confirmPassword !== ''
                                                ? 'Las contraseñas no coinciden'
                                                : ''
                                        }
                                    />
                                    {passwordError && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            {passwordError}
                                        </Alert>
                                    )}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setPasswordStep(1);
                                                setPasswordError('');
                                            }}
                                        >
                                            Atrás
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: vistelicaColors.primary }}
                                            disabled={newPassword !== confirmPassword || newPassword === ''}
                                            onClick={async () => {
                                                try {
                                                    await changePassword(currentPassword, newPassword);
                                                    setToast({
                                                        open: true,
                                                        message: 'Contraseña cambiada exitosamente',
                                                        severity: 'success'
                                                    });
                                                    setPasswordStep(0);
                                                    setCurrentPassword('');
                                                    setNewPassword('');
                                                    setConfirmPassword('');
                                                } catch (error) {
                                                    setPasswordError(error.message);
                                                }
                                            }}
                                        >
                                            Cambiar contraseña
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </Paper>
                    </Box>
                )}

                <Dialog open={emailChangeOpen} onClose={handleEmailChangeClose} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ color: vistelicaColors.primary }}>
                        Cambiar dirección de email
                    </DialogTitle>
                    <DialogContent>
                        <Stepper activeStep={emailChangeStep} alternativeLabel sx={{ my: 3 }}>
                            <Step><StepLabel>Verificar contraseña</StepLabel></Step>
                            <Step><StepLabel>Ingresar código</StepLabel></Step>
                            <Step><StepLabel>Nuevo email</StepLabel></Step>
                        </Stepper>

                        {emailChangeError && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {emailChangeError}
                            </Alert>
                        )}

                        {emailChangeStep === 0 && (
                            <>
                                <Typography variant="body1" gutterBottom>
                                    Para cambiar tu email, primero verifica tu identidad ingresando tu contraseña actual.
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Contraseña actual"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                            </>
                        )}

                        {emailChangeStep === 1 && (
                            <>
                                <Typography variant="body1" gutterBottom>
                                    Hemos enviado un código de verificación a tu email actual. Por favor ingrésalo a continuación.
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Código de verificación"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                            </>
                        )}

                        {emailChangeStep === 2 && (
                            <>
                                <Typography variant="body1" gutterBottom>
                                    Ingresa tu nueva dirección de email.
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Nuevo email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEmailChangeClose}>Cancelar</Button>
                        {emailChangeStep > 0 && (
                            <Button onClick={() => setEmailChangeStep(emailChangeStep - 1)}>
                                Atrás
                            </Button>
                        )}
                        <Button
                            onClick={() => {
                                if (emailChangeStep === 0) {
                                    handleSendVerificationCode();
                                } else if (emailChangeStep === 1) {
                                    setEmailChangeStep(2);
                                } else {
                                    handleConfirmEmailChange();
                                }
                            }}
                            disabled={
                                (emailChangeStep === 0 && !currentPassword) ||
                                (emailChangeStep === 1 && !verificationCode) ||
                                (emailChangeStep === 2 && !newEmail)
                            }
                            sx={{ backgroundColor: vistelicaColors.primary, color: 'white' }}
                        >
                            {emailChangeStep === 2 ? 'Confirmar cambio' : 'Continuar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Zoom>
    );
};

export default AccountInfo;