"use client";
import { Box, Button, Typography } from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

export default function EmptyCart() {
    return (
        <Box sx={{ textAlign: 'center', py: 10 }}>
            <ShoppingBasketIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
                Tu carrito está vacío
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Parece que no has agregado ningún producto a tu carrito todavía.
            </Typography>
            <Button variant="contained" color="primary" href="/">
                Continuar Comprando
            </Button>
        </Box>
    );
}