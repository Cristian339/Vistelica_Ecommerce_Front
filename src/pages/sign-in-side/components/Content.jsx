import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { useColorScheme } from '@mui/material/styles';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const items = [
    {
        icon: <SettingsSuggestRoundedIcon sx={{ color: vistelicaColors.primary }} aria-hidden="true" />,
        title: 'Estilo adaptable',
        description:
            'Nuestra ropa se ajusta sin esfuerzo a tu estilo de vida, brindando comodidad y versatilidad en cada ocasión.\n',
    },
    {
        icon: <ConstructionRoundedIcon sx={{ color: vistelicaColors.primary }} aria-hidden="true" />,
        title: 'Diseño duradero',
        description:
            'Disfruta de prendas que resisten el paso del tiempo, combinando calidad y resistencia en cada detalle.',
    },
    {
        icon: <ThumbUpAltRoundedIcon sx={{ color: vistelicaColors.primary }} aria-hidden="true" />,
        title: 'Comodidad excepcional',
        description:
            'Siente la diferencia con tejidos suaves y cortes ergonómicos que se adaptan perfectamente a ti.',
    },
    {
        icon: <AutoFixHighRoundedIcon sx={{ color: vistelicaColors.primary }} aria-hidden="true" />,
        title: 'Moda innovadora',
        description:
            'Descubre diseños modernos que marcan tendencia, pensados para expresar tu personalidad única.',
    },
];

// Función auxiliar para detectar modo oscuro del sistema
const getSystemPrefersDark = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Componente optimizado con memo para mejorar rendimiento
export default React.memo(function Content() {
    const { mode } = useColorScheme();

    // Función para determinar el modo efectivo (memoizada)
    const effectiveMode = React.useMemo(() => {
        if (mode === 'system') {
            return getSystemPrefersDark() ? 'dark' : 'light';
        }
        return mode;
    }, [mode, getSystemPrefersDark]);

    return (
        <Stack
            component="section"
            aria-label="Características de Vistélica"
            sx={{
                flexDirection: 'column',
                alignSelf: { xs: 'center', md: 'flex-start' },
                justifyContent: { xs: 'center', md: 'flex-start' },
                gap: { xs: 3, sm: 4 },
                maxWidth: { xs: '100%', sm: 450 },
                width: '100%',
                padding: { xs: 1, sm: 2 },
                my: { xs: 2, md: 0 }
            }}
        >
            <Box
                sx={{
                    display: { xs: 'flex', md: 'flex' },
                    justifyContent: 'center',
                    mb: { xs: 1, md: 2 }
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        color: vistelicaColors.primary,
                        fontWeight: 700,
                        letterSpacing: 1,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                        fontFamily: typography.fontFamily,
                        fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }
                    }}
                >
                    Vistélica
                </Typography>
            </Box>
            {items.map((item, index) => (
                <Stack
                    key={index}
                    direction="row"
                    sx={{ gap: 2 }}
                    component="article"
                    aria-labelledby={`feature-title-${index}`}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: `${vistelicaColors.primary}15`,
                            flexShrink: 0,
                        }}
                    >
                        {item.icon}
                    </Box>
                    <Box component="div">
                        <Typography
                            id={`feature-title-${index}`}
                            gutterBottom
                            component="h2"
                            sx={{
                                fontWeight: 600,
                                color: vistelicaColors.primary,
                                fontFamily: typography.fontFamily,
                                fontSize: { xs: '1rem', sm: '1.1rem' }
                            }}
                        >
                            {item.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            component="p"
                            sx={{
                                color: effectiveMode === 'dark' ?
                                    vistelicaColors.tertiary :
                                    vistelicaColors.secondary,
                                fontFamily: typography.fontFamily,
                                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                                lineHeight: 1.6
                            }}
                        >
                            {item.description}
                        </Typography>
                    </Box>
                </Stack>
            ))}
        </Stack>
    );
});
