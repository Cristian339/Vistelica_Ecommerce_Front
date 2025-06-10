import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import { useColorScheme } from '@mui/material/styles';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import CloseIcon from '@mui/icons-material/Close';

const StyledDialog = styled(Dialog)(({ theme }) => {
    const { mode } = useColorScheme();

    return {
        '& .MuiDialog-paper': {
            borderRadius: '16px',
            padding: '8px',
            maxWidth: '500px',
            width: '90%',
            backgroundColor: mode === 'dark'
                ? vistelicaColors.cardBackground.dark
                : vistelicaColors.cardBackground.light,
            boxShadow: mode === 'dark'
                ? vistelicaColors.cardShadow.dark
                : vistelicaColors.cardShadow.light,
            position: 'relative',
            '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '5px',
                background: `linear-gradient(90deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary})`,
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
            },
        },
        '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }
    };
});

const StyledDialogTitle = styled(DialogTitle)(() => {
    const { mode } = useColorScheme();

    return {
        textAlign: 'center',
        paddingTop: '24px',
        paddingBottom: '8px',
        color: vistelicaColors.primary,
        fontSize: 'clamp(1.5rem, 5vw, 1.75rem)',
        fontWeight: 400,
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
        position: 'relative',
    };
});

const StyledDialogContent = styled(DialogContent)({
    paddingTop: '8px !important',
    paddingBottom: '24px',
});

const CodeInputContainer = styled(Box)({
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '16px',
});

const CodeInput = styled(TextField)(() => {
    const { mode } = useColorScheme();

    return {
        width: '45px',
        '& .MuiOutlinedInput-root': {
            height: '50px',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            textAlign: 'center',
            '& input': {
                textAlign: 'center',
                padding: '8px 4px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: vistelicaColors.primary,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: vistelicaColors.primary,
                borderWidth: '2px',
            },
        },
    };
});

const CloseButton = styled(IconButton)({
    position: 'absolute',
    right: '8px',
    top: '8px',
    color: vistelicaColors.primary,
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    }
});

export default function EmailVerificationModal({
                                                   open = false,
                                                   onClose,
                                                   email = '',
                                                   registrationToken = '',
                                                   onVerificationSuccess,
                                                   onResendCode,
                                                   isSubmitting = false
                                               }) {
    const { mode } = useColorScheme();

    // Estados para el código de verificación
    const [verificationCode, setVerificationCode] = React.useState(['', '', '', '', '', '']);
    const [codeError, setCodeError] = React.useState(false);
    const [codeErrorMessage, setCodeErrorMessage] = React.useState('');

    // Estados para el proceso de verificación
    const [isVerifying, setIsVerifying] = React.useState(false);
    const [verificationError, setVerificationError] = React.useState('');
    const [verificationSuccess, setVerificationSuccess] = React.useState(false);

    // Estados para reenvío de código
    const [isResending, setIsResending] = React.useState(false);
    const [resendSuccess, setResendSuccess] = React.useState(false);
    const [resendError, setResendError] = React.useState('');
    const [resendCooldown, setResendCooldown] = React.useState(0);

    // Referencias para los inputs
    const inputRefs = React.useRef([]);

    // Limpiar estados cuando se abre/cierra el modal
    React.useEffect(() => {
        if (open) {
            // Limpiar estados al abrir
            setVerificationCode(['', '', '', '', '', '']);
            setCodeError(false);
            setCodeErrorMessage('');
            setVerificationError('');
            setVerificationSuccess(false);
            setResendError('');
            setResendSuccess(false);
            // Enfocar el primer input después de un pequeño delay
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        }
    }, [open]);

    // Efecto para el cooldown del reenvío
    React.useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleCodeChange = (index, value) => {
        // Solo permitir números
        if (!/^\d*$/.test(value)) return;

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // Limpiar errores cuando el usuario empiece a escribir
        if (codeError) {
            setCodeError(false);
            setCodeErrorMessage('');
            setVerificationError('');
        }

        // Mover automáticamente al siguiente input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, event) => {
        // Manejar backspace para mover al input anterior
        if (event.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Manejar Enter para enviar el formulario
        if (event.key === 'Enter') {
            handleVerifyCode();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const paste = event.clipboardData.getData('text');
        const pasteCode = paste.replace(/\D/g, '').slice(0, 6);

        if (pasteCode.length === 6) {
            setVerificationCode(pasteCode.split(''));
            inputRefs.current[5]?.focus();
        }
    };

    const validateCode = () => {
        const code = verificationCode.join('');
        if (code.length !== 6) {
            setCodeError(true);
            setCodeErrorMessage('Por favor ingresa el código completo de 6 dígitos.');
            return false;
        }
        return true;
    };

    const handleVerifyCode = async () => {
        if (!validateCode()) return;

        setIsVerifying(true);
        setVerificationError('');
        setVerificationSuccess(false);

        try {
            const code = verificationCode.join('');

            if (onVerificationSuccess) {
                await onVerificationSuccess(code);
                setVerificationSuccess(true);

                // Cerrar el modal después de un breve delay
                setTimeout(() => {
                    onClose?.();
                }, 1500);
            }

        } catch (error) {
            console.error('Error al verificar código:', error);
            setVerificationError(
                error.response?.data?.message ||
                error.message ||
                'Código de verificación incorrecto. Por favor, intenta nuevamente.'
            );

            // Limpiar el código y enfocar el primer input
            setVerificationCode(['', '', '', '', '', '']);
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0) return;

        setIsResending(true);
        setResendError('');
        setResendSuccess(false);

        try {
            if (onResendCode) {
                await onResendCode();
                setResendSuccess(true);
                setResendCooldown(60); // 60 segundos de cooldown

                // Limpiar el código actual
                setVerificationCode(['', '', '', '', '', '']);
                setTimeout(() => {
                    inputRefs.current[0]?.focus();
                }, 100);
            }

        } catch (error) {
            console.error('Error al reenviar código:', error);
            setResendError(
                error.response?.data?.message ||
                error.message ||
                'Error al reenviar el código. Por favor, intenta nuevamente.'
            );
        } finally {
            setIsResending(false);
        }
    };

    const handleClose = () => {
        if (!isVerifying && !isSubmitting) {
            onClose?.();
        }
    };

    return (
        <StyledDialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            disableEscapeKeyDown={isVerifying || isSubmitting}
        >
            <CloseButton
                onClick={handleClose}
                disabled={isVerifying || isSubmitting}
            >
                <CloseIcon />
            </CloseButton>

            <StyledDialogTitle>
                Verificar correo electrónico
            </StyledDialogTitle>

            <StyledDialogContent>
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: 'center',
                        mb: 2,
                        color: mode === 'dark' ?
                            vistelicaColors.tertiary :
                            vistelicaColors.secondary
                    }}
                >
                    Hemos enviado un código de verificación de 6 dígitos a:
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        textAlign: 'center',
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
                        textAlign: 'center',
                        mb: 2,
                        color: mode === 'dark' ?
                            vistelicaColors.tertiary :
                            vistelicaColors.secondary
                    }}
                >
                    Ingresa el código de verificación:
                </Typography>

                <CodeInputContainer>
                    {verificationCode.map((digit, index) => (
                        <CodeInput
                            key={index}
                            inputRef={(el) => (inputRefs.current[index] = el)}
                            value={digit}
                            onChange={(e) => handleCodeChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            error={codeError}
                            inputProps={{
                                maxLength: 1,
                                style: { textAlign: 'center' }
                            }}
                            autoComplete="off"
                            disabled={isVerifying || isSubmitting}
                        />
                    ))}
                </CodeInputContainer>

                {codeError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {codeErrorMessage}
                    </Alert>
                )}

                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    onClick={handleVerifyCode}
                    disabled={
                        isVerifying ||
                        isSubmitting ||
                        verificationCode.join('').length !== 6 ||
                        verificationSuccess
                    }
                    sx={{
                        mt: 1,
                        mb: 2,
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
                    {isVerifying || isSubmitting ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} color="inherit" />
                            {isSubmitting ? 'Completando registro...' : 'Verificando...'}
                        </Box>
                    ) : (
                        'Verificar código'
                    )}
                </Button>

                {verificationError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {verificationError}
                    </Alert>
                )}

                {verificationSuccess && (
                    <Alert
                        severity="success"
                        sx={{
                            mb: 2,
                            '& .MuiAlert-icon': {
                                color: vistelicaColors.primary
                            }
                        }}
                    >
                        ¡Verificación exitosa! Completando registro...
                    </Alert>
                )}

                {resendSuccess && (
                    <Alert
                        severity="info"
                        sx={{
                            mb: 2,
                            '& .MuiAlert-icon': {
                                color: vistelicaColors.primary
                            }
                        }}
                    >
                        Código reenviado exitosamente. Revisa tu correo electrónico.
                    </Alert>
                )}

                {resendError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {resendError}
                    </Alert>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="body2"
                        sx={{
                            mb: 1,
                            color: mode === 'dark' ?
                                vistelicaColors.tertiary :
                                vistelicaColors.secondary
                        }}
                    >
                        ¿No recibiste el código?
                    </Typography>

                    <Button
                        variant="text"
                        onClick={handleResendCode}
                        disabled={
                            isResending ||
                            isVerifying ||
                            isSubmitting ||
                            resendCooldown > 0
                        }
                        sx={{
                            color: vistelicaColors.primary,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                            '&:disabled': {
                                color: 'rgba(0, 0, 0, 0.26)',
                            }
                        }}
                    >
                        {isResending ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={16} color="inherit" />
                                Reenviando...
                            </Box>
                        ) : resendCooldown > 0 ? (
                            `Reenviar código (${resendCooldown}s)`
                        ) : (
                            'Reenviar código'
                        )}
                    </Button>
                </Box>
            </StyledDialogContent>
        </StyledDialog>
    );
}