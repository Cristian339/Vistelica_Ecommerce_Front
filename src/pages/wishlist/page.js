"use client";
import { Container, Grid, Typography, Box, CircularProgress } from '@mui/material';
import Navbar from "@/components/layout/HeaderComponent";
import { useEffect, useState } from 'react';
import wishlistService from '@/services/wishlistService';
import { getCurrentUser } from '@/services/authService';
import { useRouter } from 'next/navigation';
import ProductCard from './components/ProductCard';
import EmptyWishlist from './components/EmptyWishlist';

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const user = await getCurrentUser();

            if (!user) {
                router.push('/sign-in-side/Sign-in-side');
                return;
            }

            const wishlistItems = await wishlistService.getWishlist(user.user_id);
            setWishlist(wishlistItems);
        } catch (error) {
            console.error("Error al cargar la lista de deseos:", error);
        } finally {
            setLoading(false);
            setIsCheckingAuth(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [router]);

    const handleWishlistChange = (productId, isInWishlist) => {
        if (!isInWishlist) {
            // Eliminar producto de la lista local
            setWishlist(prev => prev.filter(item => item.product.product_id !== productId));
        } else {
            // Si se añade a la wishlist, recargar toda la lista
            fetchWishlist();
        }
    };

    if (loading || isCheckingAuth) {
        return (
            <>
                <Navbar />
                <Container maxWidth="xl" disableGutters sx={{ my: 4, px: { xs: 2, md: 4 } }}>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                        <CircularProgress />
                    </Box>
                </Container>
            </>
        );
    }

    if (!wishlist || wishlist.length === 0) {
        return <EmptyWishlist />;
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="xl" disableGutters sx={{ my: 4, px: { xs: 2, md: 4 } }}>
                <Typography variant="h4" component="h1" sx={{
                    fontWeight: 'bold',
                    mb: 4,
                    textAlign: 'center',
                    fontSize: '1.8rem',
                    fontFamily: "'Amethysta', serif"
                }}>
                    MI LISTA DE DESEOS
                </Typography>

                <Grid container spacing={4}>
                    {wishlist.map((item) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.wishlist_id}>
                            <ProductCard
                                product={item.product}
                                isInWishlist={true}
                                onWishlistChange={handleWishlistChange}
                                onCardClick={() => router.push(`/products/${item.product.product_id}`)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
}