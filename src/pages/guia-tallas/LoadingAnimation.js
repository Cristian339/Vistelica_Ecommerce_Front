'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";

const LoadingAnimation = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: 'background.paper'
            }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: vistelicaColors.primary,
                        mb: 3
                    }}
                />
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: vistelicaColors.primary,
                        fontFamily: '"Tenor Sans", sans-serif'
                    }}
                >
                    Cargando guía de tallas...
                </Typography>
            </motion.div>
        </Box>
    );
};

export default LoadingAnimation;