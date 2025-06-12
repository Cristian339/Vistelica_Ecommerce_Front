"use client";
import React, { lazy, Suspense, memo } from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Lazy loading para componentes menos críticos
const Content = lazy(() => import('./components/Content'));
const SignInCard = lazy(() => import('./components/SignInCard'));

// Componente de carga para Suspense
const LoadingFallback = memo(() => (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%'
    }}>
        <CircularProgress sx={{ color: vistelicaColors.primary }} />
    </Box>
));
LoadingFallback.displayName = 'LoadingFallback';

// Componente principal optimizado con memo
const SignInSide = memo(function SignInSide(props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />

            {/* Color mode selector con posición ajustada para móviles */}
            <ColorModeSelect
                sx={{
                    position: 'fixed',
                    top: isMobile ? '0.5rem' : '1rem',
                    right: isMobile ? '0.5rem' : '1rem',
                    zIndex: 10
                }}
                aria-label="Cambiar tema de color"
            />

            {/* Contenedor principal con roles de accesibilidad */}
            <Stack
                direction="column"
                component="main"
                role="main"
                aria-label="Página de inicio de sesión"
                sx={[
                    {
                        justifyContent: 'center',
                        height: '100vh', // Más compatible con diferentes navegadores
                        minHeight: '100%',
                        width: '100%',
                        fontFamily: typography.fontFamily,
                        overflowX: 'hidden', // Evitar scroll horizontal en móviles
                    },
                    (theme) => ({
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'fixed', // fixed en lugar de absolute para mejor rendimiento
                            zIndex: -1,
                            inset: 0,
                            backgroundImage:
                                'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover', // Asegura cobertura completa
                            ...theme.applyStyles('dark', {
                                backgroundImage:
                                    'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
                            }),
                        },
                    }),
                ]}
            >
                {/* Contenedor del contenido optimizado */}
                <Stack
                    direction={{ xs: 'column-reverse', md: 'row' }}
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: {
                            xs: 4,
                            sm: 6,
                            md: 8,
                            lg: 12
                        }, // Breakpoints más granulares
                        p: {
                            xs: 2,
                            sm: 3,
                            md: 4
                        },
                        width: '100%',
                        maxWidth: {
                            xs: '100%',
                            sm: '90%',
                            md: '1200px'
                        },
                        mx: 'auto',
                        height: '100%',
                    }}
                >
                    <Suspense fallback={<LoadingFallback />}>
                        <Content />
                        <SignInCard />
                    </Suspense>
                </Stack>
            </Stack>
        </AppTheme>
    );
});

SignInSide.propTypes = {
    disableCustomTheme: PropTypes.bool
};

export default SignInSide;