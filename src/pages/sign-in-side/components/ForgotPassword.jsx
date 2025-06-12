import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { requestPasswordReset, verifyResetCode, completePasswordReset } from '../../../services/authService';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InputAdornment from '@mui/material/InputAdornment';

// Botón personalizado
const StyledButton = styled(Button)(() => ({
    backgroundColor: vistelicaColors.primary,
    color: vistelicaColors.tertiary,
    fontWeight: 600,
    fontFamily: typography.fontFamily,
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    '&:hover': {
        backgroundColor: vistelicaColors.primaryDark,
        transform: 'translateY(-1px)'
    },
    '&:active': {
        transform: 'translateY(1px)'
    },
    '&:focus-visible': {
        outline: `3px solid ${vistelicaColors.primary}40`,
        outlineOffset: '2px'
    },
    '&:disabled': {
        backgroundColor: 'rgba(228, 176, 2, 0.5)',
    },
}));

// Estilo común para todos los TextField
const textFieldStyle = {
    '& .MuiInputLabel-root': {
        fontFamily: typography.fontFamily,
        marginTop: '-6px',
        '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
            padding: '0 4px',
        }
    },
    '& .MuiOutlinedInput-root': {
        fontFamily: typography.fontFamily,
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: vistelicaColors.primary,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: vistelicaColors.primary,
        }
    }
};

// Componente personalizado para el icono de paso
const CustomStepIcon = styled('div')(({ theme, ownerState }) => ({
    width: ownerState.isMobile ? '24px' : '30px',
    height: ownerState.isMobile ? '24px' : '30px',
    borderRadius: '50%',
    border: `2px solid ${ownerState.active ? vistelicaColors.primary : '#ccc'}`,
    backgroundColor: ownerState.completed ? vistelicaColors.primary : 'transparent',
    color: ownerState.completed ? vistelicaColors.tertiary : (ownerState.active ? vistelicaColors.primary : '#ccc'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: ownerState.isMobile ? '0.75rem' : '0.875rem',
    fontFamily: typography.fontFamily,
}));

// Componente optimizado con React.memo
const ForgotPassword = React.memo(({ open, handleClose }) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [email, setEmail] = React.useState('');
    const [code, setCode] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [passwordsMatch, setPasswordsMatch] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [token, setToken] = React.useState('');
    const [isCodeVerified, setIsCodeVerified] = React.useState(false);

    // Detección de tamaño de pantalla para responsive
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const steps = ['Ingresa tu correo', 'Verifica el código', 'Crea una nueva contraseña'];

    // Verificar si las contraseñas coinciden cada vez que cambian
    React.useEffect(() => {
        if (newPassword && confirmPassword) {
            setPasswordsMatch(newPassword === confirmPassword);
        } else {
            setPasswordsMatch(false);
        }
    }, [newPassword, confirmPassword]);

    const handleReset = React.useCallback(() => {
        setActiveStep(0);
        setEmail('');
        setCode('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
        setToken('');
        setIsCodeVerified(false);
    }, []);

    const handleCloseDialog = React.useCallback(() => {
        handleReset();
        handleClose();
    }, [handleReset, handleClose]);

    const handleSendCode = React.useCallback(async () => {
        if (!email) {
            setError('Por favor ingresa tu correo electrónico');
            return;
        }

        // Eliminar espacios en blanco
        const trimmedEmail = email.trim();

        // Validar formato de correo
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(trimmedEmail)) {
            setError('Por favor ingresa un correo electrónico válido');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await requestPasswordReset(trimmedEmail);
            setToken(response.token);
            setSuccess('Código de verificación enviado a tu correo');
            setActiveStep(1);
        } catch (error) {
            console.error("Error al solicitar restablecimiento:", error);
            setError(error.response?.data?.message || error.message || 'No se pudo enviar el código de verificación');
        } finally {
            setLoading(false);
        }
    }, [email]);

    const handleVerifyCode = React.useCallback(async () => {
        if (!code) {
            setError('Por favor ingresa el código de verificación');
            return;
        }

        if (!token) {
            setError('No se ha generado un token válido. Vuelve al paso anterior.');
            return;
        }

        // Eliminar espacios y asegurar formato correcto
        const trimmedCode = code.trim();

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validamos el código contra el backend
            await verifyResetCode(token, trimmedCode);
            setSuccess('Código verificado correctamente');
            setIsCodeVerified(true);
            setTimeout(() => {
                setActiveStep(2);
            }, 1000);
        } catch (error) {
            console.error("Error de verificación:", error);
            setIsCodeVerified(false);
            setError(error.response?.data?.message || error.message || 'Código de verificación inválido');
        } finally {
            setLoading(false);
        }
    }, [code, token]);

    const handleChangePassword = React.useCallback(async () => {
        if (!isCodeVerified) {
            setError('Debes verificar el código antes de cambiar la contraseña');
            setActiveStep(1);
            return;
        }

        if (!newPassword || newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        // Validar que la contraseña tenga letras y números
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!passwordPattern.test(newPassword)) {
            setError('La contraseña debe contener una letra y número y no debe ser igual a la anterior');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Usar el nuevo endpoint para completar el cambio de contraseña
            await completePasswordReset(token, code.trim(), newPassword);
            setSuccess('Contraseña actualizada correctamente');
            setTimeout(() => {
                handleCloseDialog();
            }, 2000);
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            setError(error.response?.data?.message || error.message || 'No se pudo actualizar la contraseña');
        } finally {
            setLoading(false);
        }
    }, [isCodeVerified, newPassword, confirmPassword, token, code, handleCloseDialog]);

    // Función para renderizar icono personalizado
    const StepIconComponent = React.useCallback((props) => {
        const { active, completed, icon } = props;
        return (
            <CustomStepIcon ownerState={{ active, completed, isMobile }}>
                {icon}
            </CustomStepIcon>
        );
    }, [isMobile]);

    return (
        <Dialog
            open={open}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
            aria-labelledby="password-recovery-title"
            PaperProps={{
                sx: {
                    width: isMobile ? '95%' : '80%',
                    maxWidth: '500px',
                    m: isMobile ? '10px' : '0 auto',
                    borderRadius: '8px',
                    overflowY: 'visible'
                }
            }}
        >
            <DialogTitle
                id="password-recovery-title"
                sx={{
                    color: vistelicaColors.primary,
                    fontWeight: 600,
                    py: isMobile ? 2 : 3,
                    px: isMobile ? 2 : 3,
                    fontSize: isMobile ? '1.2rem' : '1.5rem',
                    textAlign: isMobile ? 'center' : 'left',
                    fontFamily: typography.fontFamily
                }}
            >
                Recuperar contraseña
            </DialogTitle>
            <DialogContent sx={{ px: isMobile ? 2 : 3, py: 2, overflowY: 'visible' }}>
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel={true}
                    orientation="horizontal"
                    aria-label="Pasos para recuperar contraseña"
                    sx={{
                        mb: 3,
                        py: 2,
                        px: 0,
                        '& .MuiStepConnector-line': {
                            borderColor: activeStep >= 1 ? vistelicaColors.primary : '#ccc',
                        },
                        '& .MuiStepConnector-root': {
                            top: isMobile ? '12px' : '15px',
                        },
                    }}
                >
                    {steps.map((label, index) => (
                        <Step key={label} completed={activeStep > index}>
                            <StepLabel StepIconComponent={StepIconComponent}>
                                <Typography
                                    variant={isMobile ? "caption" : "body2"}
                                    sx={{
                                        fontWeight: activeStep === index ? 600 : 400,
                                        fontSize: isMobile ? '0.7rem' : '0.8rem',
                                        mt: 0.5,
                                        color: activeStep === index ? vistelicaColors.primary : 'text.secondary',
                                        fontFamily: typography.fontFamily
                                    }}
                                >
                                    {label}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        backgroundColor: 'rgba(211, 47, 47, 0.15)',
                        '& .MuiAlert-icon': {
                            color: '#d32f2f'
                        },
                        '& .MuiAlert-message': {
                            color: '#d32f2f',
                            fontWeight: 500,
                            fontSize: isMobile ? '0.8rem' : '0.875rem',
                            fontFamily: typography.fontFamily
                        },
                        py: isMobile ? 0.5 : 1
                    }}
                >
                    {error}
                </Alert>}

                {success && <Alert
                    severity="success"
                    sx={{
                        mb: 2,
                        '& .MuiAlert-message': {
                            fontSize: isMobile ? '0.8rem' : '0.875rem',
                            fontFamily: typography.fontFamily
                        },
                        py: isMobile ? 0.5 : 1
                    }}
                >
                    {success}
                </Alert>}

                {activeStep === 0 && (
                    <>
                        <DialogContentText sx={{
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            mb: 2,
                            fontFamily: typography.fontFamily
                        }}>
                            Ingresa tu correo electrónico y te enviaremos un código de verificación para restablecer tu contraseña.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email-input"
                            name="email"
                            label="Correo electrónico"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mt: isMobile ? 1 : 2, ...textFieldStyle }}
                            inputProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' },
                                'aria-describedby': 'email-helper-text'
                            }}
                            InputLabelProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' }
                            }}
                        />
                        <Typography id="email-helper-text" variant="caption" sx={{
                            fontFamily: typography.fontFamily,
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            mt: 0.5
                        }}>
                            Introduce el correo asociado a tu cuenta
                        </Typography>
                    </>
                )}

                {activeStep === 1 && (
                    <>
                        <DialogContentText sx={{
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            mb: 2,
                            fontFamily: typography.fontFamily
                        }}>
                            Hemos enviado un código de verificación a tu correo. Por favor ingrésalo a continuación.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="code-input"
                            name="code"
                            label="Código de verificación"
                            fullWidth
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            sx={{ mt: isMobile ? 1 : 2, ...textFieldStyle }}
                            inputProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' },
                                'aria-describedby': 'code-helper-text'
                            }}
                            InputLabelProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' }
                            }}
                        />
                        <Typography id="code-helper-text" variant="caption" sx={{
                            fontFamily: typography.fontFamily,
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            mt: 0.5
                        }}>
                            El código tiene 6 dígitos y es válido por 30 minutos
                        </Typography>
                    </>
                )}

                {activeStep === 2 && (
                    <>
                        <DialogContentText sx={{
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            mb: 2,
                            fontFamily: typography.fontFamily
                        }}>
                            Crea una nueva contraseña segura.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="new-password"
                            name="new-password"
                            label="Nueva contraseña"
                            type="password"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{ ...textFieldStyle, mb: isMobile ? 1 : 2 }}
                            inputProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' }
                            }}
                            InputLabelProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' }
                            }}
                        />
                        <Typography id="password-helper-text" variant="caption" sx={{
                            fontFamily: typography.fontFamily,
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            mt: 0.5,
                            display: 'block',
                            mb: 1
                        }}>
                            Mínimo 6 caracteres con letras y números
                        </Typography>
                        <TextField
                            margin="dense"
                            id="confirm-password"
                            name="confirm-password"
                            label="Confirmar contraseña"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ ...textFieldStyle }}
                            InputProps={{
                                endAdornment: confirmPassword && (
                                    <InputAdornment position="end">
                                        {passwordsMatch ? (
                                            <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
                                        ) : (
                                            <CancelIcon color="error" sx={{ fontSize: 20 }} />
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                            inputProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' }
                            }}
                            InputLabelProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' }
                            }}
                        />

                        {/* Mensaje que indica si las contraseñas coinciden */}
                        {confirmPassword && (
                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily: typography.fontFamily,
                                    fontSize: '0.75rem',
                                    color: passwordsMatch ? 'success.main' : 'error.main',
                                    mt: 0.5,
                                    display: 'block'
                                }}
                            >
                                {passwordsMatch
                                    ? "Las contraseñas coinciden correctamente"
                                    : "Las contraseñas no coinciden"}
                            </Typography>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{
                p: isMobile ? 2 : 3,
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: isMobile ? 'center' : 'flex-end',
                gap: isMobile ? 1 : 2
            }}>
                <Button
                    onClick={handleCloseDialog}
                    sx={{
                        color: vistelicaColors.primary,
                        width: isMobile ? '100%' : 'auto',
                        mb: isMobile ? 1 : 0,
                        fontFamily: typography.fontFamily,
                        '&:focus-visible': {
                            outline: `2px solid ${vistelicaColors.primary}40`,
                            outlineOffset: '2px'
                        }
                    }}
                >
                    Cancelar
                </Button>
                <Box sx={{
                    position: 'relative',
                    width: isMobile ? '100%' : 'auto'
                }}>
                    <StyledButton
                        onClick={
                            activeStep === 0 ? handleSendCode :
                                activeStep === 1 ? handleVerifyCode :
                                    handleChangePassword
                        }
                        disabled={loading || (activeStep === 2 && (!passwordsMatch || !newPassword || !confirmPassword))}
                        fullWidth={isMobile}
                        sx={{
                            py: isMobile ? 1.5 : 1,
                            fontSize: isMobile ? '0.9rem' : '0.875rem'
                        }}
                    >
                        {
                            activeStep === 0 ? "Enviar código" :
                                activeStep === 1 ? "Verificar código" :
                                    "Cambiar contraseña"
                        }
                    </StyledButton>
                    {loading && (
                        <CircularProgress
                            size={isMobile ? 20 : 24}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: isMobile ? '-10px' : '-12px',
                                marginLeft: isMobile ? '-10px' : '-12px',
                                color: vistelicaColors.primary
                            }}
                            aria-label="Cargando"
                        />
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
});

ForgotPassword.displayName = 'ForgotPassword';

export default ForgotPassword;