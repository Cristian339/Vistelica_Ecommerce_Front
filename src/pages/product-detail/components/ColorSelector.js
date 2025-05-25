"use client";

import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";

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
            BROWN: '#431515',
            GRAY: '#808080',
            PINK: '#ffc0cb',
            BEIGE: '#f5f5dc',
            GOLD: '#ffd700',
            SILVER: '#c0c0c0'
        };
        return colorMap[color] || '#cccccc';
    };

    return (
        <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem' }}>
                Colores:
            </Typography>
            <Grid container spacing={1}>
                {colors.map((color) => (
                    <Grid item key={color}>
                        <Box
                            onClick={() => onColorChange(color)}
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: getColorValue(color),
                                cursor: 'pointer',
                                border: selectedColor === color
                                    ? `2px solid ${vistelicaColors.primary}`
                                    : '1px solid #ddd',
                                boxShadow: selectedColor === color
                                    ? `0 0 0 2px ${vistelicaColors.primary}`
                                    : 'none',
                                '&:hover': {
                                    boxShadow: `0 0 0 2px ${vistelicaColors.primary}`
                                }
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ColorSelector;