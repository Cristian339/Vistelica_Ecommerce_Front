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
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import { useRouter } from 'next/navigation';
import Stack from "@mui/material/Stack";

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    marginTop: theme.spacing(8),
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(30),
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

export default function SignInCard() {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    // New states for tracking login process
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
                router.push('/dashboard');
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
            <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                <SitemarkIcon/>
            </Box>
            <Typography
                component="h1"
                variant="h4"
                sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
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
                    <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                    <TextField
                        error={emailError}
                        helperText={emailErrorMessage}
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
                    />
                </FormControl>
                <FormControl>
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <FormLabel htmlFor="password">Contraseña</FormLabel>
                        <Link
                            component="button"
                            type="button"
                            onClick={handleClickOpen}
                            variant="body2"
                            sx={{alignSelf: 'baseline'}}
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </Box>
                    <TextField
                        error={passwordError}
                        helperText={passwordErrorMessage}
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
                    />
                </FormControl>
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary"/>}
                    label="Recordarme"
                />
                <ForgotPassword open={open} handleClose={handleClose}/>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>

                {isSubmitting && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}

                {loginError && (
                    <Alert severity="error">
                        {loginError}
                    </Alert>
                )}

                {loginSuccess && (
                    <Alert severity="success">
                        Inicio de sesión exitoso, redirigiendo...
                    </Alert>
                )}

                <Typography sx={{textAlign: 'center'}}>
                    ¿No tienes una cuenta?{' '}
                    <span>
                        <Link
                            href="/sign-up/SignUp"
                            variant="body2"
                            sx={{alignSelf: 'center'}}
                        >
                            Regístrate
                        </Link>
                    </span>
                </Typography>
            </Box>
            <Divider>o</Divider>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => alert('Iniciar sesión con Google')}
                    startIcon={<GoogleIcon/>}
                >
                    Iniciar sesión con Google
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => alert('Iniciar sesión con Facebook')}
                    startIcon={<FacebookIcon/>}
                >
                    Iniciar sesión con Facebook
                </Button>
            </Box>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link
                    href="/privacy-policy/PrivacyPolicy"
                    variant="body2"
                    sx={{ textDecoration: 'underline' }}
                >
                    Ver Política de Privacidad (testing)
                </Link>
            </Box>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Link
                        href="/privacy-policy/PrivacyPolicy"
                        variant="body2"
                        sx={{ textDecoration: 'underline' }}
                    >
                        Ver Política de Privacidad
                    </Link>
                    <Link
                        href="/about-us/AboutUs"
                        variant="body2"
                        sx={{ textDecoration: 'underline' }}
                    >
                        Sobre Nosotros
                    </Link>
                </Stack>
            </Box>
        </Card>
    );
}