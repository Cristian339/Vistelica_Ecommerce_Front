"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SimCardRoundedIcon from '@mui/icons-material/SimCardRounded';
import { styled } from '@mui/material/styles';
import paymentService from "@/services/paymentService";
import {
    Elements,
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
} from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Alert from "@mui/material/Alert";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Collapse from '@mui/material/Collapse';

const stripePromise = loadStripe("pk_test_51RPncWQc122Tani8pkjulLHNj5pnGssS5aP8eyTIKO7kBECr0X9ndIax3yFYraPQca5Ax6uH4l528N1zzsqLI8Rn00qx93QGQO");

const PaymentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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

const CardSection = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '16px',
});

const Row = styled('div')({
    display: 'flex',
    gap: '16px',
    width: '100%',
});

const StripeInput = styled('div')(({ theme }) => ({
    padding: '12px',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    '& .StripeElement--focus': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
    },
    flexGrow: 1,
}));

const SmallStripeInput = styled(StripeInput)({
    maxWidth: '150px',
});

function CreditCardForm({ onPaymentSuccess, onPaymentError }) {
    const stripe = useStripe();
    const elements = useElements();
    const [name, setName] = React.useState('');
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [paymentSuccess, setPaymentSuccess] = React.useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setPaymentSuccess(false);

        if (!stripe || !elements) {
            setError('Stripe no se ha inicializado correctamente');
            return;
        }

        setIsProcessing(true);

        try {
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardNumberElement),
                billing_details: {
                    name: name,
                },
            });

            if (stripeError) {
                setError(stripeError.message);
                onPaymentError?.(stripeError);
                return;
            }

            if (!paymentMethod?.card?.last4 || !paymentMethod?.card?.exp_month || !paymentMethod?.card?.exp_year) {
                setError('Información de tarjeta incompleta');
                return;
            }

            const amount = paymentService.convertEurosToCents(29.99);
            const result = await paymentService.payWithCard(paymentMethod.id, amount);

            if (result) {
                setPaymentSuccess(true);
                onPaymentSuccess?.(paymentMethod);
            } else {
                setError('El pago no se completó correctamente');
            }
        } catch (err) {
            console.error('Error en el pago:', err);
            setError(err.message);
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
                    Tu pago se ha procesado correctamente.
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
                    {/* Número de tarjeta */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                            Número de tarjeta
                        </Typography>
                        <CardNumberElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                },
                                showIcon: true,
                            }}
                        />
                    </Box>

                    {/* Fecha de expiración y CVC */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                Fecha de expiración
                            </Typography>
                            <CardExpiryElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                    },
                                }}
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                CVC
                            </Typography>
                            <CardCvcElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Nombre del titular */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                            Nombre del titular
                        </Typography>
                        <OutlinedInput
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Como aparece en la tarjeta"
                            required
                        />
                    </Box>
                </PaymentContainer>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!stripe || isProcessing}
                    sx={{ mt: 3 }}
                >
                    {isProcessing ? 'Procesando...' : 'Pagar'}
                </Button>
            </Box>
        </Box>
    );
}

export default function CreditCard({ onPaymentSuccess, onPaymentError }) {
    return (
        <Elements stripe={stripePromise}>
            <CreditCardForm
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
            />
        </Elements>
    );
}