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
    const [total, setTotal] = useState({ totalPrice: 0, itemCount: 0 });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initializeCart = async () => {
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
                    const items = currentCart.orderDetails || [];
                    setCartItems(items);

                    const calculatedTotal = items.reduce((sum, item) => {
                        return sum + (parseFloat(item.price) * item.quantity);
                    }, 0);

                    setTotal({
                        totalPrice: calculatedTotal,
                        itemCount: items.length
                    });
                }
            } catch (error) {
                console.error("Error al cargar el carrito:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeCart();
    }, []);

    const handleCheckout = () => {
        const isGuest = !getCurrentUser() && cartService.getSessionId();
        if (isGuest) {
            router.push('/sign-in-side');
        } else {
            router.push('/checkout');
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Container maxWidth="xl" sx={{ my: 4, px: { xs: 2, md: 4 } }}>
                    <Typography>Cargando carrito...</Typography>
                </Container>
            </>
        );
    }

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

                {/* Cambiamos a Box con flexbox en lugar de Grid */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    alignItems: 'flex-start'
                }}>
                    {/* CartList - Ocupa todo el espacio disponible */}
                    <Box sx={{
                        flex: 1,
                        minWidth: 0, // Evita problemas de desbordamiento
                        width: '100%'
                    }}>
                        <CartList
                            cartItems={cartItems}
                            setCartItems={setCartItems}
                            setTotal={setTotal}
                            userId={cart.user?.user_id}
                            sessionId={cart.session_id}
                        />
                    </Box>

                    {/* CartSummary - Ancho fijo a la derecha */}
                    <Box sx={{
                        width: { xs: '100%', md: '350px' },
                        position: { md: 'sticky' },
                        top: 100
                    }}>
                        <CartSummary
                            totalPrice={total.totalPrice}
                            itemCount={total.itemCount}
                            isGuest={!cart.user && cart.session_id}
                            onCheckout={handleCheckout}
                        />
                    </Box>
                </Box>
            </Container>
        </>
    );
}