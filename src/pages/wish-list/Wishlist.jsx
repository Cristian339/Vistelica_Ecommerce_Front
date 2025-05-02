import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Container, Grid, Divider, CircularProgress,
    useMediaQuery, useTheme, Paper, Fade
} from '@mui/material';
import { useRouter } from 'next/router';
import ProductCard from './components/ProductCard';
import wishService from '@/services/wishService';
import { useAuth } from './components/AuthContext';
import EmptyWishlist from './components/EmptyWishlist';
import AnonymousWishlistMessage from './components/AnonymousWishlistMessage';
import { getLocalWishlist, setLocalWishlist } from '@/utils/localStorageHelpers';
import { vistelicaColors } from '../shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import HeaderComponent from '@/components/layout/HeaderComponent';

const Wishlist = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    useEffect(() => {
        const loadWishlist = async () => {
            try {
                setLoading(true);
                if (isAuthenticated && user?.id) {
                    // Si está autenticado, carga la lista de favoritos del servidor
                    const data = await wishService.getUserWishlist(user.id);
                    setProducts(data.products || []);
                } else {
                    // Si no está autenticado, carga la lista de favoritos del almacenamiento local
                    const localWishlist = getLocalWishlist();
                    setProducts(localWishlist || []);
                }
            } catch (error) {
                console.error('Error al cargar los favoritos:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadWishlist();
    }, [isAuthenticated, user]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            if (isAuthenticated) {
                // Si está autenticado, elimina del servidor
                await wishService.removeFromWishlist(productId);
                setProducts(products.filter(p => p.id !== productId));
            } else {
                // Si no está autenticado, elimina del almacenamiento local
                const updatedWishlist = products.filter(p => p.id !== productId);
                setProducts(updatedWishlist);
                setLocalWishlist(updatedWishlist);
            }
        } catch (error) {
            console.error('Error al eliminar de favoritos:', error);
        }
    };

    return (
        <>
            <HeaderComponent /> {/* Agregamos el HeaderComponent aquí */}

            <Box
                sx={{
                    background: `linear-gradient(45deg, ${vistelicaColors.primary.light}15, ${vistelicaColors.secondary.light}15)`,
                    minHeight: '100vh',
                    pt: { xs: 2, sm: 3, md: 4 },
                    pb: { xs: 4, sm: 5, md: 6 }
                }}
            >
                <Container maxWidth="lg">
                    <Paper
                        elevation={3}
                        sx={{
                            p: { xs: 2, sm: 3, md: 4 },
                            borderRadius: 2,
                            backgroundColor: 'white',
                            mb: 4
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 600,
                                mb: 1,
                                color: vistelicaColors.primary.main,
                                fontFamily: typography.fontFamily,
                                fontSize: { xs: '1.8rem', sm: '2.125rem' }
                            }}
                        >
                            Mis Favoritos
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                mb: 3,
                                color: vistelicaColors.secondary.main,
                                fontFamily: typography.fontFamily
                            }}
                        >
                            Encuentra aquí todos los productos que has marcado como favoritos
                        </Typography>

                        <Divider sx={{
                            mb: 4,
                            backgroundColor: '#e0e0e0'
                        }} />

                        {!isAuthenticated && <AnonymousWishlistMessage />}

                        {loading ? (
                            <Box display="flex" justifyContent="center" my={8}>
                                <CircularProgress sx={{ color: vistelicaColors.primary.main }} />
                            </Box>
                        ) : products.length > 0 ? (
                            <Fade in={!loading}>
                                <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
                                    {products.map((product, index) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                            <Fade in={true} timeout={(index + 1) * 200}>
                                                <Box>
                                                    <ProductCard
                                                        product={product}
                                                        onRemoveFromWishlist={() => handleRemoveFromWishlist(product.id)}
                                                        showRemoveWishlist={true}
                                                    />
                                                </Box>
                                            </Fade>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Fade>
                        ) : (
                            <EmptyWishlist />
                        )}
                    </Paper>
                </Container>
            </Box>
        </>
    );
};

export default Wishlist;