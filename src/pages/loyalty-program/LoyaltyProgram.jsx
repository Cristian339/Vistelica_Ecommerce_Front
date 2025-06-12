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
import StarIcon from '@mui/icons-material/Star';
import RedeemIcon from '@mui/icons-material/Redeem';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CelebrationIcon from '@mui/icons-material/Celebration';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
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

const LevelCard = styled(Box)(({ theme, active }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2.5),
    borderRadius: '12px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    background: active ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${vistelicaColors.primaryLight}15)` : theme.palette.background.paper,
    boxShadow: active ? `0 8px 20px rgba(228, 176, 2, 0.2)` : '0 4px 12px rgba(0, 0, 0, 0.05)',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid',
    borderColor: active ? vistelicaColors.primary : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: active ? `0 12px 28px rgba(228, 176, 2, 0.25)` : `0 8px 20px rgba(0, 0, 0, 0.1)`,
    },
    ...theme.applyStyles('dark', {
        boxShadow: active ? `0 8px 24px rgba(228, 176, 2, 0.25)` : '0 4px 16px rgba(0, 0, 0, 0.2)',
        background: active ? `linear-gradient(145deg, ${theme.palette.background.paper}, rgba(228, 176, 2, 0.1))` : theme.palette.background.paper,
    }),
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

const ProgressSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '12px',
    background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    '& .MuiLinearProgress-bar': {
        backgroundColor: vistelicaColors.primary,
        borderRadius: 6,
    },
}));

// Componente principal
const LoyaltyProgram = memo(function LoyaltyProgram(props) {
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
                        <LargeIconWrapper sx={{ mx: 'auto' }}>
                            <StarIcon fontSize="large" />
                        </LargeIconWrapper>
                        <AnimatedTitle variant="h1" aria-label="Programa de Puntos">
                            Programa de Puntos
                        </AnimatedTitle>
                        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary', maxWidth: '650px', mx: 'auto' }}>
                            En Vistelica estamos preparando un programa de fidelización exclusivo que premiará tu confianza en nosotros. Próximamente, podrás acumular puntos con cada compra y canjearlos por descuentos, productos y experiencias únicas.
                        </Typography>
                    </Box>

                    <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="subtitle2">
                            ¡Programa en desarrollo! Estamos trabajando para ofrecerte el mejor sistema de puntos. Lanzamiento previsto para 2025.
                        </Typography>
                    </Alert>

                    <Divider sx={{ my: 2 }} />

                    <SectionTitle variant="h2">
                        ¿Cómo funcionará nuestro Programa de Puntos?
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <BenefitCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <ShoppingCartIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Acumula Puntos
                                </Typography>
                                <Typography variant="body2">
                                    Por cada euro gastado en nuestra tienda online, ganarás puntos que se acumularán automáticamente en tu cuenta.
                                </Typography>
                            </BenefitCard>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <BenefitCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <RedeemIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Canjea por Recompensas
                                </Typography>
                                <Typography variant="body2">
                                    Utiliza tus puntos acumulados para obtener descuentos en futuras compras, productos exclusivos o servicios premium.
                                </Typography>
                            </BenefitCard>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <BenefitCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <WorkspacePremiumIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Sube de Nivel
                                </Typography>
                                <Typography variant="body2">
                                    Cuanto más compres, más subirás en nuestro sistema de niveles, desbloqueando beneficios aún mayores y exclusivos para clientes fieles.
                                </Typography>
                            </BenefitCard>
                        </Grid>
                    </Grid>

                    <ProgressSection>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Simulación de Progreso
                        </Typography>
                        <StyledLinearProgress variant="determinate" value={0} sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">0 puntos</Typography>
                            <Typography variant="body2" color="text.secondary">Próximamente</Typography>
                        </Box>
                    </ProgressSection>

                    <Divider sx={{ my: 3 }} />

                    <SectionTitle variant="h2">
                        Niveles de Fidelización
                    </SectionTitle>

                    <Typography variant="body1" paragraph>
                        Nuestro programa contará con diferentes niveles que te permitirán acceder a beneficios exclusivos según tu fidelidad:
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <LevelCard active={true} component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <LocalActivityIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Nivel Plata
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    El nivel inicial para todos nuestros clientes registrados.
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    • 1 punto por cada euro gastado
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    • Ofertas exclusivas
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    • Notificaciones de lanzamientos
                                </Typography>
                            </LevelCard>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <LevelCard component={motion.div} whileHover={{ y: -5 }}>
                                <ComingSoonBadge label="Próximamente" />
                                <IconWrapper>
                                    <EmojiEventsIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Nivel Oro
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    Para clientes con compras superiores a 500€ anuales.
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    • 1.5 puntos por cada euro gastado
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    • Descuentos exclusivos
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    • Envío gratis sin mínimo de compra
                                </Typography>
                            </LevelCard>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <LevelCard component={motion.div} whileHover={{ y: -5 }}>
                                <ComingSoonBadge label="Próximamente" />
                                <IconWrapper>
                                    <StarIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Nivel Platino
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    Para nuestros clientes más fieles, con compras superiores a 1.000€ anuales.
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    • 2 puntos por cada euro gastado
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    • Acceso a colecciones anticipadas
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    • Servicio de atención prioritaria
                                </Typography>
                            </LevelCard>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <SectionTitle variant="h2">
                        ¿Qué podrás obtener con tus puntos?
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <BenefitCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <CardGiftcardIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Descuentos Directos
                                </Typography>
                                <Typography variant="body2">
                                    Canjea tus puntos por descuentos inmediatos en tus compras. Cuantos más puntos, mayor será el descuento aplicado. Una forma perfecta de ahorrar en tus productos favoritos.
                                </Typography>
                            </BenefitCard>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <BenefitCard component={motion.div} whileHover={{ y: -5 }}>
                                <IconWrapper>
                                    <CelebrationIcon />
                                </IconWrapper>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Productos Exclusivos
                                </Typography>
                                <Typography variant="body2">
                                    Accede a productos exclusivos que solo estarán disponibles para miembros de nuestro programa de fidelización, con diseños únicos y ediciones limitadas.
                                </Typography>
                            </BenefitCard>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ p: 3, borderRadius: '12px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(228, 176, 2, 0.1)' : 'rgba(228, 176, 2, 0.05)', border: `1px solid ${vistelicaColors.primary}` }}>
                                <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
                                    ¡Estate atento a nuestras novedades! Estamos trabajando para lanzar nuestro programa de puntos con muchas más sorpresas y beneficios que mejorarán tu experiencia de compra.
                                </Typography>
                                <Typography variant="body1">
                                    Los clientes registrados en nuestra web antes del lanzamiento del programa recibirán puntos de bienvenida como agradecimiento por su confianza.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <PriorityHighIcon color="primary" fontSize="large" sx={{ mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            Este programa está en desarrollo. Las condiciones definitivas, niveles y beneficios podrían variar respecto a lo anunciado. Suscríbete a nuestra newsletter para ser el primero en conocer su lanzamiento oficial.
                        </Typography>
                    </Box>
                </Card>
            </Container>
        </AppTheme>
    );
});

LoyaltyProgram.displayName = 'LoyaltyProgram';

export default LoyaltyProgram;