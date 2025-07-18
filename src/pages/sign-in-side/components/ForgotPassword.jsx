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
import { vistelicaColors } from '../../../components/shared/vistelicaColors';
import { styled } from '@mui/material/styles';

// Botón personalizado
const StyledButton = styled(Button)(() => ({
    backgroundColor: vistelicaColors.primary,
    color: vistelicaColors.tertiary,
    fontWeight: 600,
    '&:hover': {
        backgroundColor: vistelicaColors.primaryDark,
    },
    '&:disabled': {
        backgroundColor: 'rgba(228, 176, 2, 0.5)',
    },
}));

// Estilo común para todos los TextField
const textFieldStyle = {
    '& .MuiInputLabel-root': {
        marginTop: '-6px',
        '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
            padding: '0 4px',
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
}));

export default function ForgotPassword({ open, handleClose }) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [email, setEmail] = React.useState('');
    const [code, setCode] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [token, setToken] = React.useState('');
    const [isCodeVerified, setIsCodeVerified] = React.useState(false);

    // Detección de tamaño de pantalla para responsive
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const steps = ['Ingresa tu correo', 'Verifica el código', 'Crea una nueva contraseña'];

    const handleReset = () => {
        setActiveStep(0);
        setEmail('');
        setCode('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
        setToken('');
        setIsCodeVerified(false);
    };

    const handleCloseDialog = () => {
        handleReset();
        handleClose();
    };

    const handleSendCode = async () => {
        if (!email) {
            setError('Por favor ingresa tu correo electrónico');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await requestPasswordReset(email);
            setToken(response.token);
            setSuccess('Código de verificación enviado a tu correo');
            setActiveStep(1);
        } catch (error) {
            setError(error.message || 'No se pudo enviar el código de verificación');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!code) {
            setError('Por favor ingresa el código de verificación');
            return;
        }

        if (!token) {
            setError('No se ha generado un token válido. Vuelve al paso anterior.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validamos el código contra el backend
            await verifyResetCode(token, code);
            setSuccess('Código verificado correctamente');
            setIsCodeVerified(true);
            setTimeout(() => {
                setActiveStep(2);
            }, 1000);
        } catch (error) {
            // Si hay error, el código es incorrecto
            console.error("Error de verificación:", error);
            setIsCodeVerified(false);
            setError(error.message || 'Código de verificación inválido. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!isCodeVerified) {
            setError('Debes verificar el código antes de cambiar la contraseña');
            setActiveStep(1);
            return;
        }

        if (!newPassword || newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres');
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
            await completePasswordReset(token, code, newPassword);
            setSuccess('Contraseña actualizada correctamente');
            setTimeout(() => {
                handleCloseDialog();
            }, 2000);
        } catch (error) {
            setError(error.message || 'No se pudo actualizar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    // Función para renderizar icono personalizado
    const StepIconComponent = (props) => {
        const { active, completed, icon } = props;
        return (
            <CustomStepIcon ownerState={{ active, completed, isMobile }}>
                {icon}
            </CustomStepIcon>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    width: isMobile ? '95%' : '80%',
                    maxWidth: '500px',
                    m: isMobile ? '10px' : '0 auto',
                    borderRadius: '8px',
                }
            }}
        >
            <DialogTitle
                sx={{
                    color: vistelicaColors.primary,
                    fontWeight: 600,
                    py: isMobile ? 2 : 3,
                    px: isMobile ? 2 : 3,
                    fontSize: isMobile ? '1.2rem' : '1.5rem',
                    textAlign: isMobile ? 'center' : 'left'
                }}
            >
                Recuperar contraseña
            </DialogTitle>
            <DialogContent sx={{ px: isMobile ? 2 : 3, py: 2 }}>
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel={true}
                    orientation="horizontal"
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
                                        color: activeStep === index ? vistelicaColors.primary : 'text.secondary'
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
                            fontSize: isMobile ? '0.8rem' : '0.875rem'
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
                            fontSize: isMobile ? '0.8rem' : '0.875rem'
                        },
                        py: isMobile ? 0.5 : 1
                    }}
                >
                    {success}
                </Alert>}

                {activeStep === 0 && (
                    <>
                        <DialogContentText sx={{ fontSize: isMobile ? '0.9rem' : '1rem', mb: 2 }}>
                            Ingresa tu correo electrónico y te enviaremos un código de verificación para restablecer tu contraseña.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Correo electrónico"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mt: isMobile ? 1 : 2, ...textFieldStyle }}
                            inputProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' }
                            }}
                            InputLabelProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' }
                            }}
                        />
                    </>
                )}

                {activeStep === 1 && (
                    <>
                        <DialogContentText sx={{ fontSize: isMobile ? '0.9rem' : '1rem', mb: 2 }}>
                            Hemos enviado un código de verificación a tu correo. Por favor ingrésalo a continuación.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Código de verificación"
                            fullWidth
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            sx={{ mt: isMobile ? 1 : 2, ...textFieldStyle }}
                            inputProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' }
                            }}
                            InputLabelProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' }
                            }}
                        />
                    </>
                )}

                {activeStep === 2 && (
                    <>
                        <DialogContentText sx={{ fontSize: isMobile ? '0.9rem' : '1rem', mb: 2 }}>
                            Crea una nueva contraseña segura.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
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
                        <TextField
                            margin="dense"
                            label="Confirmar contraseña"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ ...textFieldStyle }}
                            inputProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' }
                            }}
                            InputLabelProps={{
                                style: { fontSize: isMobile ? '0.9rem' : '1rem' }
                            }}
                        />
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
                        mb: isMobile ? 1 : 0
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
                        disabled={loading}
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
                        />
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
}