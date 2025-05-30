'use client';
import React, { useMemo } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

// Componente para el texto destacado dentro del banner
const HighlightedText = React.memo(({ text, sx = {} }) => {
    return (
        <Box
            component="span"
            sx={{
                border: '2px solid white',
                px: { xs: 1, sm: 1.5, md: 2 },
                py: { xs: 0.5, sm: 0.75, md: 1 },
                display: 'inline-block',
                ...sx
            }}
        >
            {text}
        </Box>
    );
});

// Componente principal del banner
const BannerSection = React.memo(({
                                      backgroundColor = '#cc0000',
                                      firstText = 'ÚLTIMAS',
                                      highlightedText = 'UNIDADES',
                                      sx = {}
                                  }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const containerStyles = useMemo(() => ({
        width: '100%',
        backgroundColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: { xs: 2, sm: 3, md: 4 },
        overflow: 'hidden',
        position: 'relative',
        ...sx
    }), [backgroundColor, sx]);

    const textStyles = useMemo(() => ({
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: { xs: '2rem', sm: '3rem', md: '6rem' },
        letterSpacing: { xs: '0.05em', md: '0.07em' },
        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
        fontFamily: 'inherit',
        lineHeight: 1.2
    }), []);

    // Animaciones para mejorar la experiencia visual
    const containerAnimation = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.6 }
    };

    const textAnimation = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.5, delay: 0.2 }
    };

    const highlightAnimation = {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: {
            duration: 0.5,
            delay: 0.4,
            type: 'spring',
            stiffness: 100
        }
    };

    return (
        <motion.div {...containerAnimation}>
            <Box
                sx={containerStyles}
                role="banner"
                aria-label="Banner de ofertas especiales"
            >
                <Typography variant="h1" component="h2" sx={textStyles}>
                    <motion.span {...textAnimation}>
                        {firstText}{' '}
                    </motion.span>
                    <motion.span {...highlightAnimation}>
                        <HighlightedText text={highlightedText} />
                    </motion.span>
                </Typography>
            </Box>
        </motion.div>
    );
});

// Nombres para mejor depuración
HighlightedText.displayName = 'HighlightedText';
BannerSection.displayName = 'BannerSection';

export default BannerSection;