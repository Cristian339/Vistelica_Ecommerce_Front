"use client";

import * as React from 'react';
import {
    Box,
    Typography,
    Button,
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


const stripePromise = loadStripe("pk_test_51RPncWQc122Tani8pkjulLHNj5pnGssS5aP8eyTIKO7kBECr0X9ndIax3yFYraPQca5Ax6uH4l528N1zzsqLI8Rn00qx93QGQO");

const PaymentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    border: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    maxWidth: '500px',
    margin: '0 auto',
    minHeight: '300px'
}));

const SuccessContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    border: '1px solid #4caf50',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'center'
}));

function ApplePayComponent({ amount }) {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentRequest, setPaymentRequest] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(false);

    // Convertir el monto a centavos
    const amountInCents = paymentService.convertEurosToCents(amount);

    React.useEffect(() => {
        if (!stripe || !elements) return;

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
        console.log(pr);

        pr.canMakePayment().then((result) => {
            console.log(result);
            if (result && result.applePay) {
                setPaymentRequest(pr);
            } else {
                console.warn('Apple Pay no disponible en este navegador o dispositivo');
            }
        });

        pr.on('paymentmethod', async (ev) => {
            setLoading(true);
            setError(null);

            try {
                const paymentResult = await paymentService.payWithCard(ev.paymentMethod.id, amountInCents);
                if (paymentResult) {
                    setSuccess(true);
                    ev.complete('success');
                } else {
                    setError('No se pudo procesar el pago');
                    ev.complete('fail');
                }
            } catch (err) {
                setError('Error al procesar el pago');
                console.error(err);
                ev.complete('fail');
            } finally {
                setLoading(false);
            }
        });
    }, [stripe, elements, amountInCents]);

    if (success) {
        return (
            <SuccessContainer>
                <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    Pago exitoso
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Tu pago de {(amountInCents / 100).toFixed(2)}€ se ha procesado correctamente con Apple Pay.
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Recibirás un correo de confirmación con los detalles.
                </Typography>
            </SuccessContainer>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Collapse in={!!error}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            </Collapse>

            <PaymentContainer>
                <Box sx={{
                    mb: 2,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }} />
                <AppleIcon sx={{ fontSize: 48, color: '#4285F4', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Pago con Apple Pay
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CircularProgress sx={{ mb: 2 }} />
                        <Typography variant="body2">Procesando pago...</Typography>
                    </Box>
                ) : paymentRequest ? (
                    <>
                        <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
                            Paga de forma rápida y segura con tu dispositivo Apple.
                        </Typography>
                        <div style={{ width: '100%', maxWidth: '300px' }}>
                            <PaymentRequestButtonElement
                                options={{
                                    paymentRequest,
                                    style: {
                                        paymentRequestButton: {
                                            theme: 'dark',
                                            height: '48px',
                                            type: 'buy' // Estilo específico para Apple Pay
                                        }
                                    }
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Apple Pay no está disponible en este dispositivo/navegador
                    </Typography>
                )}
            </PaymentContainer>
        </Box>
    );
}

export default function ApplePayWrapper({ amount }) {
    return (
        <Elements stripe={stripePromise}>
            <ApplePayComponent
                amount={amount}
            />
        </Elements>
    );
}