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
import GavelIcon from '@mui/icons-material/Gavel';
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

export default function LegalNotice(props) {
    const router = useRouter();
    const { mode } = useColorScheme();

    const handleGoToLogin = () => {
        router.push('/sign-in-side/SignInSide');
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
                            <GavelIcon
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
                                Aviso Legal
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
                                1. Información General
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                En cumplimiento con el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), se informa que:
                            </Typography>
                            <ul>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Denominación social: Vistélica
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        CIF/NIF: B12345678
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Inscrita en el Registro Mercantil de Sevilla, Tomo 12345, Folio 123, Sección 8, Hoja M-123456
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        Correo electrónico: vistelica.company@gmail.com
                                    </Typography>
                                </li>
                            </ul>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                2. Objeto y Alcance
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Vistélica es una plataforma de comercio electrónico especializada en la venta de ropa para hombres, mujeres y niños. El presente aviso legal regula el acceso y uso del sitio web www.vistelica.com (en adelante, "el Sitio Web") que Vistélica pone a disposición de los usuarios interesados en los servicios y contenidos ofrecidos.
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                3. Propiedad Intelectual e Industrial
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Todos los contenidos del Sitio Web, entendiendo por estos, a título enunciativo, los textos, fotografías, gráficos, imágenes, iconos, tecnología, software, links y demás contenidos audiovisuales o sonoros, así como su diseño gráfico y códigos fuente (en adelante, los "Contenidos"), son propiedad intelectual de Vistélica o de terceros, sin que puedan entenderse cedidos al Usuario ninguno de los derechos de explotación reconocidos por la normativa vigente en materia de propiedad intelectual sobre los mismos.
                            </Typography>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Las marcas, nombres comerciales o signos distintivos son propiedad de Vistélica o de terceros, sin que pueda entenderse que el acceso al Sitio Web atribuya ningún derecho sobre los mismos.
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                4. Responsabilidad
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Vistélica no se hace responsable de los daños y perjuicios de cualquier naturaleza que puedan deberse a la falta de exactitud, exhaustividad, actualidad, así como de errores u omisiones de los que pudieran adolecer los Contenidos del Sitio Web u otros contenidos a los que se pueda acceder a través del mismo.
                            </Typography>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Vistélica no garantiza la disponibilidad, continuidad y funcionamiento del Sitio Web y de sus servicios. Cuando sea razonablemente posible, Vistélica advertirá previamente de las interrupciones en el funcionamiento del Sitio Web y de los servicios.
                            </Typography>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Vistélica excluye cualquier responsabilidad por los daños y perjuicios de toda naturaleza que puedan deberse al uso ilícito, indebido o inapropiado del Sitio Web por parte del Usuario.
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                5. Enlaces
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                En el caso de que en el Sitio Web se dispusiesen enlaces o hipervínculos hacía otros sitios de Internet, Vistélica no ejercerá ningún tipo de control sobre dichos sitios y contenidos.
                            </Typography>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                En ningún caso Vistélica asumirá responsabilidad alguna por los contenidos de algún enlace perteneciente a un sitio web ajeno, ni garantizará la disponibilidad técnica, calidad, fiabilidad, exactitud, amplitud, veracidad, validez y constitucionalidad de cualquier material o información contenida en ninguno de dichos hipervínculos u otros sitios de Internet.
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                6. Protección de Datos Personales
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Para conocer el tratamiento de datos personales que realiza Vistélica, el Usuario puede consultar la Política de Privacidad que se encuentra disponible en el Sitio Web.
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                7. Legislación Aplicable y Jurisdicción
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Las presentes condiciones generales se regirán por la legislación española. Para la resolución de cualquier controversia que pudiera surgir con ocasión de la visita al Sitio Web o del uso de los servicios que en él puedan ofrecerse, Vistélica y el Usuario acuerdan someterse a los Juzgados y Tribunales del domicilio del Usuario, siempre que éste se encuentre en territorio español y actúe en calidad de consumidor.
                            </Typography>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                En caso de que el Usuario tenga su domicilio fuera de España, Vistélica y el Usuario se someten, con renuncia expresa a cualquier otro fuero, a los Juzgados y Tribunales de la ciudad de Madrid (España).
                            </Typography>

                            <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(228, 176, 2, 0.3)' }} />

                            <SectionTitle variant="h5" gutterBottom>
                                8. Modificaciones
                            </SectionTitle>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Vistélica se reserva el derecho a efectuar sin previo aviso las modificaciones que considere oportunas en el Sitio Web, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través del mismo como la forma en la que éstos aparezcan presentados o localizados.
                            </Typography>
                            <Typography
                                paragraph
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                                Asimismo, Vistélica podrá modificar el presente Aviso Legal cuando lo considere necesario, comprometiéndose a publicar y notificar al Usuario las modificaciones que se introduzcan.
                            </Typography>
                        </ScrollableContent>
                    </Card>
                </Fade>
            </PolicyContainer>
        </AppTheme>
    );
}