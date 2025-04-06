import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
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
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
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
                <Card variant="outlined">
                    <SitemarkIcon />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Política de Privacidad de Vistelica
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Última actualización: {new Date().toLocaleDateString()}
                    </Typography>

                    <ScrollableContent>
                        <Typography variant="h5" gutterBottom>
                            1. Información que recopilamos
                        </Typography>
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

                        <Typography variant="h5" gutterBottom>
                            2. Cómo utilizamos su información
                        </Typography>
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

                        <Typography variant="h5" gutterBottom>
                            3. Compartición de información
                        </Typography>
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

                        <Typography variant="h5" gutterBottom>
                            4. Seguridad de sus datos de compra
                        </Typography>
                        <Typography paragraph>
                            En Vistelica tomamos medidas estrictas para proteger su información personal y de pago contra pérdida, robo, uso indebido, acceso no autorizado, divulgación, alteración y destrucción. Utilizamos métodos de cifrado avanzados para proteger sus datos de pago y transacciones.
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h5" gutterBottom>
                            5. Sus derechos como cliente de Vistelica
                        </Typography>
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

                        <Typography variant="h5" gutterBottom>
                            6. Cookies y tecnologías similares
                        </Typography>
                        <Typography paragraph>
                            Utilizamos cookies y tecnologías similares para mejorar su experiencia de compra, recordar sus preferencias de moda, analizar tendencias y administrar el contenido de la tienda. Puede configurar su navegador para rechazar todas las cookies o para indicar cuándo se envía una cookie, pero algunas funciones de nuestra tienda online podrían no funcionar correctamente.
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h5" gutterBottom>
                            7. Cambios a esta política
                        </Typography>
                        <Typography paragraph>
                            Vistelica puede modificar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas de recopilación y uso de información. Si realizamos cambios materiales, le notificaremos por correo electrónico o mediante un aviso en nuestra tienda online antes de que el cambio entre en vigor.
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h5" gutterBottom>
                            8. Contacto con Vistelica
                        </Typography>
                        <Typography paragraph>
                            Si tiene preguntas sobre esta Política de Privacidad o sobre cómo Vistelica maneja sus datos, por favor contáctenos en: privacidad@vistelica.com o llame a nuestro servicio de atención al cliente al +34 900 123 456.
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
            </PolicyContainer>
        </AppTheme>
    );
}