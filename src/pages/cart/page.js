'use client';
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Container, Typography, Box, CircularProgress, Breadcrumbs, Paper, useMediaQuery, useTheme } from '@mui/material';
import CartList from './components/CartList';
import CartSummary from './components/CartSummary';
import Navbar from "@/components/layout/HeaderComponent";
import FooterComponent from "@/components/layout/FooterComponent";
import cartService from '@/services/cartService';
import { getCurrentUser } from '@/services/authService';
import EmptyCart from './components/EmptyCart';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SavingsIcon from '@mui/icons-material/Savings';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from "@/pages/shared-theme/themePrimitives";

const CartPage = React.memo(() => {
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState({
        totalOriginal: 0,
        totalDiscounted: 0,
        totalSavings: 0,
        itemCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const loadingRef = useRef(false);

    // Memoizar animaciones para mejorar rendimiento
    const headerAnimation = useMemo(() => ({
        initial: { scale: 0, rotate: isMobile ? 0 : -45 },
        animate: { scale: 1, rotate: 0 },
        transition: {
            type: "spring",
            stiffness: isMobile ? 200 : 260,
            damping: isMobile ? 25 : 20,
            delay: isMobile ? 0 : 0.1
        }
    }), [isMobile]);

    const titleAnimation = useMemo(() => ({
        initial: { x: isMobile ? 0 : 20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: {
            delay: isMobile ? 0.2 : 0.3,
            duration: isMobile ? 0.3 : 0.5
        }
    }), [isMobile]);

    const breadcrumbAnimation = useMemo(() => ({
        initial: { opacity: 0, y: isMobile ? 5 : 10 },
        animate: { opacity: 1, y: 0 },
        transition: {
            duration: isMobile ? 0.3 : 0.5,
            delay: isMobile ? 0.3 : 0.4
        }
    }), [isMobile]);

    const savingsCardAnimation = useMemo(() => ({
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        transition: {
            delay: isMobile ? 0.3 : 0.5,
            duration: isMobile ? 0.3 : 0.5
        }
    }), [isMobile]);

    const cartListAnimation = useMemo(() => ({
        initial: { opacity: 0, y: isMobile ? 10 : 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: isMobile ? -10 : -20 },
        transition: {
            duration: isMobile ? 0.3 : 0.5
        }
    }), [isMobile]);

    const loadCartData = useCallback(async () => {
        // Evita múltiples llamadas simultáneas
        if (loadingRef.current) return;

        loadingRef.current = true;
        setError(null);

        try {
            setLoading(true);
            const user = await getCurrentUser();
            const sessionId = cartService.getSessionId();

            let currentCart = null;

            if (user && sessionId) {
                currentCart = await cartService.handleCartMergeOnAuth();
            } else {
                currentCart = user
                    ? await cartService.getCart(user.user_id)
                    : await cartService.getCart(null, sessionId);
            }

            if (currentCart) {
                setCart(currentCart);
                const items = currentCart.cartDetails || [];
                setCartItems(items);

                // Obtener totales con descuentos aplicados
                const totalData = await cartService.getCartTotal(
                    user?.user_id,
                    user ? null : sessionId
                );

                // Obtener el conteo total de productos sumando las cantidades
                const totalItemCount = await cartService.getCartItemCount(
                    user?.user_id,
                    user ? null : sessionId
                );

                setCartTotal({
                    totalOriginal: totalData.summary.totalOriginal,
                    totalDiscounted: totalData.summary.totalDiscounted,
                    totalSavings: totalData.summary.totalSavings,
                    itemCount: totalItemCount
                });
            }
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            setError("No pudimos cargar tu carrito. Por favor, intenta de nuevo.");
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        loadCartData();

        // Cleanup para evitar memory leaks
        return () => {
            controller.abort();
        };
    }, [loadCartData]);

    const handleUpdateCart = useCallback(async () => {
        await loadCartData();
    }, [loadCartData]);

    const handleCheckout = useCallback(() => {
        const isGuest = !getCurrentUser() && cartService.getSessionId();
        if (isGuest) {
            router.push('/sign-in-side');
        } else {
            router.push('/checkout/Checkout');
        }
    }, [router]);

    // Memoizar los contenedores y componentes para mejorar el rendimiento
    const loadingComponent = useMemo(() => (
        <>
            <Navbar />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 'calc(100vh - 200px)',
                    flexDirection: 'column',
                    gap: 2
                }}
                role="status"
                aria-live="polite"
                aria-busy="true"
            >
                <CircularProgress
                    size={isMobile ? 30 : 40}
                    thickness={4}
                    sx={{ color: vistelicaColors.primary }}
                    aria-label="Cargando carrito"
                />
                <Typography variant="body1" sx={{ color: vistelicaColors.primary, fontWeight: 700 }}>
                    Cargando tu carrito...
                </Typography>
            </Box>
        </>
    ), [isMobile]);

    // Componentes condicionales
    if (loading) {
        return loadingComponent;
    }

    if (error) {
        return (
            <>
                <Navbar />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 'calc(100vh - 200px)',
                        flexDirection: 'column',
                        gap: 2,
                        p: 3,
                        textAlign: 'center'
                    }}
                    role="alert"
                >
                    <Typography variant="h6" color="error" gutterBottom>
                        {error}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Ha ocurrido un problema al cargar la información del carrito.
                    </Typography>
                    <Box
                        component="button"
                        onClick={() => loadCartData()}
                        sx={{
                            bgcolor: vistelicaColors.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: `${vistelicaColors.primary}DD`
                            }
                        }}
                    >
                        Intentar de nuevo
                    </Box>
                </Box>
            </>
        );
    }

    if (!cart || cartItems.length === 0) {
        return <EmptyCart />;
    }

    // Estilos memoizados
    const containerStyles = {
        mb: 4,
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden'
    };

    // Formato del ahorro para mejor accesibilidad
    const formattedSavings = cartTotal.totalSavings.toFixed(2);

    return (
        <>
            <Navbar />
            <Container
                maxWidth="xl"
                sx={{
                    my: { xs: 2, sm: 4 },
                    px: { xs: 2, md: 4 },
                    minHeight: 'calc(100vh - 200px)'
                }}
                aria-labelledby="cart-title"
            >
                {/* Encabezado de Mi Carrito rediseñado */}
                <Paper
                    elevation={0}
                    sx={{
                        ...containerStyles,
                        background: `linear-gradient(135deg, white 0%, ${vistelicaColors.backgroundLight} 100%)`,
                        border: `1px solid ${vistelicaColors.primary}20`
                    }}
                >
                    {/* Fondo decorativo */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '30%',
                            height: '100%',
                            opacity: 0.05,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${vistelicaColors.primary.replace('#', '')}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: '30px 30px',
                            pointerEvents: 'none',
                            zIndex: 0,
                            loading: "lazy"
                        }}
                        aria-hidden="true"
                    />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: { xs: 1.5, sm: 2 }
                        }}>
                            <motion.div {...headerAnimation}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: `${vistelicaColors.primary}15`,
                                        width: { xs: 50, sm: 70 },
                                        height: { xs: 50, sm: 70 },
                                        borderRadius: '50%',
                                        mr: { xs: 1.5, sm: 2 }
                                    }}
                                    aria-hidden="true"
                                >
                                    <ShoppingCartIcon sx={{
                                        fontSize: { xs: 28, sm: 40 },
                                        color: vistelicaColors.primary
                                    }} />
                                </Box>
                            </motion.div>

                            <motion.div {...titleAnimation}>
                                <Typography
                                    variant={isMobile ? "h4" : "h3"}
                                    component="h1"
                                    id="cart-title"
                                    sx={{
                                        fontWeight: 700,
                                        fontFamily: typography.fontFamily.heading,
                                        letterSpacing: '1px',
                                        position: 'relative',
                                        display: 'inline-block',
                                        background: vistelicaColors.primary,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: '0px 2px 5px rgba(0,0,0,0.05)',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: -8,
                                            left: '10%',
                                            width: '80%',
                                            height: 4,
                                            borderRadius: 2,
                                            background: `linear-gradient(90deg, transparent, ${vistelicaColors.primary}60, transparent)`,
                                        }
                                    }}
                                >
                                    MI CARRITO
                                </Typography>
                            </motion.div>
                        </Box>

                        {/* Breadcrumb mejorado debajo del título */}
                        <motion.div {...breadcrumbAnimation}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mt: { xs: 1.5, sm: 2 },
                                    backgroundColor: 'rgba(255,255,255,0.6)',
                                    borderRadius: 10,
                                    py: 0.8,
                                    px: 2,
                                    backdropFilter: 'blur(4px)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    maxWidth: 'fit-content',
                                    mx: 'auto'
                                }}
                                role="navigation"
                                aria-label="Navegación de migas de pan"
                            >
                                <Breadcrumbs
                                    separator={
                                        <NavigateNextIcon
                                            fontSize="small"
                                            sx={{ color: vistelicaColors.primary }}
                                        />
                                    }
                                    aria-label="breadcrumb"
                                >
                                    <Link
                                        href="/"
                                        style={{
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: 'inherit'
                                        }}
                                        aria-label="Ir a inicio"
                                    >
                                        <HomeIcon
                                            sx={{
                                                mr: 0.5,
                                                fontSize: { xs: 16, sm: 18 },
                                                color: vistelicaColors.primary
                                            }}
                                        />
                                        <Typography
                                            sx={{
                                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                                fontWeight: 500,
                                                color: 'text.secondary',
                                                '&:hover': {
                                                    color: vistelicaColors.primary
                                                }
                                            }}
                                        >
                                            Inicio
                                        </Typography>
                                    </Link>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: vistelicaColors.primary,
                                        borderRadius: 5,
                                        px: { xs: 1, sm: 1.2 },
                                        py: 0.3
                                    }}
                                         aria-current="page"
                                    >
                                        <ShoppingCartIcon
                                            sx={{
                                                mr: 0.5,
                                                fontSize: { xs: 14, sm: 16 },
                                                color: 'white'
                                            }}
                                        />
                                        <Typography
                                            sx={{
                                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                                fontWeight: 600,
                                                color: 'white'
                                            }}
                                        >
                                            Carrito
                                        </Typography>
                                    </Box>
                                </Breadcrumbs>
                            </Box>
                        </motion.div>
                    </Box>
                </Paper>

                {/* Mensaje de ahorro mejorado */}
                {cartTotal.totalSavings > 0 && (
                    <motion.div
                        {...savingsCardAnimation}
                        role="status"
                        aria-live="polite"
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                ...containerStyles,
                                background: `linear-gradient(135deg, ${vistelicaColors.error}90, ${vistelicaColors.error})`,
                                border: '1px solid rgba(255,255,255,0.5)',
                                boxShadow: '0 4px 12px rgba(255,0,0,0.15)',
                                color: 'white',
                                transform: 'rotate(0deg)',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '35%',
                                    background: 'linear-gradient(rgba(255,255,255,0.2), transparent)',
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                    zIndex: 0,
                                }
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: { xs: 2, sm: 3 },
                                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                position: 'relative',
                                zIndex: 1,
                                textAlign: { xs: 'center', sm: 'left' }
                            }}>
                                <motion.div
                                    animate={!isMobile ? {
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.05, 1]
                                    } : {}}
                                    transition={{
                                        repeat: Infinity,
                                        repeatDelay: isMobile ? 10 : 6,
                                        duration: 1.2
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: '50%',
                                            width: { xs: 50, sm: 64 },
                                            height: { xs: 50, sm: 64 },
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            border: '1px solid rgba(255,255,255,0.8)',
                                            mb: { xs: 1, sm: 0 }
                                        }}
                                        aria-hidden="true"
                                    >
                                        <SavingsIcon
                                            sx={{
                                                fontSize: { xs: 28, sm: 34 },
                                                color: vistelicaColors.error
                                            }}
                                        />
                                    </Box>
                                </motion.div>

                                <Box sx={{ mx: 'auto' }}>
                                    <Typography
                                        variant={isMobile ? "subtitle1" : "h6"}
                                        sx={{
                                            fontWeight: 800,
                                            letterSpacing: 0.5,
                                            fontFamily: typography.fontFamily.heading,
                                            color: 'white',
                                            textAlign: 'center',
                                            textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                                            fontSize: { xs: '1.1rem', sm: '1.3rem' },
                                            mb: 0.5
                                        }}
                                    >
                                        ¡FELICIDADES!
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: { xs: '0.9rem', sm: '1.05rem' },
                                            fontWeight: 600,
                                            color: 'white',
                                            textAlign: 'center',
                                            textShadow: '0 1px 1px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        Has ahorrado{' '}
                                        <Box
                                            component="span"
                                            sx={{
                                                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                                                fontWeight: 800,
                                                px: { xs: 0.8, sm: 1.2 },
                                                py: 0.2,
                                                mx: 0.5,
                                                borderRadius: 1.5,
                                                backgroundColor: 'white',
                                                color: vistelicaColors.error,
                                                display: 'inline-block',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                border: '1px solid rgba(255,255,255,0.9)'
                                            }}
                                            aria-label={`Ahorro de ${formattedSavings} euros`}
                                        >
                                            {formattedSavings}€
                                        </Box>{' '}
                                        con los descuentos aplicados
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </motion.div>
                )}

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 2, sm: 3 },
                    alignItems: 'flex-start'
                }}>
                    <AnimatePresence>
                        <motion.div
                            {...cartListAnimation}
                            style={{ flex: 1, minWidth: 0, width: '100%' }}
                        >
                            <CartList
                                cartItems={cartItems}
                                onUpdate={handleUpdateCart}
                                userId={cart.user?.user_id}
                                sessionId={cart.session_id}
                            />
                        </motion.div>
                    </AnimatePresence>

                    <Box sx={{
                        width: { xs: '100%', md: '350px' },
                        position: { md: 'sticky' },
                        top: 100
                    }}>
                        <CartSummary
                            totalPrice={cartTotal.totalDiscounted}
                            itemCount={cartTotal.itemCount}
                            isGuest={!cart.user && cart.session_id}
                            onCheckout={handleCheckout}
                        />
                    </Box>
                </Box>
            </Container>
            <FooterComponent />
        </>
    );
});

CartPage.displayName = 'CartPage';

export default CartPage;