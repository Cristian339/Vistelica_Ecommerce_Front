import React from 'react';
import { Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Share, Favorite, FavoriteBorder } from '@mui/icons-material';
import { motion } from "framer-motion";
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';

const ProductActions = ({
                            isFavorite,
                            onFavoriteToggle,
                            onShareClick,
                            loadingWishlist = false,
                            isHighlighted = false
                        }) => {
    const pulseAnimation = {
        scale: [1, 1.05, 1],
        boxShadow: [
            '0 0 0 0 rgba(0,0,0,0)',
            '0 0 0 5px rgba(252,128,25,0.2)',
            '0 0 0 0 rgba(0,0,0,0)'
        ],
        transition: { duration: 0.8 }
    };

    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Compartir producto">
                <IconButton
                    onClick={onShareClick}
                    sx={{
                        color: vistelicaColors.secondary,
                        '&:hover': { color: vistelicaColors.primary }
                    }}
                >
                    <Share fontSize="medium" />
                </IconButton>
            </Tooltip>

            <motion.div animate={isHighlighted ? pulseAnimation : {}}>
                <IconButton
                    aria-label={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
                    onClick={onFavoriteToggle}
                    disabled={loadingWishlist}
                    sx={{
                        color: isFavorite ? 'red' : 'grey.400',
                        '&:hover': {
                            color: isFavorite ? '#d32f2f' : '#f44336',
                            transform: 'scale(1.1)'
                        }
                    }}
                >
                    {loadingWishlist ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : isFavorite ? (
                        <Favorite fontSize="medium" />
                    ) : (
                        <FavoriteBorder fontSize="medium" />
                    )}
                </IconButton>
            </motion.div>
        </Box>
    );
};

export default ProductActions;