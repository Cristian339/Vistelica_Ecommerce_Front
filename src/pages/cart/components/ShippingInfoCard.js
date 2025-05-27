'use client';
import React, {useMemo} from 'react';
import {Box, Typography, LinearProgress, useTheme, useMediaQuery} from '@mui/material';
import {motion, AnimatePresence} from 'framer-motion';
import {vistelicaColors} from "@/pages/shared-theme/vistelicaColors";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalMallIcon from '@mui/icons-material/LocalMall';

const ShippingInfoCard = React.memo(({
                                         totalPrice,
                                         qualifiesForFreeShipping,
                                         amountToFreeShipping,
                                         freeShippingThreshold,
                                         freeShippingProgress
                                     }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // Memoizamos los estilos para evitar recálculos
    const containerStyles = useMemo(() => ({
        mb: {xs: 2, sm: 3},
        p: {xs: 1.5, sm: 2},
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden'
    }), []);

    // Animaciones optimizadas según dispositivo
    const progressCardAnimation = useMemo(() => ({
        initial: {opacity: 0, height: 0},
        animate: {opacity: 1, height: 'auto'},
        exit: {opacity: 0, height: 0},
        transition: {duration: isMobile ? 0.3 : 0.4}
    }), [isMobile]);

    const freeShippingCardAnimation = useMemo(() => ({
        initial: {opacity: 0, y: isMobile ? 5 : 10},
        animate: {opacity: 1, y: 0},
        transition: {duration: isMobile ? 0.3 : 0.4, type: "spring", stiffness: isMobile ? 200 : 300}
    }), [isMobile]);

    const shippingIconAnimation = useMemo(() => ({
        x: [-2, 2, -2],
        transition: {repeat: Infinity, duration: isMobile ? 1.2 : 1.5, ease: "easeInOut"}
    }), [isMobile]);

    const checkIconAnimation = useMemo(() => ({
        rotate: [0, 15, 0, 15, 0],
        transition: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: isMobile ? 3 : 5
        }
    }), [isMobile]);

    const mallIconAnimation = useMemo(() => ({
        x: `${Math.min(Math.max(freeShippingProgress - 5, 0), 95)}%`,
        transition: {duration: 0.5, ease: "easeOut"}
    }), [freeShippingProgress]);

    // Formateamos el valor del importe para accesibilidad
    const formattedAmount = useMemo(() =>
            amountToFreeShipping ? amountToFreeShipping.toFixed(2) : '0.00'
        , [amountToFreeShipping]);

    return (
        <AnimatePresence mode="wait">
            {!qualifiesForFreeShipping && totalPrice > 0 && (
                <motion.div
                    {...progressCardAnimation}
                    role="alert"
                    aria-live="polite"
                >
                    <Box sx={{
                        ...containerStyles,
                        backgroundColor: `${vistelicaColors.secondary}10`,
                        border: `1px dashed ${vistelicaColors.secondary}40`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: {xs: 0.5, sm: 1}
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: {xs: 0.5, sm: 1}
                        }}>
                            <motion.div
                                animate={shippingIconAnimation}
                            >
                                <LocalShippingIcon
                                    sx={{ color: vistelicaColors.primary }}
                                    fontSize={isMobile ? 'small' : 'medium'}
                                    aria-hidden="true"
                                />
                            </motion.div>

                            <Typography variant={isMobile ? "caption" : "body2"} sx={{
                                fontWeight: 500,
                                fontSize: {xs: '0.8rem', sm: '0.9rem'}
                            }}>
                                ¡Te faltan <Box component="span" sx={{
                                fontWeight: 700,
                                color: vistelicaColors.primary,
                            }}>{formattedAmount}€</Box> para envío gratis!
                            </Typography>
                        </Box>

                        <Box
                            sx={{width: '100%', mt: {xs: 0.5, sm: 1}}}
                            role="progressbar"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-valuenow={freeShippingProgress}
                            aria-label={`Progreso hacia envío gratuito: ${Math.round(freeShippingProgress)}%`}
                        >
                            <Box sx={{position: 'relative'}}>
                                <LinearProgress
                                    variant="determinate"
                                    value={freeShippingProgress}
                                    sx={{
                                        height: {xs: 8, sm: 10},
                                        borderRadius: 5,
                                        backgroundColor: `${vistelicaColors.primary}15`,
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 5,
                                            backgroundColor: vistelicaColors.primary,
                                            backgroundImage: `linear-gradient(45deg, ${vistelicaColors.primary} 30%, ${vistelicaColors.secondary} 90%)`,
                                        }
                                    }}
                                />

                                <motion.div
                                    animate={mallIconAnimation}
                                    style={{
                                        position: 'absolute',
                                        top: isMobile ? -16 : -18,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    <LocalMallIcon sx={{
                                        fontSize: {xs: 16, sm: 18},
                                        color: vistelicaColors.primary
                                    }}
                                                   aria-hidden="true"
                                    />
                                    <Box sx={{
                                        width: 0,
                                        height: 0,
                                        borderLeft: {xs: '4px solid transparent', sm: '5px solid transparent'},
                                        borderRight: {xs: '4px solid transparent', sm: '5px solid transparent'},
                                        borderTop: {
                                            xs: `4px solid ${vistelicaColors.primary}`,
                                            sm: `5px solid ${vistelicaColors.primary}`
                                        }
                                    }}/>
                                </motion.div>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 0.5
                            }}>
                                <Typography variant="caption">0€</Typography>
                                <Typography variant="caption" sx={{
                                    fontWeight: 'bold',
                                    color: vistelicaColors.primary
                                }}>
                                    {freeShippingThreshold}€
                                </Typography>
                            </Box>
                        </Box>

                        {/* Decoración de fondo con carga perezosa */}
                        <Box sx={{
                            position: 'absolute',
                            right: -20,
                            bottom: -20,
                            width: {xs: 80, sm: 100},
                            height: {xs: 80, sm: 100},
                            opacity: 0.05,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000000' d='M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13-6h-2V9.5h1.5l.5.5zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundSize: 'cover',
                            transform: 'rotate(-15deg)',
                            pointerEvents: 'none',
                            loading: "lazy"
                        }}
                             aria-hidden="true"
                        />
                    </Box>
                </motion.div>
            )}

            {qualifiesForFreeShipping && totalPrice > 0 && (
                <motion.div
                    {...freeShippingCardAnimation}
                    role="status"
                    aria-live="polite"
                >
                    <Box sx={{
                        ...containerStyles,
                        backgroundColor: `${vistelicaColors.success}10`,
                        border: `1px solid ${vistelicaColors.success}30`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: {xs: 0.5, sm: 1}
                    }}>
                        <motion.div
                            animate={checkIconAnimation}
                        >
                            <CheckCircleOutlineIcon
                                sx={{
                                    color: vistelicaColors.success,
                                    fontSize: {xs: 18, sm: 24}
                                }}
                                aria-hidden="true"
                            />
                        </motion.div>

                        <Box>
                            <Typography
                                variant={isMobile ? "caption" : "body2"}
                                sx={{
                                    fontWeight: 600,
                                    color: vistelicaColors.success,
                                    fontSize: {xs: '0.8rem', sm: '0.9rem'}
                                }}
                            >
                                ¡Envío GRATIS en tu pedido!
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    mt: 0.5,
                                    fontSize: {xs: '0.65rem', sm: '0.7rem'}
                                }}
                            >
                                <LocalShippingIcon
                                    sx={{fontSize: {xs: 10, sm: 12}}}
                                    aria-hidden="true"
                                />
                                Entrega estimada: 24-48h laborables
                            </Typography>
                        </Box>

                        {/* Decoración de fondo - Tick grande */}
                        <Box sx={{
                            position: 'absolute',
                            right: -15,
                            bottom: -15,
                            width: {xs: 60, sm: 80},
                            height: {xs: 60, sm: 80},
                            opacity: 0.07,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000000' d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundSize: 'cover',
                            transform: 'rotate(-15deg)',
                            pointerEvents: 'none',
                            loading: "lazy"
                        }}
                             aria-hidden="true"
                        />
                    </Box>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

ShippingInfoCard.displayName = 'ShippingInfoCard';

export default ShippingInfoCard;