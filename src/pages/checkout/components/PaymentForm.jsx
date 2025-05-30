"use client";

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CreditCard from '../paymentMethods/CreaditCard';
import ApplePayWrapper from "@/pages/checkout/paymentMethods/ApplePayWrapper";
import GooglePayWrapper from "@/pages/checkout/paymentMethods/GooglePayWrapper";
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SimCardRoundedIcon from '@mui/icons-material/SimCardRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PaymentIcon from '@mui/icons-material/Payment';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Collapse from "@mui/material/Collapse";

const Card = styled(MuiCard)(({ theme, selected }) => ({
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    width: '100%',
    '&:hover': {
        background:
            'linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)',
        borderColor: 'primary.light',
        boxShadow: '0px 2px 8px hsla(0, 0%, 0%, 0.1)',
        ...theme.applyStyles('dark', {
            background:
                'linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)',
            borderColor: 'primary.dark',
            boxShadow: '0px 1px 8px hsla(210, 100%, 25%, 0.5) ',
        }),
    },
    [theme.breakpoints.up('md')]: {
        flexGrow: 1,
        maxWidth: `calc(33.33% - ${theme.spacing(1.3)})`,
    },
    ...(selected && {
        borderColor: (theme.vars || theme).palette.primary.light,
        ...theme.applyStyles('dark', {
            borderColor: (theme.vars || theme).palette.primary.dark,
        }),
    }),
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

const GooglePayButton = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ddd',
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
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

const FormGrid = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

const PaymentForm = React.forwardRef(({
                                          paymentData,
                                          setPaymentData,
                                          onPaymentSuccess,
                                          onPaymentMethodChange
                                      }, ref) => {
    const [paymentType, setPaymentType] = React.useState(paymentData?.type || 'creditCard');
    const [cardNumber, setCardNumber] = React.useState('');
    const [cvv, setCvv] = React.useState('');
    const [expirationDate, setExpirationDate] = React.useState('');
    const [cardName, setCardName] = React.useState('');
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [paypalSuccess, setPaypalSuccess] = React.useState(false);

    // Exponer método de validación para el componente padre
    React.useImperativeHandle(ref, () => ({
        validateCreditCardForm
    }));

    const paypalOptions = {
        "clientId": "AR_ESIzlU1ollajGUtHrMcJZBHUy5JQpuchpI1K6mUK1DgQAcCd18IWmgZvHuIYsqDdfxLBffe9TCBD9",
        currency: "EUR",
        intent: "capture",
        components: "buttons"
    };

    const validateCreditCardForm = () => {
        const newErrors = {};

        if (!cardNumber) newErrors.cardNumber = "Número de tarjeta requerido";
        else if (cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = "Número incompleto";

        if (!cvv) newErrors.cvv = "CVV requerido";
        else if (cvv.length < 3) newErrors.cvv = "CVV incompleto";

        if (!cardName) newErrors.cardName = "Nombre requerido";

        if (!expirationDate) newErrors.expirationDate = "Fecha de expiración requerida";
        else if (expirationDate.length < 5) newErrors.expirationDate = "Fecha incompleta";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePaymentTypeChange = (event) => {
        const type = event.target.value;
        setPaymentType(type);
        setErrors({});
        setPaypalSuccess(false);
        onPaymentMethodChange();

        if (setPaymentData) {
            setPaymentData({
                ...paymentData,
                type: type,
                details: {}
            });
        }
    };

    const handleCardNumberChange = (event) => {
        const value = event.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        if (value.length <= 16) {
            setCardNumber(formattedValue);

            if (setPaymentData) {
                setPaymentData({
                    ...paymentData,
                    details: {
                        ...paymentData.details,
                        cardNumber: formattedValue
                    }
                });
            }
        }
    };

    const handleCvvChange = (event) => {
        const value = event.target.value.replace(/\D/g, '');
        if (value.length <= 3) {
            setCvv(value);

            if (setPaymentData) {
                setPaymentData({
                    ...paymentData,
                    details: {
                        ...paymentData.details,
                        cvv: value
                    }
                });
            }
        }
    };

    const handleExpirationDateChange = (event) => {
        const value = event.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/(\d{2})(?=\d{2})/, '$1/');
        if (value.length <= 4) {
            setExpirationDate(formattedValue);

            if (setPaymentData) {
                setPaymentData({
                    ...paymentData,
                    details: {
                        ...paymentData.details,
                        expirationDate: formattedValue
                    }
                });
            }
        }
    };

    const handleCardNameChange = (event) => {
        const value = event.target.value;
        setCardName(value);

        if (setPaymentData) {
            setPaymentData({
                ...paymentData,
                details: {
                    ...paymentData.details,
                    cardName: value
                }
            });
        }
    };

    const handleCreateOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: "134.98",
                    },
                },
            ],
        });
    };

    const handleApprove = (data, actions) => {
        setIsProcessing(true);
        setErrors({}); // Limpiar errores previos
        setPaypalSuccess(false); // Resetear estado de éxito

        return actions.order.capture()
            .then((details) => {
                console.log("Pago completado: ", details);

                // 1. Actualizar estado de pago en el componente padre
                onPaymentSuccess();

                // 2. Actualizar estado local de éxito
                setPaypalSuccess(true);

                // 3. Guardar datos de pago en el estado global
                if (setPaymentData) {
                    setPaymentData({
                        ...paymentData,
                        type: 'paypal',
                        details: {
                            id: details.id,
                            status: details.status,
                            paymentMethod: 'PayPal',
                            email: details.payer?.email_address || '',
                            payerId: details.payer?.payer_id || '',
                            amount: details.purchase_units?.[0]?.amount?.value || '0',
                            currency: details.purchase_units?.[0]?.amount?.currency_code || 'EUR',
                            captureId: details.purchase_units?.[0]?.payments?.captures?.[0]?.id || '',
                            createTime: details.create_time || new Date().toISOString()
                        }
                    });
                }
            })
            .catch(error => {
                console.error("Error al procesar el pago:", error);

                // Manejo de diferentes tipos de errores
                let errorMessage = "Hubo un problema al procesar tu pago";

                if (error?.details?.[0]?.issue === 'INSTRUMENT_DECLINED') {
                    errorMessage = "El método de pago fue rechazado";
                } else if (error?.message?.includes('funding source')) {
                    errorMessage = "Problema con la fuente de financiación";
                }

                // Actualizar estado de errores
                setErrors({
                    paypal: errorMessage,
                    paypalDetails: error
                });

                // Opcional: Reintentar lógica
                /*
                if (hasRetryAttempts) {
                    return actions.restart();
                }
                */
            })
            .finally(() => {
                setIsProcessing(false);
            });
    };

    return (
        <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
            <FormControl component="fieldset" fullWidth>
                <RadioGroup
                    aria-label="Payment options"
                    name="paymentType"
                    value={paymentType}
                    onChange={handlePaymentTypeChange}
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                    }}
                >
                    <Card selected={paymentType === 'creditCard'}>
                        <CardActionArea
                            onClick={() => handlePaymentTypeChange({ target: { value: 'creditCard' }})}
                            sx={{
                                '.MuiCardActionArea-focusHighlight': {
                                    backgroundColor: 'transparent',
                                },
                                '&:focus-visible': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CreditCardRoundedIcon
                                    fontSize="small"
                                    sx={[
                                        (theme) => ({
                                            color: 'grey.400',
                                            ...theme.applyStyles('dark', {
                                                color: 'grey.600',
                                            }),
                                        }),
                                        paymentType === 'creditCard' && {
                                            color: 'primary.main',
                                        },
                                    ]}
                                />
                                <Typography sx={{ fontWeight: 'medium' }}>Tarjeta</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                    <Card selected={paymentType === 'paypal'}>
                        <CardActionArea
                            onClick={() => handlePaymentTypeChange({ target: { value: 'paypal' }})}
                            sx={{
                                '.MuiCardActionArea-focusHighlight': {
                                    backgroundColor: 'transparent',
                                },
                                '&:focus-visible': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PaymentIcon
                                    fontSize="small"
                                    sx={[
                                        (theme) => ({
                                            color: 'grey.400',
                                            ...theme.applyStyles('dark', {
                                                color: 'grey.600',
                                            }),
                                        }),
                                        paymentType === 'paypal' && {
                                            color: 'primary.main',
                                        },
                                    ]}
                                />
                                <Typography sx={{ fontWeight: 'medium' }}>PayPal</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                    <Card selected={paymentType === 'applePay'}>
                        <CardActionArea
                            onClick={() => handlePaymentTypeChange({ target: { value: 'applePay' }})}
                            sx={{
                                '.MuiCardActionArea-focusHighlight': {
                                    backgroundColor: 'transparent',
                                },
                                '&:focus-visible': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AppleIcon
                                    fontSize="small"
                                    sx={[
                                        (theme) => ({
                                            color: 'grey.400',
                                            ...theme.applyStyles('dark', {
                                                color: 'grey.600',
                                            }),
                                        }),
                                        paymentType === 'applePay' && {
                                            color: 'primary.main',
                                        },
                                    ]}
                                />
                                <Typography sx={{ fontWeight: 'medium' }}>Apple Pay</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card selected={paymentType === 'googlePay'}>
                        <CardActionArea
                            onClick={() => handlePaymentTypeChange({ target: { value: 'googlePay' }})}
                            sx={{
                                '.MuiCardActionArea-focusHighlight': {
                                    backgroundColor: 'transparent',
                                },
                                '&:focus-visible': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <GoogleIcon
                                    fontSize="small"
                                    sx={[
                                        (theme) => ({
                                            color: 'grey.400',
                                            ...theme.applyStyles('dark', {
                                                color: 'grey.600',
                                            }),
                                        }),
                                        paymentType === 'googlePay' && {
                                            color: '#4285F4',
                                        },
                                    ]}
                                />
                                <Typography sx={{ fontWeight: 'medium' }}>Google Pay</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </RadioGroup>
            </FormControl>

            {paymentType === 'creditCard' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <CreditCard
                        amount={10}
                        onPaymentSuccess={onPaymentSuccess}  // Usar la prop
                        onPaymentMethodChange={onPaymentMethodChange}  // Usar la prop
                        setPaymentData={setPaymentData}
                    />
                    <FormControlLabel
                        control={<Checkbox name="saveCard" />}
                        label="Recordar los datos de la tarjeta para la próxima vez"
                    />
                </Box>
            )}

            {paymentType === 'paypal' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {paypalSuccess ? (
                        <SuccessContainer>
                            <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                Pago exitoso
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Tu pago se ha procesado correctamente con PayPal.
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Recibirás un correo de confirmación con los detalles.
                            </Typography>
                        </SuccessContainer>
                    ) : (
                        <>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                Pago con PayPal
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Haz clic en el botón de PayPal para completar tu compra simulada
                            </Typography>
                            <Collapse in={!!errors.paypal}>
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {errors.paypal}
                                </Alert>
                            </Collapse>
                            <Box sx={{ maxWidth: 450, mx: 'auto', width: '100%', position: 'relative' }}>
                                {isProcessing && (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                        zIndex: 1
                                    }}>
                                        <CircularProgress />
                                    </Box>
                                )}
                                <PayPalScriptProvider options={paypalOptions}>
                                    <PayPalButtons
                                        createOrder={handleCreateOrder}
                                        onApprove={handleApprove}
                                        style={{ layout: "vertical" }}
                                    />
                                </PayPalScriptProvider>
                            </Box>
                        </>
                    )}
                </Box>
            )}

            {paymentType === 'applePay' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <ApplePayWrapper
                        amount={10}
                        onPaymentSuccess={onPaymentSuccess}  // Usar la prop
                        onPaymentMethodChange={onPaymentMethodChange}  // Usar la prop
                        setPaymentData={setPaymentData}
                    />
                </Box>
            )}
            {paymentType === 'googlePay' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <GooglePayWrapper
                        amount={10}
                        onPaymentSuccess={onPaymentSuccess}  // Usar la prop
                        onPaymentMethodChange={onPaymentMethodChange}  // Usar la prop
                        setPaymentData={setPaymentData}
                    />
                </Box>
            )}
        </Stack>
    );
});

PaymentForm.displayName = 'PaymentForm';
export default PaymentForm;