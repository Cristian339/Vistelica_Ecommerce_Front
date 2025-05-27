'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, Paper, Divider, Chip, Badge, Alert, IconButton, Tooltip, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { typography } from "@/pages/shared-theme/themePrimitives";
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LoopIcon from '@mui/icons-material/Loop';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ProductListItem from './ProductListItem';

const CartList = React.memo(({ cartItems, onUpdate, userId, sessionId }) => {
    const [showHeader, setShowHeader] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    // Cálculo memoizado del total de artículos
    const totalQuantity = useMemo(() =>
            cartItems?.reduce((total, item) => total + item.quantity, 0) || 0,
        [cartItems]);

    // Manejadores optimizados
    const handleSetActive = useCallback((id) => {
        setActiveItem(id);
    }, []);

    const handleClearActive = useCallback(() => {
        setActiveItem(null);
    }, []);

    // Efecto para animar la entrada del encabezado
    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            const timer = setTimeout(() => setShowHeader(true), 300);
            return () => clearTimeout(timer);
        } else {
            setShowHeader(false);
        }
    }, [cartItems]);

    if (!cartItems || cartItems.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        p: 3,
                        backgroundColor: 'white',
                        textAlign: 'center'
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ShoppingBagIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" sx={{ mb: 1, fontFamily: typography.fontFamily.heading }}>
                            No hay productos en el carrito
                        </Typography>
                    </Box>
                </Paper>
            </motion.div>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                }}
                layout
            >
                {/* Encabezado con resumen */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 1.5, sm: 2 },
                        mb: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: 2,
                        border: `1px solid ${vistelicaColors.primary}20`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        backdropFilter: 'blur(8px)'
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <Badge
                                badgeContent={totalQuantity}
                                color="primary"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: vistelicaColors.primary
                                    }
                                }}
                            >
                                <ShoppingBagIcon sx={{ fontSize: 28, color: 'text.primary', mr: 1 }} />
                            </Badge>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    fontFamily: typography.fontFamily.heading,
                                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                }}
                            >
                                Tu Carrito
                            </Typography>
                        </Box>

                        <AnimatePresence>
                            {showHeader && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label="¡Todo listo para continuar!"
                                        color="success"
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            borderColor: vistelicaColors.success,
                                            color: vistelicaColors.success,
                                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                            '& .MuiChip-icon': {
                                                color: vistelicaColors.success
                                            }
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>
                </Paper>

                {/* Lista de productos - Nuevo diseño */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    layout
                >
                    {/* Banner elegante para los productos */}
                    <Box
                        sx={{
                            position: 'relative',
                            mb: 2,
                            height: { xs: 60, sm: 80 },
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
                        }}
                    >
                        {/* Fondo con degradado elegante */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage: `linear-gradient(45deg, ${vistelicaColors.primary}, ${vistelicaColors.secondary})`,
                                opacity: 0.9,
                            }}
                        />

                        {/* Patrones decorativos optimizados */}
                        <motion.div
                            initial={false}
                            animate={{
                                x: [0, 100, 0],
                                opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "loop"
                            }}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 2px, transparent 3px)',
                                backgroundSize: '30px 30px',
                            }}
                        />

                        {/* Texto central */}
                        <Box
                            sx={{
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'white',
                                    fontFamily: typography.fontFamily.heading,
                                    fontWeight: 700,
                                    fontSize: { xs: '1rem', sm: '1.5rem' },
                                    letterSpacing: 1,
                                    textTransform: 'uppercase',
                                    textAlign: 'center',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                }}
                            >
                                Artículos Seleccionados
                            </Typography>
                        </Box>
                    </Box>

                    {/* Productos - Usando la estructura de datos original */}
                    <AnimatePresence mode="popLayout">
                        {cartItems.map((item, index) => (
                            <ProductListItem
                                key={item.cart_detail_id}
                                item={item}
                                index={index}
                                isActive={activeItem === item.cart_detail_id}
                                setActive={handleSetActive}
                                clearActive={handleClearActive}
                                onUpdate={onUpdate}
                                userId={userId}
                                sessionId={sessionId}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Políticas de compra */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Box sx={{ mt: 5, mb: 3 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontFamily: typography.fontFamily.heading,
                                fontWeight: 600,
                                mb: 2,
                                textAlign: { xs: 'center', sm: 'left' }
                            }}
                        >
                            Garantías y políticas de compra
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid
                            container
                            spacing={2}
                            sx={{ flexGrow: 1 }}
                        >
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <PurchaseInfoItem
                                    icon={<LocalShippingIcon />}
                                    title="Envío rápido"
                                    description="Entrega en 24-48h en península"
                                    delay={0.1}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <PurchaseInfoItem
                                    icon={<LoopIcon />}
                                    title="Devolución gratuita"
                                    description="30 días para cambios y devoluciones"
                                    delay={0.2}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <PurchaseInfoItem
                                    icon={<SecurityIcon />}
                                    title="Pago seguro"
                                    description="Transacciones cifradas y verificadas"
                                    delay={0.3}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </motion.div>
            </motion.div>
        </Box>
    );
});

const PurchaseInfoItem = React.memo(({ icon, title, description, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{
                scale: 1.03,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
            style={{
                borderRadius: '8px',
                overflow: 'hidden',
                height: '100%'
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 2,
                    p: 2,
                    height: '100%',
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: `linear-gradient(145deg, white, ${vistelicaColors.backgroundLight})`,
                    transition: 'all 0.3s ease'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <Box sx={{
                        backgroundColor: `${vistelicaColors.primary}15`,
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: vistelicaColors.primary
                    }}>
                        {icon}
                    </Box>

                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                fontFamily: typography.fontFamily.heading,
                                fontSize: '0.9rem'
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                display: 'block',
                                fontSize: '0.75rem'
                            }}
                        >
                            {description}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );
});

// Añadir displayName para facilitar la depuración
CartList.displayName = 'CartList';
PurchaseInfoItem.displayName = 'PurchaseInfoItem';

export default CartList;