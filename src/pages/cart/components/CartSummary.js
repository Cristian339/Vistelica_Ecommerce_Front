'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, Button, Divider, Tooltip, Paper, CircularProgress, Badge, Snackbar, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from "@/pages/shared-theme/themePrimitives";
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/authService';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentIcon from '@mui/icons-material/Payment';
import ShippingInfoCard from './ShippingInfoCard';
import SecurityBadges from './SecurityBadges';

const CartSummary = React.memo(({
                                    totalPrice = 0,
                                    itemCount = 0,
                                    isGuest = false,
                                    onCheckout
                                }) => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSecurityBadge, setShowSecurityBadge] = useState(false);
    const [animateTotal, setAnimateTotal] = useState(false);
    const [orderReference, setOrderReference] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Verificación de autenticación con useMemo como solicitaste
    const isAuthenticated = useMemo(() => {
        if (typeof window !== 'undefined') {
            return Boolean(localStorage.getItem("token"));
        }
        return false;
    }, []);

    // Cálculos de envío gratuito - memoizados
    const freeShippingThreshold = 50;
    const qualifiesForFreeShipping = useMemo(() =>
            totalPrice >= freeShippingThreshold,
        [totalPrice, freeShippingThreshold]
    );

    const amountToFreeShipping = useMemo(() =>
            freeShippingThreshold - totalPrice,
        [freeShippingThreshold, totalPrice]
    );

    const freeShippingProgress = useMemo(() =>
            Math.min((totalPrice / freeShippingThreshold) * 100, 100),
        [totalPrice, freeShippingThreshold]
    );

    // Generar número de pedido solo una vez al montar el componente
    useEffect(() => {
        setOrderReference(`VIS-${Math.floor(100000 + Math.random() * 900000)}`);
    }, []);

    // Animaciones adicionales
    useEffect(() => {
        // Mostrar badge de seguridad después de un pequeño retraso
        const timer = setTimeout(() => {
            setShowSecurityBadge(true);
        }, 1500);

        // Animar el total periódicamente
        const animationTimer = setInterval(() => {
            setAnimateTotal(true);
            setTimeout(() => setAnimateTotal(false), 1000);
        }, 8000);

        return () => {
            clearTimeout(timer);
            clearInterval(animationTimer);
        };
    }, []);

    // Handler de checkout optimizado con useCallback
    const handleCheckoutClick = useCallback(() => {
        setIsProcessing(true);

        if (!isAuthenticated) {
            setOpenSnackbar(true);
            setTimeout(() => {
                router.push('/sign-in-side/Sign-in-side');
                setIsProcessing(false);
            }, 1500);
            return;
        }

        // Usuario autenticado
        setTimeout(() => {
            if (onCheckout) onCheckout();
            router.push('/checkout/Checkout');
            setIsProcessing(false);
        }, 800);
    }, [isAuthenticated, router, onCheckout]);

    // Renderizado optimizado para partículas
    const renderParticles = useCallback(() => {
        return [...Array(8)].map((_, i) => (
            <Box
                key={i}
                component={motion.div}
                animate={{
                    x: [Math.random() * 100, 100 - Math.random() * 100],
                    y: [Math.random() * 100, 100 - Math.random() * 100],
                    opacity: [0.2, 0.8]
                }}
                transition={{
                    duration: 10 + Math.random() * 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: Math.random() * 5,
                    ease: "linear",
                    times: [0, 1]
                }}
                sx={{
                    position: 'absolute',
                    width: 3,
                    height: 3,
                    borderRadius: '50%',
                    backgroundColor: 'white',
                }}
            />
        ));
    }, []);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                layout
            >
                <Paper
                    elevation={3}
                    sx={{
                        position: 'sticky',
                        top: { xs: 10, sm: 20 },
                        borderRadius: { xs: 2, sm: 3 },
                        p: 0,
                        background: 'linear-gradient(135deg, #ffffff, #f9f9f9)',
                        height: 'fit-content',
                        overflow: 'hidden',
                        boxShadow: {
                            xs: '0 4px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)',
                            sm: '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'
                        },
                        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                        border: '1px solid rgba(0,0,0,0.06)',
                        '&:hover': {
                            transform: {
                                xs: 'translateY(-2px)',
                                sm: 'translateY(-5px)'
                            },
                            boxShadow: {
                                xs: '0 10px 20px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.04)',
                                sm: '0 14px 30px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.05)'
                            }
                        }
                    }}
                >
                    {/* Cabecera con degradado y animación */}
                    <Box
                        component={motion.div}
                        initial={{ backgroundPosition: '0% 50%' }}
                        animate={{ backgroundPosition: '100% 50%' }}
                        transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: "linear" }}
                        sx={{
                            background: `linear-gradient(120deg, ${vistelicaColors.primary}, ${vistelicaColors.secondary}, ${vistelicaColors.primary})`,
                            backgroundSize: '200% 100%',
                            color: 'white',
                            py: { xs: 2, sm: 2.5 },
                            px: { xs: 2, sm: 3 },
                            borderRadius: '12px 12px 0 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            position: 'relative'
                        }}
                    >
                        <Box
                            component={motion.div}
                            animate={{
                                rotate: [0, 10]
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatType: "reverse",
                                repeatDelay: 7
                            }}
                        >
                            <ReceiptLongIcon sx={{ fontSize: { xs: 26, sm: 30 } }} />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                fontFamily: typography.fontFamily.heading,
                                letterSpacing: '1px',
                                textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }}
                        >
                            RESUMEN DE COMPRA
                        </Typography>

                        {/* Efecto decorativo de partículas */}
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                            {renderParticles()}
                        </Box>
                    </Box>

                    {/* Número de referencia */}
                    {totalPrice > 0 && orderReference && (
                        <Box sx={{
                            backgroundColor: 'rgba(0,0,0,0.02)',
                            py: 1,
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                            textAlign: 'center'
                        }}>
                            <Typography variant="caption" sx={{
                                fontFamily: 'monospace',
                                letterSpacing: 1,
                                color: 'text.secondary',
                                fontWeight: 500
                            }}>
                                REF: {orderReference}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ p: { xs: 2, sm: 3 } }}>
                        {/* Componente de información de envío */}
                        <ShippingInfoCard
                            totalPrice={totalPrice}
                            qualifiesForFreeShipping={qualifiesForFreeShipping}
                            amountToFreeShipping={amountToFreeShipping}
                            freeShippingThreshold={freeShippingThreshold}
                            freeShippingProgress={freeShippingProgress}
                        />

                        {/* Detalle de los costos con animaciones */}
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            sx={{ mb: 2 }}
                        >
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 1
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    Subtotal ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
                                </Typography>
                                <Typography variant="body2">
                                    {totalPrice.toFixed(2)}€
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 1
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    Envío
                                </Typography>
                                <Typography variant="body2" sx={{
                                    color: qualifiesForFreeShipping ? vistelicaColors.success : 'text.primary',
                                    fontWeight: qualifiesForFreeShipping ? 'bold' : 'regular'
                                }}>
                                    {qualifiesForFreeShipping ? 'GRATIS' : '4.95€'}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Divider con animación */}
                        <Box sx={{ position: 'relative', my: 3 }}>
                            <Divider sx={{
                                borderColor: 'rgba(0,0,0,0.1)',
                                borderStyle: 'dashed',
                                position: 'relative'
                            }} />
                            <Box
                                component={motion.div}
                                animate={{
                                    x: ['0%', '100%']
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    ease: "linear",
                                    delay: 2
                                }}
                                sx={{
                                    position: 'absolute',
                                    width: 30,
                                    height: 4,
                                    backgroundColor: 'rgba(0,0,0,0.03)',
                                    borderRadius: 2,
                                    top: -2
                                }}
                            />
                        </Box>

                        {/* Total con animación de destaque */}
                        <Box
                            component={motion.div}
                            animate={animateTotal ? {
                                backgroundColor: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.03)']
                            } : {}}
                            transition={{
                                duration: 0.5,
                                repeat: animateTotal ? 1 : 0,
                                repeatType: "reverse"
                            }}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                py: 1.5,
                                px: 2,
                                mb: 3,
                                borderRadius: 2,
                                boxShadow: 'inset 0 0 5px rgba(0,0,0,0.03)'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PaymentIcon sx={{ color: vistelicaColors.primary }} />
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 'bold'
                                    }}
                                >
                                    TOTAL
                                </Typography>
                            </Box>

                            <motion.div
                                animate={animateTotal ? {
                                    scale: [1, 1.1],
                                    backgroundColor: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.03)']
                                } : {}}
                                transition={{
                                    duration: 0.5,
                                    repeat: animateTotal ? 1 : 0,
                                    repeatType: "reverse"
                                }}
                            >
                                <Typography variant="h5" sx={{
                                    fontWeight: 'bold',
                                    color: vistelicaColors.primary,
                                    fontSize: { xs: '1.3rem', sm: '1.5rem' }
                                }}>
                                    {totalPrice.toFixed(2)}€
                                </Typography>
                            </motion.div>
                        </Box>

                        {/* Botón de checkout mejorado */}
                        <Tooltip
                            title={!isAuthenticated ? "Para finalizar compra inicie sesión o regístrese" : ""}
                            placement="top"
                            arrow
                        >
    <span style={{ width: '100%', display: 'block' }}>
        <Button
            fullWidth
            variant="contained"
            disabled={totalPrice === 0 || isProcessing}
            onClick={handleCheckoutClick}
            sx={{
                py: { xs: 1.2, sm: 1.5 },
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                fontWeight: 'bold',
                textTransform: 'uppercase',
                borderRadius: 2,
                background: `linear-gradient(135deg, ${vistelicaColors.primary}, ${vistelicaColors.secondary})`,
                color: '#ffffff !important', // Texto siempre blanco
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    animation: 'shine 3s infinite linear'
                },
                '@keyframes shine': {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' }
                },
                '& .MuiButton-startIcon': {
                    color: '#ffffff !important' // Icono siempre blanco
                }
            }}
            startIcon={isProcessing ?
                <CircularProgress size={20} sx={{ color: '#ffffff' }} /> :
                <ShoppingBagIcon sx={{ color: '#ffffff' }} />
            }
        >
            {isProcessing ? 'Procesando...' : 'Finalizar compra'}
        </Button>
    </span>
</Tooltip>

                        {/* Componente de insignias de seguridad */}
                        <SecurityBadges showSecurityBadge={showSecurityBadge} />
                    </Box>
                </Paper>
            </motion.div>

            {/* Snackbar para feedback */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity="warning"
                    sx={{ width: '100%' }}
                    onClose={() => setOpenSnackbar(false)}
                >
                    Debes iniciar sesión para continuar con la compra
                </Alert>
            </Snackbar>
        </>
    );
});

CartSummary.displayName = 'CartSummary';

export default CartSummary;