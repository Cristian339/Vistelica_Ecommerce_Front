import * as React from 'react';
import {registerUser, checkEmailAvailability, checkPhoneAvailability} from '../../services/authService';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import {styled} from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import {SitemarkIcon} from './components/CustomIcons';
import RegistrationOptions from './components/RegistrationOptions';
import AccountInfoStep from './components/AccountInfoStep';
import PersonalInfoStep from './components/PersonalInfoStep';
import ContactInfoStep from './components/ContactInfoStep';
import { useColorScheme } from '@mui/material/styles';
import { vistelicaColors } from '../shared-theme/vistelicaColors';

const Card = styled(MuiCard)(() => {
    const { mode } = useColorScheme();

    return {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '100%',
        padding: '32px',
        gap: '16px',
        margin: 'auto',
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
        '@media (min-width: 600px)': {
            width: '450px',
        },
    };
});

const SignUpContainer = styled(Stack)(() => {
    const { mode } = useColorScheme();

    return {
        height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
        minHeight: '100%',
        padding: '16px',
        '@media (min-width: 600px)': {
            padding: '32px',
        },
        '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            zIndex: -1,
            inset: 0,
            backgroundImage: mode === 'dark'
                ? vistelicaColors.background.dark
                : vistelicaColors.background.light,
            backgroundRepeat: 'no-repeat',
        }
    };
});

const steps = ['Cuenta', 'Información personal', 'Contacto'];

export default function SignUp(props) {
    const { mode } = useColorScheme();
    console.log("Estado del tema en SignUp:", mode);

    const [showEmailForm, setShowEmailForm] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const [formData, setFormData] = React.useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        avatar: '',
        born_date: ''
    });

    // Validation error states
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [lastNameError, setLastNameError] = React.useState(false);
    const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState('');
    const [born_dateError, setBorn_dateError] = React.useState(false);
    const [born_dateErrorMessage, setBorn_dateErrorMessage] = React.useState('');
    const [addressError, setAddressError] = React.useState(false);
    const [addressErrorMessage, setAddressErrorMessage] = React.useState('');
    const [phoneError, setPhoneError] = React.useState(false);
    const [phoneErrorMessage, setPhoneErrorMessage] = React.useState('');

    // API communication states
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState('');
    const [submitSuccess, setSubmitSuccess] = React.useState(false);

    const handleNext = () => {
        setActiveStep(prevStep => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevStep => prevStep - 1);
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateCurrentStep = async () => {
        let isValid;

        switch (activeStep) {
            case 0: // Account info
                const email = document.getElementById('email');
                const password = document.getElementById('password');
                isValid = true;

                if (!email?.value || !/\S+@\S+\.\S+/.test(email.value)) {
                    setEmailError(true);
                    setEmailErrorMessage('Por favor ingresa un correo electrónico válido.');
                    isValid = false;
                } else {
                    try {
                        // Check if email is already registered
                        const emailResult = await checkEmailAvailability(email.value);

                        if (!emailResult.available) {
                            setEmailError(true);
                            setEmailErrorMessage(emailResult.message || 'Este correo ya está registrado.');
                            isValid = false;
                        } else {
                            setEmailError(false);
                            setEmailErrorMessage('');
                        }
                    } catch (error) {
                        console.error('Error verificando email:', error);
                        setEmailError(true);
                        setEmailErrorMessage('Error al verificar disponibilidad del correo.');
                        isValid = false;
                    }
                }

                if (!password?.value || password.value.length < 6) {
                    setPasswordError(true);
                    setPasswordErrorMessage('La contraseña debe tener al menos 6 caracteres.');
                    isValid = false;
                } else {
                    setPasswordError(false);
                    setPasswordErrorMessage('');
                }
                return isValid;

            case 1: // Personal info
                const name = document.getElementById('name');
                const lastName = document.getElementById('lastName');
                const born_date = document.getElementById('born_date');
                isValid = true;

                if (!name?.value || name.value.trim() === '') {
                    setNameError(true);
                    setNameErrorMessage('El nombre es requerido.');
                    isValid = false;
                } else {
                    setNameError(false);
                    setNameErrorMessage('');
                }

                if (!lastName?.value || lastName.value.trim() === '') {
                    setLastNameError(true);
                    setLastNameErrorMessage('El apellido es requerido.');
                    isValid = false;
                } else {
                    setLastNameError(false);
                    setLastNameErrorMessage('');
                }

                if (!born_date?.value) {
                    setBorn_dateError(true);
                    setBorn_dateErrorMessage('La fecha de nacimiento es requerida.');
                    isValid = false;
                } else {
                    setBorn_dateError(false);
                    setBorn_dateErrorMessage('');
                }

                return isValid;

            case 2: // Contact info
                const address = document.getElementById('address');
                const phone = document.getElementById('phone');
                isValid = true;

                if (!address?.value || address.value.trim() === '') {
                    setAddressError(true);
                    setAddressErrorMessage('La dirección es requerida.');
                    isValid = false;
                } else {
                    setAddressError(false);
                    setAddressErrorMessage('');
                }

                if (!phone?.value || phone.value.trim() === '') {
                    setPhoneError(true);
                    setPhoneErrorMessage('El teléfono es requerido.');
                    isValid = false;
                } else {
                    try {
                        // Check if phone is already registered
                        const phoneResult = await checkPhoneAvailability(phone.value);

                        if (!phoneResult.available) {
                            setPhoneError(true);
                            setPhoneErrorMessage(phoneResult.message || 'Este número ya está registrado.');
                            isValid = false;
                        } else {
                            setPhoneError(false);
                            setPhoneErrorMessage('');
                        }
                    } catch (error) {
                        console.error('Error verificando teléfono:', error);
                        setPhoneError(true);
                        setPhoneErrorMessage('Error al verificar disponibilidad del teléfono.');
                        isValid = false;
                    }
                }

                return isValid;

            default:
                return true;
        }
    };

    const handleStepSubmit = async (event) => {
        event.preventDefault();
        const isValid = await validateCurrentStep();

        if (isValid) {
            if (activeStep === steps.length - 1) {
                // Validar que todos los campos requeridos estén completos
                if (!formData.name || !formData.lastName || !formData.email ||
                    !formData.password || !formData.address || !formData.phone ||
                    !formData.born_date) {
                    setSubmitError('Por favor completa todos los campos requeridos.');
                    return;
                }

                setIsSubmitting(true);
                setSubmitError('');
                setSubmitSuccess(false);

                try {
                    const response = await registerUser(formData);
                    console.log('Usuario registrado exitosamente:', response);
                    setSubmitSuccess(true);

                    // Redirigir después del registro exitoso
                    setTimeout(() => {
                        window.location.href = '/sign-in-side/SignInSide';
                    }, 2000);
                } catch (error) {
                    console.error('Error al registrar usuario:', error);
                    setSubmitError(
                        error.response?.data?.message ||
                        'Ocurrió un error al registrar. Por favor, intenta nuevamente.'
                    );
                } finally {
                    setIsSubmitting(false);
                }
            } else {
                handleNext();
            }
        }
    };

    const handleSelectEmailRegistration = () => {
        setShowEmailForm(true);
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <ColorModeSelect sx={{position: 'fixed', top: '1rem', right: '1rem'}}/>
            <SignUpContainer direction="column" justifyContent="space-between">
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
                            fontWeight: 400,
                            color: vistelicaColors.primary,
                            textAlign: 'center',
                            mb: 1,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                        }}
                    >
                        Vistélica
                    </Typography>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                            fontWeight: 400,
                            color: vistelicaColors.primaryDark,
                            textAlign: 'center',
                            mb: 2,
                            textShadow: '0px 0px 1px rgba(0,0,0,0.1)'
                        }}
                    >
                        Registrarse
                    </Typography>

                    {!showEmailForm ? (
                        <RegistrationOptions onSelectEmailRegistration={handleSelectEmailRegistration}/>
                    ) : (
                        <>
                            <Stepper
                                activeStep={activeStep}
                                sx={{
                                    my: 3,
                                    '& .MuiStepIcon-root.Mui-active': {
                                        color: vistelicaColors.primary,
                                    },
                                    '& .MuiStepIcon-root.Mui-completed': {
                                        color: vistelicaColors.primary,
                                    }
                                }}
                            >
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mb: 2,
                                    color: mode === 'dark' ?
                                        vistelicaColors.tertiary :
                                        vistelicaColors.primary
                                }}
                            >
                                Los campos marcados con * son obligatorios
                            </Typography>

                            <Box
                                component="form"
                                onSubmit={handleStepSubmit}
                                sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                            >
                                {activeStep === 0 && (
                                    <AccountInfoStep
                                        formData={formData}
                                        onChange={handleChange}
                                        emailError={emailError}
                                        emailErrorMessage={emailErrorMessage}
                                        passwordError={passwordError}
                                        passwordErrorMessage={passwordErrorMessage}
                                        required={true}
                                    />
                                )}

                                {activeStep === 1 && (
                                    <PersonalInfoStep
                                        formData={formData}
                                        onChange={handleChange}
                                        nameError={nameError}
                                        nameErrorMessage={nameErrorMessage}
                                        lastNameError={lastNameError}
                                        lastNameErrorMessage={lastNameErrorMessage}
                                        born_dateError={born_dateError}
                                        born_dateErrorMessage={born_dateErrorMessage}
                                        onBack={handleBack}
                                        required={true}
                                    />
                                )}

                                {activeStep === 2 && (
                                    <ContactInfoStep
                                        formData={formData}
                                        onChange={handleChange}
                                        addressError={addressError}
                                        addressErrorMessage={addressErrorMessage}
                                        phoneError={phoneError}
                                        phoneErrorMessage={phoneErrorMessage}
                                        onBack={handleBack}
                                        required={{
                                            address: true,
                                            phone: true,
                                            avatar: false
                                        }}
                                    />
                                )}

                                {isSubmitting && (
                                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                                        <CircularProgress size={24} sx={{ color: vistelicaColors.primary }}/>
                                        <Typography sx={{
                                            ml: 2,
                                            color: mode === 'dark' ?
                                                vistelicaColors.quaternary :
                                                vistelicaColors.secondary
                                        }}>
                                            Enviando información...
                                        </Typography>
                                    </Box>
                                )}

                                {submitError && (
                                    <Alert severity="error" sx={{mt: 2}}>
                                        {submitError}
                                    </Alert>
                                )}

                                {submitSuccess && (
                                    <Alert
                                        severity="success"
                                        sx={{
                                            mt: 2,
                                            '& .MuiAlert-icon': {
                                                color: vistelicaColors.primary
                                            }
                                        }}
                                    >
                                        ¡Registro exitoso! Redirigiendo a la página de inicio de sesión...
                                    </Alert>
                                )}
                            </Box>
                        </>
                    )}
                </Card>
            </SignUpContainer>
        </AppTheme>
    );
}