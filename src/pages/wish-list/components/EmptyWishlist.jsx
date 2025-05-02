import React from 'react';
import { Box, Typography, Button, Paper, useMediaQuery, useTheme, Fade, Zoom } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useRouter } from 'next/router';
import { vistelicaColors } from '../../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import { motion } from 'framer-motion';

const EmptyWishlist = () => {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // Animaciones para el corazón
    const heartAnimation = {
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0],
        transition: {
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 3
        }
    };

    return (
        <>


            <Fade in={true} timeout={800}>
                <Paper
                    elevation={0}
                    sx={{
                        textAlign: 'center',
                        py: { xs: 5, sm: 6, md: 8 },
                        px: { xs: 2, sm: 4, md: 6 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: `linear-gradient(145deg, #f8f8f8, #ffffff)`,
                        borderRadius: 4,
                        mb: 4,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decoración de fondo */}
                    <Box sx={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        backgroundColor: `${vistelicaColors.secondary}10`,
                        zIndex: 0
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        bottom: -80,
                        left: -80,
                        width: 160,
                        height: 160,
                        borderRadius: '50%',
                        backgroundColor: `${vistelicaColors.primary.main}10`,
                        zIndex: 0
                    }} />

                    <Box
                        component={motion.div}
                        animate={heartAnimation}
                        sx={{
                            backgroundColor: 'white',
                            p: { xs: 2.5, sm: 3 },
                            borderRadius: '50%',
                            mb: 3,
                            boxShadow: '0px 8px 30px rgba(0,0,0,0.08)',
                            position: 'relative',
                            zIndex: 1
                        }}
                    >
                        <FavoriteBorderIcon
                            sx={{
                                fontSize: { xs: 50, sm: 60, md: 70 },
                                color: vistelicaColors.secondary
                            }}
                        />
                    </Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        mb={1.5}
                        sx={{
                            fontFamily: typography.fontFamily,
                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                            position: 'relative',
                            zIndex: 1
                        }}
                    >
                        Tu lista de favoritos está vacía
                    </Typography>

                    <Typography
                        variant="body1"
                        mb={4}
                        sx={{
                            maxWidth: { xs: '100%', sm: 450 },
                            mx: 'auto',
                            color: '#666',
                            fontFamily: typography.fontFamily,
                            position: 'relative',
                            zIndex: 1
                        }}
                    >
                        Explora nuestro catálogo y añade tus productos favoritos para guardarlos aquí.
                        Podrás volver a consultarlos cuando quieras.
                    </Typography>

                    <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ShoppingBagOutlinedIcon />}
                            onClick={() => router.push('/products')}
                            sx={{
                                px: { xs: 3, sm: 4 },
                                py: 1.5,
                                borderRadius: '50px',
                                background: `linear-gradient(45deg, ${vistelicaColors.primary}, ${vistelicaColors.primaryLight})`,
                                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                fontFamily: typography.fontFamily,
                                fontWeight: 500,
                                textTransform: 'none',
                                fontSize: '1rem',
                                position: 'relative',
                                zIndex: 1,
                                '&:hover': {
                                    background: `linear-gradient(45deg, ${vistelicaColors.secondary}, ${vistelicaColors.primary.main})`,
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                                    transform: 'translateY(-3px)'
                                },
                                transition: 'all 0.3s ease-in-out',
                                mb: { xs: 3, sm: 4 }
                            }}
                        >
                            Ver productos
                        </Button>
                    </Zoom>

                    {/* Mensaje destacado sobre almacenamiento temporal */}
                    <Fade in={true} style={{ transitionDelay: '600ms' }}>
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 3,
                                p: 2.5,
                                px: { xs: 2, sm: 3 },
                                width: '100%',
                                maxWidth: 500,
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 2,
                                backgroundColor: `${vistelicaColors.primary.main}08`,
                                border: `1px solid ${vistelicaColors.primary.main}20`,
                                position: 'relative',
                                zIndex: 1,
                                '&:hover': {
                                    backgroundColor: `${vistelicaColors.primary.main}12`,
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(0,0,0,0.07)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <InfoOutlinedIcon sx={{
                                color: vistelicaColors.primary.main,
                                fontSize: { xs: 24, sm: 28 },
                                mt: 0.3
                            }} />
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    sx={{
                                        mb: 0.5,
                                        color: vistelicaColors.primary.main,
                                        fontFamily: typography.fontFamily,
                                        fontSize: { xs: '0.95rem', sm: '1.1rem' }
                                    }}
                                >
                                    ¿Sabías que...?
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#555',
                                        fontFamily: typography.fontFamily,
                                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                        lineHeight: 1.5
                                    }}
                                >
                                    Si no has iniciado sesión, tus favoritos se guardarán temporalmente
                                    en este dispositivo. <b>Inicia sesión</b> para conservarlos permanentemente y
                                    acceder a ellos desde cualquier dispositivo.
                                </Typography>
                            </Box>
                        </Paper>
                    </Fade>
                </Paper>
            </Fade>
        </>
    );
};

export default EmptyWishlist;