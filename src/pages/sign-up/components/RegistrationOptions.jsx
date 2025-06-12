import React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useColorScheme } from '@mui/material/styles';
import { vistelicaColors } from '../../../components/shared/vistelicaColors';
import { GoogleIcon, FacebookIcon } from '../../../components/sign/up/CustomIcons';

// Importar los servicios de autenticación
import {
    registerSocialUser,
    signInWithGoogle,
    signInWithFacebook,
    getCurrentUser
} from '../../../services/authService';

export default function RegistrationOptions({ onSelectEmailRegistration }) {
    const { mode } = useColorScheme();
    const router = useRouter();

    // Estados para el manejo del registro
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [registrationError, setRegistrationError] = React.useState('');
    const [registrationSuccess, setRegistrationSuccess] = React.useState(false);

    console.log("Estado del tema en RegistrationOptions:", mode);

    // Función para registro con Google
    const handleGoogleRegistration = async () => {
        try {
            setIsSubmitting(true);
            setRegistrationError('');
            setRegistrationSuccess(false);

            // 1. Autenticar con Firebase
            const result = await signInWithGoogle();
            console.log('Registro con Google exitoso:', result);

            // 2. Preparar datos del usuario para el backend
            const userData = {
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                uid: result.user.uid,
                provider: 'google',
                isNewUser: result.isNewUser
            };

            // 3. Registrar en el backend usando el servicio
            const backendResponse = await registerSocialUser(userData);
            console.log('Usuario registrado en backend:', backendResponse);

            // 4. Verificar si el usuario está baneado
            const ban = await getCurrentUser();

            if (ban.banned === false) {
                // Si el registro es exitoso
                setRegistrationSuccess(true);

                // Redirigir después de un registro exitoso
                setTimeout(() => {
                    router.push('/home/Home');
                }, 1000);
            } else {
                setRegistrationError(`Este usuario está baneado por el siguiente motivo: \n${ban.ban_reason}`);
            }

        } catch (error) {
            console.error('Error al registrarse con Google:', error);

            if (error.code === 'auth/popup-closed-by-user') {
                setRegistrationError('Has cerrado la ventana de registro.');
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                setRegistrationError('Ya existe una cuenta con este correo electrónico usando un método diferente.');
            } else {
                setRegistrationError('No se pudo completar el registro con Google. Por favor, inténtalo de nuevo.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Función para registro con Facebook
    const handleFacebookRegistration = async () => {
        try {
            setIsSubmitting(true);
            setRegistrationError('');
            setRegistrationSuccess(false);

            // 1. Autenticar con Firebase
            const result = await signInWithFacebook();
            console.log('Registro con Facebook exitoso:', result);

            // 2. Extraer datos relevantes del perfil
            const userData = {
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                uid: result.user.uid,
                provider: 'facebook',
                isNewUser: result.isNewUser,
                profile: result.profile
            };

            // 3. Registrar en el backend
            const backendResponse = await registerSocialUser(userData);
            console.log('Usuario registrado en backend:', backendResponse);

            // 4. Verificar si el usuario está baneado
            const ban = await getCurrentUser();

            if (ban.banned === false) {
                // Si el registro es exitoso
                setRegistrationSuccess(true);

                // Redirigir después de un registro exitoso
                setTimeout(() => {
                    router.push('/home/Home');
                }, 1000);
            } else {
                setRegistrationError(`Este usuario está baneado por el siguiente motivo: \n${ban.ban_reason}`);
            }

        } catch (error) {
            console.error('Error al registrarse con Facebook:', error);

            if (error.code === 'auth/popup-closed-by-user') {
                setRegistrationError('Has cerrado la ventana de registro.');
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                setRegistrationError('Ya existe una cuenta con este correo electrónico usando un método diferente.');
            } else {
                setRegistrationError('No se pudo completar el registro con Facebook. Por favor, inténtalo de nuevo.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
                variant="h4"
                sx={{
                    textAlign: 'center',
                    mb: 1,
                    color: vistelicaColors.primary,
                    fontWeight: 400
                }}
            >
                Elige cómo quieres registrarte
            </Typography>

            <Button
                fullWidth
                variant="contained"
                onClick={onSelectEmailRegistration}
                disabled={isSubmitting}
                sx={{
                    backgroundColor: vistelicaColors.primary,
                    color: vistelicaColors.tertiary,
                    fontWeight: 600,
                    '&:hover': {
                        backgroundColor: vistelicaColors.primaryDark,
                    },
                    '&:disabled': {
                        backgroundColor: 'rgba(228, 176, 2, 0.5)',
                    }
                }}
            >
                Registrarse con correo electrónico
            </Button>

            <Divider sx={{
                '&::before, &::after': {
                    borderColor: `rgba(${parseInt(vistelicaColors.primary.slice(1, 3), 16)},
                        ${parseInt(vistelicaColors.primary.slice(3, 5), 16)},
                        ${parseInt(vistelicaColors.primary.slice(5, 7), 16)}, 0.3)`,
                },
            }}>
                <Typography sx={{ color: mode === 'dark' ? vistelicaColors.quaternary : 'text.secondary' }}>
                    o
                </Typography>
            </Divider>

            <Button
                fullWidth
                variant="outlined"
                onClick={handleGoogleRegistration}
                disabled={isSubmitting}
                startIcon={<GoogleIcon />}
                sx={{
                    borderColor: vistelicaColors.primary,
                    color: mode === 'dark' ? '#FFFFFF' : '#000000',
                    fontWeight: 600,
                    '&:hover': {
                        borderColor: vistelicaColors.primary,
                        backgroundColor: mode === 'dark' ?
                            'rgba(228, 176, 2, 0.15)' : 'rgba(228, 176, 2, 0.08)'
                    },
                    '&:disabled': {
                        borderColor: 'rgba(228, 176, 2, 0.5)',
                        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
                    }
                }}
            >
                {isSubmitting ? "Registrando..." : "Registrarse con Google"}
            </Button>

            <Button
                fullWidth
                variant="outlined"
                onClick={handleFacebookRegistration}
                disabled={isSubmitting}
                startIcon={<FacebookIcon />}
                sx={{
                    borderColor: vistelicaColors.primary,
                    color: mode === 'dark' ?
                        vistelicaColors.tertiary :
                        vistelicaColors.secondary,
                    fontWeight: 600,
                    '&:hover': {
                        borderColor: vistelicaColors.primary,
                        backgroundColor: mode === 'dark' ?
                            'rgba(228, 176, 2, 0.15)' : 'rgba(228, 176, 2, 0.08)'
                    },
                    '&:disabled': {
                        borderColor: 'rgba(228, 176, 2, 0.5)',
                        color: mode === 'dark' ?
                            'rgba(255, 255, 255, 0.5)' :
                            'rgba(0, 0, 0, 0.5)'
                    }
                }}
            >
                {isSubmitting ? "Registrando..." : "Registrarse con Facebook"}
            </Button>

            {/* Indicador de carga */}
            {isSubmitting && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <CircularProgress size={24} sx={{ color: vistelicaColors.primary }} />
                </Box>
            )}

            {/* Mensaje de error */}
            {registrationError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                    {registrationError}
                </Alert>
            )}

            {/* Mensaje de éxito */}
            {registrationSuccess && (
                <Alert
                    severity="success"
                    sx={{
                        mt: 1,
                        '& .MuiAlert-icon': {
                            color: vistelicaColors.primary
                        }
                    }}
                >
                    Registro exitoso, redirigiendo...
                </Alert>
            )}

            <Typography sx={{ textAlign: 'center', mt: 1 }}>
                ¿Ya tienes una cuenta?{' '}
                <Link
                    href="/"
                    variant="body2"
                    sx={{
                        alignSelf: 'center',
                        color: vistelicaColors.primary,
                        fontWeight: 600,
                        '&:hover': {
                            color: vistelicaColors.primaryDark,
                        }
                    }}
                >
                    Iniciar sesión
                </Link>
            </Typography>
        </Box>
    );
}