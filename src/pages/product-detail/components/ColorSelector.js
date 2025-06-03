"use client";

import React from 'react';
import { Box, Typography, Grid, Tooltip } from '@mui/material';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from "@/pages/shared-theme/themePrimitives";

const ColorSelector = ({ colors, selectedColor, onColorChange }) => {
    const getColorValue = (color) => {
        // Mapeo de colores a valores hexadecimales
        const colorMap = {
            RED: '#ff0000',
            BLACK: '#000000',
            WHITE: '#ffffff',
            BLUE: '#0000ff',
            GREEN: '#00ff00',
            YELLOW: '#ffff00',
            ORANGE: '#ffa500',
            PURPLE: '#800080',
            BROWN: '#715638',
            GRAY: '#808080',
            PINK: '#ffc0cb',
            BEIGE: '#f5f5dc',
            GOLD: '#ffd700',
            SILVER: '#c0c0c0'
        };
        return colorMap[color] || '#cccccc';
    };

    // Función para obtener un nombre más amigable del color
    const getColorName = (color) => {
        const colorNames = {
            RED: 'Rojo',
            BLACK: 'Negro',
            WHITE: 'Blanco',
            BLUE: 'Azul',
            GREEN: 'Verde',
            YELLOW: 'Amarillo',
            ORANGE: 'Naranja',
            PURPLE: 'Morado',
            BROWN: 'Marrón',
            GRAY: 'Gris',
            PINK: 'Rosa',
            BEIGE: 'Beige',
            GOLD: 'Dorado',
            SILVER: 'Plateado'
        };
        return colorNames[color] || color;
    };

    return (
        <Box mb={3}>
            <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                    fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                    fontFamily: typography.fontFamily,
                    fontWeight: 500,
                    color: vistelicaColors.secondary,
                    mb: 1
                }}
            >
                Colores:
            </Typography>
            <Grid
                container
                spacing={{ xs: 1, sm: 1.5 }}
                sx={{
                    ml: -0.5,
                    maxWidth: '100%',
                    flexWrap: 'wrap'
                }}
            >
                {colors.map((color) => (
                    <Grid item key={color}>
                        <Tooltip
                            title={getColorName(color)}
                            arrow
                            placement="top"
                        >
                            <Box
                                onClick={() => onColorChange(color)}
                                aria-label={`Color ${getColorName(color)}`}
                                role="button"
                                tabIndex={0}
                                sx={{
                                    width: { xs: 28, sm: 32, md: 36 },
                                    height: { xs: 28, sm: 32, md: 36 },
                                    borderRadius: '50%',
                                    backgroundColor: getColorValue(color),
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    border: selectedColor === color
                                        ? `2px solid ${vistelicaColors.primary}`
                                        : '1px solid #ddd',
                                    boxShadow: selectedColor === color
                                        ? `0 0 0 2px ${vistelicaColors.primary}`
                                        : 'none',
                                    '&:hover': {
                                        boxShadow: `0 0 0 2px ${vistelicaColors.primary}`,
                                        transform: 'scale(1.1)'
                                    },
                                    '&:focus': {
                                        outline: 'none',
                                        boxShadow: `0 0 0 3px ${vistelicaColors.primary}80`
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        onColorChange(color);
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Tooltip>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ColorSelector; 