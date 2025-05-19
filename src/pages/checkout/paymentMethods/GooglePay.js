"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import paymentService from "@/services/paymentService";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import Button from '@mui/material/Button';
import Alert from "@mui/material/Alert";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Collapse from '@mui/material/Collapse';
import GoogleIcon from '@mui/icons-material/Google';

const stripePromise = loadStripe("pk_test_51RPncWQc122Tani8pkjulLHNj5pnGssS5aP8eyTIKO7kBECr0X9ndIax3yFYraPQca5Ax6uH4l528N1zzsqLI8Rn00qx93QGQO");

const PaymentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    padding: theme.spacing(3),
    borderRadius: `calc(${theme.shape.borderRadius}px + 4px)`,
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    background: 'linear-gradient(to bottom right, hsla(220, 35%, 97%, 0.3) 25%, hsla(220, 20%, 88%, 0.3) 100%)',
    boxShadow: '0px 4px 8px hsla(210, 0%, 0%, 0.05)',
    ...theme.applyStyles('dark', {
        background: 'linear-gradient(to right bottom, hsla(220, 30%, 6%, 0.2) 25%, hsla(220, 20%, 25%, 0.2) 100%)',
        boxShadow: '0px 4px 8px hsl(220, 35%, 0%)',
    }),
}));

const GooglePayButton = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ddd',
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    margin: theme.spacing(2, 0),
    width: '100%',
    maxWidth: '300px',
    '&:hover': {
        backgroundColor: '#f5f5f5',
    },
    ...theme.applyStyles('dark', {
        backgroundColor: '#424242',
        borderColor: '#555',
        '&:hover': {
            backgroundColor: '#333',
        },
    }),
}));

function GooglePayForm({ onPaymentSuccess, onPaymentError }) {
    const stripe = useStripe();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [paymentSuccess, setPaymentSuccess] = React.useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setPaymentSuccess(false);

        if (!stripe) {
            setError('Stripe no se ha inicializado correctamente');
            return;
        }

        setIsProcessing(true);

        try {
            // Aquí iría la lógica real de Google Pay con Stripe
            // Esto es solo un mock para el maquetado
            console.log('Iniciando pago con Google Pay...');

            // Simulamos un retraso de pago
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulamos un pago exitoso
            setPaymentSuccess(true);
            onPaymentSuccess?.({ id: 'mock_google_pay_pm_123' });

        } catch (err) {
            console.error('Error en el pago:', err);
            setError(err.message || 'Error al procesar el pago con Google Pay');
            onPaymentError?.(err);
        } finally {
            setIsProcessing(false);
        }
    };

    if (paymentSuccess) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                border: '1px solid #4caf50',
                borderRadius: 1,
                backgroundColor: 'rgba(76, 175, 80, 0.1)'
            }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    Pago exitoso
                </Typography>
                <Typography variant="body1">
                    Tu pago con Google Pay se ha procesado correctamente.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Collapse in={!!error}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            </Collapse>

            <Box component="form" onSubmit={handleSubmit}>
                <PaymentContainer>
                    <GoogleIcon sx={{ fontSize: 48, color: '#4285F4', mb: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                        Pago con Google Pay
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
                        Paga de forma rápida y segura con tu cuenta de Google.
                    </Typography>

                    <GooglePayButton onClick={handleSubmit}>
                        <img
                            src="https://www.gstatic.com/instantbuy/svg/googlepay_dark.svg"
                            alt="Google Pay"
                            style={{ height: '40px' }}
                        />
                    </GooglePayButton>

                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2 }}>
                        Serás redirigido a Google Pay para completar el pago.
                    </Typography>
                </PaymentContainer>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!stripe || isProcessing}
                    sx={{ mt: 3 }}
                    startIcon={<GoogleIcon />}
                >
                    {isProcessing ? 'Procesando...' : 'Pagar con Google Pay'}
                </Button>
            </Box>
        </Box>
    );
}

export default function GooglePay({ onPaymentSuccess, onPaymentError }) {
    return (
        <Elements stripe={stripePromise}>
            <GooglePayForm
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
            />
        </Elements>
    );
}