'use client';
import { Box } from '@mui/material';
import CartItem from './CartItem';

export default function CartList({ cartItems, setCartItems, setTotal, userId, sessionId }) {
    if (!cartItems || cartItems.length === 0) {
        return (
            <Box sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                p: 3,
                backgroundColor: 'white',
                textAlign: 'center'
            }}>
                No hay productos en el carrito
            </Box>
        );
    }

    return (
        <Box sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 3,
            backgroundColor: 'white'
        }}>
            {cartItems.map((item) => (
                <CartItem
                    key={item.order_detail_id}
                    item={item}
                    setCartItems={setCartItems}
                    setTotal={setTotal}
                    userId={userId}
                    sessionId={sessionId}
                />
            ))}
        </Box>
    );
}