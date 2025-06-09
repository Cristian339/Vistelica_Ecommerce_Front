'use client';

import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Divider,
    Button,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import { useRouter } from 'next/navigation';
import Navbar from "@/components/layout/HeaderComponent";

const ReturnsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [showReturnButton, setShowReturnButton] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            setShowReturnButton(!!token);
        }
    }, []);

    const handleReturnClick = () => {
        router.push('/account/RefundPage');
    };

    return (
        <>
            <Navbar/>
            <Container maxWidth="md" sx={{ py: 6 }}>
                {/* Título principal */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            color: vistelicaColors.primary,
                            mb: 2,
                            fontFamily: typography.fontFamily
                        }}
                    >
                        Política de Devoluciones
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: vistelicaColors.secondary,
                            fontFamily: typography.fontFamily
                        }}
                    >
                        Información clara sobre nuestros procesos
                    </Typography>
                </Box>

                {/* Sección 1: Plazos y condiciones básicas */}
                <Box sx={{
                    mb: 6,
                    p: 4,
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                    borderLeft: `4px solid ${vistelicaColors.primary}`
                }}>
                    <Typography variant="h5" sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: vistelicaColors.primary,
                        fontFamily: typography.fontFamily
                    }}>
                        Condiciones Generales
                    </Typography>

                    <Box component="ul" sx={{
                        pl: 2.5,
                        '& li': {
                            mb: 2,
                            fontFamily: typography.fontFamily
                        }
                    }}>
                        <li>
                            <Typography component="span" sx={{ fontWeight: 600 }}>
                                Plazo de devolución:
                            </Typography>{' '}
                            Dispones de <strong>14 días hábiles</strong> desde la recepción para solicitar la devolución.
                        </li>
                        <li>
                            <Typography component="span" sx={{ fontWeight: 600 }}>
                                Motivos aceptados:
                            </Typography>{' '}
                            <Box component="ul" sx={{ pl: 2.5, mt: 1 }}>
                                <li>Producto no coincide con lo pedido</li>
                                <li>Artículo dañado o defectuoso</li>
                                <li>Error en el envío (producto equivocado)</li>
                            </Box>
                        </li>
                        <li>
                            <Typography component="span" sx={{ fontWeight: 600 }}>
                                Reembolso:
                            </Typography>{' '}
                            El importe se devolverá en un plazo de <strong>3-5 días hábiles</strong> una vez recibido y verificado el producto.
                        </li>
                    </Box>
                </Box>

                {/* Sección 2: Responsabilidad de gastos de envío */}
                <Box sx={{
                    mb: 6,
                    p: 4,
                    backgroundColor: '#fff8f0',
                    borderRadius: 2,
                    borderLeft: `4px solid ${vistelicaColors.secondary}`
                }}>
                    <Typography variant="h5" sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: vistelicaColors.primary,
                        fontFamily: typography.fontFamily
                    }}>
                        Gastos de Devolución
                    </Typography>

                    <Box sx={{ mb: 4 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1.5
                        }}>
                            <Box sx={{
                                backgroundColor: '#4caf50',
                                color: 'white',
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2
                            }}>
                                1
                            </Box>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                fontFamily: typography.fontFamily
                            }}>
                                Error de la tienda o producto defectuoso
                            </Typography>
                        </Box>
                        <Typography sx={{
                            pl: 6,
                            mb: 2,
                            fontFamily: typography.fontFamily
                        }}>
                            <strong>La tienda cubre todos los gastos</strong> cuando:
                        </Typography>
                        <Box component="ul" sx={{
                            pl: 8,
                            mb: 3,
                            '& li': {
                                mb: 1,
                                fontFamily: typography.fontFamily
                            }
                        }}>
                            <li>Producto dañado o defectuoso</li>
                            <li>Envío incorrecto (producto equivocado)</li>
                            <li>Artículo no coincide con la descripción</li>
                        </Box>
                    </Box>

                    <Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1.5
                        }}>
                            <Box sx={{
                                backgroundColor: '#4caf50',
                                color: 'white',
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2
                            }}>
                                2
                            </Box>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                fontFamily: typography.fontFamily
                            }}>
                                Decisión del cliente (derecho de desistimiento)
                            </Typography>
                        </Box>
                        <Typography sx={{
                            pl: 6,
                            fontFamily: typography.fontFamily
                        }}>
                            Según la normativa europea:
                        </Typography>
                        <Box component="ul" sx={{
                            pl: 8,
                            mt: 1,
                            '& li': {
                                mb: 1,
                                fontFamily: typography.fontFamily
                            }
                        }}>
                            <li>Derecho a devolución en 14 días naturales</li>
                            <li>El cliente asume los gastos de envío de la devolución</li>
                        </Box>
                    </Box>
                </Box>

                {/* Botón de acción */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    {showReturnButton ? (
                        <Button
                            variant="contained"
                            onClick={handleReturnClick}
                            sx={{
                                backgroundColor: vistelicaColors.primary,
                                px: 6,
                                py: 1.5,
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                '&:hover': {
                                    backgroundColor: vistelicaColors.secondary
                                }
                            }}
                        >
                            Iniciar Devolución
                        </Button>
                    ) : (
                        <Typography sx={{
                            fontFamily: typography.fontFamily,
                            color: vistelicaColors.secondary
                        }}>
                            Inicia sesión para acceder al sistema de devoluciones
                        </Typography>
                    )}
                </Box>

                {/* Nota importante */}
                <Box sx={{
                    p: 3,
                    backgroundColor: '#fff3e0',
                    borderRadius: 2,
                    borderLeft: `4px solid #ff9800`
                }}>
                    <Typography variant="body1" sx={{
                        fontFamily: typography.fontFamily,
                        fontWeight: 500
                    }}>
                        <strong>Importante:</strong> Los productos deben devolverse en su embalaje original y en perfecto estado. Nos reservamos el derecho a rechazar devoluciones que no cumplan estas condiciones.
                    </Typography>
                </Box>
            </Container>
        </>
    );
};

export default ReturnsPage;