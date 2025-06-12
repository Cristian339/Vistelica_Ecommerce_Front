"use client";
import * as React from 'react';
import { memo, useState } from 'react';
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
import PercentIcon from '@mui/icons-material/Percent';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TimelineIcon from '@mui/icons-material/Timeline';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

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

const floatAnimation = keyframes`
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
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
                'radial-gradient(ellipse at 50% 50%, rgba(35, 42, 46, 0.8), rgba(20, 24, 28, 1))',
        }),
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

const PromoCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    borderRadius: '12px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    background: theme.palette.background.paper,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
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

const PromoHighlight = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '10px 20px',
    background: vistelicaColors.primary,
    color: '#fff',
    fontWeight: 'bold',
    transform: 'rotate(45deg) translate(20%, -50%)',
    transformOrigin: 'top right',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 1,
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

const FloatingIconBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: `${floatAnimation} 3s ease-in-out infinite`,
    marginBottom: theme.spacing(2),
}));

const DiscountChip = styled(Chip)(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '1.1rem',
    padding: '20px 10px',
    height: 'auto',
    backgroundColor: vistelicaColors.primary,
    color: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        backgroundColor: vistelicaColors.primaryDark,
    },
    ...theme.applyStyles('dark', {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    }),
}));

// Componente principal
const PromotionalTerms = memo(function PromotionalTerms(props) {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleGoToHome = () => {
        router.push('/');
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <ColorModeSelect
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 2,
                }}
            />
            <Container
                direction="column"
                justifyContent="space-between"
                component="main"
                role="main"
                aria-labelledby="promo-title"
            >
                <Fade in={true} timeout={800}>
                    <Card variant="outlined">
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 0.5, sm: 1 } }}>
                            <AnimatedTitle variant="h1" id="promo-title">Términos Promocionales</AnimatedTitle>
                        </Box>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography
                                component="h2"
                                variant="h5"
                                sx={{
                                    fontFamily: typography.h3.fontFamily,
                                    fontWeight: 600,
                                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                    color: theme.palette.mode === 'dark' ? '#fff' : '#333',
                                    mb: 1
                                }}
                            >
                                VENTA DE TEMPORADA
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    mb: { xs: 2, sm: 3 },
                                    fontStyle: 'italic',
                                    fontSize: { xs: '0.85rem', sm: '1rem' },
                                    fontFamily: typography.fontFamily,
                                    color: theme.palette.text.secondary
                                }}
                                role="doc-subtitle"
                            >
                                Descuentos especiales y opciones de pago
                            </Typography>
                        </Box>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={6}>
                                <PromoCard>
                                    <PromoHighlight>AHORRA</PromoHighlight>
                                    <FloatingIconBox>
                                        <PercentIcon sx={{ color: vistelicaColors.primary, fontSize: 50 }} />
                                    </FloatingIconBox>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
                                        DESCUENTOS DE TEMPORADA
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 3 }}>
                                        <DiscountChip label="25% DTO." />
                                        <DiscountChip label="50% DTO." />
                                    </Box>
                                    <Typography paragraph>
                                        La promoción VENTA DE TEMPORADA es válida online desde el 1 de octubre de 2024 y en tiendas físicas hasta el 31 de diciembre de 2024.
                                    </Typography>
                                    <Typography paragraph>
                                        La promoción incluye descuentos del 25% al 50% en una amplia selección de artículos.
                                    </Typography>
                                    <Typography paragraph sx={{ fontStyle: 'italic', fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                                        *Quedan excluidos de esta promoción los artículos exclusivos y la nueva colección.
                                    </Typography>
                                </PromoCard>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <PromoCard>
                                    <FloatingIconBox>
                                        <PaymentIcon sx={{ color: vistelicaColors.primary, fontSize: 50 }} />
                                    </FloatingIconBox>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
                                        FRACCIONA TU PAGO
                                    </Typography>
                                    <Typography paragraph>
                                        Con seQura, puedes fraccionar tu compra en 3 cuotas mensuales sin costes ni intereses adicionales.
                                    </Typography>
                                    <Typography paragraph fontWeight="medium">
                                        ¿Cómo funciona?
                                    </Typography>
                                    <Typography component="ul" sx={{ pl: 2 }}>
                                        <li>Selecciona "Paga en 3 con seQura" al finalizar tu compra</li>
                                        <li>Completa un breve formulario de solo cinco campos</li>
                                        <li>Obtén aprobación instantánea sin papeleo</li>
                                        <li>Paga solo la primera cuota en el momento de la compra</li>
                                    </Typography>
                                    <Typography paragraph sx={{ mt: 2 }}>
                                        Para plazos más largos, también puedes elegir pagar en 6, 9 o 12 meses, con intereses aplicables según el periodo seleccionado.
                                    </Typography>
                                </PromoCard>
                            </Grid>
                        </Grid>

                        <Box sx={{ mb: 4 }}>
                            <SectionTitle variant="h5" gutterBottom sx={{ mb: 2 }}>
                                Términos y Condiciones Adicionales
                            </SectionTitle>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                <LocalOfferIcon sx={{ color: vistelicaColors.primary, mr: 1.5, mt: 0.3 }} />
                                <Typography paragraph>
                                    La promoción SUIT PACK y otras promociones en curso no son acumulables con estos descuentos.
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                <ShoppingBagIcon sx={{ color: vistelicaColors.primary, mr: 1.5, mt: 0.3 }} />
                                <Typography paragraph>
                                    Los centros outlet y los corners de El Corte Inglés pueden tener estructuras de descuento diferentes.
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                <EventIcon sx={{ color: vistelicaColors.primary, mr: 1.5, mt: 0.3 }} />
                                <Typography paragraph>
                                    Las fechas promocionales están sujetas a cambios. Consulta nuestra web o visita nuestras tiendas para la información más actualizada.
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                <TimelineIcon sx={{ color: vistelicaColors.primary, mr: 1.5, mt: 0.3 }} />
                                <Typography paragraph>
                                    Promoción válida hasta agotar existencias. La empresa se reserva el derecho de modificar o cancelar estas promociones en cualquier momento.
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: `rgba(${theme.palette.mode === 'dark' ? '228, 176, 2, 0.4' : '228, 176, 2, 0.3'})` }} />

                        <Box sx={{
                            p: 3,
                            borderRadius: 2,
                            border: `1px solid ${vistelicaColors.primary}30`,
                            background: theme.palette.mode === 'dark' ? 'rgba(228, 176, 2, 0.05)' : 'rgba(228, 176, 2, 0.03)',
                            mb: 3
                        }}>
                            <Typography paragraph sx={{
                                fontFamily: typography.fontFamily,
                                fontStyle: 'italic',
                                fontSize: '0.95rem',
                                color: theme.palette.text.secondary
                            }}>
                                "Nuestro compromiso es ofrecer el mejor valor a nuestros clientes. Nuestras promociones de temporada están diseñadas para brindar productos de calidad a precios excepcionales."
                            </Typography>
                            <Typography align="right" sx={{
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: vistelicaColors.primary
                            }}>
                                — Equipo Vistelica
                            </Typography>
                        </Box>

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
                            aria-label="Volver a la página principal"
                        >
                            Volver a la tienda
                        </Button>
                    </Card>
                </Fade>
            </Container>
        </AppTheme>
    );
});

PromotionalTerms.displayName = 'PromotionalTerms';

export default PromotionalTerms;