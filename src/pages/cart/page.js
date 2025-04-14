"use client";
import { Container, Grid, Typography } from '@mui/material';
import CartList from './components/CartList';
import CartSummary from './components/CartSummary';
import Navbar from "@/components/layout/HeaderComponent";

export default function CartPage() {
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
                    CESTA DE LA COMPRA
                </Typography>

                <Grid container spacing={4}>
                    {/* Columna izquierda - Lista de productos (70% del espacio) */}
                    <Grid item xs={12} md={8}>
                        <CartList />
                    </Grid>

                    {/* Columna derecha - Resumen (30% del espacio) */}
                    <Grid item xs={12} md={4}>
                        <CartSummary />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}