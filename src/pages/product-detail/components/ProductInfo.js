"use client";

import React, {useEffect, useState} from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails,
    Typography, Box, Paper, Divider, Chip, IconButton,
    useTheme, useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArticleIcon from '@mui/icons-material/Article';
import InfoIcon from '@mui/icons-material/Info';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const ProductInfo = ({ product }) => {
    const [expanded, setExpanded] = useState(false);
    const [highlightedParagraph, setHighlightedParagraph] = useState(null);



    const description = product?.description || '';

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // Dividir la descripción en párrafos para animación
    const paragraphs = description.split('\n').filter(p => p.trim().length > 0);


    useEffect(() => {
        console.log("La descripcion es: " + description);
    }, []);
    // Animaciones optimizadas
    const containerVariants = {
        hidden: { opacity: 0, y: isMobile ? 5 : 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                when: "beforeChildren",
                staggerChildren: isMobile ? 0.05 : 0.1
            }
        }
    };

    const paragraphVariants = {
        hidden: { opacity: 0, x: isMobile ? -3 : -5 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    };

    const handleParagraphHover = (index) => {
        if (!isMobile) setHighlightedParagraph(index);
    };

    const handleParagraphLeave = () => {
        if (!isMobile) setHighlightedParagraph(null);
    };

    const handleParagraphTouch = (index) => {
        if (isMobile) {
            if (highlightedParagraph === index) {
                setHighlightedParagraph(null);
            } else {
                setHighlightedParagraph(index);
            }
        }
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
                    mt: { xs: 1.5, sm: 2, md: 2.5 },
                    overflow: 'hidden',
                    borderRadius: { xs: '10px', sm: '12px' },
                    backgroundColor: '#fcfcfc',
                    boxShadow: {
                        xs: '0 2px 10px rgba(0,0,0,0.04)',
                        sm: '0 4px 20px rgba(0,0,0,0.06)'
                    },
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
                            <Box
                                component={motion.div}
                                animate={{
                                    rotate: expanded ? 180 : 0,
                                    scale: expanded ? 1.2 : 1
                                }}
                                transition={{
                                    duration: 0.3,
                                    type: "spring",
                                    stiffness: 200
                                }}
                                sx={{
                                    backgroundColor: `${vistelicaColors.primary}15`,
                                    borderRadius: '50%',
                                    width: { xs: 28, sm: 32 },
                                    height: { xs: 28, sm: 32 },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <ExpandMoreIcon
                                    sx={{
                                        fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                        color: vistelicaColors.primary
                                    }}
                                />
                            </Box>
                        }
                        aria-label="Expandir descripción del producto"
                        sx={{
                            minHeight: { xs: '48px !important', sm: '56px !important' },
                            p: { xs: 1.2, sm: 1.5 },
                            px: { xs: 1.8, sm: 2.5 },
                            background: `linear-gradient(to right, ${vistelicaColors.primary}15, ${vistelicaColors.secondary}05)`,
                            ':hover': {
                                background: `linear-gradient(to right, ${vistelicaColors.primary}25, ${vistelicaColors.secondary}10)`,
                            },
                            '& .MuiAccordionSummary-content': {
                                margin: { xs: '6px 0', sm: '8px 0' }
                            }
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1, sm: 1.5 },
                            flexWrap: { xs: 'wrap', sm: 'nowrap' }
                        }}>
                            <motion.div
                                animate={{
                                    rotate: expanded ? 15 : 0,
                                    scale: expanded ? 1.15 : 1
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2,
                                    type: "spring"
                                }}
                                style={{
                                    background: `linear-gradient(135deg, ${vistelicaColors.primary}, ${vistelicaColors.secondary})`,
                                    borderRadius: '50%',
                                    padding: isMobile ? '6px' : '8px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <ArticleIcon sx={{
                                    color: 'white',
                                    fontSize: { xs: '1.1rem', sm: '1.3rem' }
                                }} />
                            </motion.div>
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontSize: { xs: '0.95rem', sm: '1.1rem' },
                                        fontWeight: 600,
                                        fontFamily: typography.fontFamily,
                                        color: vistelicaColors.primary,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    Descripción del producto
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                        color: vistelicaColors.secondary,
                                        fontFamily: typography.fontFamily,
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                >
                                    Información detallada del artículo
                                </Typography>
                            </Box>
                            <Chip
                                icon={
                                    <AutoAwesomeIcon
                                        sx={{
                                            fontSize: '0.7rem',
                                            color: vistelicaColors.primary
                                        }}
                                    />
                                }
                                label="Detalle"
                                size="small"
                                sx={{
                                    height: { xs: 20, sm: 22 },
                                    backgroundColor: `${vistelicaColors.primary}15`,
                                    color: vistelicaColors.primary,
                                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                    fontWeight: 600,
                                    fontFamily: typography.fontFamily,
                                    ml: { xs: 0, sm: 1 },
                                    display: { xs: expanded ? 'none' : 'flex', sm: 'flex' }
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
                                        p: { xs: 2, sm: 3 },
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
                                                    onClick={() => handleParagraphTouch(index)}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            gap: { xs: 1, sm: 1.5 },
                                                            mb: { xs: 1.5, sm: 2 },
                                                            transition: 'all 0.3s ease',
                                                            p: { xs: 1, sm: 1.5 },
                                                            borderRadius: { xs: '6px', sm: '8px' },
                                                            backgroundColor: highlightedParagraph === index
                                                                ? `${vistelicaColors.primary}08`
                                                                : 'transparent',
                                                            '&:hover': {
                                                                backgroundColor: !isMobile
                                                                    ? `${vistelicaColors.primary}05`
                                                                    : 'transparent'
                                                            }
                                                        }}
                                                    >
                                                        {index === 0 ? (
                                                            <InfoIcon sx={{
                                                                color: vistelicaColors.primary,
                                                                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                                                mt: 0.3,
                                                                flexShrink: 0
                                                            }} />
                                                        ) : index === 1 ? (
                                                            <Box
                                                                sx={{
                                                                    display: { xs: 'none', md: 'block' },
                                                                    opacity: 0.7,
                                                                    ml: 0.2
                                                                }}
                                                            >
                                                                <FormatQuoteIcon sx={{
                                                                    color: vistelicaColors.primary,
                                                                    fontSize: '0.9rem',
                                                                    transform: 'rotate(180deg)',
                                                                    mt: 0.3,
                                                                    opacity: 0.6,
                                                                    flexShrink: 0
                                                                }} />
                                                            </Box>
                                                        ) : null}

                                                        <Typography
                                                            variant="body1"
                                                            component="p"
                                                            sx={{
                                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                                lineHeight: 1.7,
                                                                fontFamily: typography.fontFamily,
                                                                color: index === 0
                                                                    ? vistelicaColors.primary
                                                                    : (vistelicaColors.secondary || '#333'),
                                                                position: 'relative',
                                                                pl: index === 0 ? 0 : (index === 1 ? { xs: 0, md: 0 } : 0),
                                                                flex: 1,
                                                                '&:not(:last-child)': {
                                                                    pb: { xs: 0.5, sm: 1 },
                                                                },
                                                                '&:first-of-type': {
                                                                    fontWeight: 600,
                                                                },
                                                                wordBreak: 'break-word'
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
                                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                                        fontFamily: typography.fontFamily,
                                                        p: { xs: 1, sm: 1.5 },
                                                        color: vistelicaColors.secondary,
                                                        fontStyle: 'italic'
                                                    }}
                                                >
                                                    {description || "No hay descripción disponible para este producto."}
                                                </Typography>
                                            </motion.div>
                                        )}

                                        {/* Elementos decorativos responsivos */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: { xs: -20, sm: -30 },
                                                right: { xs: -20, sm: -30 },
                                                width: { xs: 120, sm: 180 },
                                                height: { xs: 120, sm: 180 },
                                                background: `radial-gradient(circle, ${vistelicaColors.primary}10 10%, transparent 70%)`,
                                                opacity: 0.5,
                                                borderRadius: '50%',
                                                zIndex: 0,
                                                display: { xs: 'none', sm: 'block' }
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: { xs: 10, sm: 20 },
                                                left: { xs: -20, sm: -40 },
                                                width: { xs: 70, sm: 100 },
                                                height: { xs: 70, sm: 100 },
                                                background: `radial-gradient(circle, ${vistelicaColors.secondary}10 10%, transparent 70%)`,
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

export default ProductInfo;