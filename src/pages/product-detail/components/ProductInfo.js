"use client";

import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Paper, Divider, Chip, IconButton } from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import ArticleIcon from '@mui/icons-material/Article';
import InfoIcon from '@mui/icons-material/Info';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const ProductInfo = ({ description }) => {
    const [expanded, setExpanded] = useState(true);
    const [highlightedParagraph, setHighlightedParagraph] = useState(null);

    // Dividir la descripción en párrafos para animación
    const paragraphs = description.split('\n').filter(p => p.trim().length > 0);

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

    const paragraphVariants = {
        hidden: { opacity: 0, x: -5 },
        visible: { opacity: 1, x: 0 }
    };

    const handleParagraphHover = (index) => {
        setHighlightedParagraph(index);
    };

    const handleParagraphLeave = () => {
        setHighlightedParagraph(null);
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
                    border: `1px solid ${vistelicaColors.primary}20`
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
                            background: `linear-gradient(to right, ${vistelicaColors.primary}15, ${vistelicaColors.secondary}05)`,
                            ':hover': {
                                background: `linear-gradient(to right, ${vistelicaColors.primary}25, ${vistelicaColors.secondary}10)`,
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <motion.div
                                animate={{
                                    rotate: expanded ? [0, 15, 0] : 0,
                                    scale: expanded ? [1, 1.15, 1] : 1
                                }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                style={{
                                    background: `linear-gradient(135deg, ${vistelicaColors.primary}, ${vistelicaColors.secondary})`,
                                    borderRadius: '50%',
                                    padding: '8px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <ArticleIcon sx={{
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
                                    Descripción del producto
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: '0.8rem',
                                        color: 'text.secondary',
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                >
                                    Información detallada del artículo
                                </Typography>
                            </Box>
                            <Chip
                                label="Detalle"
                                size="small"
                                sx={{
                                    height: 22,
                                    backgroundColor: `${vistelicaColors.primary}30`,
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
                                        borderColor: `${vistelicaColors.primary}30`,
                                        borderStyle: 'dashed'
                                    }} />
                                    <Box sx={{
                                        p: 3,
                                        borderRadius: '0 0 12px 12px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        background: 'linear-gradient(135deg, #ffffff 25%, #fafafa 100%)'
                                    }}>
                                        {paragraphs.length > 0 ? (
                                            paragraphs.map((paragraph, index) => (
                                                <motion.div
                                                    key={index}
                                                    variants={paragraphVariants}
                                                    onMouseEnter={() => handleParagraphHover(index)}
                                                    onMouseLeave={handleParagraphLeave}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            gap: 1.5,
                                                            mb: 2,
                                                            transition: 'all 0.3s',
                                                            p: 1.5,
                                                            borderRadius: '8px',
                                                            backgroundColor: highlightedParagraph === index ? `${vistelicaColors.primary}08` : 'transparent'
                                                        }}
                                                    >
                                                        {index === 0 && (
                                                            <InfoIcon sx={{
                                                                color: vistelicaColors.primary,
                                                                fontSize: '1.2rem',
                                                                mt: 0.3
                                                            }} />
                                                        )}
                                                        <Typography
                                                            variant="body1"
                                                            component="p"
                                                            sx={{
                                                                fontSize: '1rem',
                                                                lineHeight: 1.7,
                                                                fontFamily: typography.fontFamily,
                                                                color: index === 0 ? vistelicaColors.secondary : (vistelicaColors.textPrimary || '#333'),
                                                                position: 'relative',
                                                                pl: index === 0 ? 0 : (index === 1 ? 0 : 0),
                                                                flex: 1,
                                                                '&:not(:last-child)': {
                                                                    pb: 1,
                                                                },
                                                                '&:first-of-type': {
                                                                    fontWeight: 500,
                                                                }
                                                            }}
                                                        >
                                                            {paragraph}
                                                        </Typography>
                                                    </Box>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <motion.div variants={paragraphVariants}>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontSize: '1rem',
                                                        fontFamily: typography.fontFamily,
                                                        p: 1.5
                                                    }}
                                                >
                                                    {description || "No hay descripción disponible para este producto."}
                                                </Typography>
                                            </motion.div>
                                        )}

                                        {/* Elementos decorativos */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: -30,
                                                right: -30,
                                                width: '180px',
                                                height: '180px',
                                                background: `radial-gradient(circle, ${vistelicaColors.primary}10 10%, transparent 70%)`,
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
                                                background: `radial-gradient(circle, ${vistelicaColors.secondary}10 10%, transparent 70%)`,
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

export default ProductInfo;