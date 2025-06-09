"use client";

import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
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
import GoogleIcon from '@mui/icons-material/Google';
import paymentService from '@/services/paymentService';
import { typography } from '@/pages/shared-theme/themePrimitives';

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

const GoogleIconWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: '#4285F4',
    width: 64,
    height: 64,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)'
}));

// Optimizar componente con React.memo para evitar re-renderizados innecesarios
const GooglePayComponent = React.memo(function GooglePayComponent({ amount, onPaymentSuccess, onPaymentMethodChange }) {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentRequest, setPaymentRequest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Memoizar el monto convertido
    const amountInCents = useMemo(() => {
        return paymentService.convertEurosToCents(amount);
    }, [amount]);

    // Optimizar efectos con cleanup adecuado
    useEffect(() => {
        if (!stripe || !elements) return;

        // Notificar cambio de método de pago
        onPaymentMethodChange();

        let pr = null;

        const initializePaymentRequest = () => {
            pr = stripe.paymentRequest({
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
                if (result) {
                    setPaymentRequest(pr);
                } else {
                    console.warn('Google Pay no disponible en este navegador o dispositivo');
                    setError('Google Pay no está disponible');
                }
            });

            pr.on('paymentmethod', handlePaymentMethod);
        };

        const handlePaymentMethod = async (ev) => {
            setLoading(true);
            setError(null);

            try {
                const paymentResult = await paymentService.payWithCard(ev.paymentMethod.id, amountInCents);
                if (paymentResult) {
                    setSuccess(true);
                    onPaymentSuccess(); // Notificar éxito al componente padre
                    ev.complete('success');
                } else {
                    setError('No se pudo procesar el pago');
                    ev.complete('fail');
                }
            } catch (err) {
                setError('Error al procesar el pago: ' + err.message);
                console.error(err);
                ev.complete('fail');
            } finally {
                setLoading(false);
            }
        };

        initializePaymentRequest();

        // Limpieza al desmontar
        return () => {
            if (pr) {
                pr.off('paymentmethod', handlePaymentMethod);
            }
        };
    }, [stripe, elements, amountInCents, onPaymentSuccess, onPaymentMethodChange]);

    if (success) {
        return (
            <SuccessContainer>
                <CheckCircleIcon
                    sx={{
                        fontSize: 64,
                        color: '#52c41a',
                        mb: 2,
                        filter: 'drop-shadow(0 2px 6px rgba(82, 196, 26, 0.3))'
                    }}
                />
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: '#52c41a',
                        fontFamily: typography.fontFamily,
                        mb: 1.5
                    }}
                >
                    Pago exitoso
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 2,
                        fontFamily: typography.fontFamily,
                        fontSize: '1rem',
                        color: '#333'
                    }}
                >
                    Tu pago de {(amountInCents / 100).toFixed(2)}€ se ha procesado correctamente con Google Pay.
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        fontFamily: typography.fontFamily
                    }}
                >
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
                <GoogleIconWrapper>
                    <GoogleIcon
                        sx={{
                            fontSize: 36,
                            color: '#ffffff',
                            filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.3))'
                        }}
                    />
                </GoogleIconWrapper>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        fontFamily: typography.fontFamily,
                        color: '#333',
                        mb: 1
                    }}
                >
                    Pago con Google Pay
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
                                color: '#4285F4'
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
                            Paga de forma rápida y segura con tu cuenta de Google.
                        </Typography>
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '320px',
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
                                            theme: 'light',
                                            height: '48px'
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
                        Cargando opciones de pago...
                    </Typography>
                )}
            </PaymentContainer>
        </Box>
    );
});

// Optimizar el wrapper con React.memo
export default React.memo(function GooglePayWrapper({ amount, onPaymentSuccess, onPaymentMethodChange }) {
    return (
        <Elements stripe={stripePromise}>
            <GooglePayComponent
                amount={amount}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentMethodChange={onPaymentMethodChange}
            />
        </Elements>
    );
});