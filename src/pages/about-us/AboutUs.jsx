import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { SitemarkIcon } from '../sign-up/components/CustomIcons';
import { useRouter } from 'next/navigation';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '800px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const AboutContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
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
}));

const TeamMemberCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    marginBottom: theme.spacing(2),
    boxShadow: theme.shadows[3],
}));

export default function AboutUs(props) {
    const router = useRouter();
    const handleGoToLogin = () => {
        router.push('/sign-in-side/SignInSide');
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
            <AboutContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <SitemarkIcon />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Sobre Nosotros
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Conozca al equipo de desarrolladores detrás de Vistelica
                    </Typography>

                    <ScrollableContent>
                        <Typography variant="h5" gutterBottom>
                            Nuestro Proyecto
                        </Typography>
                        <Typography paragraph>
                            Vistelica nació como proyecto final de nuestro grado superior en Desarrollo de Aplicaciones Multiplataforma.
                            Nuestra visión fue crear una plataforma de e-commerce moderna y accesible que revolucionara la forma en
                            que las familias compran ropa.
                        </Typography>
                        <Typography paragraph>
                            Combinando nuestras habilidades en desarrollo web, diseño de interfaces y programación backend,
                            hemos construido una solución tecnológica completa que ofrece una experiencia de usuario fluida
                            y adaptada a las necesidades de cada cliente.
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h5" gutterBottom>
                            Tecnologías Utilizadas
                        </Typography>
                        <Typography paragraph>
                            Para el desarrollo de Vistelica, hemos implementado un stack tecnológico moderno y escalable:
                        </Typography>
                        <ul>
                            <li>
                                <Typography>
                                    <strong>Frontend:</strong> React, Next.js, Material UI y herramientas avanzadas de diseño responsivo.
                                </Typography>
                            </li>
                            <li>
                                <Typography>
                                    <strong>Backend:</strong> Node.js con Express, gestión de autenticación segura y APIs REST.
                                </Typography>
                            </li>
                            <li>
                                <Typography>
                                    <strong>Base de datos:</strong> MongoDB para almacenamiento flexible y eficiente de productos e información de usuarios.
                                </Typography>
                            </li>
                        </ul>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h5" gutterBottom align="center">
                            Nuestro Equipo de Desarrollo
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TeamMemberCard>
                                    <LargeAvatar alt="Jesús Moreno Jiménez" />
                                    <Typography variant="h6">Jesús Moreno Jiménez</Typography>
                                    <Typography variant="subtitle1" color="primary" gutterBottom>Frontend Developer</Typography>
                                    <Typography variant="body2">
                                        Especialista en interfaces de usuario y experiencia de usuario. Ha liderado el desarrollo
                                        del frontend con React y Material UI, creando componentes reutilizables y una arquitectura
                                        frontend sólida y mantenible.
                                    </Typography>
                                </TeamMemberCard>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TeamMemberCard>
                                    <LargeAvatar alt="Cristian Joel Vargas" />
                                    <Typography variant="h6">Cristian Joel Vargas</Typography>
                                    <Typography variant="subtitle1" color="primary" gutterBottom>Fullstack Developer</Typography>
                                    <Typography variant="body2">
                                        Desarrollador versátil con foco en la integración de sistemas. Ha implementado el sistema
                                        de autenticación, gestión de estado y las conexiones entre el frontend y backend para
                                        crear una experiencia unificada.
                                    </Typography>
                                </TeamMemberCard>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TeamMemberCard>
                                    <LargeAvatar alt="Jesús Moreno Caballero" />
                                    <Typography variant="h6">Jesús Moreno Caballero</Typography>
                                    <Typography variant="subtitle1" color="primary" gutterBottom>Backend Developer</Typography>
                                    <Typography variant="body2">
                                        Enfocado en la arquitectura del servidor y la base de datos. Ha diseñado la estructura
                                        de datos, implementado las APIs y garantizado el rendimiento y la seguridad del backend
                                        para proporcionar una plataforma fiable y escalable.
                                    </Typography>
                                </TeamMemberCard>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h5" gutterBottom>
                            Objetivos del Proyecto
                        </Typography>
                        <Typography paragraph>
                            El desarrollo de Vistelica nos ha permitido aplicar nuestros conocimientos en un caso real de negocio
                            digital. Hemos enfrentado desafíos como la implementación de pagos seguros, la gestión eficiente del
                            catálogo de productos y la optimización para dispositivos móviles.
                        </Typography>
                        <Typography paragraph>
                            Este proyecto representa no solo nuestra capacidad técnica, sino también nuestra visión de cómo la
                            tecnología puede transformar la experiencia de compra en línea, haciéndola más accesible, segura
                            y adaptada a las necesidades del usuario moderno.
                        </Typography>
                    </ScrollableContent>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGoToLogin}
                        sx={{ mt: 2 }}
                    >
                        Ir a Iniciar Sesión
                    </Button>
                </Card>
            </AboutContainer>
        </AppTheme>
    );
}