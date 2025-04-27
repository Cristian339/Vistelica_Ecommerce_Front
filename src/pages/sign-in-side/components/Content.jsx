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

const items = [
    {
        icon: <SettingsSuggestRoundedIcon sx={{ color: vistelicaColors.primary }} />,
        title: 'Estilo adaptable',
        description:
            'Nuestra ropa se ajusta sin esfuerzo a tu estilo de vida, brindando comodidad y versatilidad en cada ocasión.\n',
    },
    {
        icon: <ConstructionRoundedIcon sx={{ color: vistelicaColors.primary }} />,
        title: 'Diseño duradero',
        description:
            'Disfruta de prendas que resisten el paso del tiempo, combinando calidad y resistencia en cada detalle.',
    },
    {
        icon: <ThumbUpAltRoundedIcon sx={{ color: vistelicaColors.primary }} />,
        title: 'Comodidad excepcional',
        description:
            'Siente la diferencia con tejidos suaves y cortes ergonómicos que se adaptan perfectamente a ti.',
    },
    {
        icon: <AutoFixHighRoundedIcon sx={{ color: vistelicaColors.primary }} />,
        title: 'Moda innovadora',
        description:
            'Descubre diseños modernos que marcan tendencia, pensados para expresar tu personalidad única.',
    },
];

export default function Content() {
    const { mode } = useColorScheme();
    console.log("Estado del tema en Content:", mode);

    return (
        <Stack
            sx={{
                flexDirection: 'column',
                alignSelf: 'center',
                gap: 4,
                maxWidth: 450,
                padding: 2
            }}
        >
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                <Typography
                    variant="h4"
                    sx={{
                        color: vistelicaColors.primary,
                        fontWeight: 700,
                        letterSpacing: 1,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}
                >
                    Vistélica
                </Typography>
            </Box>
            {items.map((item, index) => (
                <Stack key={index} direction="row" sx={{ gap: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                    }}>
                        {item.icon}
                    </Box>
                    <div>
                        <Typography
                            gutterBottom
                            sx={{
                                fontWeight: 600,
                                color: mode === 'dark' ?
                                    vistelicaColors.primaryDark :
                                    vistelicaColors.primaryDark,
                            }}
                        >
                            {item.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: mode === 'dark' ?
                                    vistelicaColors.tertiary :
                                    vistelicaColors.secondary,
                            }}
                        >
                            {item.description}
                        </Typography>
                    </div>
                </Stack>
            ))}
        </Stack>
    );
}