"use client";
// Importaciones de servicios
import {
    loginUser,
    registerSocialUser,
    signInWithGoogle,
    signInWithFacebook
} from '../../../services/authService';

// Importaciones de React y hooks
import * as React from 'react';
import { useRouter } from 'next/navigation';

// Importaciones de componentes de Material-UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { styled, useTheme } from '@mui/material/styles';
import { useColorScheme } from '@mui/material/styles';

// Importaciones de componentes personalizados
import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon } from './CustomIcons';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import ColorModeSelect from '../../shared-theme/ColorModeSelect';
import Content from './Content';
import TermsAndConditions from "../../terms-conditions/TermsConditions";

// Importaciones de Joy UI
import Stack from "@mui/joy/Stack";

// Contenedor para pantalla completa
const FullScreenContainer = styled(Box)(({ theme }) => {
    const { mode } = useColorScheme();

    return {
        minHeight: '100vh',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: mode === 'dark'
            ? vistelicaColors.cardBackground.dark
            : vistelicaColors.cardBackground.light,
        overflowY: 'auto',
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
    };
});

const Card = styled(MuiCard)(({ theme }) => {
    const { mode } = useColorScheme();

    return {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: theme.spacing(4),
        gap: theme.spacing(2),
        backgroundColor: mode === 'dark'
            ? vistelicaColors.cardBackground.dark
            : vistelicaColors.cardBackground.light,
        boxShadow: mode === 'dark'
            ? vistelicaColors.cardShadow.dark
            : vistelicaColors.cardShadow.light,
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '5px',
            background: `linear-gradient(90deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary})`,
        },
        // Dispositivos pequeños (móviles)
        [theme.breakpoints.only('xs')]: {
            margin: 'auto',
            marginTop: theme.spacing(8),
            maxWidth: '100%',
        },
        // Dispositivos medianos (tablets y móviles anchos)
        [theme.breakpoints.between('sm', 'md')]: {
            margin: 'auto',
            marginTop: theme.spacing(8),
            minWidth: '500px',
            maxWidth: '80%',
        },
        // Escritorio
        [theme.breakpoints.up('md')]: {
            minWidth: '550px',
            maxWidth: '650px',
        },
    };
});

// Divider personalizado con colores de Vistélica
const StyledDivider = styled(Divider)(() => ({
    '&::before, &::after': {
        borderColor: `rgba(${parseInt(vistelicaColors.primary.slice(1, 3), 16)},
                       ${parseInt(vistelicaColors.primary.slice(3, 5), 16)},
                       ${parseInt(vistelicaColors.primary.slice(5, 7), 16)}, 0.3)`,
    },
}));

// Botones personalizados
const PrimaryButton = styled(Button)(() => ({
    backgroundColor: vistelicaColors.primary,
    color: vistelicaColors.tertiary,
    fontWeight: 600,
    padding: '10px 0',
    '&:hover': {
        backgroundColor: vistelicaColors.primaryDark,
        boxShadow: '0 4px 12px rgba(228, 176, 2, 0.25)',
    },
    '&:disabled': {
        backgroundColor: 'rgba(228, 176, 2, 0.5)',
    },
    transition: 'all 0.3s ease',
}));

// StyledLink con los colores de Vistélica
const StyledLink = styled(Link)(() => ({
    color: vistelicaColors.primary,
    '&:hover': {
        color: vistelicaColors.primaryDark,
    },
}));

export default function SignInCard() {
    const { mode } = useColorScheme();
    console.log("Estado del tema:", mode);

    // Aplicar el color de fondo al elemento HTML y body
    React.useEffect(() => {
        document.documentElement.style.backgroundColor = mode === 'dark'
            ? vistelicaColors.cardBackground.dark
            : vistelicaColors.cardBackground.light;
        document.body.style.backgroundColor = mode === 'dark'
            ? vistelicaColors.cardBackground.dark
            : vistelicaColors.cardBackground.light;

        return () => {
            document.documentElement.style.backgroundColor = '';
            document.body.style.backgroundColor = '';
        };
    }, [mode]);

    const theme = useTheme();
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    // Estado para el modal de Términos y Condiciones
    const [openTerms, setOpenTerms] = React.useState(false);

    // States for tracking login process
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [loginError, setLoginError] = React.useState('');
    const [loginSuccess, setLoginSuccess] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Funciones para manejar el modal de Términos y Condiciones
    const handleOpenTerms = () => {
        setOpenTerms(true);
    };

    const handleCloseTerms = () => {
        setOpenTerms(false);
    };

    const handleAcceptTerms = () => {
        console.log('Términos y condiciones aceptados');
        handleCloseTerms();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }

        setIsSubmitting(true);
        setLoginError('');
        setLoginSuccess(false);

        const data = new FormData(event.currentTarget);
        const credentials = {
            email: data.get('email'),
            password: data.get('password'),
        };

        try {
            const response = await loginUser(credentials);
            console.log('Login exitoso:', response);
            setLoginSuccess(true);

            // Redirect after successful login
            setTimeout(() => {
                router.push('/home/Home');
            }, 1000);

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setLoginError(
                error.response?.data?.message ||
                'Credenciales incorrectas. Por favor, verifica tus datos.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateInputs = () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Por favor, introduce una dirección de correo válida.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('La contraseña debe tener al menos 6 caracteres.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

// Función para inicio de sesión con Google
    const handleGoogleSignIn = async () => {
        try {
            setIsSubmitting(true);
            setLoginError('');

            // 1. Autenticar con Firebase
            const result = await signInWithGoogle();
            console.log('Login con Google exitoso:', result);

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

            setLoginSuccess(true);

            // 4. Redirección según tipo de usuario
            if (result.isNewUser) {
                setTimeout(() => router.push('/complete-profile'), 1000);
            } else {
                setTimeout(() => router.push('/dashboard'), 1000);
            }
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);

            if (error.code === 'auth/popup-closed-by-user') {
                setLoginError('Has cerrado la ventana de inicio de sesión.');
            } else {
                setLoginError('No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFacebookSignIn = async () => {
        try {
            setIsSubmitting(true);
            setLoginError('');

            // 1. Autenticar con Firebase
            const result = await signInWithFacebook();
            console.log('Login con Facebook exitoso:', result);

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
            await registerSocialUser(userData);
            setLoginSuccess(true);

            // 4. Redirección según tipo de usuario
            if (result.isNewUser) {
                setTimeout(() => router.push('/complete-profile'), 1000);
            } else {
                setTimeout(() => router.push('/dashboard'), 1000);
            }
        } catch (error) {
            console.error('Error al iniciar sesión con Facebook:', error);

            if (error.code === 'auth/popup-closed-by-user') {
                setLoginError('Has cerrado la ventana de inicio de sesión.');
            } else {
                setLoginError('No se pudo iniciar sesión con Facebook. Por favor, inténtalo de nuevo.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FullScreenContainer>
            {/* Selector de modo con posición fija */}
            <Box sx={{
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 1200
            }}>
                <ColorModeSelect />
            </Box>

            <Grid
                container
                spacing={3}
                sx={{
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: { xs: 0, md: 2 }
                }}
            >
                <Grid item xs={12} sm={10} md={7} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card variant="outlined">
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{
                                width: '100%',
                                fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                                fontWeight: 700,
                                color: vistelicaColors.primary,
                                textAlign: 'center',
                                mb: 2,
                                textShadow: '0px 0px 1px rgba(0,0,0,0.1)'
                            }}
                        >
                            Iniciar sesión
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{display: 'flex', flexDirection: 'column', width: '100%', gap: 2}}
                        >
                            <FormControl>
                                <FormLabel htmlFor="email" sx={{
                                    color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                                    fontWeight: 500
                                }}>
                                    Correo electrónico
                                </FormLabel>
                                <TextField
                                    error={emailError}
                                    helperText={emailErrorMessage}
                                    FormHelperTextProps={{
                                        sx: { fontWeight: 700 }  // Negrita para mensajes de error
                                    }}
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="tu@correo.com"
                                    autoComplete="email"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    color={emailError ? 'error' : 'primary'}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': {
                                                borderColor: vistelicaColors.primary,
                                            }
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormControl>
                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <FormLabel htmlFor="password" sx={{
                                        color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                                        fontWeight: 500
                                    }}>
                                        Contraseña
                                    </FormLabel>
                                    <StyledLink
                                        component="button"
                                        type="button"
                                        onClick={handleClickOpen}
                                        variant="body2"
                                        sx={{alignSelf: 'baseline'}}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </StyledLink>
                                </Box>
                                <TextField
                                    error={passwordError}
                                    helperText={passwordErrorMessage}
                                    FormHelperTextProps={{
                                        sx: { fontWeight: 700 }  // Negrita para mensajes de error
                                    }}
                                    name="password"
                                    placeholder="••••••"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    color={passwordError ? 'error' : 'primary'}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': {
                                                borderColor: vistelicaColors.primary,
                                            }
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="remember"
                                        sx={{
                                            color: vistelicaColors.primary,
                                            '&.Mui-checked': {
                                                color: vistelicaColors.primary,
                                            },
                                        }}
                                    />
                                }
                                label="Recordarme"
                            />
                            <ForgotPassword open={open} handleClose={handleClose}/>

                            <PrimaryButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                            </PrimaryButton>

                            {isSubmitting && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <CircularProgress size={24} sx={{ color: vistelicaColors.primary }} />
                                </Box>
                            )}

                            {loginError && (
                                <Adashboardlert severity="error">
                                    {loginError}
                                </Adashboardlert>
                            )}

                            {loginSuccess && (
                                <Alert
                                    severity="success"
                                    sx={{
                                        '& .MuiAlert-icon': {
                                            color: vistelicaColors.primary
                                        }
                                    }}
                                >
                                    Inicio de sesión exitoso, redirigiendo...
                                </Alert>
                            )}

                            <Typography sx={{textAlign: 'center'}}>
                                ¿No tienes una cuenta?{' '}
                                <StyledLink
                                    href="/sign-up/SignUp"
                                    variant="body2"
                                    sx={{
                                        alignSelf: 'center',
                                        fontWeight: 600
                                    }}
                                >
                                    Regístrate
                                </StyledLink>
                            </Typography>
                        </Box>
                        <StyledDivider sx={{ my: 2 }}>o</StyledDivider>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleGoogleSignIn}
                                disabled={isSubmitting}
                                startIcon={<GoogleIcon/>}
                                sx={{
                                    borderColor: vistelicaColors.primary,
                                    color: mode === 'dark' ? '#FFFFFF' : '#000000',
                                    fontWeight: 600,
                                    '&:hover': {
                                        borderColor: vistelicaColors.primary,
                                        backgroundColor: mode === 'dark' ?
                                            'rgba(228, 176, 2, 0.15)' : 'rgba(228, 176, 2, 0.08)'
                                    }
                                }}
                            >
                                {isSubmitting ? "Conectando..." : "Iniciar sesión con Google"}
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleFacebookSignIn}
                                disabled={isSubmitting}
                                startIcon={<FacebookIcon/>}
                                sx={{
                                    borderColor: vistelicaColors.primary,
                                    color: mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
                                    fontWeight: 600,
                                    '&:hover': {
                                        borderColor: vistelicaColors.primary,
                                        backgroundColor: mode === 'dark' ?
                                            'rgba(228, 176, 2, 0.15)' : 'rgba(228, 176, 2, 0.08)'
                                    }
                                }}
                            >
                                {isSubmitting ? "Conectando..." : "Iniciar sesión con Facebook"}
                            </Button>
                        </Box>
                        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                            <StyledLink
                                href="/about-us/AboutUs"
                                variant="body2"
                                sx={{
                                    textDecoration: 'underline',
                                    fontWeight: 600
                                }}
                            >
                                Sobre Nosotros
                            </StyledLink>
                            <StyledLink
                                component="button"
                                onClick={handleOpenTerms}
                                variant="body2"
                                sx={{
                                    textDecoration: 'underline',
                                    fontWeight: 600
                                }}
                            >
                                Términos y condiciones
                            </StyledLink>
                            <StyledLink
                                href="/privacy-policy/PrivacyPolicy"
                                variant="body2"
                                sx={{
                                    textDecoration: 'underline',
                                    fontWeight: 600
                                }}
                            >
                                Política de privacidad
                            </StyledLink>
                        </Stack>
                    </Card>
                </Grid>

                {/* Columna de contenido - visible solo en pantallas medianas y grandes */}
                <Grid
                    item
                    md={5}
                    lg={5}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Content />
                </Grid>
            </Grid>

            {/* Modal de Términos y Condiciones */}
            <TermsAndConditions
                open={openTerms}
                handleClose={handleCloseTerms}
                handleAccept={handleAcceptTerms}
            />
        </FullScreenContainer>
    );
}