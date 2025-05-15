'use client';

import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { useRouter } from 'next/navigation';

const SizeGuideSelector = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        // Navegar a la página correspondiente
        switch(newValue) {
            case 0:
                router.push('/guia-tallas/hombre');
                break;
            case 1:
                router.push('/guia-tallas/mujer');
                break;
            case 2:
                router.push('/guia-tallas/nino');
                break;
            default:
                router.push('/guia-tallas/hombre');
        }
    };

    return (
        <Box sx={{
            width: '100%',
            mb: 4,
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            boxShadow: theme.shadows[1]
        }}>
            <Typography
                variant="h6"
                sx={{
                    px: 3,
                    pt: 2,
                    fontWeight: 500,
                    color: theme.palette.text.secondary
                }}
            >
                SELECCIONA LA GUÍA DE TALLAS
            </Typography>
            <Tabs
                value={value}
                onChange={handleChange}
                variant={isMobile ? 'scrollable' : 'fullWidth'}
                scrollButtons="auto"
                aria-label="Selector de guías de tallas"
                sx={{
                    '& .MuiTabs-indicator': {
                        backgroundColor: theme.palette.primary.main,
                        height: 3
                    }
                }}
            >
                <Tab
                    label="Hombre"
                    sx={{
                        fontWeight: 500,
                        textTransform: 'none',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        minWidth: 'unset',
                        px: isMobile ? 1.5 : 3
                    }}
                />
                <Tab
                    label="Mujer"
                    sx={{
                        fontWeight: 500,
                        textTransform: 'none',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        minWidth: 'unset',
                        px: isMobile ? 1.5 : 3
                    }}
                />
                <Tab
                    label="Niño"
                    sx={{
                        fontWeight: 500,
                        textTransform: 'none',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        minWidth: 'unset',
                        px: isMobile ? 1.5 : 3
                    }}
                />
            </Tabs>
        </Box>
    );
};

export default SizeGuideSelector;