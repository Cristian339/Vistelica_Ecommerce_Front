"use client";

import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {vistelicaColors} from "@/pages/shared-theme/vistelicaColors";

const PromotionBanner = ({ offer, price }) => {
    return (
        <Box my={1.5}>
            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
                    borderLeft: '3px solid',
                    borderColor: vistelicaColors.primary,
                    backgroundColor: vistelicaColors.primaryLight
                }}
            >
                <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 'medium' }}>
                    <span style={{ color: 'primary.main', fontWeight: 'bold' }}>{price}</span> {offer}
                </Typography>
            </Paper>
        </Box>
    );
};

export default PromotionBanner;