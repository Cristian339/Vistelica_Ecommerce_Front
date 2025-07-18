'use client';
import { Box, IconButton, Typography } from '@mui/material';
import { vistelicaColors } from "@/components/shared/vistelicaColors";
import { typography } from "@/components/shared/themePrimitives";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { motion } from 'framer-motion';

export default function ProductActionButtons({
                                                 quantity,
                                                 handleQuantityChange,
                                                 loading
                                             }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || loading}
                    sx={{
                        color: vistelicaColors.primary,
                        '&.Mui-disabled': {
                            color: 'rgba(0,0,0,0.2)'
                        },
                        backgroundColor: 'rgba(0,0,0,0.04)',
                        '&:hover': {
                            backgroundColor: `${vistelicaColors.primary}20`
                        }
                    }}
                >
                    <RemoveIcon fontSize="small" />
                </IconButton>
            </motion.div>

            <Typography
                sx={{
                    mx: 1,
                    minWidth: 20,
                    textAlign: 'center',
                    fontFamily: typography.fontFamily.heading,
                    fontWeight: 'bold'
                }}
            >
                {quantity}
            </Typography>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 100 || loading}
                    sx={{
                        color: vistelicaColors.primary,
                        '&.Mui-disabled': {
                            color: 'rgba(0,0,0,0.2)'
                        },
                        backgroundColor: 'rgba(0,0,0,0.04)',
                        '&:hover': {
                            backgroundColor: `${vistelicaColors.primary}20`
                        }
                    }}
                >
                    <AddIcon fontSize="small" />
                </IconButton>
            </motion.div>
        </Box>
    );
}