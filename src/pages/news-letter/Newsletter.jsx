"use client";
import * as React from 'react';
import { memo, useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { styled, keyframes, useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useRouter } from 'next/navigation';
import { vistelicaColors } from '../shared-theme/vistelicaColors';
import { typography } from '../shared-theme/themePrimitives';
import useMediaQuery from '@mui/material/useMediaQuery';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Snackbar from '@mui/material/Snackbar';

// Iconos
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Animaciones
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(228, 176, 2, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(228, 176, 2, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(228, 176, 2, 0);
  }
`;

// Componentes estilizados
const AnimatedTitle = styled(Typography)(({ theme }) => ({
    fontFamily: typography.h1.fontFamily,
    fontWeight: 700,
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    background: `linear-gradient(90deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary}, ${vistelicaColors.tertiary}, ${vistelicaColors.quaternary}, ${vistelicaColors.primary})`,
    backgroundSize: '200% auto',
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    animation: `${fadeIn} 1s ease-out, ${shimmer} 3s infinite linear`,
    marginBottom: theme.spacing(1),
    letterSpacing: '0.05em',
    position: 'relative',
    display: 'inline-block',
    textAlign: 'center',
    width: 'auto',
    textShadow: '0 2px 4px rgba(35, 42, 46, 0.1)',
}));

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(2),
    gap: theme.spacing(1.5),
    margin: 'auto',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
        width: '800px',
        padding: theme.spacing(4),
        gap: theme.spacing(2),
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '5px',
        background: `linear-gradient(90deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary})`,
    },
    ...theme.applyStyles('dark', {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    }),
}));

const Container = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(ellipse at 50% 50%, hsl(225, 15%, 15%), hsl(220, 20%, 10%))',
        }),
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    position: 'relative',
    paddingLeft: theme.spacing(1.5),
    fontSize: '1.15rem',
    fontFamily: typography.h5.fontFamily,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
        fontSize: '1.25rem',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '4px',
        height: '70%',
        background: vistelicaColors.primary,
        borderRadius: '4px',
    },
}));

const BenefitCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2.5),
    borderRadius: '12px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    background: theme.palette.background.paper,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 8px 20px rgba(228, 176, 2, 0.15)`,
    },
    ...theme.applyStyles('dark', {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        '&:hover': {
            boxShadow: `0 8px 24px rgba(228, 176, 2, 0.2)`,
        },
    }),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    width: 50,
    height: 50,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    background: `linear-gradient(135deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary})`,
    color: '#fff',
    boxShadow: '0 4px 12px rgba(228, 176, 2, 0.25)',
    animation: `${floatAnimation} 3s ease-in-out infinite`,
}));

const LargeIconWrapper = styled(Box)(({ theme }) => ({
    width: 70,
    height: 70,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    background: `linear-gradient(135deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary})`,
    color: '#fff',
    boxShadow: '0 4px 16px rgba(228, 176, 2, 0.3)',
    animation: `${pulseAnimation} 2s infinite`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: vistelicaColors.primary,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: vistelicaColors.primary,
        }
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: vistelicaColors.primary
        }
    }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    fontWeight: 600,
    backgroundColor: vistelicaColors.primary,
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        backgroundColor: vistelicaColors.primaryDark,
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
    '&:active': {
        transform: 'translateY(0)',
    },
}));

const ComingSoonBadge = styled(Chip)(({ theme }) => ({
    position: 'absolute',
    top: 16,
    right: 16,
    fontWeight: 'bold',
    backgroundColor: vistelicaColors.quaternary,
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
}));

const FormSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '16px',
    background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    border: `1px dashed ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const ExclusiveOfferCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${vistelicaColors.primaryLight}15)`,
    border: `2px solid ${vistelicaColors.primary}`,
    boxShadow: `0 8px 24px rgba(228, 176, 2, 0.15)`,
    position: 'relative',
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary})`,
    },
    ...theme.applyStyles('dark', {
        background: `linear-gradient(135deg, ${theme.palette.background.paper}, rgba(228, 176, 2, 0.1))`,
        boxShadow: `0 8px 24px rgba(228, 176, 2, 0.25)`,
    }),
}));

// Componente principal
const Newsletter = memo(function Newsletter(props) {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Estados para formulario
    const [email, setEmail] = useState('');
    const [frequency, setFrequency] = useState('weekly');
    const [preferences, setPreferences] = useState({
        newProducts: true,
        sales: true,
        exclusiveOffers: true,
        events: false,
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación básica
        if (!email) {
            setError('Por favor introduce tu email');
            return;
        }

        if (!termsAccepted) {
            setError('Debes aceptar los términos y condiciones');
            return;
        }

        // Aquí iría la lógica para enviar los datos a un backend
        console.log({
            email,
            frequency,
            preferences,
            termsAccepted
        });

        setSubmitted(true);
        setError('');
    };

    const handlePreferenceChange = (event) => {
        setPreferences({
            ...preferences,
            [event.target.name]: event.target.checked
        });
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <ColorModeSelect
                sx={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    zIndex: 5,
                }}
            />
            <Container
                direction="column"
                spacing={3}
                justifyContent="center"
                alignItems="center"
            >
                <Card>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <LargeIconWrapper sx={{ mx: 'auto' }}>
                            <MailOutlineIcon fontSize="large" />
                        </LargeIconWrapper>
                        <AnimatedTitle variant="h1" aria-label="Suscripción a Novedades">
                            Suscripción a Novedades
                        </AnimatedTitle>
                        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary', maxWidth: '650px', mx: 'auto' }}>
                            Mantente al día con todas nuestras novedades, lanzamientos exclusivos y promociones especiales. Suscríbete ahora y no te pierdas nada de lo que Vistelica tiene para ofrecerte.
                        </Typography>
                    </Box>

                    {!submitted ? (
                        <FormSection component="form" onSubmit={handleSubmit}>
                            <SectionTitle variant="h2">
                                Únete a nuestra comunidad
                            </SectionTitle>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <StyledTextField
                                        fullWidth
                                        label="Tu correo electrónico"
                                        variant="outlined"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        error={!!error && !email}
                                        helperText={!email && error ? "El correo electrónico es obligatorio" : ""}
                                        required
                                        InputProps={{
                                            startAdornment: <MailOutlineIcon color="action" sx={{ mr: 1 }} />,
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        ¿Con qué frecuencia quieres recibir nuestras novedades?
                                    </Typography>
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            row
                                            value={frequency}
                                            onChange={(e) => setFrequency(e.target.value)}
                                        >
                                            <FormControlLabel value="weekly" control={<Radio color="primary" />} label="Semanal" />
                                            <FormControlLabel value="biweekly" control={<Radio color="primary" />} label="Quincenal" />
                                            <FormControlLabel value="monthly" control={<Radio color="primary" />} label="Mensual" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        ¿Qué tipo de información te interesa?
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={preferences.newProducts}
                                                        onChange={handlePreferenceChange}
                                                        name="newProducts"
                                                        color="primary"
                                                    />
                                                }
                                                label="Nuevos productos"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={preferences.sales}
                                                        onChange={handlePreferenceChange}
                                                        name="sales"
                                                        color="primary"
                                                    />
                                                }
                                                label="Ofertas y rebajas"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={preferences.exclusiveOffers}
                                                        onChange={handlePreferenceChange}
                                                        name="exclusiveOffers"
                                                        color="primary"
                                                    />
                                                }
                                                label="Ofertas exclusivas"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={preferences.events}
                                                        onChange={handlePreferenceChange}
                                                        name="events"
                                                        color="primary"
                                                    />
                                                }
                                                label="Eventos y novedades"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                name="termsAccepted"
                                                color="primary"
                                            />
                                        }
                                        label="Acepto recibir comunicaciones comerciales y he leído la política de privacidad"
                                    />
                                    {error && !termsAccepted && (
                                        <Typography color="error" variant="caption" display="block" sx={{ mt: 0.5 }}>
                                            Debes aceptar los términos para continuar
                                        </Typography>
                                    )}
                                </Grid>

                                <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }}>
                                    <SubmitButton
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        endIcon={<NotificationsActiveIcon />}
                                    >
                                        Suscribirse
                                    </SubmitButton>
                                </Grid>
                            </Grid>
                        </FormSection>
                    ) : (
                        <Box sx={{ textAlign: 'center', my: 4, py: 4 }}>
                            <ThumbUpAltIcon sx={{ fontSize: 60, color: vistelicaColors.primary, mb: 2 }} />
                            <Typography variant="h4" gutterBottom>
                                ¡Gracias por suscribirte!
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Hemos enviado un correo de confirmación a tu dirección de email.
                                Por favor, confirma tu suscripción para comenzar a recibir nuestras novedades.
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => setSubmitted(false)}
                                sx={{ mt: 2 }}
                            >
                                Volver al formulario
                            </Button>
                        </Box>
                    )}

                    <Divider sx={{ my: 4 }} />

                    <SectionTitle variant="h2">
                        Beneficios de suscribirse
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <BenefitCard>
                                <IconWrapper>
                                    <NewReleasesIcon />
                                </IconWrapper>
                                <Typography variant="h6" gutterBottom>
                                    Primicia en novedades
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Sé el primero en enterarte de nuestros nuevos lanzamientos y colecciones antes que nadie.
                                </Typography>
                            </BenefitCard>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <BenefitCard>
                                <IconWrapper>
                                    <LocalOfferIcon />
                                </IconWrapper>
                                <Typography variant="h6" gutterBottom>
                                    Ofertas exclusivas
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Accede a descuentos especiales y promociones disponibles solo para suscriptores.
                                </Typography>
                            </BenefitCard>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <BenefitCard>
                                <IconWrapper>
                                    <VerifiedUserIcon />
                                </IconWrapper>
                                <Typography variant="h6" gutterBottom>
                                    Contenido personalizado
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Recibe recomendaciones basadas en tus preferencias y historial de compras.
                                </Typography>
                            </BenefitCard>
                        </Grid>
                    </Grid>

                    <ExclusiveOfferCard>
                        <ComingSoonBadge label="Próximamente" />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <CardMembershipIcon sx={{ color: vistelicaColors.primary, fontSize: 32 }} />
                            <Typography variant="h5" fontWeight={600}>
                                Ofertas especiales para miembros con tarjeta
                            </Typography>
                        </Box>

                        <Typography variant="body1" paragraph>
                            En el futuro, los suscriptores que también posean nuestra tarjeta de fidelidad disfrutarán de ventajas exclusivas:
                        </Typography>

                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TimerIcon sx={{ color: vistelicaColors.primary }} />
                                    <Typography variant="body1">
                                        Acceso anticipado a ventas limitadas
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TrendingUpIcon sx={{ color: vistelicaColors.primary }} />
                                    <Typography variant="body1">
                                        Descuentos incrementales hasta un 50%
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <NotificationsActiveIcon sx={{ color: vistelicaColors.primary }} />
                                    <Typography variant="body1">
                                        Notificación prioritaria de colecciones exclusivas
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocalOfferIcon sx={{ color: vistelicaColors.primary }} />
                                    <Typography variant="body1">
                                        Cupones de regalo por cumpleaños
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Alert severity="info" sx={{ mt: 3 }}>
                            <Typography variant="body2">
                                Este programa especial para suscriptores con tarjeta se lanzará próximamente. Mantente atento a nuestras comunicaciones para más detalles.
                            </Typography>
                        </Alert>
                    </ExclusiveOfferCard>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Puedes darte de baja en cualquier momento a través del enlace en los correos que recibas.
                            Respetamos tu privacidad y nunca compartiremos tus datos con terceros.
                        </Typography>
                    </Box>
                </Card>
            </Container>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
                message={error}
            />
        </AppTheme>
    );
});

Newsletter.displayName = 'Newsletter';

export default Newsletter;