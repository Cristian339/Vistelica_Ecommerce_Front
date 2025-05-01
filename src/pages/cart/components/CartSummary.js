'use client';
import {Box, Typography, Button, Divider, Tooltip} from '@mui/material';
import { vistelicaColors } from "@/pages/shared-theme/vistelicaColors";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import cartService from '@/services/cartService';
import { getCurrentUser } from '@/services/authService';

export default function CartSummary({
                                        totalPrice = 0,
                                        itemCount = 0,
                                        onCheckout
                                    }) {
    const router = useRouter();
    const safeTotalPrice = typeof totalPrice === 'number' ? totalPrice : 0;

    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem('token');
    const sessionId = cartService.getSessionId();

    // Efecto para fusionar carritos al montar el componente si hay ambos (token y sessionId)
    useEffect(() => {
        console.log(isAuthenticated);
        console.log(sessionId);
        const mergeCartsIfNeeded = async () => {
            if (isAuthenticated && sessionId) {
                try {
                    await cartService.handleCartMergeOnAuth();
                } catch (error) {
                    console.error('Error merging carts:', error);
                }
            }
        };

        mergeCartsIfNeeded();
    }, [isAuthenticated, sessionId]);

    const handleCheckoutClick = () => {
        if (!isAuthenticated) {
            // Redirigir a login si no está autenticado
            router.push('/sign-in-side/Sign-in-side');
        } else {
            // Llamar a la función onCheckout si está autenticado
            if (onCheckout) {
                onCheckout();
            }
        }
    };

    return (
        <Box sx={{
            position: 'sticky',
            top: 20,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 3,
            backgroundColor: 'white',
            height: 'fit-content'
        }}>
            <Typography variant="h6" sx={{
                fontWeight: 'bold',
                mb: 3,
                fontSize: '1.2rem',
                fontFamily: "'Amethysta', serif"
            }}>
                RESUMEN DE COMPRA
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2
                }}>
                    <Typography sx={{fontFamily: "'Amethysta', serif"}}>
                        Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})
                    </Typography>
                    <Typography sx={{fontFamily: "'Amethysta', serif"}}>
                        {safeTotalPrice.toFixed(2)}€
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold',fontFamily: "'Amethysta', serif" }}>
                    TOTAL
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: "'Amethysta', serif" }}>
                    {safeTotalPrice.toFixed(2)}€
                </Typography>
            </Box>

            <Tooltip
                title={!isAuthenticated ? "Para finalizar compra inicie sesión o regístrese" : ""}
                placement="top"
                arrow
            >
                <span>
                    <Button
                        fullWidth
                        variant="contained"
                        disabled={itemCount === 0}
                        onClick={handleCheckoutClick}
                        sx={{
                            py: 1.5,
                            backgroundColor: itemCount === 0 ? '#e0e0e0' : vistelicaColors.primary,
                            '&:hover': {
                                backgroundColor: itemCount === 0 ? '#e0e0e0' : vistelicaColors.primaryDark
                            },
                            fontWeight: 'bold',
                            mb: 2,
                            fontFamily: "'Amethysta', serif"
                        }}
                    >
                        {!isAuthenticated ? 'INICIAR SESIÓN PARA COMPRAR' : 'FINALIZAR COMPRA'}
                    </Button>
                </span>
            </Tooltip>

            <Typography sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'green',
                fontSize: '0.9rem'
            }}>
                PÁGOS 100% SEGUROS
            </Typography>
        </Box>
    );
}