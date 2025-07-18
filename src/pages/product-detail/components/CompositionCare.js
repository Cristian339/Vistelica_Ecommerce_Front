"use client";

import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Paper, Divider, Chip, useMediaQuery, useTheme } from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FabricIcon from '@mui/icons-material/Checkroom';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import { vistelicaColors } from '@/components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";

const CompositionCare = ({ composition }) => {
    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // Instrucciones de cuidado predeterminadas
    const careInstructions = [
        "Lavar a máquina a 30°C máximo",
        "No usar blanqueador",
        "Planchar a temperatura baja",
        "No secar en secadora",
        "Lavar colores similares juntos"
    ];

    // Animaciones optimizadas
    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                when: "beforeChildren",
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -5 },
        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Paper
                elevation={isMobile ? 1 : 2}
                sx={{
                    mt: { xs: 1.5, sm: 2, md: 2.5 },
                    overflow: 'hidden',
                    borderRadius: { xs: '10px', sm: '12px' },
                    backgroundColor: '#fcfcfc',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: `1px solid ${vistelicaColors.secondary}20`,
                    transition: 'all 0.3s ease'
                }}
            >
                <Accordion
                    expanded={expanded}
                    onChange={() => setExpanded(!expanded)}
                    disableGutters
                    elevation={0}
                    sx={{
                        '&:before': { display: 'none' },
                        backgroundColor: 'transparent'
                    }}
                >
                    <AccordionSummary
                        expandIcon={
                            <motion.div
                                animate={{ rotate: expanded ? 180 : 0 }}
                                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                            >
                                <ExpandMoreIcon
                                    sx={{
                                        fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                        color: vistelicaColors.secondary
                                    }}
                                />
                            </motion.div>
                        }
                        aria-label="Expandir composición y cuidados"
                        sx={{
                            minHeight: { xs: '48px !important', sm: '56px !important' },
                            p: { xs: 1.2, sm: 1.5 },
                            px: { xs: 2, sm: 2.5 },
                            background: `linear-gradient(to right, ${vistelicaColors.secondary}15, ${vistelicaColors.primary}05)`,
                            ':hover': {
                                background: `linear-gradient(to right, ${vistelicaColors.secondary}25, ${vistelicaColors.primary}10)`,
                            }
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1, sm: 1.5 },
                            width: '100%',
                            flexWrap: { xs: 'wrap', sm: 'nowrap' }
                        }}>
                            <motion.div
                                animate={{
                                    rotate: expanded ? [0, -15, 0] : 0,
                                    scale: expanded ? [1, 1.15, 1] : 1
                                }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                style={{
                                    background: `linear-gradient(135deg, ${vistelicaColors.secondary}, ${vistelicaColors.primary})`,
                                    borderRadius: '50%',
                                    padding: isMobile ? '6px' : '8px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <FabricIcon sx={{
                                    color: 'white',
                                    fontSize: { xs: '1.1rem', sm: '1.3rem' }
                                }} />
                            </motion.div>
                            <Box sx={{
                                flex: 1,
                                mr: { xs: 0, sm: 1 }
                            }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontSize: { xs: '0.95rem', sm: '1.1rem' },
                                        fontWeight: 600,
                                        fontFamily: typography.fontFamily,
                                        color: vistelicaColors.secondary,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    Composición y cuidados
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontFamily: typography.fontFamily,
                                        color: 'text.secondary',
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                >
                                    Materiales e instrucciones de lavado
                                </Typography>
                            </Box>
                            <Chip
                                label="Info"
                                size="small"
                                sx={{
                                    height: { xs: 20, sm: 22 },
                                    backgroundColor: `${vistelicaColors.secondary}30`,
                                    color: vistelicaColors.secondary,
                                    fontSize: '0.7rem',
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 600,
                                    ml: { xs: 0, sm: 1 }
                                }}
                            />
                        </Box>
                    </AccordionSummary>

                    <AccordionDetails sx={{ p: 0 }}>
                        <AnimatePresence>
                            {expanded && (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={containerVariants}
                                >
                                    <Divider sx={{
                                        borderColor: `${vistelicaColors.secondary}30`,
                                        borderStyle: 'dashed'
                                    }} />
                                    <Box sx={{
                                        p: { xs: 2, sm: 2.5, md: 3 },
                                        borderRadius: '0 0 12px 12px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        background: 'linear-gradient(135deg, #ffffff 25%, #fafafa 100%)'
                                    }}>
                                        {/* Sección de composición */}
                                        <motion.div variants={itemVariants}>
                                            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                                        fontWeight: 600,
                                                        fontFamily: typography.fontFamily,
                                                        color: vistelicaColors.secondary,
                                                        mb: { xs: 1.5, sm: 2 },
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1
                                                    }}
                                                >
                                                    <Box sx={{
                                                        width: { xs: 4, sm: 6 },
                                                        height: { xs: 18, sm: 22 },
                                                        backgroundColor: vistelicaColors.secondary,
                                                        borderRadius: 1,
                                                        mr: 1
                                                    }} />
                                                    Composición
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                                        fontFamily: typography.fontFamily,
                                                        lineHeight: 1.7,
                                                        pl: { xs: 1.5, sm: 2 },
                                                        borderLeft: `3px solid ${vistelicaColors.secondary}40`
                                                    }}
                                                >
                                                    {composition || "100% Algodón"}
                                                </Typography>
                                            </Box>
                                        </motion.div>

                                        {/* Sección de cuidados */}
                                        <motion.div variants={itemVariants}>
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                                        fontWeight: 600,
                                                        fontFamily: typography.fontFamily,
                                                        color: vistelicaColors.secondary,
                                                        mb: { xs: 1.5, sm: 2 },
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1
                                                    }}
                                                >
                                                    <Box sx={{
                                                        width: { xs: 4, sm: 6 },
                                                        height: { xs: 18, sm: 22 },
                                                        backgroundColor: vistelicaColors.primary,
                                                        borderRadius: 1,
                                                        mr: 1
                                                    }} />
                                                    Instrucciones de cuidado
                                                </Typography>
                                                <Box sx={{
                                                    pl: { xs: 1, sm: 2 },
                                                    display: 'grid',
                                                    gridTemplateColumns: { xs: '1fr', sm: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)' },
                                                    gap: { xs: 1, sm: 2 }
                                                }}>
                                                    {careInstructions.map((instruction, index) => (
                                                        <motion.div
                                                            key={index}
                                                            variants={itemVariants}
                                                            custom={index}
                                                            whileHover={{ x: 5 }}
                                                        >
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: { xs: 1.5, sm: 2 },
                                                                mb: { xs: 1, sm: 1.5 }
                                                            }}>
                                                                <LocalLaundryServiceIcon sx={{
                                                                    color: vistelicaColors.primary,
                                                                    fontSize: { xs: '0.9rem', sm: '1rem' }
                                                                }} />
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                                                        fontFamily: typography.fontFamily
                                                                    }}
                                                                >
                                                                    {instruction}
                                                                </Typography>
                                                            </Box>
                                                        </motion.div>
                                                    ))}
                                                </Box>
                                            </Box>
                                        </motion.div>

                                        {/* Elementos decorativos ajustados para responsive */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: -30,
                                                right: -30,
                                                width: { xs: '120px', sm: '180px' },
                                                height: { xs: '120px', sm: '180px' },
                                                background: `radial-gradient(circle, ${vistelicaColors.secondary}10 10%, transparent 70%)`,
                                                opacity: 0.5,
                                                borderRadius: '50%',
                                                zIndex: 0,
                                                display: { xs: 'none', sm: 'block' }
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 20,
                                                left: -40,
                                                width: { xs: '80px', sm: '100px' },
                                                height: { xs: '80px', sm: '100px' },
                                                background: `radial-gradient(circle, ${vistelicaColors.primary}10 10%, transparent 70%)`,
                                                opacity: 0.4,
                                                borderRadius: '50%',
                                                zIndex: 0,
                                                display: { xs: 'none', sm: 'block' }
                                            }}
                                        />
                                    </Box>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </AccordionDetails>
                </Accordion>
            </Paper>
        </motion.div>
    );
};

export default CompositionCare;