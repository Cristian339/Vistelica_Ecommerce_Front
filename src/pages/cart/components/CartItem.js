"use client";
import { useState } from 'react';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CartItem() {
    const [quantity, setQuantity] = useState(1);

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            py: 2,
            borderBottom: '1px solid #eee',
            gap: 3,
            minWidth: 1000
        }}>
            {/* Imagen del producto */}
            <Avatar
                variant="square"
                src="https://res.cloudinary.com/dhyv4dpk2/image/upload/v1744976244/vistelica/productos/Hombre/Camisas/kmoglt9i8wj6fwuclcng.jpg"
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 1
                }}
            />

            {/* Nombre del producto */}
            <Typography variant="body1" sx={{
                fontWeight: 500,
                flexGrow: 1,
                fontFamily: "'Amethysta', serif"
            }}>
                Camisa manga corta bordado
            </Typography>

            {/* Controles */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                    size="small"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                    <RemoveIcon />
                </IconButton>

                <Typography>{quantity}</Typography>

                <IconButton
                    size="small"
                    onClick={() => setQuantity(q => q + 1)}
                >
                    <AddIcon />
                </IconButton>

                <IconButton size="small" sx={{ color: 'black' }}>
                    <DeleteIcon />
                </IconButton>
            </Box>
        </Box>
    );
}