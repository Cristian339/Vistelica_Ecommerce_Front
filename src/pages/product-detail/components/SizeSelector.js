// SizeSelector.js actualizado
"use client";

import React from 'react';
import { Button, Typography, Grid, Box } from '@mui/material';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";

const SizeSelector = ({ sizes, selectedSize, onSizeChange }) => {
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
                                color: vistelicaColors.primary,
                                borderColor: vistelicaColors.primary,
                                backgroundColor: vistelicaColors.tertiary,
                                ...(selectedSize === size && {
                                    color: vistelicaColors.tertiary,
                                    backgroundColor: vistelicaColors.primary,
                                    borderColor: vistelicaColors.primary,
                                }),
                                '&:hover': {
                                    borderColor: vistelicaColors.primaryDark,
                                    backgroundColor: selectedSize === size
                                        ? vistelicaColors.primaryDark
                                        : 'rgba(228, 176, 2, 0.08)'
                                }
                            }}
                            onClick={() => onSizeChange(size)}
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