import React from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { Add, Remove, TouchApp } from '@mui/icons-material';
import { motion } from "framer-motion";
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const QuantitySelector = ({
                              quantity,
                              onQuantityChange,
                              min = 1,
                              max = 10
                          }) => {
    return (
        <Box sx={{ my: 3 }}>
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: 'linear-gradient(145deg, #ffffff, #f8f8f8)'
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: typography.fontFamily,
                        fontWeight: 600,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        color: vistelicaColors.secondary
                    }}
                >
                    <TouchApp sx={{ mr: 1, color: vistelicaColors.primary }} />
                    Cantidad
                </Typography>

                <motion.div
                    whileHover={{ scale: 1.03 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '180px',
                        height: '55px',
                        borderRadius: '28px',
                        background: 'linear-gradient(145deg, #f8f8f8, #ffffff)',
                        boxShadow: '5px 5px 10px #d9d9d9, -5px -5px 10px #ffffff',
                        padding: '6px'
                    }}>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                        >
                            <IconButton
                                size="large"
                                onClick={() => onQuantityChange(-1)}
                                disabled={quantity <= min}
                                sx={{
                                    backgroundColor: quantity <= min ? '#f0f0f0' : vistelicaColors.primary,
                                    color: quantity <= min ? '#aaa' : 'white',
                                    '&:hover': {
                                        backgroundColor: quantity <= min ? '#f0f0f0' : vistelicaColors.primaryDark,
                                    },
                                    width: 40,
                                    height: 40
                                }}
                            >
                                <Remove />
                            </IconButton>
                        </motion.div>

                        <motion.div
                            key={quantity}
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 700,
                                damping: 30
                            }}
                            style={{ flex: 1 }}
                        >
                            <Typography
                                sx={{
                                    textAlign: 'center',
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 700,
                                    fontSize: '1.5rem',
                                    color: vistelicaColors.secondary
                                }}
                            >
                                {quantity}
                            </Typography>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                        >
                            <IconButton
                                size="large"
                                onClick={() => onQuantityChange(1)}
                                disabled={quantity >= max}
                                sx={{
                                    backgroundColor: quantity >= max ? '#f0f0f0' : vistelicaColors.primary,
                                    color: quantity >= max ? '#aaa' : 'white',
                                    '&:hover': {
                                        backgroundColor: quantity >= max ? '#f0f0f0' : vistelicaColors.primaryDark,
                                    },
                                    width: 40,
                                    height: 40
                                }}
                            >
                                <Add />
                            </IconButton>
                        </motion.div>
                    </Box>
                </motion.div>
            </Paper>
        </Box>
    );
};

export default QuantitySelector;