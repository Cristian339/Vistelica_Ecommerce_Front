'use client';
import React, { useMemo } from 'react';
import { Box, Typography, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LockIcon from '@mui/icons-material/Lock';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";

const SecurityBadges = React.memo(({ showSecurityBadge }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // Memoizamos el array de badges para evitar recálculos
    const securityBadges = useMemo(() => [
        {
            icon: LockIcon,
            label: "SSL",
            tooltip: "Pago 100% seguro",
            color: vistelicaColors.primary,
            ariaLabel: "Certificado SSL para pagos seguros"
        },
        {
            icon: CreditCardIcon,
            label: "Tarjeta",
            tooltip: "Múltiples métodos de pago",
            color: vistelicaColors.secondary,
            ariaLabel: "Varios métodos de pago disponibles"
        },
        {
            icon: LocalShippingIcon,
            label: "Envío",
            tooltip: "Envío rápido y seguro",
            color: vistelicaColors.info,
            ariaLabel: "Servicio de envío rápido y seguro"
        },
        {
            icon: SecurityIcon,
            label: "Seguro",
            tooltip: "Transacciones cifradas",
            color: vistelicaColors.success,
            ariaLabel: "Transacciones con cifrado de seguridad"
        },
        {
            icon: VerifiedUserIcon,
            label: "Garantía",
            tooltip: "Satisfacción garantizada",
            color: vistelicaColors.warning,
            ariaLabel: "Garantía de satisfacción al cliente"
        }
    ], []);

    // Optimizamos estilos según el dispositivo
    const containerStyles = useMemo(() => ({
        mt: isMobile ? 1 : 2,
        position: 'relative',
        maxWidth: '100%',
        overflow: 'hidden'
    }), [isMobile]);

    const badgesContainerStyles = useMemo(() => ({
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: { xs: 1.5, sm: 2 },
        mt: { xs: 2, sm: 3 },
        mb: 1
    }), []);

    const badgeIconStyles = useMemo(() => ({
        width: { xs: 32, sm: 36, md: 40 },
        height: { xs: 32, sm: 36, md: 40 },
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }), []);

    // Optimizamos animaciones según el dispositivo
    const badgeAnimation = useMemo(() => ({
        initial: { opacity: 0, y: isMobile ? 5 : 10 },
        animate: { opacity: 1, y: 0 },
        transition: (index) => ({
            delay: Math.min(0.2 + index * (isMobile ? 0.07 : 0.1), 0.6), // Limitamos el delay máximo
            type: 'tween',
            duration: isMobile ? 0.2 : 0.3
        }),
        whileHover: { y: isMobile ? -2 : -3 }
    }), [isMobile]);

    if (!showSecurityBadge && showSecurityBadge !== undefined) {
        return null;
    }

    return (
        <Box sx={containerStyles}>
            <Box
                component="section"
                aria-label="Certificaciones de seguridad"
                sx={badgesContainerStyles}
            >
                {securityBadges.map((badge, index) => (
                    <motion.div
                        key={index}
                        initial={badgeAnimation.initial}
                        animate={badgeAnimation.animate}
                        transition={badgeAnimation.transition(index)}
                        whileHover={badgeAnimation.whileHover}
                        layout
                    >
                        <Tooltip
                            title={badge.tooltip}
                            arrow
                            enterTouchDelay={50}
                            leaveTouchDelay={1500}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    cursor: 'pointer'
                                }}
                                aria-label={badge.ariaLabel}
                            >
                                <Box
                                    sx={{
                                        ...badgeIconStyles,
                                        backgroundColor: `${badge.color}15`,
                                        border: `1px solid ${badge.color}20`
                                    }}
                                >
                                    <badge.icon
                                        sx={{
                                            color: badge.color,
                                            fontSize: { xs: 16, sm: 18, md: 20 }
                                        }}
                                        aria-hidden="true"
                                    />
                                </Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: badge.color,
                                        fontWeight: 500,
                                        fontSize: { xs: '0.65rem', sm: '0.7rem' }
                                    }}
                                >
                                    {badge.label}
                                </Typography>
                            </Box>
                        </Tooltip>
                    </motion.div>
                ))}
            </Box>
        </Box>
    );
});

SecurityBadges.displayName = 'SecurityBadges';

export default SecurityBadges;