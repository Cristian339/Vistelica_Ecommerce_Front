"use client";

import * as React from 'react';
import { useCallback } from 'react';
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
import { vistelicaColors } from "@/components/shared/vistelicaColors";
import { typography } from '@/components/shared/themePrimitives';

const stripePromise = loadStripe("pk_test_51RPncWQc122Tani8pkjulLHNj5pnGssS5aP8eyTIKO7kBECr0X9ndIax3yFYraPQca5Ax6uH4l528N1zzsqLI8Rn00qx93QGQO");

const PaymentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: 'auto',
    padding: theme.spacing(3.5),
    borderRadius: '16px',
    border: '1px solid #eaeaea',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
    }
}));

const StripeInputContainer = styled('div')(({ theme }) => ({
    padding: '12px 16px',
    border: `1px solid #d9d9d9`,
    borderRadius: '8px',
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: vistelicaColors.primary,
    },
    '& .StripeElement--focus': {
        borderColor: vistelicaColors.primary,
        boxShadow: `0 0 0 2px ${vistelicaColors.primary}20`,
    },
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
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(82, 196, 26, 0.1)',
    transition: 'all 0.3s ease'
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '10px',
    padding: '12px 24px',
    fontFamily: typography.fontFamily,
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    textTransform: 'none',
    fontSize: '1rem',
    backgroundColor: vistelicaColors.primary,
    '&:hover': {
        backgroundColor: `${vistelicaColors.primary}e0`,
        boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
        transform: 'translateY(-2px)'
    },
    '&.Mui-disabled': {
        backgroundColor: '#bdbdbd',
        color: '#fff'
    }
}));

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
    borderRadius: '8px',
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: vistelicaColors.primary,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: vistelicaColors.primary,
        borderWidth: '2px',
    },
    fontFamily: typography.fontFamily
}));

// Optimizamos el componente principal con React.memo
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
    }, [onPaymentMethodChange]);

    // Optimizar el manejo del formulario con useCallback
    const handleSubmit = useCallback(async (event) => {
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
                console.log('Pago con tarjeta exitoso, notificando al componente padre');

                // Importante - asegurar la notificación al padre
                if (typeof onPaymentSuccess === 'function') {
                    onPaymentSuccess(); // Notificar éxito al padre
                }
            } else {
                throw new Error('El pago no se completó correctamente');
            }
        } catch (err) {
            console.error('Error en el pago:', err);
            setError(err.message || 'Error al procesar el pago');
        } finally {
            setIsProcessing(false);
        }
    }, [stripe, elements, name, amount, onPaymentSuccess]);

    const handleNameChange = useCallback((e) => {
        setName(e.target.value);
    }, []);

    if (paymentSuccess) {
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
                        color: '#333',
                        fontSize: '1rem'
                    }}
                >
                    Tu pago se ha procesado correctamente.
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

            <Box component="form" onSubmit={handleSubmit}>
                <PaymentContainer>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        pb: 2,
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <Box
                            sx={{
                                backgroundColor: `${vistelicaColors.primary}15`,
                                p: 1.2,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2
                            }}
                        >
                            <CreditCardRoundedIcon
                                sx={{
                                    fontSize: 28,
                                    color: vistelicaColors.primary
                                }}
                            />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 400,
                                fontFamily: typography.fontFamily,
                                color: '#333'
                            }}
                        >
                            Tarjeta de crédito/débito
                        </Typography>
                    </Box>

                    {/* Número de tarjeta */}
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                fontWeight: 'medium',
                                fontFamily: typography.fontFamily,
                                color: '#444'
                            }}
                        >
                            Número de tarjeta
                        </Typography>
                        <StripeInputContainer>
                            <CardNumberElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            fontFamily: typography.fontFamily,
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                            iconColor: vistelicaColors.primary
                                        },
                                        invalid: {
                                            color: '#9e2146',
                                            iconColor: '#fa755a'
                                        }
                                    },
                                    showIcon: true,
                                }}
                            />
                        </StripeInputContainer>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 3,
                        flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                        {/* Fecha de expiración */}
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1,
                                    fontWeight: 'medium',
                                    fontFamily: typography.fontFamily,
                                    color: '#444'
                                }}
                            >
                                Fecha de expiración
                            </Typography>
                            <StripeInputContainer>
                                <CardExpiryElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#424770',
                                                fontFamily: typography.fontFamily,
                                                '::placeholder': {
                                                    color: '#aab7c4',
                                                }
                                            },
                                            invalid: {
                                                color: '#9e2146',
                                            }
                                        },
                                    }}
                                />
                            </StripeInputContainer>
                        </Box>

                        {/* CVC */}
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1,
                                    fontWeight: 'medium',
                                    fontFamily: typography.fontFamily,
                                    color: '#444'
                                }}
                            >
                                Código de seguridad (CVC)
                            </Typography>
                            <StripeInputContainer>
                                <CardCvcElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#424770',
                                                fontFamily: typography.fontFamily,
                                                '::placeholder': {
                                                    color: '#aab7c4',
                                                }
                                            },
                                            invalid: {
                                                color: '#9e2146',
                                            }
                                        },
                                    }}
                                />
                            </StripeInputContainer>
                        </Box>
                    </Box>

                    {/* Nombre del titular - Mejorar responsividad */}
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                fontWeight: 'medium',
                                fontFamily: typography.fontFamily,
                                color: '#444'
                            }}
                        >
                            Nombre del titular
                        </Typography>
                        <StyledOutlinedInput
                            fullWidth
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Como aparece en la tarjeta"
                            required
                            size="medium"
                            sx={{
                                fontSize: { xs: '0.9rem', sm: '1rem' } // Tamaño responsivo
                            }}
                            inputProps={{
                                'aria-label': 'Nombre del titular',
                            }}
                        />
                    </Box>
                </PaymentContainer>

                <StyledButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!stripe || isProcessing}
                    sx={{
                        mt: 3,
                        height: { xs: '48px', sm: '52px' } // Altura responsiva
                    }}
                >
                    {isProcessing ? (
                        <>
                            <CircularProgress
                                size={24}
                                sx={{
                                    mr: 1.5,
                                    color: 'white'
                                }}
                                thickness={4}
                            />
                            Procesando pago...
                        </>
                    ) : (
                        `Pagar ${amount}`
                    )}
                </StyledButton>
            </Box>
        </Box>
    );
}

// Optimizar el componente exportado con React.memo
export default React.memo(function CreditCard({
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
});