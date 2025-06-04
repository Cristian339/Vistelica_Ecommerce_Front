"use client";

import * as React from 'react';
import {
    Box,
    Typography,
    Button,
    OutlinedInput,
    Alert,
    Collapse,
    CircularProgress,
    styled
} from '@mui/material';
import {
    Elements,
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
} from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import paymentService from '@/services/paymentService';

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
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0px 4px 8px hsla(210, 0%, 0%, 0.05)',
}));

const StripeInputContainer = styled('div')(({ theme }) => ({
    padding: '12px',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    '& .StripeElement--focus': {
        borderColor: theme.palette.primary.main,
    },
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
    textAlign: 'center'
}));

function CreditCardForm({ amount, onPaymentSuccess, onPaymentMethodChange }) {
    const stripe = useStripe();
    const elements = useElements();
    const [name, setName] = React.useState('');
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [paymentSuccess, setPaymentSuccess] = React.useState(false);

    React.useEffect(() => {
        // Notificar al padre que se seleccionó este método
        onPaymentMethodChange();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setIsProcessing(true);

        if (!stripe || !elements) {
            setError('Stripe no se ha inicializado correctamente');
            setIsProcessing(false);
            return;
        }

        try {
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardNumberElement),
                billing_details: { name }
            });

            if (stripeError) {
                throw new Error(stripeError.message);
            }

            const amountInCents = paymentService.convertEurosToCents(amount);
            const result = await paymentService.payWithCard(paymentMethod.id, amountInCents);

            if (result) {
                setPaymentSuccess(true);
                onPaymentSuccess(); // Notificar éxito al padre
            } else {
                throw new Error('El pago no se completó correctamente');
            }
        } catch (err) {
            console.error('Error en el pago:', err);
            setError(err.message || 'Error al procesar el pago');
        } finally {
            setIsProcessing(false);
        }
    };

    if (paymentSuccess) {
        return (
            <SuccessContainer>
                <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    Pago exitoso
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Tu pago se ha procesado correctamente.
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

            <Box component="form" onSubmit={handleSubmit}>
                <PaymentContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CreditCardRoundedIcon sx={{ fontSize: 40, mr: 1 }} />
                        <Typography variant="h6">Tarjeta de crédito/débito</Typography>
                    </Box>

                    {/* Número de tarjeta */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                            Número de tarjeta
                        </Typography>
                        <StripeInputContainer>
                            <CardNumberElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: 'text.primary',
                                            '::placeholder': {
                                                color: 'text.disabled',
                                            },
                                        },
                                    },
                                    showIcon: true,
                                }}
                            />
                        </StripeInputContainer>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        {/* Fecha de expiración */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                Fecha de expiración
                            </Typography>
                            <StripeInputContainer>
                                <CardExpiryElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: 'text.primary',
                                            },
                                        },
                                    }}
                                />
                            </StripeInputContainer>
                        </Box>

                        {/* CVC */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                Código de seguridad (CVC)
                            </Typography>
                            <StripeInputContainer>
                                <CardCvcElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: 'text.primary',
                                            },
                                        },
                                    }}
                                />
                            </StripeInputContainer>
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
                    size="large"
                    disabled={!stripe || isProcessing}
                    sx={{ mt: 3 }}
                >
                    {isProcessing ? (
                        <>
                            <CircularProgress size={24} sx={{ mr: 1 }} />
                            Procesando pago...
                        </>
                    ) : (
                        `Pagar`
                    )}
                </Button>
            </Box>
        </Box>
    );
}

export default function CreditCard({
                                       amount,
                                       onPaymentSuccess,
                                       onPaymentMethodChange
                                   }) {
    return (
        <Elements stripe={stripePromise}>
            <CreditCardForm
                amount={amount}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentMethodChange={onPaymentMethodChange}
            />
        </Elements>
    );
}