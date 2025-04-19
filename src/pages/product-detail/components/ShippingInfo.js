"use client";

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ShippingInfo = () => {
    return (
        <Box mt={2}>
            <Accordion
                elevation={0}
                sx={{
                    '&:before': { display: 'none' },
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ fontSize: '1rem' }} />}
                    sx={{ minHeight: '32px !important' }}
                >
                    <Typography variant="subtitle2" sx={{ fontSize: '0.85rem' }}>Envíos</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'primary.main' }}>Envío Gratuito</span> en pedidos +50€.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default ShippingInfo;