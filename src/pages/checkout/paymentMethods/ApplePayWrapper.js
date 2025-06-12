"use client";

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Alert,
    Collapse,
    CircularProgress,
    styled
} from '@mui/material';
import {
    Elements,
    useStripe,
    useElements,
    PaymentRequestButtonElement
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import paymentService from '@/services/paymentService';
import AppleIcon from '@mui/icons-material/Apple';
import { vistelicaColors } from "@/components/shared/vistelicaColors";
import { typography } from '@/components/shared/themePrimitives';

// Cargar Stripe sólo una vez
const stripePromise = loadStripe("pk_test_51RPncWQc122Tani8pkjulLHNj5pnGssS5aP8eyTIKO7kBECr0X9ndIax3yFYraPQca5Ax6uH4l528N1zzsqLI8Rn00qx93QGQO");

const PaymentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    borderRadius: '16px',
    border: '1px solid #eaeaea',
    backgroundColor: theme.palette.background.paper,
    maxWidth: '500px',
    margin: '0 auto',
    minHeight: '300px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
    }
}));

const SuccessContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    border: '1px solid #b7eb8f',
    borderRadius: '16px',
    backgroundColor: 'rgba(82, 196, 26, 0.05)',
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(82, 196, 26, 0.1)',
    transition: 'all 0.3s ease'
}));

const AppleIconWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: '#000000',
    width: 64,
    height: 64,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
}));

// Componente optimizado con memo
const ApplePayComponent = React.memo(function ApplePayComponent({
    amount,
    onPaymentSuccess,
    onPaymentMethodChange,
    setPaymentData
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentRequest, setPaymentRequest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const amountInCents = typeof amount === 'number' && amount > 0
        ? paymentService.convertEurosToCents(amount)
        : 0; // o algún valor seguro predeterminado

    if (typeof amount !== 'number' || amount <= 0) {
        return (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
                No se proporcionó una cantidad válida para el pago.
            </Typography>
        );
    }

    useEffect(() => {
        if (!stripe || !elements) return;

        if (!amountInCents || amountInCents <= 0) {
            setError('No se proporcionó una cantidad válida para el pago');
            return;
        }
        // Notificar al padre que se seleccionó este método
        onPaymentMethodChange();

        const pr = stripe.paymentRequest({
            country: 'ES',
            currency: 'eur',
            total: {
                label: 'Total a pagar',
                amount: amountInCents,
            },
            requestPayerName: true,
            requestPayerEmail: true,
        });

        pr.canMakePayment().then((result) => {
            if (result && result.applePay) {
                setPaymentRequest(pr);
            } else {
                console.warn('Apple Pay no disponible');
                setError('Apple Pay no está disponible en tu dispositivo');
            }
        });

        const handlePaymentMethod = async (ev) => {
            setLoading(true);
            setError(null);

            try {
                const { paymentIntent, error: paymentError } = await paymentService.processApplePayPayment({
                    paymentMethodId: ev.paymentMethod.id,
                    amount: amountInCents,
                    currency: 'eur'
                });

                if (paymentError) {
                    throw new Error(paymentError.message);
                }

                if (paymentIntent.status === 'succeeded') {
                    setSuccess(true);

                    // Actualizar datos de pago en el estado global
                    if (setPaymentData) {
                        setPaymentData(prev => ({
                            ...prev,
                            type: 'applePay',
                            details: {
                                id: paymentIntent.id,
                                status: paymentIntent.status,
                                paymentMethod: 'Apple Pay',
                                email: ev.payerEmail || '',
                                amount: amount,
                                currency: 'EUR'
                            }
                        }));
                    }

                    // Notificar éxito al componente padre
                    onPaymentSuccess();
                    ev.complete('success');
                } else {
                    throw new Error('El pago no fue completado');
                }
            } catch (err) {
                console.error('Error en Apple Pay:', err);
                setError(err.message || 'Error al procesar el pago');
                ev.complete('fail');
            } finally {
                setLoading(false);
            }
        };

        pr.on('paymentmethod', handlePaymentMethod);

        // Limpiar listener al desmontar
        return () => {
            pr.off('paymentmethod', handlePaymentMethod);
        };
    }, [stripe, elements, amountInCents, onPaymentSuccess, onPaymentMethodChange, setPaymentData, amount]);

    if (success) {
        return (
            <SuccessContainer>
                <CheckCircleIcon sx={{
                    fontSize: 64,
                    color: '#52c41a',
                    mb: 2,
                    filter: 'drop-shadow(0 2px 6px rgba(82, 196, 26, 0.3))'
                }} />
                <Typography variant="h5" gutterBottom sx={{
                    fontWeight: 700,
                    color: '#52c41a',
                    fontFamily: typography.fontFamily,
                    mb: 1.5
                }}>
                    Pago exitoso
                </Typography>
                <Typography variant="body1" sx={{
                    mb: 2,
                    fontFamily: typography.fontFamily,
                    fontSize: '1rem',
                    color: '#333'
                }}>
                    Tu pago de {(amountInCents / 100).toFixed(2)}€ se ha procesado correctamente con Apple Pay.
                </Typography>
                <Typography variant="body2" sx={{
                    color: 'text.secondary',
                    fontFamily: typography.fontFamily
                }}>
                    Recibirás un correo de confirmación con los detalles.
                </Typography>
            </SuccessContainer>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Collapse in={!!error}>
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        borderRadius: '8px',
                        '& .MuiAlert-icon': {
                            color: '#ff4d4f'
                        }
                    }}
                >
                    {error}
                </Alert>
            </Collapse>

            <PaymentContainer>
                <AppleIconWrapper>
                    <AppleIcon sx={{
                        fontSize: 36,
                        color: '#ffffff',
                        filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.3))'
                    }} />
                </AppleIconWrapper>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        fontFamily: typography.fontFamily,
                        color: '#151515',
                        mb: 1
                    }}
                >
                    Pago con Apple Pay
                </Typography>

                {loading ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: 2
                    }}>
                        <CircularProgress
                            size={38}
                            thickness={4}
                            sx={{
                                mb: 2,
                                color: vistelicaColors.primary
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: typography.fontFamily,
                                color: 'text.secondary'
                            }}
                        >
                            Procesando pago...
                        </Typography>
                    </Box>
                ) : paymentRequest ? (
                    <>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 3,
                                textAlign: 'center',
                                color: '#555',
                                fontFamily: typography.fontFamily,
                                maxWidth: '90%',
                                mx: 'auto'
                            }}
                        >
                            Paga de forma rápida y segura con tu dispositivo Apple.
                        </Typography>
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '320px',
                                minHeight: '50px',
                                my: 1,
                                '.paymentRequestButton': {
                                    '&:hover': {
                                        transform: 'scale(1.01)',
                                        transition: 'transform 0.2s ease'
                                    }
                                }
                            }}
                        >
                            <PaymentRequestButtonElement
                                options={{
                                    paymentRequest,
                                    style: {
                                        paymentRequestButton: {
                                            theme: 'dark',
                                            height: '48px',
                                            type: 'buy'
                                        }
                                    }
                                }}
                                className="paymentRequestButton"
                            />
                        </Box>
                        <Typography
                            variant="caption"
                            sx={{
                                mt: 2,
                                color: 'text.secondary',
                                fontFamily: typography.fontFamily,
                                textAlign: 'center',
                                display: 'block'
                            }}
                        >
                            Transacción segura y protegida
                        </Typography>
                    </>
                ) : (
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            fontFamily: typography.fontFamily,
                            mt: 2,
                            textAlign: 'center'
                        }}
                    >
                        {error ? 'Error al cargar Apple Pay' : 'Cargando opciones de pago...'}
                    </Typography>
                )}
            </PaymentContainer>
        </Box>
    );
});

// Optimizar el wrapper con React.memo
export default React.memo(function ApplePayWrapper({
    amount,
    onPaymentSuccess,
    onPaymentMethodChange,
    setPaymentData
}) {
    return (
        <Elements stripe={stripePromise}>
            <ApplePayComponent
                amount={amount}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentMethodChange={onPaymentMethodChange}
                setPaymentData={setPaymentData}
            />
        </Elements>
    );
});