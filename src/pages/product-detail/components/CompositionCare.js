"use client";

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CompositionCare = ({ composition }) => {
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
                    <Typography variant="subtitle2" sx={{ fontSize: '0.85rem' }}>Composición</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {composition}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default CompositionCare;