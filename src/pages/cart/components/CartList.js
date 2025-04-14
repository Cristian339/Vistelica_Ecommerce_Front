"use client";
import { Box } from '@mui/material';
import CartItem from './CartItem';

export default function CartList() {
    return (
        <Box sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 3,
            backgroundColor: 'white'
        }}>
            <CartItem />
            {/* Puedes duplicar <CartItem /> para más productos */}
        </Box>
    );
}