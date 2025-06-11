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
import DescriptionIcon from '@mui/icons-material/Description';
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
        backgroundColor: '#c99a02',
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
        padding: theme.spacing(2),
        gap: theme.spacing(1.5),
        margin: 'auto',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
        [theme.breakpoints.up('sm')]: {
            width: '800px',
            padding: theme.spacing(4),
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
        maxHeight: '50vh',
        overflowY: 'auto',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.7)',
        '& ul': {
            paddingLeft: theme.spacing(2),
        },
        '& li': {
            marginBottom: theme.spacing(1),
        },
        '&::-webkit-scrollbar': {
            width: '6px',
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
            maxHeight: '60vh',
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
        fontSize: '1.15rem',
        fontWeight: 600,
        color: useColorScheme().mode === 'dark' ? vistelicaColors.tertiary : vistelicaColors.secondary,
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
    };
});

export default function TermsOfUse(props) {
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
                            <DescriptionIcon
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
                                Condiciones de Uso
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
                                1. Aceptación de las Condiciones
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Al acceder y utilizar el sitio web www.vistelica.com (en adelante, "el Sitio Web"), propiedad de Vistélica , usted acepta estar legalmente obligado por estos Términos y Condiciones de Uso, que constituyen un acuerdo legal entre usted y Vistélica.
                            </Typography>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Si no está de acuerdo con estos términos, no debe utilizar el Sitio Web. Vistélica se reserva el derecho de modificar estos términos en cualquier momento, siendo su responsabilidad revisarlos periódicamente.
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                2. Registro y Cuenta de Usuario
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Para realizar compras en Vistélica, deberá registrarse creando una cuenta de usuario. Usted se compromete a:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Proporcionar información veraz, exacta y completa sobre su identidad
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Mantener y actualizar sus datos de registro para mantenerlos actualizados
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Ser responsable de la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Notificar inmediatamente a Vistélica cualquier uso no autorizado de su cuenta
                                    </Typography>
                                </li>
                            </ul>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                3. Proceso de Compra
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Al realizar una compra en Vistélica, usted acepta:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Que es mayor de 18 años o tiene el consentimiento de sus padres/tutores
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Que los precios mostrados incluyen IVA pero no incluyen gastos de envío (a menos que se indique lo contrario)
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Que Vistélica puede rechazar o cancelar pedidos por errores en los precios, disponibilidad de productos o sospecha de fraude
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Que es responsable de proporcionar una dirección de envío correcta y completa
                                    </Typography>
                                </li>
                            </ul>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                4. Propiedad Intelectual
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Todo el contenido del Sitio Web (textos, imágenes, logotipos, diseños, software, etc.) es propiedad exclusiva de Vistélica o de sus licenciantes y está protegido por leyes de propiedad intelectual.
                            </Typography>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Queda prohibida cualquier reproducción, distribución, modificación o uso comercial del contenido sin autorización expresa por escrito de Vistélica.
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                5. Conducta del Usuario
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Al utilizar el Sitio Web, usted se compromete a:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        No realizar actividades ilegales, fraudulentas o que infrinjan derechos de terceros
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        No utilizar el Sitio Web para fines comerciales no autorizados
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        No interferir con la seguridad o el funcionamiento del Sitio Web
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        No publicar comentarios falsos, difamatorios o inapropiados
                                    </Typography>
                                </li>
                            </ul>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                6. Limitación de Responsabilidad
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Vistélica no será responsable por:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Daños indirectos, incidentales o consecuentes resultantes del uso del Sitio Web
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Errores tipográficos o inexactitudes en la información del producto
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Retrasos en la entrega causados por factores ajenos a Vistélica
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Daños a los productos durante el transporte
                                    </Typography>
                                </li>
                            </ul>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                7. Ley Aplicable y Jurisdicción
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Estas Condiciones de Uso se regirán e interpretarán de acuerdo con las leyes de España. Cualquier disputa que surja en relación con estas condiciones será resuelta por los tribunales de Madrid, a menos que la ley aplicable establezca otra jurisdicción.
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                8. Contacto
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Para cualquier pregunta sobre estas Condiciones de Uso, puede contactarnos en:
                            </Typography>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Email: vistelica.company@gmail.com<br />
                            </Typography>
                        </ScrollableContent>
                    </Card>
                </Fade>
            </PolicyContainer>
        </AppTheme>
    );
}