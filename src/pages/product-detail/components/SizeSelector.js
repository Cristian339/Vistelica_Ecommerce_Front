"use client";

import React, { useState } from 'react';
import { Button, Typography, Grid, Box } from '@mui/material';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";

const SizeSelector = ({ sizes }) => {
    const [selectedSize, setSelectedSize] = useState(null);

    return (
        <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem' }}>
                Tallas:
            </Typography>
            <Grid container spacing={0.5}>
                {sizes.map((size) => (
                    <Grid item key={size}>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                minWidth: '32px',
                                minHeight: '32px',
                                p: 0,
                                // Estado normal
                                color: vistelicaColors.primary, // Texto dorado
                                borderColor: vistelicaColors.primary, // Borde dorado
                                backgroundColor: vistelicaColors.tertiary, // Fondo blanco
                                // Estado seleccionado
                                ...(selectedSize === size && {
                                    color: vistelicaColors.tertiary, // Texto blanco
                                    backgroundColor: vistelicaColors.primary, // Fondo dorado
                                    borderColor: vistelicaColors.primary, // Borde dorado
                                }),
                                // Hover
                                '&:hover': {
                                    borderColor: vistelicaColors.primaryDark, // Borde dorado oscuro
                                    backgroundColor: selectedSize === size
                                        ? vistelicaColors.primaryDark // Si está seleccionado, fondo dorado oscuro al hover
                                        : 'rgba(228, 176, 2, 0.08)' // Si no está seleccionado, fondo muy claro
                                }
                            }}
                            onClick={() => setSelectedSize(size)}
                        >
                            {size}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SizeSelector;