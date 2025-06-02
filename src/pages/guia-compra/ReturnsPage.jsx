'use client';

import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    useTheme,
    useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const ReturnsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [showReturnButton, setShowReturnButton] = useState(false);

    // Verificar el token al cargar el componente
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            setShowReturnButton(!!token);
        }
    }, []);

    const handleReturnClick = () => {
        // Redirigir a la página de devoluciones
        window.location.href = '/mi-cuenta/devoluciones';
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        color: vistelicaColors.primary,
                        mb: 2,
                        fontSize: isMobile ? '2rem' : '2.5rem',
                        fontFamily: typography.fontFamily
                    }}
                >
                    Política de Cambios y Devoluciones
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: vistelicaColors.secondary,
                        maxWidth: '800px',
                        mx: 'auto',
                        fontFamily: typography.fontFamily
                    }}
                >
                    En Vístelica queremos que estés completamente satisfecho con tu compra.
                    Conoce nuestras condiciones para cambios y devoluciones.
                </Typography>
            </Box>

            <Box sx={{
                backgroundColor: '#f9f9f9',
                p: 4,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                mb: 6
            }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: vistelicaColors.primary,
                        fontFamily: typography.fontFamily
                    }}
                >
                    📦 Devoluciones Fáciles en 3 Pasos
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 3,
                    mb: 3
                }}>
                    {[
                        {icon: '1️⃣', title: 'Solicita la devolución', text: 'Dentro de los 14 días posteriores a la recepción'},
                        {icon: '2️⃣', title: 'Empaqueta los artículos', text: 'Con etiquetas y en perfecto estado'},
                        {icon: '3️⃣', title: 'Recibe tu reembolso', text: 'En 3-5 días hábiles tras recibir el paquete'}
                    ].map((step, index) => (
                        <Box key={index} sx={{
                            flex: 1,
                            p: 3,
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                            <Typography variant="h6" sx={{ mb: 1, fontFamily: typography.fontFamily }}>
                                {step.icon} {step.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', fontFamily: typography.fontFamily }}>
                                {step.text}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {showReturnButton && (
                    <Button
                        variant="contained"
                        onClick={handleReturnClick}
                        sx={{
                            backgroundColor: vistelicaColors.primary,
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            borderRadius: '8px',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: vistelicaColors.secondary
                            }
                        }}
                    >
                        Iniciar Devolución
                    </Button>
                )}

                {!showReturnButton && (
                    <Typography sx={{
                        fontFamily: typography.fontFamily,
                        color: vistelicaColors.secondary,
                        fontStyle: 'italic'
                    }}>
                        Inicia sesión para acceder a las opciones de devolución
                    </Typography>
                )}
            </Box>

            <Divider sx={{ my: 6, borderColor: vistelicaColors.divider }} />

            <Box sx={{ mb: 6 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: vistelicaColors.primary,
                        fontFamily: typography.fontFamily
                    }}
                >
                    📝 Condiciones Generales
                </Typography>

                <Accordion sx={{ mb: 2, boxShadow: 'none', border: `1px solid ${vistelicaColors.divider}` }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography sx={{ fontWeight: 500, fontFamily: typography.fontFamily }}>Plazos para devoluciones</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ fontFamily: typography.fontFamily }}>
                            • Tienes <strong>14 días naturales</strong> desde la recepción para solicitar la devolución.<br />
                            • Los cambios pueden solicitarse hasta <strong>30 días después</strong> de la compra.<br />
                            • Productos de temporada (rebajas, colecciones especiales): <strong>7 días</strong> para devoluciones.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ mb: 2, boxShadow: 'none', border: `1px solid ${vistelicaColors.divider}` }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography sx={{ fontWeight: 500, fontFamily: typography.fontFamily }}>Estado de los productos</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ fontFamily: typography.fontFamily }}>
                            • Las prendas deben estar <strong>sin usar, con etiquetas</strong> y en su embalaje original.<br />
                            • No aceptamos devoluciones de ropa interior, bañadores o productos personalizados.<br />
                            • Los zapatos deben devolverse <strong>sin marcas de uso</strong> y con su caja original.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ mb: 2, boxShadow: 'none', border: `1px solid ${vistelicaColors.divider}` }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography sx={{ fontWeight: 500, fontFamily: typography.fontFamily }}>Costes de devolución</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ fontFamily: typography.fontFamily }}>
                            • <strong>Devoluciones en España:</strong> Gratis con nuestra etiqueta prepago.<br />
                            • <strong>Devoluciones internacionales:</strong> El cliente asume los costes de envío.<br />
                            • <strong>Cambios:</strong> Gratis el primer cambio, coste de envío para cambios adicionales.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>

            <Box sx={{
                backgroundColor: '#fff8e1',
                p: 4,
                borderRadius: '12px',
                borderLeft: `4px solid ${vistelicaColors.primary}`,
                mb: 6
            }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: vistelicaColors.primary,
                        fontFamily: typography.fontFamily
                    }}
                >
                    ⚠️ Atención Importante
                </Typography>
                <Typography sx={{ fontFamily: typography.fontFamily }}>
                    Las devoluciones que no cumplan con nuestras políticas (productos usados, sin etiquetas o fuera de plazo)
                    serán rechazadas y enviadas de vuelta al cliente. En estos casos, los gastos de envío correrán por cuenta del cliente.
                </Typography>
            </Box>

            <Box>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: vistelicaColors.primary,
                        fontFamily: typography.fontFamily
                    }}
                >
                    🔄 Proceso de Cambios
                </Typography>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: 4,
                    mb: 4
                }}>
                    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontFamily: typography.fontFamily }}>Cambio por talla/color</Typography>
                        <Typography sx={{ fontFamily: typography.fontFamily }}>
                            1. Solicita el cambio en tu área de cliente o contactando con nuestro servicio.<br />
                            2. Recibirás instrucciones para enviar el producto.<br />
                            3. Te enviaremos el nuevo artículo cuando recibamos el original.
                        </Typography>
                    </Box>

                    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontFamily: typography.fontFamily }}>Cambio por otro producto</Typography>
                        <Typography sx={{ fontFamily: typography.fontFamily }}>
                            1. Realiza una devolución normal y elige "Voucher" como método de reembolso.<br />
                            2. Recibirás un código descuento por el valor de tu compra.<br />
                            3. Usa este código en tu siguiente pedido.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default ReturnsPage;