import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled, keyframes } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { useRouter } from 'next/navigation';
import LockIcon from '@mui/icons-material/Lock';
import Fade from '@mui/material/Fade';

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
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
    fontSize: '2.5rem',
    background: `linear-gradient(90deg, #E4B002, #EAD8B1, #FFFFFF, #EAD8B1, #E4B002)`,
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
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
        width: '800px',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '5px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
    ...theme.applyStyles('dark', {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    }),
}));

const PolicyContainer = styled(Stack)(({ theme }) => ({
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
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: theme.palette.background.paper,
        borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.primary.light,
        borderRadius: '8px',
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    position: 'relative',
    paddingLeft: theme.spacing(1.5),
    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '4px',
        height: '70%',
        background: theme.palette.primary.main,
        borderRadius: '4px',
    },
}));

export default function PrivacyPolicy(props) {
    const router = useRouter();
    const handleGoToLogin = () => {
        router.push('/sign-in-side/SignInSide');
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
            <PolicyContainer direction="column" justifyContent="space-between">
                <Fade in={true} timeout={800}>
                    <Card variant="outlined">
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                            <AnimatedLogo variant="h1">Vistélica</AnimatedLogo>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LockIcon color="primary" />
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    width: '100%',
                                    fontSize: 'clamp(1.8rem, 8vw, 2.15rem)',
                                    fontWeight: 600
                                }}
                            >
                                Política de Privacidad
                            </Typography>
                        </Box>

                        <Typography
                            variant="subtitle1"
                            sx={{
                                mb: 2,
                                fontStyle: 'italic',
                                color: theme => theme.palette.text.secondary
                            }}
                        >
                            Última actualización: {new Date().toLocaleDateString()}
                        </Typography>

                        <ScrollableContent>
                            <SectionTitle variant="h5" gutterBottom>
                                1. Información que recopilamos
                            </SectionTitle>
                            <Typography paragraph>
                                En Vistelica, recopilamos información personal que nos proporciona directamente cuando utiliza nuestros servicios de compra y navegación de ropa para hombres, mujeres y niños.
                                Esto incluye:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography>
                                        Información de registro: nombre, apellido, correo electrónico, contraseña, fecha de nacimiento.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography>
                                        Información de contacto: dirección, número de teléfono y direcciones de envío.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography>
                                        Información de perfil: tallas, preferencias de vestimenta, historial de compras y foto de avatar (opcional).
                                    </Typography>
                                </li>
                                <li>
                                    <Typography>
                                        Información de compra: datos de pago, detalles del producto, historial de pedidos.
                                    </Typography>
                                </li>
                            </ul>

                            <Divider sx={{ my: 3 }} />

                            <SectionTitle variant="h5" gutterBottom>
                                2. Cómo utilizamos su información
                            </SectionTitle>
                            <Typography paragraph>
                                En Vistelica utilizamos la información que recopilamos para:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography>
                                        Procesar sus pedidos y entregas de ropa para toda la familia.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography>
                                        Crear recomendaciones personalizadas de moda según sus preferencias y tallas.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography>
                                        Enviar comunicaciones relacionadas con nuevas colecciones, promociones especiales y descuentos exclusivos.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography>
                                        Mejorar nuestro catálogo y experiencia de compra según las tendencias de moda y preferencias de nuestros clientes.
                                    </Typography>
                                </li>
                            </ul>

                            <Divider sx={{ my: 3 }} />

                            <SectionTitle variant="h5" gutterBottom>
                                3. Compartición de información
                            </SectionTitle>
                            <Typography paragraph>
                                Vistelica no comparte su información personal con terceros, excepto en las siguientes circunstancias:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography>
                                        Con compañías de transporte para realizar la entrega de sus pedidos.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography>
                                        Con proveedores de servicios de procesamiento de pagos para completar sus transacciones.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography>
                                        Para cumplir con leyes aplicables, reglamentos, procesos legales o solicitudes gubernamentales.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography>
                                        En caso de una fusión, venta de activos de Vistelica u otra transacción corporativa donde la información del usuario podría ser transferida como parte de los activos de la empresa.
                                    </Typography>
                                </li>
                            </ul>

                            <Divider sx={{ my: 3 }} />

                            <SectionTitle variant="h5" gutterBottom>
                                4. Seguridad de sus datos de compra
                            </SectionTitle>
                            <Typography paragraph>
                                En Vistelica tomamos medidas estrictas para proteger su información personal y de pago contra pérdida, robo, uso indebido, acceso no autorizado, divulgación, alteración y destrucción. Utilizamos métodos de cifrado avanzados para proteger sus datos de pago y transacciones.
                            </Typography>

                            <Divider sx={{ my: 3 }} />

                            <SectionTitle variant="h5" gutterBottom>
                                5. Sus derechos como cliente de Vistelica
                            </SectionTitle>
                            <Typography paragraph>
                                Como cliente de nuestra tienda de ropa, usted tiene derecho a:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography>
                                        Acceder, corregir o eliminar sus datos personales, incluyendo preferencias de moda y tallas.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography>
                                        Modificar sus preferencias de marketing sobre nuevas colecciones y promociones.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography>
                                        Solicitar información sobre cómo se utilizan sus datos para personalizar recomendaciones de productos.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography>
                                        Retirar su consentimiento para recibir comunicaciones sobre tendencias y ofertas especiales.
                                    </Typography>
                                </li>
                            </ul>

                            <Divider sx={{ my: 3 }} />

                            <SectionTitle variant="h5" gutterBottom>
                                6. Cookies y tecnologías similares
                            </SectionTitle>
                            <Typography paragraph>
                                Utilizamos cookies y tecnologías similares para mejorar su experiencia de compra, recordar sus preferencias de moda, analizar tendencias y administrar el contenido de la tienda. Puede configurar su navegador para rechazar todas las cookies o para indicar cuándo se envía una cookie, pero algunas funciones de nuestra tienda online podrían no funcionar correctamente.
                            </Typography>

                            <Divider sx={{ my: 3 }} />

                            <SectionTitle variant="h5" gutterBottom>
                                7. Cambios a esta política
                            </SectionTitle>
                            <Typography paragraph>
                                Vistelica puede modificar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas de recopilación y uso de información. Si realizamos cambios materiales, le notificaremos por correo electrónico o mediante un aviso en nuestra tienda online antes de que el cambio entre en vigor.
                            </Typography>

                            <Divider sx={{ my: 3 }} />

                            <SectionTitle variant="h5" gutterBottom>
                                8. Contacto con Vistelica
                            </SectionTitle>
                            <Typography paragraph>
                                Si tiene preguntas sobre esta Política de Privacidad o sobre cómo Vistelica maneja sus datos, por favor contáctenos en: privacidad@vistelica.com o llame a nuestro servicio de atención al cliente al +34 900 123 456.
                            </Typography>
                        </ScrollableContent>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGoToLogin}
                            sx={{
                                mt: 2,
                                py: 1.2,
                                fontWeight: 600,
                                boxShadow: 2,
                                '&:hover': {
                                    boxShadow: 4,
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.3s'
                                }
                            }}
                        >
                            Ir a Iniciar Sesión
                        </Button>
                    </Card>
                </Fade>
            </PolicyContainer>
        </AppTheme>
    );
}