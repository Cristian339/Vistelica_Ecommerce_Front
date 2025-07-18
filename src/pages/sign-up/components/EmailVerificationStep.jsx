import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import { useColorScheme } from '@mui/material/styles';
import { vistelicaColors } from '../../../components/shared/vistelicaColors';
import EmailVerificationModal from './EmailVerificationModal';

export default function EmailVerificationStep({
                                                  email = '',
                                                  registrationToken = '',
                                                  onVerificationSuccess,
                                                  onResendCode,
                                                  onCancel,
                                                  onBack,
                                                  isSubmitting = false
                                              }) {
    const { mode } = useColorScheme();
    const [showModal, setShowModal] = React.useState(false);
    const [verificationComplete, setVerificationComplete] = React.useState(false);

    // Abrir el modal automáticamente cuando se monta el componente
    React.useEffect(() => {
        if (!verificationComplete) {
            setShowModal(true);
        }
    }, [verificationComplete]);

    const handleVerificationSuccess = async (verificationCode) => {
        try {
            if (onVerificationSuccess) {
                await onVerificationSuccess(verificationCode);
                setVerificationComplete(true);
                setShowModal(false);
            }
        } catch (error) {
            // Re-lanzar el error para que lo maneje el modal
            throw error;
        }
    };

    const handleResendCode = async () => {
        if (onResendCode) {
            return await onResendCode();
        }
    };

    const handleModalClose = () => {
        if (!isSubmitting && !verificationComplete) {
            setShowModal(false);
            // Opcional: volver al paso anterior cuando se cierra el modal
            if (onBack) {
                onBack();
            }
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCancelRegistration = () => {
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <>
            <Box sx={{ textAlign: 'center', py: 3 }}>
                {verificationComplete ? (
                    // Estado de verificación completada
                    <>
                        <CheckCircleIcon
                            sx={{
                                fontSize: 64,
                                color: vistelicaColors.primary,
                                mb: 2
                            }}
                        />
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 2,
                                color: vistelicaColors.primary,
                                fontWeight: 600
                            }}
                        >
                            ¡Verificación exitosa!
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 3,
                                color: mode === 'dark' ?
                                    vistelicaColors.tertiary :
                                    vistelicaColors.secondary
                            }}
                        >
                            Tu correo electrónico ha sido verificado correctamente.
                            Completando el registro...
                        </Typography>
                        <Alert
                            severity="success"
                            sx={{
                                mt: 2,
                                '& .MuiAlert-icon': {
                                    color: vistelicaColors.primary
                                }
                            }}
                        >
                            Registro completado exitosamente. Redirigiendo al inicio de sesión...
                        </Alert>
                    </>
                ) : (
                    // Estado inicial - esperando verificación
                    <>
                        <EmailIcon
                            sx={{
                                fontSize: 64,
                                color: vistelicaColors.primary,
                                mb: 2
                            }}
                        />
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 2,
                                color: vistelicaColors.primary,
                                fontWeight: 600
                            }}
                        >
                            Verificación de correo
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 2,
                                color: mode === 'dark' ?
                                    vistelicaColors.tertiary :
                                    vistelicaColors.secondary
                            }}
                        >
                            Hemos enviado un código de verificación a:
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 3,
                                fontWeight: 600,
                                color: vistelicaColors.primary,
                                wordBreak: 'break-word'
                            }}
                        >
                            {email}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 4,
                                color: mode === 'dark' ?
                                    vistelicaColors.tertiary :
                                    vistelicaColors.secondary
                            }}
                        >
                            Haz clic en el botón de abajo para ingresar tu código de verificación.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleOpenModal}
                                disabled={isSubmitting}
                                sx={{
                                    py: 1.5,
                                    backgroundColor: vistelicaColors.primary,
                                    '&:hover': {
                                        backgroundColor: vistelicaColors.primaryDark,
                                    },
                                    '&:disabled': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                    }
                                }}
                            >
                                Ingresar código de verificación
                            </Button>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={onBack}
                                    disabled={isSubmitting}
                                    sx={{
                                        borderColor: vistelicaColors.primary,
                                        color: vistelicaColors.primary,
                                        '&:hover': {
                                            borderColor: vistelicaColors.primaryDark,
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        }
                                    }}
                                >
                                    Volver
                                </Button>

                                <Button
                                    variant="text"
                                    fullWidth
                                    onClick={handleCancelRegistration}
                                    disabled={isSubmitting}
                                    sx={{
                                        color: 'rgba(0, 0, 0, 0.6)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        }
                                    }}
                                >
                                    Cancelar registro
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>

            {/* Modal de verificación */}
            <EmailVerificationModal
                open={showModal}
                onClose={handleModalClose}
                email={email}
                registrationToken={registrationToken}
                onVerificationSuccess={handleVerificationSuccess}
                onResendCode={handleResendCode}
                isSubmitting={isSubmitting}
            />
        </>
    );
}