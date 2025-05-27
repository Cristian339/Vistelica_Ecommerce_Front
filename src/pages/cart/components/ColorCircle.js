'use client';
import React, { useMemo } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

// Función para traducir colores del inglés al español
const getColorTranslation = (colorName) => {
    if (!colorName) return 'N/A';

    const colorTranslations = {
        'RED': 'Rojo',
        'BLACK': 'Negro',
        'WHITE': 'Blanco',
        'BLUE': 'Azul',
        'GREEN': 'Verde',
        'YELLOW': 'Amarillo',
        'ORANGE': 'Naranja',
        'PURPLE': 'Morado',
        'BROWN': 'Marrón',
        'GRAY': 'Gris',
        'PINK': 'Rosa',
        'BEIGE': 'Beige',
        'GOLD': 'Dorado',
        'SILVER': 'Plateado',
        'NAVY': 'Azul marino'
    };

    return colorTranslations[colorName?.toUpperCase()] || colorName;
};

// Función para mapear nombres de colores a valores HEX
const getColorHex = (colorName) => {
    if (!colorName) return '#CCCCCC';

    const colorMap = {
        RED: '#FF0000',
        BLACK: '#000000',
        WHITE: '#FFFFFF',
        BLUE: '#0000FF',
        GREEN: '#00FF00',
        YELLOW: '#FFFF00',
        ORANGE: '#FFA500',
        PURPLE: '#800080',
        BROWN: '#715638',
        GRAY: '#808080',
        PINK: '#FFC0CB',
        BEIGE: '#F5F5DC',
        GOLD: '#FFD700',
        SILVER: '#C0C0C0',
        NAVY: '#000080'
    };

    return colorMap[colorName?.toUpperCase()] || '#CCCCCC';
};

const ColorCircle = React.memo(({ color }) => {
    // Memoizamos los cálculos para evitar recálculos innecesarios
    const colorHex = useMemo(() => getColorHex(color), [color]);
    const colorTranslated = useMemo(() => getColorTranslation(color), [color]);
    const isLightColor = useMemo(() =>
            ['WHITE', 'YELLOW', 'BEIGE'].includes(color?.toUpperCase()),
        [color]);

    return (
        <Tooltip
            title={colorTranslated}
            arrow
            placement="top"
            enterTouchDelay={0}
            leaveTouchDelay={1500}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.3, sm: 0.5 },
                cursor: 'pointer',
                '&:hover': {
                    '& .color-circle': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }
                }
            }}>
                <Box
                    className="color-circle"
                    sx={{
                        width: { xs: 16, sm: 18 },
                        height: { xs: 16, sm: 18 },
                        borderRadius: '50%',
                        backgroundColor: colorHex,
                        border: isLightColor ? '1px solid #ccc' : 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    aria-label={`Color ${colorTranslated}`}
                />
                <Typography
                    variant="caption"
                    sx={{
                        opacity: 0.8,
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        userSelect: 'none'
                    }}>
                    Color
                </Typography>
            </Box>
        </Tooltip>
    );
});

ColorCircle.displayName = 'ColorCircle';

export default ColorCircle;