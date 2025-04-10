"use client";

import React from 'react';
import {
    Box,
    Typography,
    Divider,
    Avatar,
    Rating,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ProductReviews = ({ reviews }) => {
    return (
        <Box mt={4}>
            <Typography variant="h5" gutterBottom sx={{ fontSize: '1.2rem', fontWeight: 600 }}>
                Opiniones de clientes
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating
                    value={4.5}
                    precision={0.5}
                    readOnly
                    sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                    {reviews.length} opiniones
                </Typography>
            </Box>

            <Accordion defaultExpanded elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">Ver todas las opiniones</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {reviews.map((review, index) => (
                        <Box key={index} mb={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
                                    {review.user.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2">{review.user}</Typography>
                                    <Rating value={review.rating} size="small" readOnly />
                                </Box>
                            </Box>
                            <Typography variant="body2" paragraph>
                                {review.comment}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {review.date}
                            </Typography>
                            {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
                        </Box>
                    ))}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default ProductReviews;