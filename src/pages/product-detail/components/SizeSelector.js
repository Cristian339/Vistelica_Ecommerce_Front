"use client";

import React, { useState } from 'react';
import { Button, Typography, Grid, Box } from '@mui/material';

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
                                borderColor: selectedSize === size ? 'primary.main' : 'divider',
                                bgcolor: selectedSize === size ? 'primary.light' : 'background.paper',
                                '&:hover': {
                                    borderColor: 'primary.main'
                                }
                            }}
                            onClick={() => setSelectedSize(size)}
                        >
                            {size}
                        </Button>
                    </Grid>
                ))}
            </Grid>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mt: 0.5 }}>
        <span style={{ textDecoration: 'underline', color: 'primary.main', cursor: 'pointer' }}>
          Guía de tallas
        </span>
            </Typography>
        </Box>
    );
};

export default SizeSelector;