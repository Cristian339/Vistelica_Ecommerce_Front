"use client";

import React, { useState } from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails,
    Typography, Box, Grid, Divider, Paper
} from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CachedIcon from '@mui/icons-material/Cached';
import SecurityIcon from '@mui/icons-material/Security';
import StraightenIcon from '@mui/icons-material/Straighten';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

// Variantes para animaciones
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const ShippingMethod = ({ icon, title, description, highlighted }) => {
    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
                    mb: 2,
                    borderRadius: 2,
                    background: highlighted ? `linear-gradient(145deg, ${vistelicaColors.primaryLight}20, ${vistelicaColors.primaryLight}10)` : 'transparent',
                    border: '1px solid',
                    borderColor: highlighted ? vistelicaColors.primaryLight : 'transparent',
                    transition: 'all 0.3s ease'
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={2} sm={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <motion.div
                            whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: highlighted ? `${vistelicaColors.primary}20` : `${vistelicaColors.secondary}10`,
                                borderRadius: '50%',
                                padding: '8px',
                            }}
                        >
                            <Box sx={{ color: highlighted ? vistelicaColors.primary : vistelicaColors.secondary }}>
                                {icon}
                            </Box>
                        </motion.div>
                    </Grid>
                    <Grid item xs={10} sm={11}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontFamily: typography.fontFamily,
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                color: highlighted ? vistelicaColors.primary : vistelicaColors.primary,
                                mb: 0.5
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: typography.fontFamily,
                                fontSize: '0.85rem',
                                color: 'text.secondary'
                            }}
                        >
                            {description}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </motion.div>
    );
};

const ShippingInfo = () => {
    const [expanded, setExpanded] = useState(false);

    const handleChange = () => {
        setExpanded(!expanded);
    };

    return (
        <Box mt={3}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Accordion
                    elevation={0}
                    expanded={expanded}
                    onChange={handleChange}
                    sx={{
                        '&:before': { display: 'none' },
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: expanded ? vistelicaColors.primaryLight : 'divider',
                        boxShadow: expanded ? `0 4px 12px ${vistelicaColors.primaryLight}30` : 'none',
                        transition: 'all 0.3s ease',
                        '&.Mui-expanded': {
                            margin: 0
                        },
                        overflow: 'hidden',
                        backgroundColor: expanded ? `${vistelicaColors.primaryLight}05` : 'transparent'
                    }}
                >
                    <AccordionSummary
                        expandIcon={
                            <motion.div
                                animate={{ rotate: expanded ? 180 : 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <ExpandMoreIcon sx={{
                                    fontSize: '1.2rem',
                                    color: expanded ? vistelicaColors.primary : vistelicaColors.secondary
                                }} />
                            </motion.div>
                        }
                        sx={{
                            minHeight: '48px !important',
                            padding: 1.5,
                            '& .MuiAccordionSummary-content': {
                                margin: '8px 0'
                            }
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                        >
                            <Box sx={{
                                p: 1,
                                borderRadius: '50%',
                                backgroundColor: expanded ? `${vistelicaColors.primary}15` : 'transparent',
                                transition: 'all 0.3s ease'
                            }}>
                                <LocalShippingIcon
                                    sx={{
                                        fontSize: '1.2rem',
                                        color: vistelicaColors.primary
                                    }}
                                />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    ml: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    fontFamily: typography.fontFamily,
                                    color: expanded ? vistelicaColors.primary : 'text.primary'
                                }}
                            >
                                Envíos y Devoluciones
                            </Typography>
                        </motion.div>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 2, pt: 0 }}>
                        <AnimatePresence>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <Box sx={{ mt: 1 }}>
                                    <ShippingMethod
                                        icon={<LocalShippingIcon fontSize="small" />}
                                        title="Envío Gratuito Express"
                                        description="En todos los pedidos de ropa superiores a 50€ (2-3 días laborables)"
                                        highlighted={true}
                                    />

                                    <ShippingMethod
                                        icon={<AccessTimeIcon fontSize="small" />}
                                        title="Envío Premium"
                                        description="Recibe tus prendas en 24h (coste adicional de 5,99€)"
                                        highlighted={false}
                                    />

                                    <ShippingMethod
                                        icon={<StraightenIcon fontSize="small" />}
                                        title="Guía de Tallas"
                                        description="Consulta nuestra guía de tallas para encontrar tu ajuste perfecto"
                                        highlighted={false}
                                    />

                                    <Divider sx={{ my: 2 }} />

                                    <ShippingMethod
                                        icon={<CachedIcon fontSize="small" />}
                                        title="Devoluciones Sin Complicaciones"
                                        description="30 días para cambios o devoluciones. Recogida a domicilio gratuita."
                                        highlighted={false}
                                    />

                                    <ShippingMethod
                                        icon={<SecurityIcon fontSize="small" />}
                                        title="Garantía de Calidad"
                                        description="Todos nuestros productos pasan por estrictos controles de calidad"
                                        highlighted={false}
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