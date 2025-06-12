"use client";

import React, { useState } from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails,
    Typography, Box, Grid, Divider, Paper,
    useMediaQuery, useTheme, Chip
} from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CachedIcon from '@mui/icons-material/Cached';
import SecurityIcon from '@mui/icons-material/Security';
import StraightenIcon from '@mui/icons-material/Straighten';
import TimerIcon from '@mui/icons-material/Timer';
import { vistelicaColors } from '@/components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";

// Variantes para animaciones optimizadas para rendimiento
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        }
    }
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.4
        }
    }
};

const ShippingMethod = ({ icon, title, description, highlighted, delay = 0 }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <motion.div
            variants={itemVariants}
            custom={delay}
            whileHover={{
                scale: isMobile ? 1.01 : 1.02,
                transition: { duration: 0.2 }
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 1.2, sm: 1.5 },
                    mb: { xs: 1.5, sm: 2 },
                    borderRadius: { xs: 1.5, sm: 2 },
                    background: highlighted
                        ? `linear-gradient(145deg, ${vistelicaColors.primaryLight}20, ${vistelicaColors.primaryLight}10)`
                        : 'transparent',
                    border: '1px solid',
                    borderColor: highlighted ? vistelicaColors.primaryLight : 'rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Grid container spacing={1.5}>
                    <Grid
                        item
                        xs={isMobile ? 3 : 2}
                        sm={1}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <motion.div
                            whileHover={{
                                rotate: [0, -10, 10, -5, 0],
                                transition: { duration: 0.5 }
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: `${vistelicaColors.primary}15`,
                                borderRadius: '50%',
                                padding: '8px',
                                width: isMobile ? '32px' : '40px',
                                height: isMobile ? '32px' : '40px',
                                boxShadow: highlighted
                                    ? `0 2px 8px ${vistelicaColors.primary}30`
                                    : 'none',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Box sx={{
                                color: vistelicaColors.primary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {React.cloneElement(icon, {
                                    fontSize: isMobile ? 'small' : 'medium'
                                })}
                            </Box>
                        </motion.div>
                    </Grid>
                    <Grid item xs={isMobile ? 9 : 10} sm={11}>
                        <Box sx={{ position: 'relative' }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 600,
                                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                                    color: vistelicaColors.primary,
                                    mb: 0.5,
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                {title}
                                {highlighted && (
                                    <Box
                                        component={motion.div}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        sx={{
                                            display: 'inline-flex',
                                            ml: 1,
                                            verticalAlign: 'middle'
                                        }}
                                    >
                                        <Chip
                                            label="DESTACADO"
                                            size="small"
                                            sx={{
                                                height: '18px',
                                                fontSize: '0.65rem',
                                                color: 'white',
                                                fontWeight: 600,
                                                backgroundColor: vistelicaColors.primary,
                                                '& .MuiChip-label': { px: 0.8 },
                                                display: { xs: 'none', sm: 'inline-flex' }
                                            }}
                                        />
                                    </Box>
                                )}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: typography.fontFamily,
                                    fontSize: { xs: '0.8rem', sm: '0.85rem' },
                                    color: vistelicaColors.secondary,
                                    lineHeight: 1.5
                                }}
                            >
                                {description}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Elemento decorativo sutil */}
                {highlighted && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -15,
                            right: -15,
                            width: 70,
                            height: 70,
                            background: `radial-gradient(circle, ${vistelicaColors.primary}10 0%, transparent 70%)`,
                            opacity: 0.8,
                            display: { xs: 'none', sm: 'block' }
                        }}
                    />
                )}
            </Paper>
        </motion.div>
    );
};

const ShippingInfo = () => {
    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const handleChange = () => {
        setExpanded(!expanded);
    };

    return (
        <Box mt={{ xs: 2, sm: 3, md: 3 }}>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                }}
            >
                <Accordion
                    elevation={0}
                    expanded={expanded}
                    onChange={handleChange}
                    sx={{
                        '&:before': { display: 'none' },
                        borderRadius: { xs: 1.5, sm: 2 },
                        border: '1px solid',
                        borderColor: expanded
                            ? vistelicaColors.primaryLight
                            : 'rgba(0,0,0,0.08)',
                        boxShadow: expanded
                            ? `0 4px 12px ${vistelicaColors.primaryLight}30`
                            : 'none',
                        transition: 'all 0.3s ease',
                        '&.Mui-expanded': {
                            margin: 0
                        },
                        overflow: 'hidden',
                        backgroundColor: expanded
                            ? `${vistelicaColors.primaryLight}05`
                            : 'transparent',
                        position: 'relative'
                    }}
                >
                    <AccordionSummary
                        expandIcon={
                            <Box
                                component={motion.div}
                                animate={{
                                    rotate: expanded ? 180 : 0,
                                    scale: expanded ? 1.1 : 1
                                }}
                                transition={{ duration: 0.3 }}
                                sx={{
                                    minWidth: '24px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <ExpandMoreIcon sx={{
                                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                    color: vistelicaColors.primary
                                }} />
                            </Box>
                        }
                        aria-label="Mostrar información de envíos y devoluciones"
                        sx={{
                            minHeight: { xs: '44px !important', sm: '48px !important' },
                            padding: { xs: 1.2, sm: 1.5 },
                            '&:hover': {
                                backgroundColor: `${vistelicaColors.secondary}08`
                            },
                            '& .MuiAccordionSummary-content': {
                                margin: { xs: '6px 0', sm: '8px 0' }
                            },
                            '& .MuiAccordionSummary-expandIconWrapper': {
                                position: 'relative',
                                marginLeft: 1
                            }
                        }}
                    >
                        <Box
                            component={motion.div}
                            whileHover={{ scale: isMobile ? 1.01 : 1.02 }}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                pr: { xs: 1, sm: 2 }
                            }}
                        >
                            <Box sx={{
                                p: { xs: 0.8, sm: 1 },
                                borderRadius: '50%',
                                backgroundColor: expanded
                                    ? `${vistelicaColors.primary}15`
                                    : `${vistelicaColors.primary}10`,
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <LocalShippingIcon
                                    sx={{
                                        fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                        color: vistelicaColors.primary
                                    }}
                                />
                            </Box>
                            <Box sx={{ ml: { xs: 1.2, sm: 1.5 }, flex: 1 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: { xs: '0.95rem', sm: '1rem' },
                                        fontWeight: 600,
                                        fontFamily: typography.fontFamily,
                                        color: vistelicaColors.primary,
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    Envíos y Devoluciones
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: { xs: 'none', sm: 'block' },
                                        fontSize: '0.8rem',
                                        color: vistelicaColors.secondary,
                                        fontFamily: typography.fontFamily,
                                        mt: 0.3
                                    }}
                                >
                                    {expanded ? 'Ocultar detalles' : 'Ver opciones disponibles'}
                                </Typography>
                            </Box>

                            {!expanded && (
                                <Box
                                    sx={{
                                        display: { xs: 'none', md: 'flex' },
                                        alignItems: 'center',
                                        gap: 0.5,
                                        mr: { md: 2, lg: 4 },
                                        position: 'relative',
                                        minWidth: '95px'
                                    }}
                                >
                                    <TimerIcon sx={{
                                        fontSize: '0.9rem',
                                        color: vistelicaColors.primary
                                    }} />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontFamily: typography.fontFamily,
                                            fontSize: '0.75rem',
                                            color: vistelicaColors.secondary,
                                            fontWeight: 500
                                        }}
                                    >
                                        Desde 2-3 días
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </AccordionSummary>

                    <AccordionDetails sx={{
                        p: { xs: 1.5, sm: 2 },
                        pt: 0,
                        pb: { xs: 2, sm: 2.5 }
                    }}>
                        <AnimatePresence>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <Box sx={{ mt: { xs: 0.5, sm: 1 } }}>
                                    <ShippingMethod
                                        icon={<LocalShippingIcon />}
                                        title="Envío Gratuito Express"
                                        description="En todos los pedidos de ropa superiores a 50€ (2-3 días laborables)"
                                        highlighted={true}
                                    />

                                    <ShippingMethod
                                        icon={<AccessTimeIcon />}
                                        title="Envío Premium"
                                        description="Recibe tus prendas en 24h (coste adicional de 5,99€)"
                                        highlighted={false}
                                        delay={0.2}
                                    />

                                    <ShippingMethod
                                        icon={<StraightenIcon />}
                                        title="Guía de Tallas"
                                        description="Consulta nuestra guía de tallas para encontrar tu ajuste perfecto"
                                        highlighted={false}
                                        delay={0.3}
                                    />

                                    <Divider sx={{
                                        my: { xs: 1.5, sm: 2 },
                                        borderStyle: 'dashed',
                                        borderColor: `${vistelicaColors.primary}30`
                                    }} />

                                    <ShippingMethod
                                        icon={<CachedIcon />}
                                        title="Devoluciones Sin Complicaciones"
                                        description="30 días para cambios o devoluciones. Recogida a domicilio gratuita."
                                        highlighted={false}
                                        delay={0.4}
                                    />

                                    <ShippingMethod
                                        icon={<SecurityIcon />}
                                        title="Garantía de Calidad"
                                        description="Todos nuestros productos pasan por estrictos controles de calidad"
                                        highlighted={false}
                                        delay={0.5}
                                    />
                                </Box>
                            </motion.div>
                        </AnimatePresence>
                    </AccordionDetails>
                </Accordion>
            </motion.div>
        </Box>
    );
};

export default ShippingInfo;