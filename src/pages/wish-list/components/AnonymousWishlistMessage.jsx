import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, useTheme, useMediaQuery, Fade } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/router';
import { vistelicaColors } from '../../../components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";
import { motion } from 'framer-motion';

const AnonymousWishlistMessage = () => {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verificar autenticación al cargar el componente
        // Ajusta esto según tu método de autenticación actual
        const checkAuth = () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            setIsAuthenticated(!!token);
        };

        checkAuth();
    }, []);

    // Si el usuario ya está autenticado, no mostramos este componente
    if (isAuthenticated) return null;

    const iconAnimation = {
        y: [0, -5, 0],
        transition: {
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1
        }
    };

    return (
        <Fade in={true} timeout={600}>
            <Paper
                elevation={0}
                sx={{
                    mb: 4,
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    border: `1px solid ${vistelicaColors.primary.main}15`,
                    backgroundColor: `${vistelicaColors.primary.main}05`,
                }}
            >
                {/* Elementos decorativos de fondo */}
                <Box sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${vistelicaColors.primary.main}10 0%, transparent 70%)`,
                    zIndex: 0
                }} />

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    p: { xs: 2.5, sm: 3 },
                }}>
                    <Box
                        component={motion.div}
                        animate={iconAnimation}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: `${vistelicaColors.primary.main}15`,
                            borderRadius: '50%',
                            p: { xs: 1.5, sm: 2 },
                            mr: { xs: 0, sm: 3 },
                            mb: { xs: 2, sm: 0 },
                            zIndex: 1
                        }}
                    >
                        <AccountCircleIcon sx={{
                            fontSize: { xs: 30, sm: 36 },
                            color: vistelicaColors.primary.main,
                        }} />
                    </Box>

                    <Box sx={{ flex: 1, zIndex: 1 }}>
                        <Typography
                            fontWeight="600"
                            sx={{
                                mb: 0.5,
                                fontFamily: typography.fontFamily,
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                color: vistelicaColors.primary.main
                            }}
                        >
                            Tus favoritos se guardarán temporalmente
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: typography.fontFamily,
                                mb: { xs: 2, sm: 0 },
                                color: 'text.secondary',
                                maxWidth: 600
                            }}
                        >
                            Para guardarlos permanentemente y acceder desde cualquier dispositivo,
                            inicia sesión o crea una cuenta.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        onClick={() => router.push('/sign-in-side/Sign-in-side')}
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                            ml: { xs: 0, sm: 2 },
                            px: { xs: 2, sm: 3 },

                            py: 1,
                            borderRadius: 6,
                            textTransform: 'none',
                            fontFamily: typography.fontFamily,
                            fontWeight: 500,
                            zIndex: 1,
                            background: `linear-gradient(45deg, ${vistelicaColors.primary}, ${vistelicaColors.primaryLight || vistelicaColors.primary.light})`,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            '&:hover': {
                                background: `linear-gradient(45deg, ${vistelicaColors.secondary || vistelicaColors.primary.light}, ${vistelicaColors.primary.main})`,
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Iniciar sesión
                    </Button>
                </Box>
            </Paper>
        </Fade>
    );
};

export default AnonymousWishlistMessage;