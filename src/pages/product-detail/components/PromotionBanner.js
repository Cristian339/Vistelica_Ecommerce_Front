"use client";

import React from 'react';
import { Paper, Typography, Box, useMediaQuery, useTheme, Chip } from '@mui/material';
import { motion } from "framer-motion";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PercentIcon from '@mui/icons-material/Percent';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const PromotionBanner = ({ offer, price }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, x: -10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 15
            }}
        >
            <Box
                my={{ xs: 1.5, sm: 2, md: 2.5 }}
                sx={{
                    position: 'relative',
                    maxWidth: { xs: '100%', md: '95%' }
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 1.2, sm: 1.5, md: 2 },
                        pl: { xs: 1.8, sm: 2, md: 2.5 },
                        borderRadius: { xs: 1.5, sm: 2 },
                        borderLeft: '4px solid',
                        borderColor: vistelicaColors.primary,
                        backgroundColor: `${vistelicaColors.primaryLight}15`,
                        background: `linear-gradient(120deg, ${vistelicaColors.primaryLight}15 0%, ${vistelicaColors.primaryLight}05 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: `0 2px 8px ${vistelicaColors.primaryLight}20`,
                        transition: 'all 0.3s ease'
                    }}
                >
                    {/* Elemento decorativo de fondo */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -15,
                            right: -15,
                            width: { xs: 90, sm: 120 },
                            height: { xs: 90, sm: 120 },
                            background: `radial-gradient(circle, ${vistelicaColors.primary}10 0%, transparent 70%)`,
                            opacity: 0.5,
                            zIndex: 0
                        }}
                    />

                    <Box
                        component={motion.div}
                        animate={{
                            scale: [1, 1.15, 1],
                            rotate: [0, 8, 0]
                        }}
                        transition={{
                            repeat: Infinity,
                            repeatDelay: 4,
                            duration: 1.2,
                            ease: "easeInOut"
                        }}
                        sx={{
                            mr: { xs: 1.2, sm: 1.5 },
                            bgcolor: `${vistelicaColors.primary}20`,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: { xs: 0.5, sm: 0.8 },
                            borderRadius: '50%',
                            zIndex: 1
                        }}
                    >
                        <LocalOfferIcon
                            sx={{
                                color: vistelicaColors.primary,
                                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.4rem' }
                            }}
                        />
                    </Box>

                    <Box sx={{ zIndex: 1, flex: 1 }}>
                        <Typography
                            variant="body1"
                            component={motion.div}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            sx={{
                                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                                fontWeight: 'medium',
                                fontFamily: typography.fontFamily,
                                lineHeight: 1.4,
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center'
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    color: vistelicaColors.primary,
                                    fontWeight: 700,
                                    mr: 0.5,
                                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                }}
                            >
                                {price}
                                <Box
                                    component={motion.div}
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        opacity: [1, 0.8, 1]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                        duration: 0.8
                                    }}
                                    sx={{
                                        display: 'inline-flex',
                                        ml: 0.5
                                    }}
                                >
                                    <Chip
                                        icon={<PercentIcon fontSize="small" />}
                                        label="OFERTA"
                                        size="small"
                                        sx={{
                                            height: { xs: '18px', sm: '20px' },
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            backgroundColor: vistelicaColors.primary,
                                            color: '#fff',
                                            ml: 0.5,
                                            display: { xs: 'none', sm: 'inline-flex' }
                                        }}
                                    />
                                </Box>
                            </Box>
                            {offer}
                        </Typography>
                    </Box>
                </Paper>

                {/* Elemento decorativo adicional */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    sx={{
                        position: 'absolute',
                        top: -8,
                        right: { xs: 8, sm: 12 },
                        width: { xs: 16, sm: 20 },
                        height: { xs: 16, sm: 20 },
                        borderRadius: '50%',
                        backgroundColor: vistelicaColors.primary,
                        display: { xs: 'none', md: 'block' }
                    }}
                />
            </Box>
        </motion.div>
    );
};

export default PromotionBanner;