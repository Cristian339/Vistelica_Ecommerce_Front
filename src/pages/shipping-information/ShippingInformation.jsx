"use client";
import * as React from 'react';
import { memo } from 'react';
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
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { vistelicaColors } from '../shared-theme/vistelicaColors';
import { typography } from '../shared-theme/themePrimitives';
import useMediaQuery from '@mui/material/useMediaQuery';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Alert from '@mui/material/Alert';

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

const ShippingOptionCard = styled(Box)(({ theme }) => ({
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

const EstimatedTime = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
}));

const ShippingCost = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontWeight: 600,
    color: vistelicaColors.secondary,
}));

const FreeBadge = styled(Box)(({ theme }) => ({
    background: vistelicaColors.primary,
    color: '#fff',
    padding: theme.spacing(0.5, 1.5),
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
}));

const ExpandNotice = styled(Alert)(({ theme }) => ({
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(237, 108, 2, 0.1)' : '#FFF4E5',
    color: theme.palette.mode === 'dark' ? '#FFB74D' : '#663C00',
    '& .MuiAlert-icon': {
        color: theme.palette.mode === 'dark' ? '#FFB74D' : '#663C00',
    },
}));

// Componente principal
const ShippingInformation = memo(function ShippingInformation(props) {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                        <IconWrapper sx={{ mx: 'auto', mb: 3, width: 70, height: 70 }}>
                            <LocalShippingIcon fontSize="large" />
                        </IconWrapper>
                        <AnimatedTitle variant="h1" aria-label="Shipping Information">
                            Información de Envío
                        </AnimatedTitle>
                        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary', maxWidth: '650px', mx: 'auto' }}>
                            En Vistelica, queremos que disfrutes de tu compra lo antes posible. Ofrecemos varias opciones de envío para adaptarnos a tus preferencias y necesidades. A continuación, te explicamos los métodos disponibles, los tiempos de entrega estimados y los costes aplicables.
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <SectionTitle variant="h2">
                        Opciones de Envío Disponibles
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <ShippingOptionCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <HomeIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Envío a Domicilio (Península)
                                </Typography>
                                <EstimatedTime>
                                    <AccessTimeIcon fontSize="small" />
                                    <Typography variant="body2">
                                        Tiempo estimado de entrega: 24-72 horas laborables
                                    </Typography>
                                </EstimatedTime>
                                <ShippingCost>
                                    <Typography variant="body1">
                                        Coste: 3,95&nbsp;€
                                    </Typography>
                                </ShippingCost>
                                <FreeBadge>
                                    GRATIS para pedidos superiores a 40&nbsp;€
                                </FreeBadge>
                            </ShippingOptionCard>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <ShippingOptionCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <LocationOnIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Punto de Recogida (Península)
                                </Typography>
                                <EstimatedTime>
                                    <AccessTimeIcon fontSize="small" />
                                    <Typography variant="body2">
                                        Tiempo estimado de entrega: 24-72 horas laborables
                                    </Typography>
                                </EstimatedTime>
                                <ShippingCost>
                                    <Typography variant="body1">
                                        Coste: 2,95&nbsp;€
                                    </Typography>
                                </ShippingCost>
                                <FreeBadge>
                                    GRATIS para pedidos superiores a 40&nbsp;€
                                </FreeBadge>
                            </ShippingOptionCard>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <ShippingOptionCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <PublicIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Islas Baleares
                                </Typography>
                                <EstimatedTime>
                                    <AccessTimeIcon fontSize="small" />
                                    <Typography variant="body2">
                                        Tiempo estimado de entrega: 2-7 días laborables
                                    </Typography>
                                </EstimatedTime>
                                <ShippingCost>
                                    <Typography variant="body1">
                                        Coste: 5,95&nbsp;€
                                    </Typography>
                                </ShippingCost>
                            </ShippingOptionCard>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <ShippingOptionCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <PublicIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Islas Canarias
                                </Typography>
                                <EstimatedTime>
                                    <AccessTimeIcon fontSize="small" />
                                    <Typography variant="body2">
                                        Tiempo estimado de entrega: 2-10 días laborables
                                    </Typography>
                                </EstimatedTime>
                                <ShippingCost>
                                    <Typography variant="body1">
                                        Coste: 9,95&nbsp;€
                                    </Typography>
                                </ShippingCost>
                            </ShippingOptionCard>
                        </Grid>
                    </Grid>

                    <ExpandNotice severity="info" icon={<NotificationsActiveIcon />}>
                        ¡Pronto ampliaremos nuestros servicios de envío a más países europeos! ¡Estate atento a las novedades!
                    </ExpandNotice>

                    <Divider sx={{ my: 3 }} />

                    <SectionTitle variant="h2">
                        Información sobre los Tiempos de Entrega
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <ShippingOptionCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <ScheduleIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Inicio del Plazo de Entrega
                                </Typography>
                                <Typography variant="body2">
                                    Los plazos de entrega comienzan a contar a partir de las 24 horas laborables posteriores a la confirmación del pedido.
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                    Los sábados, domingos y festivos no se consideran días laborables.
                                </Typography>
                            </ShippingOptionCard>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <ShippingOptionCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <ErrorOutlineIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Retrasos Excepcionales
                                </Typography>
                                <Typography variant="body2">
                                    Durante campañas especiales, rebajas o promociones, los plazos de entrega pueden verse ligeramente afectados debido al alto volumen de pedidos.
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                    Los retrasos también pueden deberse a condiciones meteorológicas, zonas rurales o fuerza mayor.
                                </Typography>
                            </ShippingOptionCard>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <ShippingOptionCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <SupportAgentIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    ¿Problemas con tu pedido?
                                </Typography>
                                <Typography variant="body2">
                                    Si no has recibido tu paquete tras el periodo indicado, por favor contacta con nuestro Departamento de Atención al Cliente.
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                    Estaremos encantados de ayudarte a resolver cualquier incidencia.
                                </Typography>
                            </ShippingOptionCard>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <SectionTitle variant="h2">
                        Información Adicional
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <ShippingOptionCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <CardTravelIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Pedidos con Varios Paquetes
                                </Typography>
                                <Typography variant="body2">
                                    En ocasiones, tu pedido puede ser enviado desde diferentes centros logísticos. Si esto ocurre, te avisaremos por correo electrónico para informarte de qué artículos recibirás en cada envío y su correspondiente número de seguimiento.
                                </Typography>
                            </ShippingOptionCard>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <ShippingOptionCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <WarehouseIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Zonas de Entrega
                                </Typography>
                                <Typography variant="body2">
                                    Actualmente, los artículos ofrecidos en nuestra tienda online solo están disponibles para entrega dentro del territorio español (Península, Islas Baleares e Islas Canarias).
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                                    Consideramos la Península y las Islas Canarias como mercados diferenciados a efectos logísticos.
                                </Typography>
                            </ShippingOptionCard>
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </AppTheme>
    );
});

ShippingInformation.displayName = 'ShippingInformation';

export default ShippingInformation;