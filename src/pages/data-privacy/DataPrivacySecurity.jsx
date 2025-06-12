"use client";
import * as React from 'react';
import { memo, useState, lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled, keyframes, useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { useRouter } from 'next/navigation';
import Fade from '@mui/material/Fade';
import { vistelicaColors } from '../shared-theme/vistelicaColors';
import { typography } from '../shared-theme/themePrimitives';
import ShieldIcon from '@mui/icons-material/Shield';
import SecurityIcon from '@mui/icons-material/Security';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';

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

const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
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
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

const ScrollableContent = styled(Box)(({ theme }) => ({
    maxHeight: '60vh',
    overflowY: 'auto',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    fontFamily: typography.fontFamily,
    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-track': {
        background: theme.palette.background.paper,
        borderRadius: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: vistelicaColors.primary,
        borderRadius: '6px',
    },
    [theme.breakpoints.up('sm')]: {
        maxHeight: '60vh',
        padding: theme.spacing(3),
        '&::-webkit-scrollbar': {
            width: '8px',
        },
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    position: 'relative',
    paddingLeft: theme.spacing(1.5),
    fontSize: '1.15rem',
    fontFamily: typography.h5.fontFamily,
    fontWeight: 600,
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

const FeatureCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(3),
    borderRadius: '12px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    background: theme.palette.background.paper,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    height: '100%',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 8px 20px rgba(228, 176, 2, 0.15)`,
    },
    ...theme.applyStyles('dark', {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        '&:hover': {
            boxShadow: '0 8px 24px rgba(228, 176, 2, 0.25)',
        },
    }),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    width: 60,
    height: 60,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    background: `linear-gradient(135deg, ${vistelicaColors.primary}, ${vistelicaColors.quaternary})`,
    color: '#fff',
    boxShadow: '0 4px 12px rgba(228, 176, 2, 0.25)',
    animation: `${pulseAnimation} 2s infinite`,
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    marginBottom: theme.spacing(1.5),
    borderRadius: '8px !important',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? 'rgba(228, 176, 2, 0.2)' : 'rgba(0, 0, 0, 0.05)',
    '&:before': {
        display: 'none',
    },
    '&.Mui-expanded': {
        margin: theme.spacing(1.5, 0),
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(35, 42, 46, 0.7)',
    }),
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    padding: theme.spacing(0, 2),
    '& .MuiAccordionSummary-content': {
        margin: theme.spacing(1.5, 0),
    },
    '&.Mui-expanded': {
        minHeight: 0,
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
        color: vistelicaColors.primary,
    },
}));

// Componente principal (memoizado para mejor rendimiento)
const DataPrivacySecurity = memo(function DataPrivacySecurity(props) {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [expanded, setExpanded] = useState(false);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleGoToHome = () => {
        router.push('/');
    };

    const AnimatedFeature = ({ index, icon, title, description }) => (
        <Grid
            item
            xs={12}
            sm={6}
            md={4}
            component={Box}
            sx={{
                animation: `${fadeInUp} 0.6s ease-out forwards`,
                animationDelay: `${index * 0.2}s`,
                opacity: 0
            }}
        >
            <FeatureCard>
                <IconWrapper>
                    {icon}
                </IconWrapper>
                <Typography
                    variant="h6"
                    sx={{
                        mb: 1.5,
                        fontWeight: 600,
                        color: vistelicaColors.primary,
                        fontFamily: typography.h6.fontFamily
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: typography.body2.fontFamily,
                        color: theme.palette.text.secondary
                    }}
                >
                    {description}
                </Typography>
            </FeatureCard>
        </Grid>
    );

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <ColorModeSelect
                sx={{
                    position: 'fixed',
                    top: { xs: '0.5rem', sm: '1rem' },
                    right: { xs: '0.5rem', sm: '1rem' },
                    zIndex: 10
                }}
                aria-label="Cambiar tema de color"
            />
            <Container
                direction="column"
                justifyContent="space-between"
                component="main"
                role="main"
                aria-labelledby="security-title"
            >
                <Fade in={true} timeout={800}>
                    <Card variant="outlined">
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 0.5, sm: 1 } }}>
                            <AnimatedTitle variant="h1" id="security-title">Seguridad de tus datos</AnimatedTitle>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 0.5, sm: 1 } }}>
                            <ShieldIcon sx={{ color: vistelicaColors.primary, fontSize: { xs: 24, sm: 28 } }} />
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    width: '100%',
                                    fontSize: 'clamp(1.5rem, 6vw, 2.15rem)',
                                    fontWeight: 600,
                                    fontFamily: typography.h4.fontFamily
                                }}
                            >
                                Privacidad y Protección de Datos
                            </Typography>
                        </Box>

                        <Typography
                            variant="subtitle1"
                            sx={{
                                mb: { xs: 1, sm: 2 },
                                fontStyle: 'italic',
                                fontSize: { xs: '0.85rem', sm: '1rem' },
                                fontFamily: typography.fontFamily
                            }}
                            role="doc-subtitle"
                        >
                            Información en cumplimiento de la normativa de protección de datos
                        </Typography>

                        {/* Key Features Section */}
                        <Box sx={{ mb: 4, mt: 1 }}>
                            <Grid container spacing={3}>
                                <AnimatedFeature
                                    index={0}
                                    icon={<SecurityIcon fontSize="large" />}
                                    title="Seguridad Mejorada"
                                    description="Implementamos las medidas de seguridad más robustas para proteger tus datos personales contra accesos no autorizados y brechas."
                                />
                                <AnimatedFeature
                                    index={1}
                                    icon={<PrivacyTipIcon fontSize="large" />}
                                    title="Control de Privacidad"
                                    description="Te damos control total sobre tu información personal con opciones transparentes para gestionar tus preferencias de privacidad."
                                />
                                <AnimatedFeature
                                    index={2}
                                    icon={<LockIcon fontSize="large" />}
                                    title="Encriptación de Datos"
                                    description="Tus datos sensibles se encriptan con tecnologías avanzadas para garantizar la máxima protección durante transferencias y almacenamiento."
                                />
                            </Grid>
                        </Box>

                        <ScrollableContent>
                            <SectionTitle variant="h5" gutterBottom>
                                Sobre Nosotros y Nuestro Compromiso
                            </SectionTitle>
                            <Typography paragraph sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' }, mb: { xs: 1, sm: 2 }, fontWeight: 500, color: vistelicaColors.primary, fontFamily: typography.fontFamily }}>
                                En Vistélica, priorizamos la protección de tu información personal y estamos comprometidos con la transparencia sobre cómo recopilamos, usamos y protegemos tus datos.
                            </Typography>
                            <Typography paragraph sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, mb: { xs: 1, sm: 2 }, fontFamily: typography.fontFamily }}>
                                Nuestras políticas de protección de datos cumplen con la normativa europea (GDPR) y están diseñadas para asegurar que tu información se maneje con el máximo cuidado y respeto por tu privacidad.
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: `rgba(${theme.palette.mode === 'dark' ? '228, 176, 2, 0.4' : '228, 176, 2, 0.3'})` }} />

                            <SectionTitle variant="h5" gutterBottom>
                                Preguntas Frecuentes sobre Protección de Datos
                            </SectionTitle>

                            <Box sx={{ mt: 3 }} role="region" aria-label="Preguntas Frecuentes">
                                <StyledAccordion
                                    expanded={expanded === 'panel1'}
                                    onChange={handleAccordionChange('panel1')}
                                    TransitionProps={{ unmountOnExit: true }}
                                >
                                    <StyledAccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <Typography sx={{ fontWeight: 600, fontFamily: typography.fontFamily }}>
                                            ¿Por qué necesitamos tus datos?
                                        </Typography>
                                    </StyledAccordionSummary>
                                    <AccordionDetails>
                                        <Typography sx={{ fontFamily: typography.fontFamily }}>
                                            Tu información personal es necesaria para brindarte nuestros servicios de manera efectiva. Usamos tus datos para procesar pedidos,
                                            gestionar tu cuenta y mejorar tu experiencia de compra. Siempre solicitaremos tu consentimiento explícito
                                            antes de usar tus datos para cualquier propósito distinto al estrictamente necesario para nuestros servicios.
                                        </Typography>
                                    </AccordionDetails>
                                </StyledAccordion>

                                <StyledAccordion
                                    expanded={expanded === 'panel2'}
                                    onChange={handleAccordionChange('panel2')}
                                    TransitionProps={{ unmountOnExit: true }}
                                >
                                    <StyledAccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel2-content"
                                        id="panel2-header"
                                    >
                                        <Typography sx={{ fontWeight: 600, fontFamily: typography.fontFamily }}>
                                            ¿Cómo recopilamos tus datos personales?
                                        </Typography>
                                    </StyledAccordionSummary>
                                    <AccordionDetails>
                                        <Typography paragraph sx={{ fontFamily: typography.fontFamily }}>
                                            Recopilamos tus datos a través de varios canales:
                                        </Typography>
                                        <ul>
                                            <li>
                                                <Typography sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                                    Cuando creas una cuenta en nuestro sitio web
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                                    Durante el proceso de compra al realizar un pedido
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                                    Cuando te suscribes a nuestro boletín
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography sx={{ fontFamily: typography.fontFamily }}>
                                                    A través de cookies cuando navegas por nuestro sitio web (sujeto a tu consentimiento)
                                                </Typography>
                                            </li>
                                        </ul>
                                    </AccordionDetails>
                                </StyledAccordion>

                                <StyledAccordion
                                    expanded={expanded === 'panel3'}
                                    onChange={handleAccordionChange('panel3')}
                                    TransitionProps={{ unmountOnExit: true }}
                                >
                                    <StyledAccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                    >
                                        <Typography sx={{ fontWeight: 600, fontFamily: typography.fontFamily }}>
                                            ¿Quién tiene acceso a tus datos?
                                        </Typography>
                                    </StyledAccordionSummary>
                                    <AccordionDetails>
                                        <Typography paragraph sx={{ fontFamily: typography.fontFamily }}>
                                            El acceso a tu información personal está estrictamente limitado a:
                                        </Typography>
                                        <ul>
                                            <li>
                                                <Typography sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                                    Nuestro personal autorizado que necesita acceso para brindarte nuestros servicios
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                                    Proveedores de servicios externos que nos ayudan a ofrecer nuestros servicios (por ejemplo, procesadores de pago, empresas de envío)
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography sx={{ fontFamily: typography.fontFamily }}>
                                                    Autoridades públicas cuando lo exige la ley
                                                </Typography>
                                            </li>
                                        </ul>
                                        <Typography sx={{ mt: 2, fontWeight: 500, fontFamily: typography.fontFamily }}>
                                            Nunca vendemos tus datos personales a terceros con fines de marketing.
                                        </Typography>
                                    </AccordionDetails>
                                </StyledAccordion>

                                <StyledAccordion
                                    expanded={expanded === 'panel4'}
                                    onChange={handleAccordionChange('panel4')}
                                    TransitionProps={{ unmountOnExit: true }}
                                >
                                    <StyledAccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel4-content"
                                        id="panel4-header"
                                    >
                                        <Typography sx={{ fontWeight: 600, fontFamily: typography.fontFamily }}>
                                            ¿Cuáles son tus derechos de protección de datos?
                                        </Typography>
                                    </StyledAccordionSummary>
                                    <AccordionDetails>
                                        <Typography paragraph sx={{ fontFamily: typography.fontFamily }}>
                                            Tienes los siguientes derechos respecto a tus datos personales:
                                        </Typography>
                                        <Box sx={{ pl: 2 }}>
                                            <Typography sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                                <Box component="span" sx={{ fontWeight: 600, color: vistelicaColors.primary }}>Derecho de acceso:</Box> Puedes solicitar una copia de tus datos personales.
                                            </Typography>
                                            <Typography sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                                <Box component="span" sx={{ fontWeight: 600, color: vistelicaColors.primary }}>Derecho de rectificación:</Box> Puedes solicitar la corrección de datos inexactos.
                                            </Typography>
                                            <Typography sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                                <Box component="span" sx={{ fontWeight: 600, color: vistelicaColors.primary }}>Derecho de supresión:</Box> Puedes solicitar la eliminación de tus datos.
                                            </Typography>
                                            <Typography sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                                <Box component="span" sx={{ fontWeight: 600, color: vistelicaColors.primary }}>Derecho de limitación:</Box> Puedes solicitar limitar el uso de tus datos.
                                            </Typography>
                                            <Typography sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                                <Box component="span" sx={{ fontWeight: 600, color: vistelicaColors.primary }}>Derecho de portabilidad:</Box> Puedes solicitar la transferencia de tus datos.
                                            </Typography>
                                            <Typography sx={{ fontFamily: typography.fontFamily }}>
                                                <Box component="span" sx={{ fontWeight: 600, color: vistelicaColors.primary }}>Derecho de oposición:</Box> Puedes oponerte a ciertos usos de tus datos.
                                            </Typography>
                                        </Box>
                                    </AccordionDetails>
                                </StyledAccordion>

                                <StyledAccordion
                                    expanded={expanded === 'panel5'}
                                    onChange={handleAccordionChange('panel5')}
                                    TransitionProps={{ unmountOnExit: true }}
                                >
                                    <StyledAccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel5-content"
                                        id="panel5-header"
                                    >
                                        <Typography sx={{ fontWeight: 600, fontFamily: typography.fontFamily }}>
                                            ¿Cómo protegemos tus datos?
                                        </Typography>
                                    </StyledAccordionSummary>
                                    <AccordionDetails>
                                        <Typography paragraph sx={{ fontFamily: typography.fontFamily }}>
                                            Implementamos fuertes medidas de seguridad para proteger tus datos:
                                        </Typography>
                                        <ul>
                                            <li>
                                                <Typography sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                                    Encriptación avanzada para la transmisión y almacenamiento de datos
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                                    Auditorías de seguridad y evaluaciones de vulnerabilidad regulares
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                                    Controles de acceso estrictos y procedimientos de autenticación
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography sx={{ fontFamily: typography.fontFamily }}>
                                                    Monitoreo continuo de actividades sospechosas
                                                </Typography>
                                            </li>
                                        </ul>
                                        <Typography sx={{ mt: 2, fontStyle: 'italic', fontFamily: typography.fontFamily }}>
                                            Actualizamos constantemente nuestros protocolos de seguridad para adaptarnos a nuevas amenazas y asegurar que tus datos permanezcan protegidos.
                                        </Typography>
                                    </AccordionDetails>
                                </StyledAccordion>
                            </Box>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: `rgba(${theme.palette.mode === 'dark' ? '228, 176, 2, 0.4' : '228, 176, 2, 0.3'})` }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <VerifiedUserIcon sx={{ color: vistelicaColors.primary, fontSize: 28 }} />
                                <SectionTitle variant="h5">
                                    Nuestro Compromiso de Seguridad
                                </SectionTitle>
                            </Box>

                            <Box sx={{
                                p: 3,
                                borderRadius: 2,
                                border: `1px solid ${vistelicaColors.primary}30`,
                                background: theme.palette.mode === 'dark' ? 'rgba(228, 176, 2, 0.05)' : 'rgba(228, 176, 2, 0.03)',
                                mb: 3
                            }}>
                                <Typography paragraph sx={{
                                    fontSize: { xs: '0.95rem', sm: '1rem' },
                                    fontStyle: 'italic',
                                    fontFamily: typography.fontFamily
                                }}>
                                    "En Vistélica, creemos que tu privacidad es un derecho fundamental. Nos comprometemos a mantener los más altos estándares de protección de datos y transparencia en todas nuestras operaciones. Tu confianza es nuestro activo más valioso."
                                </Typography>
                                <Typography align="right" sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                                    color: vistelicaColors.primary,
                                    fontFamily: typography.fontFamily
                                }}>
                                    — El equipo de seguridad de Vistélica
                                </Typography>
                            </Box>
                        </ScrollableContent>

                        <Button
                            variant="contained"
                            sx={{
                                mt: { xs: 1, sm: 2 },
                                py: { xs: 1, sm: 1.2 },
                                fontWeight: 600,
                                fontFamily: typography.fontFamily,
                                backgroundColor: vistelicaColors.primary,
                                boxShadow: 2,
                                '&:hover': {
                                    backgroundColor: vistelicaColors.primaryDark,
                                    boxShadow: 4,
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.3s'
                                }
                            }}
                            onClick={handleGoToHome}
                            aria-label="Volver al inicio"
                        >
                            Volver al inicio
                        </Button>
                    </Card>
                </Fade>
            </Container>
        </AppTheme>
    );
});

DataPrivacySecurity.displayName = 'DataPrivacySecurity';

export default DataPrivacySecurity;