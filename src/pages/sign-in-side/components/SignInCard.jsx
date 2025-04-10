import * as React from 'react';
import { loginUser } from '../../../services/authService';
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
import { styled, useTheme } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import { useRouter } from 'next/navigation';
import Stack from "@mui/joy/Stack";
import { vistelicaColors } from '../../shared-theme/vistelicaColors';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    marginTop: theme.spacing(8),
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
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
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(30),
    },
    ...theme.applyStyles('dark', {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    }),
}));

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
    const theme = useTheme();
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

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

    return (
        <Card variant="outlined">
            <Box sx={{
                display: {xs: 'flex', md: 'none'},
                justifyContent: 'center',
                mb: 2
            }}>
                <SitemarkIcon sx={{ color: vistelicaColors.primary }}/>
            </Box>
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
                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : vistelicaColors.tertiary,
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
                            color: theme.palette.mode === 'dark' ? '#FFFFFF' : vistelicaColors.tertiary,
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
                    <Alert severity="error">
                        {loginError}
                    </Alert>
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
                    onClick={() => alert('Iniciar sesión con Google')}
                    startIcon={<GoogleIcon/>}
                    sx={{
                        borderColor: vistelicaColors.primary,
                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                        fontWeight: 600,
                        '&:hover': {
                            borderColor: vistelicaColors.primary,
                            backgroundColor: theme.palette.mode === 'dark' ?
                                'rgba(228, 176, 2, 0.15)' : 'rgba(228, 176, 2, 0.08)'
                        }
                    }}
                >
                    Iniciar sesión con Google
                </Button>

                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => alert('Iniciar sesión con Facebook')}
                    startIcon={<FacebookIcon/>}
                    sx={{
                        borderColor: vistelicaColors.primary,
                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                        fontWeight: 600,
                        '&:hover': {
                            borderColor: vistelicaColors.primary,
                            backgroundColor: theme.palette.mode === 'dark' ?
                                'rgba(228, 176, 2, 0.15)' : 'rgba(228, 176, 2, 0.08)'
                        }
                    }}
                >
                    Iniciar sesión con Facebook
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
            </Stack>
        </Card>
    );
}