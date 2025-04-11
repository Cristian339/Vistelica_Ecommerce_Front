"use client";

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ProductInfo = ({ description }) => {
    return (
        <Box mt={2}>
            <Accordion
                defaultExpanded
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
                    <Typography variant="subtitle2" sx={{ fontSize: '0.85rem' }}>Descripción</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 1 }}>
                    <Typography variant="body2" sx={{
                        maxWidth: 900,
                        fontSize: '0.8rem',
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word', // Rompe palabras muy largas
                        overflowWrap: 'break-word' // Asegura el salto de línea
                    }}>
                        {description}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default ProductInfo;