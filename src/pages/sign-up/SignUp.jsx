import * as React from 'react';
import {
    initiateRegistration,
    verifyRegistration,
    resendVerificationCode,
    cancelRegistration,
    checkEmailAvailability,
    checkPhoneAvailability
} from '../../services/authService';
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
import {SitemarkIcon} from '../../components/sign/up/CustomIcons';
import RegistrationOptions from './components/RegistrationOptions';
import AccountInfoStep from './components/AccountInfoStep';
import PersonalInfoStep from './components/PersonalInfoStep';
import ContactInfoStep from './components/PersonalizationStep';
import AdditionalAddressStep from './components/AdditionalAddressStep';
import { useColorScheme } from '@mui/material/styles';
import { vistelicaColors } from '../../components/shared/vistelicaColors';
import PersonalizationStep from "./components/PersonalizationStep";
import EmailVerificationStep from './components/EmailVerificationStep';

const Card = styled(MuiCard)(() => {
    const { mode } = useColorScheme();

    return {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '100%',
        maxWidth: '450px',
        padding: '24px',
        gap: '12px',
        margin: 'auto',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: mode === 'dark'
            ? vistelicaColors.cardBackground.dark
            : vistelicaColors.cardBackground.light,
        boxShadow: mode === 'dark'
            ? vistelicaColors.cardShadow.dark
            : vistelicaColors.cardShadow.light,
        borderRadius: '16px',
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '5px',
            background: `linear-gradient(90deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary})`,
        },
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: vistelicaColors.primary,
            borderRadius: '3px',
            '&:hover': {
                background: vistelicaColors.primaryDark,
            }
        },
    };
});

const SignUpContainer = styled(Stack)(() => {
    const { mode } = useColorScheme();

    return {
        height: '100vh',
        minHeight: '100vh',
        padding: '16px',
        justifyContent: 'center',
        alignItems: 'center',
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

const steps = ['Cuenta', 'Información personal', 'Dirección adicional', 'Personalización', 'Verificación'];

export default function SignUp(props) {
    const { mode } = useColorScheme();
    console.log("Estado del tema en SignUp:", mode);

    const [showEmailForm, setShowEmailForm] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);

    // Estados para el registro y verificación
    const [registrationToken, setRegistrationToken] = React.useState('');
    const [isWaitingVerification, setIsWaitingVerification] = React.useState(false);

    const [formData, setFormData] = React.useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        avatar: '',
        born_date: '',

        includeAdditionalAddress: false,
        additional_street: '',
        additional_city: '',
        additional_state: '',
        additional_postal_code: '',
        additional_country: '',
        additional_block: '',
        additional_floor: '',
        additional_door: '',
        additional_label: '',
        additional_is_default: false
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
    const [phoneError, setPhoneError] = React.useState(false);
    const [phoneErrorMessage, setPhoneErrorMessage] = React.useState('');

    // Additional address error states
    const [additionalAddressErrors, setAdditionalAddressErrors] = React.useState({});

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

    const handleCheckboxChange = (name, checked) => {
        setFormData({
            ...formData,
            [name]: checked
        });
    };

    const validateAdditionalAddress = () => {
        const errors = {};
        let isValid = true;

        if (formData.includeAdditionalAddress) {
            if (!formData.additional_street || formData.additional_street.trim() === '') {
                errors.additional_street = 'La calle es requerida.';
                isValid = false;
            }

            if (!formData.additional_city || formData.additional_city.trim() === '') {
                errors.additional_city = 'La ciudad es requerida.';
                isValid = false;
            }

            if (!formData.additional_state || formData.additional_state.trim() === '') {
                errors.additional_state = 'El estado/provincia es requerido.';
                isValid = false;
            }

            if (!formData.additional_postal_code || formData.additional_postal_code.trim() === '') {
                errors.additional_postal_code = 'El código postal es requerido.';
                isValid = false;
            }

            if (!formData.additional_country || formData.additional_country.trim() === '') {
                errors.additional_country = 'El país es requerido.';
                isValid = false;
            }
        }

        setAdditionalAddressErrors(errors);
        return isValid;
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
                const phone = document.getElementById('phone');
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

                if (!phone?.value || phone.value.trim() === '') {
                    setPhoneError(true);
                    setPhoneErrorMessage('El teléfono es requerido.');
                    isValid = false;
                } else {
                    try {
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

            case 2: // Additional address
                return validateAdditionalAddress();

            case 3: // Personalization
                return true;

            case 4: // Email verification
                return true;

            default:
                return true;
        }
    };

    const handleStepSubmit = async (event) => {
        event.preventDefault();
        const isValid = await validateCurrentStep();

        if (isValid) {
            if (activeStep === steps.length - 2) { // Paso de personalización (antes de verificación)
                // Validar que todos los campos requeridos estén completos
                if (!formData.name || !formData.lastName || !formData.email ||
                    !formData.password || !formData.phone || !formData.born_date) {
                    setSubmitError('Por favor completa todos los campos requeridos.');
                    return;
                }

                setIsSubmitting(true);
                setSubmitError('');
                setSubmitSuccess(false);

                try {
                    // Iniciar el proceso de registro (envía email de verificación)
                    const response = await initiateRegistration(formData);
                    console.log('Registro iniciado exitosamente:', response);

                    // Guardar el token de registro
                    setRegistrationToken(response.registrationToken);
                    setIsWaitingVerification(true);

                    // Avanzar al paso de verificación
                    handleNext();

                } catch (error) {
                    console.error('Error al iniciar registro:', error);
                    setSubmitError(
                        error.response?.data?.message ||
                        error.message ||
                        'Ocurrió un error al iniciar el registro. Por favor, intenta nuevamente.'
                    );
                } finally {
                    setIsSubmitting(false);
                }
            } else if (activeStep < steps.length - 1) {
                handleNext();
            }
        }
    };

    const handleVerificationSuccess = async (verificationCode) => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const response = await verifyRegistration(registrationToken, verificationCode);
            console.log('Verificación exitosa:', response);

            if (response.success) {
                setSubmitSuccess(true);

                // Redirigir al login después de un delay
                setTimeout(() => {
                    window.location.href = '/sign-in-side/Sign-in-side';
                }, 2000);
            } else {
                throw new Error(response.message || 'Error en la verificación');
            }

        } catch (error) {
            console.error('Error al verificar registro:', error);
            // Re-lanzar el error para que lo maneje el componente EmailVerificationStep
            throw new Error(
                error.response?.data?.message ||
                error.message ||
                'Código de verificación incorrecto. Por favor, intenta nuevamente.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleResendVerificationCode = async () => {
        try {
            const response = await resendVerificationCode(registrationToken);
            console.log('Código reenviado:', response);
            return { success: true, message: response.message };
        } catch (error) {
            console.error('Error al reenviar código:', error);
            throw new Error(
                error.response?.data?.message ||
                error.message ||
                'Error al reenviar el código de verificación.'
            );
        }
    };

    const handleCancelRegistration = async () => {
        try {
            await cancelRegistration(registrationToken);
            // Volver al inicio del formulario
            setActiveStep(0);
            setRegistrationToken('');
            setIsWaitingVerification(false);
            setSubmitError('');
            setSubmitSuccess(false);
        } catch (error) {
            console.error('Error al cancelar registro:', error);
            setSubmitError('Error al cancelar el registro.');
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

                            {activeStep < steps.length - 1 && (
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
                            )}

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
                                        phoneError={phoneError}
                                        phoneErrorMessage={phoneErrorMessage}
                                        onBack={handleBack}
                                        required={{
                                            name: true,
                                            lastName: true,
                                            born_date: true,
                                            phone: true
                                        }}
                                    />
                                )}

                                {activeStep === 2 && (
                                    <AdditionalAddressStep
                                        formData={formData}
                                        onChange={handleChange}
                                        onCheckboxChange={handleCheckboxChange}
                                        errors={additionalAddressErrors}
                                        onBack={handleBack}
                                        isLastStep={false}
                                    />
                                )}

                                {activeStep === 3 && (
                                    <PersonalizationStep
                                        formData={formData}
                                        onChange={handleChange}
                                        onBack={handleBack}
                                        required={{
                                            avatar: false
                                        }}
                                    />
                                )}

                                {activeStep === 4 && (
                                    <EmailVerificationStep
                                        email={formData.email}
                                        registrationToken={registrationToken}
                                        onVerificationSuccess={handleVerificationSuccess}
                                        onResendCode={handleResendVerificationCode}
                                        onCancel={handleCancelRegistration}
                                        onBack={handleBack}
                                        isSubmitting={isSubmitting}
                                    />
                                )}

                                {isSubmitting && activeStep < 4 && (
                                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                                        <CircularProgress size={24} sx={{ color: vistelicaColors.primary }}/>
                                        <Typography sx={{
                                            ml: 2,
                                            color: mode === 'dark' ?
                                                vistelicaColors.quaternary :
                                                vistelicaColors.secondary
                                        }}>
                                            {activeStep === 3 ? 'Enviando código de verificación...' : 'Enviando información...'}
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
                                        ¡Registro completado exitosamente! Redirigiendo al inicio de sesión...
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