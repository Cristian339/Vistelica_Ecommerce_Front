import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled, keyframes, useColorScheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { useRouter } from 'next/navigation';
import LockIcon from '@mui/icons-material/Lock';
import Fade from '@mui/material/Fade';
import { vistelicaColors } from '../shared-theme/vistelicaColors';
import {typography} from "@/pages/shared-theme/themePrimitives";

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


// Botón principal con hover mejorado
const PrimaryButton = styled(Button)(() => ({
    backgroundColor: vistelicaColors.primary,
    color: '#FFFFFF',
    fontWeight: 600,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        backgroundColor: '#c99a02', // Versión más oscura del primario
        boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-2px)',
        transition: 'all 0.3s',
    },
}));

const Card = styled(MuiCard)(({ theme }) => {
    const { mode } = useColorScheme();
    return {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '100%',
        padding: theme.spacing(2), // Padding reducido para móviles
        gap: theme.spacing(1.5),
        margin: 'auto',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        borderRadius: '12px', // Menos redondeado en móviles
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
        [theme.breakpoints.up('sm')]: {
            width: '800px',
            padding: theme.spacing(4), // Vuelve al padding original en pantallas más grandes
            gap: theme.spacing(2),
            borderRadius: '16px',
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
        ...(mode === 'dark' && {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }),
    };
});

const PolicyContainer = styled(Stack)(({ theme }) => {
    const { mode } = useColorScheme();
    return {
        height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
        minHeight: '100%',
        padding: theme.spacing(1), // Padding reducido para móviles
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
            backgroundImage: mode === 'dark'
                ? 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))'
                : 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
            backgroundRepeat: 'no-repeat',
        },
    };
});

const ScrollableContent = styled(Box)(({ theme }) => {
    const { mode } = useColorScheme();
    return {
        maxHeight: '50vh', // Altura reducida para móviles
        overflowY: 'auto',
        padding: theme.spacing(2), // Padding reducido
        marginBottom: theme.spacing(2),
        border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.7)',
        '& ul': {
            paddingLeft: theme.spacing(2), // Ajusta el padding de las listas para móviles
        },
        '& li': {
            marginBottom: theme.spacing(1), // Añade espacio entre elementos de lista
        },
        '&::-webkit-scrollbar': {
            width: '6px', // Barra de desplazamiento más delgada para móviles
        },
        '&::-webkit-scrollbar-track': {
            background: mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: vistelicaColors.primary,
            borderRadius: '6px',
        },
        [theme.breakpoints.up('sm')]: {
            maxHeight: '60vh', // Vuelve a la altura original en pantallas más grandes
            padding: theme.spacing(3),
            '&::-webkit-scrollbar': {
                width: '8px',
            },
        },
    };
});

const SectionTitle = styled(Typography)(({ theme }) => {
    return {
        position: 'relative',
        paddingLeft: theme.spacing(1.5),
        fontSize: '1.15rem', // Tamaño más pequeño para móviles
        fontWeight: 600,
        color: useColorScheme().mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
        [theme.breakpoints.up('sm')]: {
            fontSize: '1.25rem', // Tamaño original para pantallas más grandes
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
    };
});

export default function PrivacyPolicy(props) {
    const router = useRouter();
    const { mode } = useColorScheme();

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
            <PolicyContainer direction="column" justifyContent="space-between">
                <Fade in={true} timeout={800}>
                    <Card variant="outlined">
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                            <AnimatedLogo variant="h1">Vistélica</AnimatedLogo>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LockIcon
                                sx={{
                                    color: vistelicaColors.primary,
                                    fontSize: { xs: 24, sm: 28 }
                                }}
                            />
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    width: '100%',
                                    fontSize: 'clamp(1.5rem, 8vw, 2.15rem)',
                                    fontWeight: 600,
                                }}
                            >
                                Política de Privacidad
                            </Typography>
                        </Box>

                        <Typography
                            variant="subtitle1"
                            sx={{
                                mb: { xs: 1, sm: 2 },
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                fontStyle: 'italic',

                            }}
                        >
                            Última actualización: {new Date().toLocaleDateString()}
                        </Typography>

                        <ScrollableContent>
                            <SectionTitle variant="h5" gutterBottom>
                                1. Información que recopilamos
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                En Vistelica, recopilamos información personal que nos proporciona directamente cuando utiliza nuestros servicios de compra y navegación de ropa para hombres, mujeres y niños.
                                Esto incluye:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Información de registro: nombre, apellido, correo electrónico, contraseña, fecha de nacimiento.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Información de contacto: dirección, número de teléfono y direcciones de envío.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Información de perfil: tallas, preferencias de vestimenta, historial de compras y foto de avatar (opcional).
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Información de compra: datos de pago, detalles del producto, historial de pedidos.
                                    </Typography>
                                </li>
                            </ul>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                2. Cómo utilizamos su información
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                En Vistelica utilizamos la información que recopilamos para:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Procesar sus pedidos y entregas de ropa para toda la familia.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Crear recomendaciones personalizadas de moda según sus preferencias y tallas.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Enviar comunicaciones relacionadas con nuevas colecciones, promociones especiales y descuentos exclusivos.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Mejorar nuestro catálogo y experiencia de compra según las tendencias de moda y preferencias de nuestros clientes.
                                    </Typography>
                                </li>
                            </ul>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                3. Compartición de información
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Vistelica no comparte su información personal con terceros, excepto en las siguientes circunstancias:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Con compañías de transporte para realizar la entrega de sus pedidos.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Con proveedores de servicios de procesamiento de pagos para completar sus transacciones.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Para cumplir con leyes aplicables, reglamentos, procesos legales o solicitudes gubernamentales.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        En caso de una fusión, venta de activos de Vistelica u otra transacción corporativa donde la información del usuario podría ser transferida como parte de los activos de la empresa.
                                    </Typography>
                                </li>
                            </ul>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                4. Seguridad de sus datos de compra
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                En Vistelica tomamos medidas estrictas para proteger su información personal y de pago contra pérdida, robo, uso indebido, acceso no autorizado, divulgación, alteración y destrucción. Utilizamos métodos de cifrado avanzados para proteger sus datos de pago y transacciones.
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                5. Sus derechos como cliente de Vistelica
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Como cliente de nuestra tienda de ropa, usted tiene derecho a:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Acceder, corregir o eliminar sus datos personales, incluyendo preferencias de moda y tallas.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Modificar sus preferencias de marketing sobre nuevas colecciones y promociones.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Solicitar información sobre cómo se utilizan sus datos para personalizar recomendaciones de productos.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Retirar su consentimiento para recibir comunicaciones sobre tendencias y ofertas especiales.
                                    </Typography>
                                </li>
                            </ul>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                6. Cookies y tecnologías similares
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Utilizamos cookies y tecnologías similares para mejorar su experiencia de compra, recordar sus preferencias de moda, analizar tendencias y administrar el contenido de la tienda. Puede configurar su navegador para rechazar todas las cookies o para indicar cuándo se envía una cookie, pero algunas funciones de nuestra tienda online podrían no funcionar correctamente.
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                7. Cambios a esta política
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Vistelica puede modificar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas de recopilación y uso de información. Si realizamos cambios materiales, le notificaremos por correo electrónico o mediante un aviso en nuestra tienda online antes de que el cambio entre en vigor.
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                8. Contacto con Vistelica
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Si tiene preguntas sobre esta Política de Privacidad o sobre cómo Vistelica maneja sus datos, por favor contáctenos en: privacidad@vistelica.com o llame a nuestro servicio de atención al cliente al +34 900 123 456.
                            </Typography>
                        </ScrollableContent>

                        <PrimaryButton
                            variant="contained"
                            onClick={handleGoToLogin}
                            sx={{
                                mt: { xs: 1, sm: 2 },
                                py: { xs: 1, sm: 1.2 },
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                            }}
                        >
                            Ir a Iniciar Sesión
                        </PrimaryButton>
                    </Card>
                </Fade>
            </PolicyContainer>
        </AppTheme>
    );
}