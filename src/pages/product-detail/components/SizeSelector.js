import React from 'react';
import { Box, Typography, Paper, Button, Tooltip } from '@mui/material';
import { motion } from "framer-motion";
import { TouchApp } from '@mui/icons-material';
import { vistelicaColors } from '@/components/shared/vistelicaColors';
import { typography } from "@/components/shared/themePrimitives";

const SizeSelector = ({
                          availableSizes,
                          selectedSize,
                          onSizeChange,
                          setShowSizeGuide,
                          highlightedSection,
                          pulseAnimation
                      }) => {
    return (
        <Box sx={{ mb: 3 }}>
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: 'linear-gradient(145deg, #ffffff, #f8f8f8)',
                    ...(highlightedSection && {
                        animation: pulseAnimation
                    })
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: typography.fontFamily,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            color: vistelicaColors.secondary
                        }}
                    >
                        <TouchApp sx={{ mr: 1, color: vistelicaColors.primary }} />
                        Talla: {selectedSize && <span style={{ marginLeft: '4px', fontWeight: 400 }}>{selectedSize}</span>}
                    </Typography>
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => setShowSizeGuide(true)}
                        sx={{
                            color: vistelicaColors.primary,
                            fontFamily: typography.fontFamily,
                            textDecoration: 'underline',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                textDecoration: 'underline',
                                color: vistelicaColors.primaryDark
                            }
                        }}
                    >
                        Guía de tallas
                    </Button>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        justifyContent: 'flex-start'
                    }}
                >
                    {availableSizes.map(size => (
                        <motion.div
                            key={size}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Tooltip title={size} arrow>
                                <Button
                                    variant={selectedSize === size ? "contained" : "outlined"}
                                    onClick={() => onSizeChange(size)}
                                    sx={{
                                        minWidth: '48px',
                                        height: '48px',
                                        borderRadius: '8px',
                                        color: selectedSize === size ? 'white' : vistelicaColors.secondary,
                                        backgroundColor: selectedSize === size ? vistelicaColors.primary : 'transparent',
                                        borderColor: selectedSize === size ? vistelicaColors.primary : '#e0e0e0',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: selectedSize === size ? vistelicaColors.primaryDark : 'rgba(0,0,0,0.04)',
                                            borderColor: selectedSize === size ? vistelicaColors.primaryDark : vistelicaColors.primary
                                        }
                                    }}
                                >
                                    {size}
                                </Button>
                            </Tooltip>
                        </motion.div>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default SizeSelector;