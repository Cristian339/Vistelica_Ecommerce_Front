'use client';
import React from 'react';
import { Box } from '@mui/material';

const BannerSection = () => {
    return (
        <Box
            sx={{
                width: '100%',
                backgroundColor: '#cc0000', // Color rojo similar al de tu banner
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: { xs: 2, sm: 3, md: 4 }, // Padding vertical responsivo
            }}
        >
            <Box
                sx={{
                    color: 'white',
                    typography: 'h3',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: { xs: '2rem', sm: '3rem', md: '6rem' },
                }}
            >
                ÚLTIMAS <Box component="span" sx={{ border: '2px solid white', px: 2, py: 1 }}>UNIDADES</Box>
            </Box>
        </Box>
    );
};




export default BannerSection;