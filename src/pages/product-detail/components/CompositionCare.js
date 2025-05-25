"use client";

import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Paper, Divider, Chip } from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FabricIcon from '@mui/icons-material/Checkroom';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const CompositionCare = ({ composition }) => {
    const [expanded, setExpanded] = useState(false);

    // Instrucciones de cuidado predeterminadas
    const careInstructions = [
        "Lavar a máquina a 30°C máximo",
        "No usar blanqueador",
        "Planchar a temperatura baja",
        "No secar en secadora",
        "Lavar colores similares juntos"
    ];

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -5 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Paper
                elevation={2}
                sx={{
                    mt: 2,
                    overflow: 'hidden',
                    borderRadius: '12px',
                    backgroundColor: '#fcfcfc',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: `1px solid ${vistelicaColors.secondary}20`
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
                                        fontSize: '1.2rem',
                                        color: vistelicaColors.secondary
                                    }}
                                />
                            </motion.div>
                        }
                        sx={{
                            minHeight: '56px !important',
                            p: 1.5,
                            px: 2.5,
                            background: `linear-gradient(to right, ${vistelicaColors.secondary}15, ${vistelicaColors.primary}05)`,
                            ':hover': {
                                background: `linear-gradient(to right, ${vistelicaColors.secondary}25, ${vistelicaColors.primary}10)`,
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <motion.div
                                animate={{
                                    rotate: expanded ? [0, -15, 0] : 0,
                                    scale: expanded ? [1, 1.15, 1] : 1
                                }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                style={{
                                    background: `linear-gradient(135deg, ${vistelicaColors.secondary}, ${vistelicaColors.primary})`,
                                    borderRadius: '50%',
                                    padding: '8px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <FabricIcon sx={{
                                    color: 'white',
                                    fontSize: '1.3rem'
                                }} />
                            </motion.div>
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontSize: '1.1rem',
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
                                    height: 22,
                                    backgroundColor: `${vistelicaColors.secondary}30`,
                                    color: vistelicaColors.secondary,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    ml: 1
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
                                        p: 3,
                                        borderRadius: '0 0 12px 12px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        background: 'linear-gradient(135deg, #ffffff 25%, #fafafa 100%)'
                                    }}>
                                        {/* Sección de composición */}
                                        <motion.div variants={itemVariants}>
                                            <Box sx={{ mb: 3 }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: 600,
                                                        fontFamily: typography.fontFamily,
                                                        color: vistelicaColors.secondary,
                                                        mb: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1
                                                    }}
                                                >
                                                    <Box sx={{
                                                        width: 6,
                                                        height: 22,
                                                        backgroundColor: vistelicaColors.secondary,
                                                        borderRadius: 1,
                                                        mr: 1
                                                    }} />
                                                    Composición
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontSize: '1rem',
                                                        fontFamily: typography.fontFamily,
                                                        lineHeight: 1.7,
                                                        pl: 2,
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
                                                        fontSize: '1rem',
                                                        fontWeight: 600,
                                                        fontFamily: typography.fontFamily,
                                                        color: vistelicaColors.secondary,
                                                        mb: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1
                                                    }}
                                                >
                                                    <Box sx={{
                                                        width: 6,
                                                        height: 22,
                                                        backgroundColor: vistelicaColors.primary,
                                                        borderRadius: 1,
                                                        mr: 1
                                                    }} />
                                                    Instrucciones de cuidado
                                                </Typography>
                                                <Box sx={{ pl: 2 }}>
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
                                                                gap: 2,
                                                                mb: 1.5
                                                            }}>
                                                                <LocalLaundryServiceIcon sx={{
                                                                    color: vistelicaColors.primary,
                                                                    fontSize: '1rem'
                                                                }} />
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontSize: '0.95rem',
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

                                        {/* Elementos decorativos */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: -30,
                                                right: -30,
                                                width: '180px',
                                                height: '180px',
                                                background: `radial-gradient(circle, ${vistelicaColors.secondary}10 10%, transparent 70%)`,
                                                opacity: 0.5,
                                                borderRadius: '50%',
                                                zIndex: 0
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 20,
                                                left: -40,
                                                width: '100px',
                                                height: '100px',
                                                background: `radial-gradient(circle, ${vistelicaColors.primary}10 10%, transparent 70%)`,
                                                opacity: 0.4,
                                                borderRadius: '50%',
                                                zIndex: 0
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