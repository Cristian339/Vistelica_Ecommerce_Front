"use client";
import { useState } from 'react';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CartItem({ item = {} }) {
    const [quantity, setQuantity] = useState(item.quantity || 1);

    // Usar la imageUrl del producto si está disponible o una imagen placeholder
    const imageUrl = item.imageUrl || item.image || '/images/placeholder-product.jpg';
    const productName = item.name || 'Producto';
    const productPrice = item.price || 0;

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            py: 2,
            borderBottom: '1px solid #eee',
            gap: 3,
            minWidth: { xs: '100%', md: 1000 }
        }}>
            {/* Imagen del producto */}
            <Avatar
                variant="square"
                src={imageUrl}
                alt={productName}
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 1
                }}
            />

            {/* Nombre del producto */}
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" sx={{
                    fontWeight: 500,
                    fontFamily: "'Amethysta', serif"
                }}>
                    {productName}
                </Typography>

                <Typography variant="body2" color="primary" fontWeight="bold">
                    {parseFloat(productPrice).toFixed(2)}€
                </Typography>
            </Box>

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