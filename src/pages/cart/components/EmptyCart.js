'use client';
import React, { useCallback, useMemo } from 'react';
import { Box, Button, Typography, Container, Paper, useTheme, useMediaQuery } from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { vistelicaColors } from "@/components/shared/vistelicaColors";
import { typography } from "@/components/shared/themePrimitives";
import Navbar from "@/components/layout/HeaderComponent";

const EmptyCart = React.memo(() => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // Animaciones optimizadas para diferentes dispositivos
    const containerAnimation = useMemo(() => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: isMobile ? 0.3 : 0.5 }
    }), [isMobile]);

    const iconAnimation = useMemo(() => ({
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: {
            type: "spring",
            stiffness: isMobile ? 200 : 260,
            damping: 20,
            delay: 0.2
        }
    }), [isMobile]);

    const buttonAnimation = useMemo(() => ({
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.4, duration: isMobile ? 0.2 : 0.3 }
    }), [isMobile]);

    const iconSize = useMemo(() => ({
        width: { xs: 80, sm: 100 },
        height: { xs: 80, sm: 100 },
        fontSize: { xs: 40, sm: 50 }
    }), []);

    return (
        <>
            <Navbar />
            <Container
                maxWidth="md"
                sx={{
                    py: { xs: 6, sm: 8, md: 10 },
                    px: { xs: 2, md: 4 }
                }}
            >
                <motion.div
                    {...containerAnimation}
                    layout
                >
                    <Paper
                        elevation={0}
                        sx={{
                            textAlign: 'center',
                            py: { xs: 6, sm: 8 },
                            px: { xs: 2, sm: 3 },
                            borderRadius: { xs: 3, sm: 4 },
                            border: '1px solid #eaeaea',
                        }}
                    >
                        <motion.div
                            {...iconAnimation}
                        >
                            <Box
                                sx={{
                                    width: iconSize.width,
                                    height: iconSize.height,
                                    borderRadius: '50%',
                                    backgroundColor: `${vistelicaColors.primary}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    mb: 3
                                }}
                            >
                                <ShoppingBasketIcon
                                    sx={{
                                        fontSize: iconSize.fontSize,
                                        color: vistelicaColors.primary,
                                    }}
                                />
                            </Box>
                        </motion.div>

                        <Typography
                            variant={isMobile ? "h5" : "h4"}
                            gutterBottom
                            sx={{
                                fontFamily: typography.fontFamily.heading,
                                fontWeight: 600,
                                mb: 2
                            }}
                        >
                            Tu carrito está vacío
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                mb: 4,
                                maxWidth: 500,
                                mx: 'auto',
                                fontFamily: typography.fontFamily.body,
                                fontSize: { xs: '0.9rem', sm: '1rem' }
                            }}
                        >
                            Parece que no has agregado ningún producto a tu carrito todavía.
                            Explora nuestra colección y encuentra prendas que te encanten.
                        </Typography>

                        <motion.div
                            {...buttonAnimation}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                href="/"
                                component={Link}
                                size={isMobile ? "medium" : "large"}
                                sx={{
                                    px: { xs: 3, sm: 4 },
                                    py: { xs: 1, sm: 1.5 },
                                    borderRadius: 2,
                                    fontFamily: typography.fontFamily.heading,
                                    fontWeight: 600,
                                    backgroundColor: vistelicaColors.primary,
                                    '&:hover': {
                                        backgroundColor: vistelicaColors.primaryDark
                                    }
                                }}
                            >
                                Explorar productos
                            </Button>
                        </motion.div>

                        <Box sx={{ mt: { xs: 4, sm: 6 } }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mb: { xs: 1.5, sm: 2 },
                                    fontWeight: 600,
                                    fontFamily: typography.fontFamily.heading,
                                    color: 'text.secondary',
                                    fontSize: { xs: '0.75rem', sm: '0.8rem' }
                                }}
                            >
                                ¿YA TIENES UNA CUENTA?
                            </Typography>

                            <Button
                                variant="outlined"
                                href="/sign-in-side/Sign-in-side"
                                component={Link}
                                size={isMobile ? "small" : "medium"}
                                sx={{
                                    fontFamily: typography.fontFamily.body,
                                    borderColor: vistelicaColors.secondary,
                                    color: vistelicaColors.secondary,
                                    '&:hover': {
                                        borderColor: vistelicaColors.secondary,
                                        backgroundColor: `${vistelicaColors.secondary}10`
                                    }
                                }}
                            >
                                Iniciar sesión
                            </Button>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </>
    );
});

EmptyCart.displayName = 'EmptyCart';

export default EmptyCart;