'use client';
import { Container, Grid, Typography, Box } from '@mui/material';
import CartList from './components/CartList';
import CartSummary from './components/CartSummary';
import Navbar from "@/components/layout/HeaderComponent";
import { useEffect, useState } from 'react';
import cartService from '@/services/cartService';
import { getCurrentUser } from '@/services/authService';
import EmptyCart from './components/EmptyCart';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState({
        totalOriginal: 0,
        totalDiscounted: 0,
        totalSavings: 0,
        itemCount: 0
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loadCartData = async () => {
        try {
            setLoading(true);
            const user = await getCurrentUser();
            const sessionId = cartService.getSessionId();

            let currentCart = null;

            if (user && sessionId) {
                currentCart = await cartService.handleCartMergeOnAuth();
            } else {
                currentCart = user
                    ? await cartService.getCart(user.user_id)
                    : await cartService.getCart(null, sessionId);
            }

            if (currentCart) {
                setCart(currentCart);
                const items = currentCart.cartDetails || [];
                setCartItems(items);

                // Obtener totales con descuentos aplicados
                const totalData = await cartService.getCartTotal(
                    user?.user_id,
                    user ? null : sessionId
                );

                setCartTotal({
                    totalOriginal: totalData.summary.totalOriginal,
                    totalDiscounted: totalData.summary.totalDiscounted,
                    totalSavings: totalData.summary.totalSavings,
                    itemCount: items.length
                });
            }
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCartData();
    }, []);

    const handleUpdateCart = async () => {
        await loadCartData();
    };

    const handleCheckout = () => {
        const isGuest = !getCurrentUser() && cartService.getSessionId();
        if (isGuest) {
            router.push('/sign-in-side');
        } else {
            router.push('/checkout');
        }
    };

    if (!cart || cartItems.length === 0) {
        return <EmptyCart />;
    }

    return (
        <>
            <Navbar />
            <Container
                maxWidth="xl"
                sx={{
                    my: 4,
                    px: { xs: 2, md: 4 },
                    minHeight: 'calc(100vh - 200px)'
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        mb: 4,
                        textAlign: 'center',
                        fontSize: { xs: '1.5rem', md: '1.8rem' },
                        fontFamily: "'Amethysta', serif"
                    }}
                >
                    CESTA DE LA COMPRA
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    alignItems: 'flex-start'
                }}>
                    <Box sx={{
                        flex: 1,
                        minWidth: 0,
                        width: '100%'
                    }}>
                        <CartList
                            cartItems={cartItems}
                            onUpdate={handleUpdateCart}
                            userId={cart.user?.user_id}
                            sessionId={cart.session_id}
                        />
                    </Box>

                    <Box sx={{
                        width: { xs: '100%', md: '350px' },
                        position: { md: 'sticky' },
                        top: 100
                    }}>
                        <CartSummary
                            totalPrice={cartTotal.totalDiscounted} // Precio CON descuentos
                            itemCount={cartTotal.itemCount}
                            isGuest={!cart.user && cart.session_id}
                            onCheckout={handleCheckout}
                        />
                    </Box>
                </Box>
            </Container>
        </>
    );
}