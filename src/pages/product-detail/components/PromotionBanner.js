"use client";

import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { motion } from "framer-motion";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const PromotionBanner = ({ offer, price }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box my={2}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 1.5,
                        pl: 2,
                        borderRadius: 2,
                        borderLeft: '4px solid',
                        borderColor: vistelicaColors.primary,
                        backgroundColor: `${vistelicaColors.primaryLight}15`,
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, 0]
                        }}
                        transition={{ repeat: Infinity, repeatDelay: 6 }}
                        style={{ marginRight: '12px' }}
                    >
                        <LocalOfferIcon sx={{ color: vistelicaColors.primary }} />
                    </motion.div>

                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '0.9rem',
                            fontWeight: 'medium',
                            fontFamily: typography.fontFamily
                        }}
                    >
                        <Box component="span" sx={{
                            color: vistelicaColors.primary,
                            fontWeight: 700,
                            mr: 0.5
                        }}>
                            {price}
                        </Box>
                        {offer}
                    </Typography>
                </Paper>
            </Box>
        </motion.div>
    );
};

export default PromotionBanner;