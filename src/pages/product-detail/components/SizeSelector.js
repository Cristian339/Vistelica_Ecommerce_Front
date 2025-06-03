"use client";

import React from 'react';
import { Button, Typography, Grid, Box, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import { motion } from "framer-motion";
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { typography } from "@/pages/shared-theme/themePrimitives";

const SizeSelector = ({ sizes, selectedSize, onSizeChange }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // Determinamos el tamaño de los botones según el viewport
    const getButtonSize = () => {
        if (isMobile) return { width: 32, height: 32, fontSize: '0.8rem' };
        if (isTablet) return { width: 36, height: 36, fontSize: '0.85rem' };
        return { width: 40, height: 40, fontSize: '0.9rem' };
    };

    const buttonSize = getButtonSize();

    // Variantes para animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <Box mb={3}>
            <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                    fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                    fontFamily: typography.fontFamily,
                    fontWeight: 500,
                    color: vistelicaColors.secondary,
                    mb: 1
                }}
            >
                Tallas:
            </Typography>

            <Box
                component={motion.div}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <Grid
                    container
                    spacing={{ xs: 0.5, sm: 1 }}
                    sx={{ ml: -0.5 }}
                >
                    {sizes.map((size) => (
                        <Grid item key={size}>
                            <Tooltip
                                title={selectedSize === size ? "Talla seleccionada" : `Seleccionar talla ${size}`}
                                arrow
                                placement="top"
                            >
                                <Box
                                    component={motion.div}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        aria-label={`Seleccionar talla ${size}`}
                                        aria-pressed={selectedSize === size}
                                        sx={{
                                            minWidth: { xs: buttonSize.width, sm: buttonSize.width, md: buttonSize.width },
                                            height: { xs: buttonSize.height, sm: buttonSize.height, md: buttonSize.height },
                                            p: 0,
                                            fontSize: buttonSize.fontSize,
                                            fontFamily: typography.fontFamily,
                                            fontWeight: 500,
                                            color: vistelicaColors.primary,
                                            borderColor: selectedSize === size
                                                ? vistelicaColors.primary
                                                : `${vistelicaColors.primary}80`,
                                            borderWidth: selectedSize === size ? 2 : 1,
                                            backgroundColor: selectedSize === size
                                                ? vistelicaColors.primary
                                                : vistelicaColors.tertiary,
                                            transition: 'all 0.2s ease',
                                            ...(selectedSize === size && {
                                                color: vistelicaColors.tertiary,
                                                boxShadow: `0 2px 4px ${vistelicaColors.primary}40`,
                                            }),
                                            '&:hover': {
                                                borderColor: vistelicaColors.primary,
                                                backgroundColor: selectedSize === size
                                                    ? vistelicaColors.primaryDark
                                                    : `${vistelicaColors.primary}15`,
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 4px 8px ${vistelicaColors.primary}30`,
                                            },
                                            '&:focus': {
                                                outline: 'none',
                                                boxShadow: `0 0 0 3px ${vistelicaColors.primary}40`,
                                            }
                                        }}
                                        onClick={() => onSizeChange(size)}
                                    >
                                        {size}
                                    </Button>
                                </Box>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Mensaje de guía de tallas */}
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 1.5
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: vistelicaColors.secondary,
                        fontFamily: typography.fontFamily,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        fontStyle: 'italic',
                        cursor: 'pointer',
                        '&:hover': {
                            color: vistelicaColors.primary,
                            textDecoration: 'underline'
                        }
                    }}
                >
                    Guía de tallas
                </Typography>
            </Box>
        </Box>
    );
};

export default SizeSelector;