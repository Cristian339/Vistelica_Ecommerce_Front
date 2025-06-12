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
import { vistelicaColors } from '../shared-theme/vistelicaColors';
import { typography } from '../shared-theme/themePrimitives';
import useMediaQuery from '@mui/material/useMediaQuery';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RedeemIcon from '@mui/icons-material/Redeem';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

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

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(228, 176, 2, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(228, 176, 2, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(228, 176, 2, 0.5);
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

const GiftCardPreview = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    height: '180px',
    borderRadius: '16px',
    overflow: 'hidden',
    background: `linear-gradient(135deg, ${vistelicaColors.secondary}, ${vistelicaColors.primary})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    animation: `${glowAnimation} 4s infinite ease-in-out`,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("/gift-card-pattern.svg")',
        opacity: 0.1,
    },
    [theme.breakpoints.up('md')]: {
        height: '200px',
    },
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

const ComingSoonBadge = styled(Chip)(({ theme }) => ({
    position: 'absolute',
    top: 16,
    right: 16,
    fontWeight: 'bold',
    backgroundColor: vistelicaColors.quaternary,
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 2,
}));

const FaqItem = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 'none',
        marginBottom: 0,
        paddingBottom: 0,
    },
}));

// Componente principal
const GiftCard = memo(function GiftCard(props) {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <ColorModeSelect
                sx={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 2,
                }}
            />
            <Container
                direction="column"
                spacing={3}
                justifyContent="center"
                alignItems="center"
            >
                <Card>
                    <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
                        <AnimatedTitle variant="h1">Tarjeta de Regalo</AnimatedTitle>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                            El futuro de las compras con beneficios exclusivos
                        </Typography>
                    </Box>

                    <GiftCardPreview>
                        <ComingSoonBadge label="¡Próximamente!" />
                        <CardGiftcardIcon sx={{ fontSize: 60, color: '#fff' }} />
                        <Typography
                            variant="h4"
                            sx={{
                                color: '#fff',
                                fontWeight: 'bold',
                                position: 'absolute',
                                bottom: 20,
                                left: 20
                            }}
                        >
                            Vistelica Gift Card
                        </Typography>
                    </GiftCardPreview>

                    <Alert
                        severity="info"
                        variant="outlined"
                        sx={{ mb: 4 }}
                    >
                        <Typography variant="body1">
                            <strong>¡Grandes novedades en camino!</strong> Nuestra tarjeta de regalo estará disponible a partir de junio de 2026.
                        </Typography>
                    </Alert>

                    <Typography variant="body1" paragraph>
                        En Vistelica estamos trabajando para ofrecerte la mejor experiencia de compra. Como parte de nuestro compromiso con los clientes fieles, estamos desarrollando un exclusivo programa de tarjetas de regalo que revolucionará tu forma de comprar.
                    </Typography>

                    <SectionTitle variant="h2">
                        Beneficios Exclusivos
                    </SectionTitle>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <BenefitCard>
                                <IconWrapper>
                                    <LocalOfferIcon fontSize="medium" />
                                </IconWrapper>
                                <Typography variant="h6" gutterBottom>
                                    Descuentos Adicionales
                                </Typography>
                                <Typography variant="body2">
                                    Obtén hasta un 15% de descuento adicional en tus compras favoritas, acumulable con otras promociones.
                                </Typography>
                            </BenefitCard>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <BenefitCard>
                                <IconWrapper>
                                    <RedeemIcon fontSize="medium" />
                                </IconWrapper>
                                <Typography variant="h6" gutterBottom>
                                    Regalos Sorpresa
                                </Typography>
                                <Typography variant="body2">
                                    Recibe productos exclusivos y obsequios especiales por tu cumpleaños y fechas señaladas.
                                </Typography>
                            </BenefitCard>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <BenefitCard>
                                <IconWrapper>
                                    <CelebrationIcon fontSize="medium" />
                                </IconWrapper>
                                <Typography variant="h6" gutterBottom>
                                    Eventos Exclusivos
                                </Typography>
                                <Typography variant="body2">
                                    Accede antes que nadie a lanzamientos y eventos especiales para miembros de nuestro programa.
                                </Typography>
                            </BenefitCard>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <BenefitCard>
                                <IconWrapper>
                                    <LoyaltyIcon fontSize="medium" />
                                </IconWrapper>
                                <Typography variant="h6" gutterBottom>
                                    Puntos Acumulables
                                </Typography>
                                <Typography variant="body2">
                                    Por cada compra acumula puntos que podrás canjear por descuentos o productos seleccionados.
                                </Typography>
                            </BenefitCard>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <BenefitCard>
                                <IconWrapper>
                                    <EventAvailableIcon fontSize="medium" />
                                </IconWrapper>
                                <Typography variant="h6" gutterBottom>
                                    Acceso Anticipado
                                </Typography>
                                <Typography variant="body2">
                                    Disfruta de acceso anticipado a nuestras rebajas y promociones especiales antes que el público general.
                                </Typography>
                            </BenefitCard>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <BenefitCard>
                                <IconWrapper>
                                    <CardGiftcardIcon fontSize="medium" />
                                </IconWrapper>
                                <Typography variant="h6" gutterBottom>
                                    Tarjetas Personalizables
                                </Typography>
                                <Typography variant="body2">
                                    Diseña tu propia tarjeta con imágenes personalizadas y mensajes especiales.
                                </Typography>
                            </BenefitCard>
                        </Grid>
                    </Grid>

                    <SectionTitle variant="h2">
                        ¿Cómo conseguir tu tarjeta?
                    </SectionTitle>

                    <Typography variant="body1" paragraph>
                        Las tarjetas estarán disponibles para todos nuestros clientes que cumplan al menos un año de fidelidad con Vistelica. El sistema registrará automáticamente tu antigüedad desde tu primera compra, y cuando estés habilitado, recibirás una notificación para activar tu tarjeta de regalo.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Además, ofreceremos niveles según tu historial de compras y antigüedad:
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, border: `1px solid ${vistelicaColors.primary}`, borderRadius: '8px', textAlign: 'center' }}>
                                <Typography variant="h6" color="primary" gutterBottom>Nivel Plata</Typography>
                                <Typography variant="body2">Para clientes con 1 año de antigüedad</Typography>
                                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>10% de descuento</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, border: `1px solid ${vistelicaColors.quaternary}`, borderRadius: '8px', textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ color: vistelicaColors.quaternary }} gutterBottom>Nivel Oro</Typography>
                                <Typography variant="body2">Para clientes con 2 años de antigüedad</Typography>
                                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>15% de descuento</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, border: `1px solid ${vistelicaColors.secondary}`, borderRadius: '8px', textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ color: vistelicaColors.secondary }} gutterBottom>Nivel Diamante</Typography>
                                <Typography variant="body2">Para nuestros clientes VIP más fieles</Typography>
                                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>20% de descuento + beneficios exclusivos</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <SectionTitle variant="h2">
                        Preguntas Frecuentes
                    </SectionTitle>

                    <Box sx={{ mb: 4 }}>
                        <FaqItem>
                            <Typography variant="h6" gutterBottom>¿Cuándo estará disponible la tarjeta de regalo?</Typography>
                            <Typography variant="body2">
                                Nuestro programa de tarjetas de regalo estará disponible a partir de junio de 2026. Estamos trabajando para ofrecerte la mejor experiencia posible.
                            </Typography>
                        </FaqItem>

                        <FaqItem>
                            <Typography variant="h6" gutterBottom>¿Cómo sabré si soy elegible?</Typography>
                            <Typography variant="body2">
                                Todos los clientes que hayan realizado al menos una compra un año antes del lanzamiento serán elegibles automáticamente. Recibirás una notificación por correo electrónico cuando tu tarjeta esté disponible.
                            </Typography>
                        </FaqItem>

                        <FaqItem>
                            <Typography variant="h6" gutterBottom>¿Los beneficios son acumulables con otras promociones?</Typography>
                            <Typography variant="body2">
                                Sí, la mayoría de los beneficios serán acumulables con otras promociones vigentes, aunque pueden aplicarse algunas excepciones en eventos especiales o rebajas extraordinarias.
                            </Typography>
                        </FaqItem>

                        <FaqItem>
                            <Typography variant="h6" gutterBottom>¿Puedo regalar mi tarjeta a otra persona?</Typography>
                            <Typography variant="body2">
                                Las tarjetas son personales e intransferibles, ya que están vinculadas a tu historial de compras. Sin embargo, estamos trabajando en una opción para regalar tarjetas a tus seres queridos con beneficios especiales.
                            </Typography>
                        </FaqItem>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="body1" gutterBottom>
                            ¿Quieres ser de los primeros en conseguir nuestra tarjeta de regalo?
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 2,
                                backgroundColor: vistelicaColors.primary,
                                '&:hover': {
                                    backgroundColor: vistelicaColors.primaryDark,
                                }
                            }}
                            startIcon={<NotificationsActiveIcon />}
                        >
                            Recibir notificación
                        </Button>
                    </Box>
                </Card>
            </Container>
        </AppTheme>
    );
});

GiftCard.displayName = 'GiftCard';

export default GiftCard;