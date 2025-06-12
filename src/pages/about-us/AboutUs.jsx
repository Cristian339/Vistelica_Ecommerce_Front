import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled, keyframes, useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { useRouter } from 'next/navigation';
import Fade from '@mui/material/Fade';
import GroupsIcon from '@mui/icons-material/Groups';
import { vistelicaColors } from '../shared-theme/vistelicaColors';
import { typography } from '../shared-theme/themePrimitives';

// Animación para el logo
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

const AnimatedLogo = styled(Typography)(({ theme }) => ({
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

const AboutContainer = styled(Stack)(({ theme }) => ({
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
    maxHeight: '50vh',
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

const TeamMemberCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: '12px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    background: theme.palette.background.paper,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 8px 20px rgba(${theme.palette.mode === 'dark' ? '228, 176, 2, 0.25' : '228, 176, 2, 0.15'})`,
    },
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    ...theme.applyStyles('dark', {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        '&:hover': {
            boxShadow: '0 8px 24px rgba(228, 176, 2, 0.25)',
        },
    }),
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
    width: 100,
    height: 100,
    marginBottom: theme.spacing(1.5),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: `3px solid ${vistelicaColors.primary}`,
    [theme.breakpoints.up('sm')]: {
        width: 120,
        height: 120,
        marginBottom: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
        width: 150,
        height: 150,
        border: `4px solid ${vistelicaColors.primary}`,
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    position: 'relative',
    paddingLeft: theme.spacing(1.5),
    fontSize: '1.15rem',
    fontFamily: typography.h5.fontFamily,
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

const AnimatedGrid = styled(Grid)(({ index }) => ({
    animation: `${fadeInUp} 0.6s ease-out forwards`,
    animationDelay: `${index * 0.2}s`,
    opacity: 0,
}));

export default function AboutUs(props) {
    const router = useRouter();
    const theme = useTheme();

    const handleGoToLogin = () => {
        router.push('/sign-in-side/Sign-in-side');
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <ColorModeSelect sx={{
                position: 'fixed',
                top: { xs: '0.5rem', sm: '1rem' },
                right: { xs: '0.5rem', sm: '1rem' },
                zIndex: 10
            }} />
            <AboutContainer direction="column" justifyContent="space-between">
                <Fade in={true} timeout={800}>
                    <Card variant="outlined">
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 0.5, sm: 1 } }}>
                            <AnimatedLogo variant="h1">Vistélica</AnimatedLogo>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 0.5, sm: 1 } }}>
                            <GroupsIcon sx={{ color: vistelicaColors.primary, fontSize: { xs: 24, sm: 28 } }} />
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
                                Sobre Nosotros
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
                        >
                            Conozca al equipo de desarrolladores detrás de Vistélica
                        </Typography>

                        <ScrollableContent>
                            <SectionTitle variant="h5" gutterBottom>
                                ¿En qué consiste Vistélica?
                            </SectionTitle>
                            <Typography paragraph sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' }, mb: { xs: 1, sm: 2 }, fontWeight: 500, color: vistelicaColors.primary, fontFamily: typography.fontFamily }}>
                                Vistélica es una plataforma e-commerce premium diseñada para el sector de la moda, que combina una experiencia de usuario cautivadora con un sistema robusto, seguro y escalable. Nuestra solución integral potencia negocios digitales, aumenta ventas y fortalece la identidad de marca en el competitivo mercado actual.
                            </Typography>
                            <Typography paragraph sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, mb: { xs: 1, sm: 2 }, fontFamily: typography.fontFamily }}>
                                Destacamos por un diseño exclusivo y personalizable, navegación intuitiva, experiencia móvil perfecta, proceso de compra optimizado, infraestructura de alto rendimiento y seguridad avanzada. Vistélica no es solo una tienda online, es un socio estratégico para el crecimiento digital de tu marca de moda.
                            </Typography>
                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: `rgba(${theme.palette.mode === 'dark' ? '228, 176, 2, 0.4' : '228, 176, 2, 0.3'})` }} />
                            <SectionTitle variant="h5" gutterBottom>
                                Tecnologías Utilizadas
                            </SectionTitle>
                            <Typography paragraph sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, mb: { xs: 1, sm: 2 }, fontFamily: typography.fontFamily }}>
                                Vistélica está construida con tecnologías modernas y escalables, garantizando rendimiento, seguridad y facilidad de integración:
                            </Typography>
                            <Box sx={{ pl: { xs: 1, sm: 2 }, mb: 2 }}>
                                <Typography sx={{ fontWeight: 600, color: vistelicaColors.primary, mb: 0.5 }}>Frontend:</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                    <Box component="span" sx={{ bgcolor: vistelicaColors.primary, color: vistelicaColors.secondary, px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.95rem', fontWeight: 500 }}>React.js</Box>
                                    <Box component="span" sx={{ bgcolor: vistelicaColors.quaternary, color: vistelicaColors.secondary, px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.95rem', fontWeight: 500 }}>Next.js</Box>
                                    <Box component="span" sx={{ bgcolor: vistelicaColors.tertiary, color: vistelicaColors.secondary, px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.95rem', fontWeight: 500 }}>Material UI</Box>
                                    <Box component="span" sx={{ bgcolor: vistelicaColors.quaternary, color: vistelicaColors.secondary, px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.95rem', fontWeight: 500 }}>JavaScript</Box>
                                    <Box component="span" sx={{ bgcolor: vistelicaColors.primaryDark, color: vistelicaColors.secondary, px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.95rem', fontWeight: 500 }}>Cloudinary</Box>
                                </Box>
                                <Typography sx={{ fontWeight: 600, color: vistelicaColors.primary, mb: 0.5 }}>Backend:</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                    <Box component="span" sx={{ bgcolor: vistelicaColors.primary, color: vistelicaColors.secondary, px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.95rem', fontWeight: 500 }}>Node.js</Box>
                                    <Box component="span" sx={{ bgcolor: vistelicaColors.quaternary, color: vistelicaColors.secondary, px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.95rem', fontWeight: 500 }}>Next.js</Box>
                                    <Box component="span" sx={{ bgcolor: vistelicaColors.tertiary, color: vistelicaColors.secondary, px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.95rem', fontWeight: 500 }}>TypeORM</Box>
                                    <Box component="span" sx={{ bgcolor: vistelicaColors.quaternary, color: vistelicaColors.secondary, px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.95rem', fontWeight: 500 }}>TypeScript</Box>
                                    <Box component="span" sx={{ bgcolor: vistelicaColors.primaryDark, color: vistelicaColors.secondary, px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.95rem', fontWeight: 500 }}>Stripe</Box>
                                </Box>
                                <Typography sx={{ fontWeight: 600, color: vistelicaColors.primary, mb: 0.5 }}>Base de datos:</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    <Box component="span" sx={{ bgcolor: vistelicaColors.primary, color: vistelicaColors.secondary, px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.95rem', fontWeight: 500 }}>PostgreSQL</Box>
                                </Box>
                            </Box>
                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: `rgba(${theme.palette.mode === 'dark' ? '228, 176, 2, 0.4' : '228, 176, 2, 0.3'})` }} />
                            <SectionTitle variant="h5" gutterBottom>
                                Ventajas Competitivas
                            </SectionTitle>
                            <Typography paragraph sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, mb: { xs: 1, sm: 2 }, fontFamily: typography.fontFamily }}>
                                • Lanzamiento rápido y costes optimizados.<br />
                                • Infraestructura escalable y de alta disponibilidad.<br />
                                • Seguridad avanzada y cumplimiento normativo.<br />
                                • Panel de administración intuitivo y personalizable.<br />
                                • Análisis avanzado y soporte especializado.<br />
                                • Actualizaciones continuas y plataforma evolutiva.
                            </Typography>
                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: `rgba(${theme.palette.mode === 'dark' ? '228, 176, 2, 0.4' : '228, 176, 2, 0.3'})` }} />

                            <SectionTitle variant="h5" gutterBottom>
                                Nuestro Proyecto
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    mb: { xs: 1, sm: 2 },
                                    fontFamily: typography.fontFamily
                                }}
                            >
                                Vistélica nació como proyecto final de nuestro grado superior en Desarrollo de Aplicaciones Multiplataforma.
                                Nuestra visión fue crear una plataforma de e-commerce moderna y accesible que revolucionara la forma en
                                que las familias compran ropa.
                            </Typography>
                            <Typography
                                paragraph
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    mb: { xs: 1, sm: 2 },
                                    fontFamily: typography.fontFamily
                                }}
                            >
                                Combinando nuestras habilidades en desarrollo web, diseño de interfaces y programación backend,
                                hemos construido una solución tecnológica completa que ofrece una experiencia de usuario fluida
                                y adaptada a las necesidades de cada cliente.
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: `rgba(${theme.palette.mode === 'dark' ? '228, 176, 2, 0.4' : '228, 176, 2, 0.3'})` }} />

                            <SectionTitle variant="h5" gutterBottom>
                                Tecnologías Utilizadas
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    mb: { xs: 1, sm: 2 },
                                    fontFamily: typography.fontFamily
                                }}
                            >
                                Para el desarrollo de Vistélica, hemos implementado un stack tecnológico moderno y escalable:
                            </Typography>
                            <Box sx={{ pl: { xs: 1, sm: 2 } }}>
                                <ul>
                                    <li>
                                        <Typography sx={{
                                            mb: 1,
                                            fontSize: { xs: '0.9rem', sm: '1rem' },
                                            fontFamily: typography.fontFamily
                                        }}>
                                            <Box component="span" sx={{ fontWeight: 600, color: vistelicaColors.primary }}>Frontend:</Box> React, Next.js, Material UI y herramientas avanzadas de diseño responsivo.
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography sx={{
                                            mb: 1,
                                            fontSize: { xs: '0.9rem', sm: '1rem' },
                                            fontFamily: typography.fontFamily
                                        }}>
                                            <Box component="span" sx={{ fontWeight: 600, color: vistelicaColors.primary }}>Backend:</Box> Node.js con Express, gestión de autenticación segura y APIs REST.
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography sx={{
                                            mb: 1,
                                            fontSize: { xs: '0.9rem', sm: '1rem' },
                                            fontFamily: typography.fontFamily
                                        }}>
                                            <Box component="span" sx={{ fontWeight: 600, color: vistelicaColors.primary }}>Base de datos:</Box> MongoDB para almacenamiento flexible y eficiente de productos e información de usuarios.
                                        </Typography>
                                    </li>
                                </ul>
                            </Box>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: `rgba(${theme.palette.mode === 'dark' ? '228, 176, 2, 0.4' : '228, 176, 2, 0.3'})` }} />

                            <Typography
                                variant="h5"
                                gutterBottom
                                align="center"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '1.15rem', sm: '1.5rem' },
                                    color: vistelicaColors.primary,
                                    fontFamily: typography.h5.fontFamily,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        display: 'block',
                                        width: { xs: '60px', sm: '80px' },
                                        height: '3px',
                                        background: vistelicaColors.primary,
                                        margin: '8px auto',
                                        borderRadius: '2px',
                                    }
                                }}
                            >
                                Nuestro Equipo de Desarrollo
                            </Typography>

                            <Grid container spacing={2} sx={{ mt: { xs: 1, sm: 2 } }}>
                                {['Jesús Moreno Jiménez', 'Cristian Joel Vargas', 'Jesús Moreno Caballero'].map((name, index) => (
                                    <AnimatedGrid item xs={12} sm={6} md={4} key={name} index={index}>
                                        <TeamMemberCard>
                                            <LargeAvatar alt={name} src={`/static/images/avatar/${index + 1}.jpg`} />
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: { xs: '1rem', sm: '1.25rem' },
                                                    color: theme.palette.text.primary,
                                                    fontFamily: typography.h6.fontFamily,
                                                    mt: 1
                                                }}
                                            >
                                                {name}
                                            </Typography>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    color: vistelicaColors.primary,
                                                    fontWeight: 500,
                                                    fontSize: { xs: '0.85rem', sm: '1rem' },
                                                    fontFamily: typography.subtitle1.fontFamily,
                                                    mb: 1
                                                }}
                                            >
                                                {index === 0 ? 'Frontend Developer' :
                                                    index === 1 ? 'Fullstack Developer' :
                                                        'Backend Developer'}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                                    lineHeight: 1.5,
                                                    fontFamily: typography.body2.fontFamily,
                                                    color: vistelicaColors.secondary,
                                                }}
                                            >
                                                {index === 0 ?
                                                    'Especialista en interfaces de usuario y experiencia de usuario. Ha liderado el desarrollo del frontend con React y Material UI, creando componentes reutilizables y una arquitectura frontend sólida y mantenible.' :
                                                    index === 1 ?
                                                        'Desarrollador versátil con foco en la integración de sistemas. Ha implementado el sistema de autenticación, gestión de estado y las conexiones entre el frontend y backend para crear una experiencia unificada.' :
                                                        'Enfocado en la arquitectura del servidor y la base de datos. Ha diseñado la estructura de datos, implementado las APIs y garantizado el rendimiento y la seguridad del backend para proporcionar una plataforma fiable y escalable.'}
                                            </Typography>
                                        </TeamMemberCard>
                                    </AnimatedGrid>
                                ))}
                            </Grid>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: `rgba(${theme.palette.mode === 'dark' ? '228, 176, 2, 0.4' : '228, 176, 2, 0.3'})` }} />

                            <SectionTitle variant="h5" gutterBottom>
                                Objetivos del Proyecto
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    mb: { xs: 1, sm: 2 },
                                    fontFamily: typography.fontFamily
                                }}
                            >
                                El desarrollo de Vistélica nos ha permitido aplicar nuestros conocimientos en un caso real de negocio
                                digital. Hemos enfrentado desafíos como la implementación de pagos seguros, la gestión eficiente del
                                catálogo de productos y la optimización para dispositivos móviles.
                            </Typography>
                            <Typography
                                paragraph
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    mb: { xs: 1, sm: 2 },
                                    fontFamily: typography.fontFamily

                                }}
                            >
                                Este proyecto representa no solo nuestra capacidad técnica, sino también nuestra visión de cómo la
                                tecnología puede transformar la experiencia de compra en línea, haciéndola más accesible, segura
                                y adaptada a las necesidades del usuario moderno.
                            </Typography>
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
                            onClick={handleGoToLogin}
                        >
                            Ir a Iniciar Sesión
                        </Button>
                    </Card>
                </Fade>
            </AboutContainer>
        </AppTheme>
    );
}