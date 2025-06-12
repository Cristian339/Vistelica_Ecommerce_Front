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
import Grid from '@mui/material/Grid';
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
import { vistelicaColors } from "@/components/shared/vistelicaColors";
import { typography } from '@/components/shared/themePrimitives';

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: theme.spacing(2.5),
    color: '#212121',
    fontFamily: typography.fontFamily,
    position: 'relative',
    paddingBottom: theme.spacing(1),
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '50px',
        height: '3px',
        backgroundColor: vistelicaColors.primary,
        borderRadius: '2px'
    }
}));

const Card = styled(MuiCard)(({ theme, selected }) => ({
    border: '1px solid',
    borderColor: selected ? vistelicaColors.primary : theme.palette.divider,
    borderRadius: '10px',
    width: '100%',
    boxShadow: selected ? `0px 2px 12px ${vistelicaColors.primary}30` : 'none',
    transition: 'all 0.3s ease',
    marginBottom: theme.spacing(1.5),
    '&:hover': {
        background: `linear-gradient(to bottom right, ${vistelicaColors.primary}10, ${vistelicaColors.primary}05)`,
        borderColor: vistelicaColors.primary,
        boxShadow: `0px 2px 10px ${vistelicaColors.primary}20`,
        transform: 'translateY(-3px)',
    }
}));

const SuccessContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    border: '1px solid #4caf50',
    borderRadius: '12px',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'center',
    boxShadow: '0 3px 15px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease'
}));

const GooglePayButton = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ddd',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: '#f5f5f5',
        boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)'
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

const PaymentMethodIcon = styled(Box)(({ theme, selected, paymentType }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 42,
    borderRadius: '50%',
    backgroundColor: selected ? `${vistelicaColors.primary}15` : 'rgba(0, 0, 0, 0.04)',
    color: selected ? vistelicaColors.primary : theme.palette.text.secondary,
    transition: 'all 0.3s ease',
    marginRight: theme.spacing(2),
    boxShadow: selected ? `0 3px 8px ${vistelicaColors.primary}20` : 'none',
}));

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.palette.text.secondary,
    '&.Mui-checked': {
        color: vistelicaColors.primary,
    }
}));

const PaymentMethodsPanel = styled(Box)(({ theme }) => ({
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: theme.spacing(2.5),
    border: '1px solid #eaeaea',
    height: '100%',
    [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(3),
    }
}));

const PaymentMethodLabel = styled(Typography)(({ theme }) => ({
    fontSize: '1rem',
    fontWeight: 600,
    color: '#424242',
    fontFamily: typography.fontFamily,
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: -8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '40px',
        height: '3px',
        backgroundColor: vistelicaColors.primary,
        borderRadius: '2px'
    }
}));

const PaymentFormContainer = styled(Box)(({ theme }) => ({
    flexGrow: 1,
}));

const PaymentForm = React.forwardRef(({
                                          paymentData,
                                          setPaymentData,
                                          amount,
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
        const formattedAmount = amount.replace(/[^\d.]/g, '');
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: formattedAmount,
                    },
                },
            ],
        });
    };

    const handleApprove = (data, actions) => {
        setIsProcessing(true);
        setErrors({});
        setPaypalSuccess(false);

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
            })
            .finally(() => {
                setIsProcessing(false);
            });
    };

    // Renderizado del formulario de pago seleccionado
    const renderPaymentFormContent = () => {
        switch(paymentType) {
            case 'creditCard':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <CreditCard
                            amount={amount}
                            onPaymentSuccess={onPaymentSuccess}
                            onPaymentMethodChange={onPaymentMethodChange}
                            setPaymentData={setPaymentData}
                        />
                        <FormControlLabel
                            control={
                                <StyledCheckbox
                                    name="saveCard"
                                    sx={{
                                        color: 'text.secondary',
                                        '&.Mui-checked': {
                                            color: vistelicaColors.primary,
                                        }
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        fontFamily: typography.fontFamily,
                                        fontSize: '0.9rem',
                                        color: 'text.secondary'
                                    }}
                                >
                                    Recordar los datos de la tarjeta para la próxima vez
                                </Typography>
                            }
                        />
                    </Box>
                );
            case 'paypal':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {paypalSuccess ? (
                            <SuccessContainer>
                                <CheckCircleIcon sx={{
                                    fontSize: 60,
                                    color: 'success.main',
                                    mb: 2,
                                    filter: 'drop-shadow(0 3px 6px rgba(76, 175, 80, 0.3))'
                                }} />
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        color: 'success.main',
                                        fontFamily: typography.fontFamily
                                    }}
                                >
                                    Pago exitoso
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 2,
                                        fontFamily: typography.fontFamily
                                    }}
                                >
                                    Tu pago se ha procesado correctamente con PayPal.
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
                        ) : (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 500,
                                        fontFamily: typography.fontFamily,
                                        color: vistelicaColors.primary
                                    }}
                                >
                                    Pago con PayPal
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                    sx={{ fontFamily: typography.fontFamily }}
                                >
                                    Haz clic en el botón de PayPal para completar tu compra simulada
                                </Typography>
                                <Collapse in={!!errors.paypal}>
                                    <Alert
                                        severity="error"
                                        sx={{
                                            mb: 2,
                                            borderRadius: '8px'
                                        }}
                                    >
                                        {errors.paypal}
                                    </Alert>
                                </Collapse>
                                <Box sx={{
                                    maxWidth: 450,
                                    mx: 'auto',
                                    width: '100%',
                                    position: 'relative',
                                    '.paypal-buttons': {
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }
                                }}>
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
                                            backgroundColor: 'rgba(255,255,255,0.8)',
                                            zIndex: 1,
                                            borderRadius: '8px'
                                        }}>
                                            <CircularProgress sx={{ color: vistelicaColors.primary }} />
                                        </Box>
                                    )}
                                    <PayPalScriptProvider options={paypalOptions}>
                                        <PayPalButtons
                                            createOrder={handleCreateOrder}
                                            onApprove={handleApprove}
                                            style={{
                                                layout: "vertical",
                                                shape: "rect",
                                                color: "blue"
                                            }}
                                        />
                                    </PayPalScriptProvider>
                                </Box>
                            </>
                        )}
                    </Box>
                );
            case 'applePay':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <ApplePayWrapper
                            amount={amount}
                            onPaymentSuccess={onPaymentSuccess}
                            onPaymentMethodChange={onPaymentMethodChange}
                            setPaymentData={setPaymentData}
                        />
                    </Box>
                );
            case 'googlePay':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <GooglePayWrapper
                            amount={amount}
                            onPaymentSuccess={onPaymentSuccess}
                            onPaymentMethodChange={onPaymentMethodChange}
                            setPaymentData={setPaymentData}
                        />
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'flex-start',
                gap: 3
            }}>
                {/* Panel de selección de métodos de pago (lateral) */}
                <Box sx={{
                    width: { xs: '100%', md: '250px' },
                    flexShrink: 0,
                    order: { xs: 2, md: 1 }
                }}>
                    <PaymentMethodsPanel>
                        <PaymentMethodLabel>
                            Seleccionar método de pago
                        </PaymentMethodLabel>
                        <FormControl component="fieldset" fullWidth>
                            <RadioGroup
                                aria-label="Opciones de pago"
                                name="paymentType"
                                value={paymentType}
                                onChange={handlePaymentTypeChange}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5
                                }}
                            >
                                {/* Opciones de métodos de pago (tarjeta, PayPal, etc.) */}
                                <Card selected={paymentType === 'creditCard'}>
                                    <CardActionArea
                                        onClick={() => handlePaymentTypeChange({ target: { value: 'creditCard' }})}
                                        sx={{
                                            borderRadius: '10px',
                                            padding: 1,
                                            '.MuiCardActionArea-focusHighlight': {
                                                backgroundColor: 'transparent',
                                            },
                                            '&:focus-visible': {
                                                backgroundColor: `${vistelicaColors.primary}10`,
                                                outline: `2px solid ${vistelicaColors.primary}`,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 1,
                                            '&:last-child': { pb: 1 }
                                        }}>
                                            <PaymentMethodIcon selected={paymentType === 'creditCard'}>
                                                <CreditCardRoundedIcon fontSize={paymentType === 'creditCard' ? "medium" : "small"} />
                                            </PaymentMethodIcon>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 'medium',
                                                        fontFamily: typography.fontFamily
                                                    }}
                                                >
                                                    Tarjeta
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontFamily: typography.fontFamily
                                                    }}
                                                >
                                                    Visa, Mastercard
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>

                                {/* Repetir estructura similar para otros métodos de pago */}
                                <Card selected={paymentType === 'paypal'}>
                                    <CardActionArea
                                        onClick={() => handlePaymentTypeChange({ target: { value: 'paypal' }})}
                                        sx={{
                                            borderRadius: '10px',
                                            padding: 1,
                                            '.MuiCardActionArea-focusHighlight': {
                                                backgroundColor: 'transparent',
                                            },
                                            '&:focus-visible': {
                                                backgroundColor: `${vistelicaColors.primary}10`,
                                                outline: `2px solid ${vistelicaColors.primary}`,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 1,
                                            '&:last-child': { pb: 1 }
                                        }}>
                                            <PaymentMethodIcon selected={paymentType === 'paypal'}>
                                                <PaymentIcon fontSize={paymentType === 'paypal' ? "medium" : "small"} />
                                            </PaymentMethodIcon>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 'medium',
                                                        fontFamily: typography.fontFamily
                                                    }}
                                                >
                                                    PayPal
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontFamily: typography.fontFamily
                                                    }}
                                                >
                                                    Pago rápido y seguro
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>

                                <Card selected={paymentType === 'applePay'}>
                                    <CardActionArea
                                        onClick={() => handlePaymentTypeChange({ target: { value: 'applePay' }})}
                                        sx={{
                                            borderRadius: '10px',
                                            padding: 1,
                                            '.MuiCardActionArea-focusHighlight': {
                                                backgroundColor: 'transparent',
                                            },
                                            '&:focus-visible': {
                                                backgroundColor: `${vistelicaColors.primary}10`,
                                                outline: `2px solid ${vistelicaColors.primary}`,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 1,
                                            '&:last-child': { pb: 1 }
                                        }}>
                                            <PaymentMethodIcon selected={paymentType === 'applePay'}>
                                                <AppleIcon fontSize={paymentType === 'applePay' ? "medium" : "small"} />
                                            </PaymentMethodIcon>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 'medium',
                                                        fontFamily: typography.fontFamily
                                                    }}
                                                >
                                                    Apple Pay
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontFamily: typography.fontFamily
                                                    }}
                                                >
                                                    Para dispositivos Apple
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>

                                <Card selected={paymentType === 'googlePay'}>
                                    <CardActionArea
                                        onClick={() => handlePaymentTypeChange({ target: { value: 'googlePay' }})}
                                        sx={{
                                            borderRadius: '10px',
                                            padding: 1,
                                            '.MuiCardActionArea-focusHighlight': {
                                                backgroundColor: 'transparent',
                                            },
                                            '&:focus-visible': {
                                                backgroundColor: `${vistelicaColors.primary}10`,
                                                outline: `2px solid ${vistelicaColors.primary}`,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 1,
                                            '&:last-child': { pb: 1 }
                                        }}>
                                            <PaymentMethodIcon selected={paymentType === 'googlePay'}>
                                                <GoogleIcon fontSize={paymentType === 'googlePay' ? "medium" : "small"} />
                                            </PaymentMethodIcon>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 'medium',
                                                        fontFamily: typography.fontFamily
                                                    }}
                                                >
                                                    Google Pay
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontFamily: typography.fontFamily
                                                    }}
                                                >
                                                    Para dispositivos Android
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </RadioGroup>
                        </FormControl>
                    </PaymentMethodsPanel>
                </Box>

                {/* Contenedor del formulario del método seleccionado */}
                <Box sx={{
                    flexGrow: 1,
                    width: { xs: '100%', md: 'calc(100% - 280px)' },
                    order: { xs: 1, md: 2 }
                }}>
                    <PaymentFormContainer>
                        <SectionTitle variant="h6">
                            Método de pago seleccionado
                        </SectionTitle>
                        {renderPaymentFormContent()}
                    </PaymentFormContainer>
                </Box>
            </Box>
        </Box>
    );
});

PaymentForm.displayName = 'PaymentForm';
export default PaymentForm;