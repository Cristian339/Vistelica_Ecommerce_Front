"use client";

import * as React from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddressForm from './components/AddressForm';
import Info from './components/Info';
import InfoMobile from './components/InfoMobile';
import PaymentForm from './components/PaymentForm';
import Review from './components/Review';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import cartService from "@/services/cartService";
import { orderService } from '@/services/orderService';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { vistelicaColors } from "../shared-theme/vistelicaColors";
import { typography } from '../shared-theme/themePrimitives';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Pasos traducidos al español con íconos
const steps = [
    {
        label: 'Dirección de envío',
        icon: <LocalShippingOutlinedIcon />
    },
    {
        label: 'Detalles de pago',
        icon: <PaymentOutlinedIcon />,
    },
    {
        label: 'Revisar pedido',
        icon: <ReceiptLongOutlinedIcon />,
    }
];

// Componentes estilizados para mejorar el diseño
const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    fontWeight: 500,
    fontFamily: typography.fontFamily,
    padding: '10px 24px',
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
    }
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: '0 3px 15px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    }
}));

const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
    '& .MuiStepLabel-label': {
        fontFamily: typography.fontFamily,
        fontWeight: 500,
        fontSize: '0.9rem',
        color: '#666',
        '&.Mui-active': {
            color: vistelicaColors.primary,
            fontWeight: 600,
        },
        '&.Mui-completed': {
            color: '#4caf50',
            fontWeight: 600,
        }
    },
    '& .MuiStepIcon-root': {
        color: '#bdbdbd',
        '&.Mui-active': {
            color: vistelicaColors.primary,
        },
        '&.Mui-completed': {
            color: '#4caf50',
        }
    }
}));

const SuccessIcon = styled(Box)(({ theme }) => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: '#f0f9ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    boxShadow: '0 4px 20px rgba(0,149,255,0.15)',
    marginBottom: theme.spacing(3),
}));

const PaymentSuccessAlert = styled(Alert)(({ theme }) => ({
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(82, 196, 26, 0.15)',
    fontFamily: typography.fontFamily,
    fontSize: '1rem',
    alignItems: 'center',
    '& .MuiAlert-icon': {
        fontSize: '24px'
    }
}));

// Componente estilizado para el mensaje de pago requerido
const PaymentRequiredHelp = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    padding: theme.spacing(1.5),
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 152, 0, 0.08)',
    border: '1px solid rgba(255, 152, 0, 0.2)',
    color: '#f57c00',
    fontFamily: typography.fontFamily,
    fontSize: '0.875rem'
}));

// Estilizar el tooltip para el mensaje de pago requerido
const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .MuiTooltip-tooltip`]: {
        backgroundColor: 'rgba(255, 152, 0, 0.95)',
        color: '#fff',
        maxWidth: 300,
        fontSize: '0.875rem',
        fontFamily: typography.fontFamily,
        padding: theme.spacing(1.5),
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1)
    },
    [`& .MuiTooltip-arrow`]: {
        color: 'rgba(255, 152, 0, 0.95)',
    },
}));

// Configuración para PayPal
const paypalOptions = {
    "client-id": "test", // Usar "test" para sandbox o tu client-id real
    currency: "EUR",
    intent: "capture",
    components: "buttons"
};

// Componentes estilizados mejorados para mejor rendimiento
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

export default function Checkout(props) {
    const paymentFormRef = useRef(null);
    const [activeStep, setActiveStep] = useState(0);
    const router = useRouter();
    const [paymentData, setPaymentData] = useState({
        type: 'creditCard',
        details: {}
    });
    const [cartData, setCartData] = useState(null);
    const [shippingData, setShippingData] = useState(null);
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
    const [orderData, setOrderData] = useState(null);

    // Optimizar carga de datos con AbortController para limpieza adecuada
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchCartData = async () => {
            try {
                const products = await cartService.getCurrentCartProducts(signal);
                if (!signal.aborted) {
                    setCartData({ products });
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error al cargar productos del carrito:', error);
                }
            }
        };

        fetchCartData();

        return () => {
            controller.abort(); // Limpiar request en desmontaje
        };
    }, []);

    // Funciones memoizadas para cálculos para mejorar rendimiento
    const calculateDiscountedPrice = useCallback((price, discountPercentage) => {
        const originalPrice = parseFloat(price);
        const discount = parseFloat(discountPercentage);
        return originalPrice * (1 - discount / 100);
    }, []);

    const calculateSubtotal = useCallback((products) => {
        if (!products || products.length === 0) return 0;
        return products.reduce((sum, item) => {
            const finalPrice = calculateDiscountedPrice(item.price, item.discount_percentage);
            return sum + (finalPrice * item.quantity);
        }, 0);
    }, [calculateDiscountedPrice]);

    const calculateShippingCost = useCallback((subtotal) => {
        return subtotal >= 50 ? 0 : 4.99;
    }, []);

    const calculateTotal = useCallback(() => {
        if (!cartData || !cartData.products) return "0.00 €";

        const subtotal = calculateSubtotal(cartData.products);
        const shippingCost = calculateShippingCost(subtotal);
        const total = subtotal + shippingCost;

        return `${total.toFixed(2)} €`;
    }, [cartData, calculateSubtotal, calculateShippingCost]);

    // Función para limpiar el carrito por elementos
    const clearCartByItems = async () => {
        if (!cartData || !cartData.products) return;

        try {
            for (const item of cartData.products) {
                await cartService.removeFromCart(item.product.product_id);
            }
        } catch (error) {
            console.error('Error al limpiar el carrito:', error);
        }
    };

    // Optimizar funciones de eventos con useCallback
    const handlePaymentSuccess = useCallback(() => {
        console.log("Pago completado con éxito");
        setIsPaymentCompleted(true);
    }, []);

    const handlePaymentMethodChange = useCallback(() => {
        console.log("Método de pago cambiado, reseteando estado de pago");
        setIsPaymentCompleted(false);
    }, []);

    const handleNext = useCallback(() => {
        if (activeStep === 1 && !isPaymentCompleted) {
            alert('Por favor, completa el pago antes de continuar.');
            return;
        }

        setActiveStep(prevStep => prevStep + 1);
    }, [activeStep, isPaymentCompleted]);

    const handleBack = useCallback(() => {
        setActiveStep(prevStep => prevStep - 1);
    }, []);

    const handleShippingData = useCallback((data) => {
        setShippingData(data);
    }, []);

    // Memoizar la función createOrder para evitar recreaciones
    const createOrder = useCallback(async () => {
        try {
            if (!cartData || !cartData.products || cartData.products.length === 0) {
                alert('No hay productos en el carrito');
                return;
            }

            if (!shippingData || !shippingData.selectedAddressId) {
                alert('Por favor selecciona una dirección de envío');
                return;
            }

            // Preparar los detalles del pedido
            const orderDetails = cartData.products.map(item => {
                const finalPrice = calculateDiscountedPrice(item.price, item.discount_percentage);

                return {
                    product_id: item.product.product_id,
                    quantity: item.quantity,
                    price: parseFloat(finalPrice.toFixed(2)), // Asegurar 2 decimales
                    size: item.size || null,
                    color: item.color || null
                };
            });

            // Preparar el JSON del pedido según el formato requerido
            const orderRequestData = {
                address_id: shippingData.selectedAddressId,
                payment_method_name: getPaymentMethodName(),
                details: orderDetails
            };

            console.log('Enviando pedido:', orderRequestData);

            const result = await orderService.createOrder(orderRequestData);

            console.log('Pedido creado exitosamente:', result);

            // Almacenar la respuesta del pedido en el estado
            setOrderData(result);

            // Limpiar carrito después de crear el pedido
            try {
                await clearCartByItems();
            } catch (clearError) {
                console.warn('No se pudo limpiar el carrito:', clearError);
            }

            // Avanzar al paso de confirmación
            setActiveStep(activeStep + 1);

        } catch (error) {
            console.error('Error creando pedido:', error);
            alert(error.message || 'Error al crear el pedido');
        }
    }, [cartData, shippingData, calculateDiscountedPrice, clearCartByItems, activeStep, router]);

    // Memoizar getPaymentMethodName para mejor rendimiento
    const getPaymentMethodName = useCallback(() => {
        if (!paymentData || !paymentData.type) {
            return 'Tarjeta de Crédito'; // Default
        }

        switch (paymentData.type) {
            case 'creditCard':
                return 'Tarjeta de Crédito';
            case 'paypal':
                return 'PayPal';
            case 'applePay':
                return 'Apple Pay';
            case 'googlePay':
                return 'Google Pay';
            case 'bankTransfer':
                return 'Transferencia Bancaria';
            default:
                return 'Método de Pago';
        }
    }, [paymentData]);

    // Memoizar el contenido del paso actual para evitar re-renders
    const currentStepContent = useMemo(() => {
        return getStepContent(activeStep);
    }, [activeStep, paymentData, shippingData, calculateTotal]);

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <AddressForm onDataChange={handleShippingData} />;
            case 1:
                return <PaymentForm
                    paymentData={paymentData}
                    setPaymentData={setPaymentData}
                    amount={calculateTotal()}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentMethodChange={handlePaymentMethodChange}
                    ref={paymentFormRef}
                />;
            case 2:
                return <Review paymentData={paymentData} shippingData={shippingData} />;
            default:
                throw new Error('Unknown step');
        }
    }

    // Función memoizada para navegar a pedidos
    const goToOrders = useCallback(() => {
        router.push('/account/order-history/UserOrdersPage');
    }, [router]);

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 10 }}>
                <ColorModeIconDropdown />
            </Box>

            <Grid
                container
                sx={{
                    height: {
                        xs: '100%',
                        sm: 'calc(100dvh - var(--template-frame-height, 0px))',
                    },
                    mt: {
                        xs: 4,
                        sm: 0,
                    },
                }}
            >
                <Grid
                    size={{ xs: 12, sm: 5, lg: 4 }}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        backgroundColor: 'background.paper',
                        borderRight: { sm: 'none', md: '1px solid' },
                        borderColor: { sm: 'none', md: 'divider' },
                        alignItems: 'start',
                        pt: 16,
                        px: 10,
                        gap: 4,
                    }}
                >
                    {/* Logo de Vistelica */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 2
                    }}>
                        <ShoppingBagOutlinedIcon
                            sx={{
                                fontSize: 32,
                                color: vistelicaColors.primary
                            }}
                        />
                        <Typography
                            variant="h5"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                fontFamily: typography.fontFamily,
                                color: '#333'
                            }}
                        >
                            Vistelica
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            width: '100%',
                            maxWidth: 500,
                        }}
                    >
                        <Info totalPrice={activeStep >= 2 ? '$144.97' : '$134.98'} />
                    </Box>
                </Grid>
                <Grid
                    size={{ sm: 12, md: 7, lg: 8 }}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        backgroundColor: { xs: 'transparent', sm: 'background.default' },
                        alignItems: 'start',
                        pt: { xs: 0, sm: 16 },
                        px: { xs: 2, sm: 4, md: 6 }, // Padding responsivo mejorado
                        gap: { xs: 3, md: 6 },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: { sm: 'space-between', md: 'flex-end' },
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: { sm: '100%', md: 600 },
                        }}
                    >
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                flexGrow: 1,
                            }}
                        >
                            <Stepper
                                id="desktop-stepper"
                                activeStep={activeStep}
                                sx={{
                                    width: '100%',
                                    height: 40,
                                    '& .MuiStep-root': {
                                        padding: '0 16px'
                                    },
                                    '& .MuiStepConnector-line': {
                                        borderColor: activeStep > 0 ? vistelicaColors.primary : '#eaeaea',
                                        borderTopWidth: 3,
                                        borderRadius: 4
                                    },
                                }}
                            >
                                {steps.map(({ label, icon }) => (
                                    <Step
                                        sx={{
                                            ':first-child': { pl: 0 },
                                            ':last-child': { pr: 0 },
                                        }}
                                        key={label}
                                    >
                                        <CustomStepLabel
                                            StepIconProps={{
                                                icon: icon
                                            }}
                                        >
                                            {label}
                                        </CustomStepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Box>
                    <StyledCard sx={{ display: { xs: 'flex', md: 'none' }, width: '100%' }}>
                        <CardContent
                            sx={{
                                display: 'flex',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2.5,
                                '&:last-child': { pb: 2.5 }
                            }}
                        >
                            <div>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{
                                        fontFamily: typography.fontFamily,
                                        color: 'text.secondary',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    Productos seleccionados
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: typography.fontFamily,
                                        fontWeight: 700,
                                        color: vistelicaColors.primary
                                    }}
                                >
                                    {activeStep >= 2 ? '$144.97' : '$134.98'}
                                </Typography>
                            </div>
                            <InfoMobile totalPrice={activeStep >= 2 ? '$144.97' : '$134.98'} />
                        </CardContent>
                    </StyledCard>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            maxWidth: { sm: '100%', md: '900px', lg: '1200px' }, // Anchos responsivos
                            margin: '0 auto',
                        }}
                    >
                        <Stepper
                            id="mobile-stepper"
                            activeStep={activeStep}
                            alternativeLabel
                            sx={{
                                display: { sm: 'flex', md: 'none' },
                                mb: 3,
                                '& .MuiStepConnector-line': {
                                    borderColor: activeStep > 0 ? vistelicaColors.primary : '#eaeaea',
                                    borderTopWidth: 2,
                                    borderRadius: 4
                                },
                            }}
                        >
                            {steps.map(({ label, icon }) => (
                                <Step
                                    sx={{
                                        ':first-child': { pl: 0 },
                                        ':last-child': { pr: 0 },
                                        '& .MuiStepConnector-root': {
                                            top: { xs: 6, sm: 12 }
                                        },
                                    }}
                                    key={label}
                                >
                                    <CustomStepLabel
                                        sx={{
                                            '.MuiStepLabel-labelContainer': {
                                                maxWidth: '90px',
                                                mt: 1
                                            }
                                        }}
                                        StepIconProps={{
                                            icon: icon
                                        }}
                                    >
                                        {label}
                                    </CustomStepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <Stack
                                spacing={3}
                                useFlexGap
                                sx={{
                                    alignItems: 'center',
                                    py: 4,
                                    textAlign: 'center',
                                    backgroundColor: '#fff',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 30px rgba(0,0,0,0.07)',
                                    border: '1px solid #f0f0f0',
                                    px: { xs: 2, sm: 6 }
                                }}
                            >
                                <SuccessIcon>
                                    <span role="img" aria-label="Confirmación de pedido">📦</span>
                                </SuccessIcon>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#333',
                                        fontFamily: typography.fontFamily
                                    }}
                                >
                                    ¡Gracias por tu pedido!
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: 'text.secondary',
                                        fontFamily: typography.fontFamily,
                                        maxWidth: '500px'
                                    }}
                                >
                                    El número de tu pedido es
                                    <strong>&nbsp;#{orderData?.order?.order_number || 'N/A'}</strong>. Te hemos enviado un email con la
                                    confirmación del pedido y te actualizaremos cuando se envíe.
                                </Typography>
                                <StyledButton
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        mt: 2,
                                        backgroundColor: vistelicaColors.primary,
                                        '&:hover': {
                                            backgroundColor: `${vistelicaColors.primary}e0`,
                                        }
                                    }}
                                    onClick={goToOrders}
                                >
                                    Ver mis pedidos
                                </StyledButton>
                            </Stack>
                        ) : (
                            <React.Fragment>
                                <Box
                                    sx={{
                                        bgcolor: '#fff',
                                        borderRadius: { xs: '12px', md: '16px' }, // Bordes responsivos
                                        p: { xs: 2, sm: 3, md: 4 }, // Padding responsivo
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                        border: '1px solid #f0f0f0',
                                        width: '100%',
                                        mx: 'auto', // Centrar
                                        overflow: 'hidden' // Evitar desbordamiento en móviles
                                    }}
                                >
                                    {/* Título del paso actual con color primario */}
                                    <Typography
                                        component="h2"
                                        variant="h5"
                                        gutterBottom
                                        sx={{
                                            mb: { xs: 2.5, md: 4 }, // Margen responsivo
                                            fontSize: { xs: '1.25rem', md: '1.5rem' }, // Tamaño de fuente responsivo
                                            fontFamily: typography.fontFamily,
                                            fontWeight: 700,
                                            color: '#333',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                bgcolor: `${vistelicaColors.primary}15`,
                                                color: vistelicaColors.primary,
                                                width: { xs: 36, md: 40 }, // Tamaño responsivo
                                                height: { xs: 36, md: 40 },
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: `0 4px 12px ${vistelicaColors.primary}20`
                                            }}
                                        >
                                            {steps[activeStep].icon}
                                        </Box>
                                        {steps[activeStep].label}
                                    </Typography>

                                    {currentStepContent}

                                    {/* Mostrar alerta de éxito cuando el pago está completo */}
                                    {activeStep === 1 && isPaymentCompleted && (
                                        <PaymentSuccessAlert
                                            icon={<CheckCircleIcon fontSize="inherit" />}
                                            severity="success"
                                        >
                                            Pago completado con éxito. Puedes continuar al siguiente paso.
                                        </PaymentSuccessAlert>
                                    )}

                                    {/* Eliminamos el mensaje estático que aparecía siempre */}
                                </Box>

                                <Box
                                    sx={[
                                        {
                                            display: 'flex',
                                            flexDirection: { xs: 'column-reverse', sm: 'row' },
                                            alignItems: 'center',
                                            flexGrow: 1,
                                            gap: 2,
                                            pb: { xs: 12, sm: 0 },
                                            pt: { xs: 2, sm: 4 }, // Padding top responsivo
                                            mb: { xs: '60px', sm: '40px' }, // Margen bottom responsivo
                                            width: '100%',
                                            mx: 'auto' // Centrar
                                        },
                                        activeStep !== 0
                                            ? { justifyContent: 'space-between' }
                                            : { justifyContent: 'flex-end' },
                                    ]}
                                >
                                    {activeStep !== 0 && (
                                        <StyledButton
                                            startIcon={<ChevronLeftRoundedIcon />}
                                            onClick={handleBack}
                                            variant="outlined"
                                            sx={{
                                                display: { xs: 'none', sm: 'flex' },
                                                borderColor: '#bdbdbd',
                                                color: '#666',
                                                '&:hover': {
                                                    borderColor: '#999',
                                                    backgroundColor: 'rgba(0,0,0,0.04)'
                                                }
                                            }}
                                        >
                                            Anterior
                                        </StyledButton>
                                    )}
                                    {activeStep !== 0 && (
                                        <StyledButton
                                            startIcon={<ChevronLeftRoundedIcon />}
                                            onClick={handleBack}
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                display: { xs: 'flex', sm: 'none' },
                                                borderColor: '#bdbdbd',
                                                color: '#666',
                                                '&:hover': {
                                                    borderColor: '#999',
                                                    backgroundColor: 'rgba(0,0,0,0.04)'
                                                }
                                            }}
                                        >
                                            Anterior
                                        </StyledButton>
                                    )}

                                    {/* Usar Tooltip para mostrar el mensaje solo en hover cuando el pago no está completo */}
                                    {activeStep === 1 && !isPaymentCompleted ? (
                                        <StyledTooltip
                                            title={
                                                <>
                                                    <InfoOutlinedIcon fontSize="small" />
                                                    <span>Por favor, completa el proceso de pago antes de continuar al siguiente paso.</span>
                                                </>
                                            }
                                            arrow
                                            placement="left"
                                        >
                                            <span style={{ width: '100%' }}> {/* Contenedor para el tooltip */}
                                                <StyledButton
                                                    variant="contained"
                                                    endIcon={<ChevronRightRoundedIcon />}
                                                    onClick={handleNext}
                                                    disabled={true}
                                                    sx={{
                                                        width: { xs: '100%', sm: 'auto' },
                                                        minWidth: { sm: '180px' },
                                                        backgroundColor: vistelicaColors.primary,
                                                        fontSize: '1rem',
                                                        '&:hover': {
                                                            backgroundColor: `${vistelicaColors.primary}e0`,
                                                        },
                                                        '&.Mui-disabled': {
                                                            backgroundColor: '#bdbdbd',
                                                            color: '#fff'
                                                        }
                                                    }}
                                                >
                                                    Siguiente
                                                </StyledButton>
                                            </span>
                                        </StyledTooltip>
                                    ) : (
                                        <StyledButton
                                            variant="contained"
                                            endIcon={<ChevronRightRoundedIcon />}
                                            onClick={activeStep === steps.length - 1 ? createOrder : handleNext}
                                            disabled={activeStep === 1 && !isPaymentCompleted}
                                            sx={{
                                                width: { xs: '100%', sm: 'auto' },
                                                minWidth: { sm: '180px' },
                                                backgroundColor: vistelicaColors.primary,
                                                fontSize: '1rem',
                                                '&:hover': {
                                                    backgroundColor: `${vistelicaColors.primary}e0`,
                                                },
                                                '&.Mui-disabled': {
                                                    backgroundColor: '#bdbdbd',
                                                    color: '#fff'
                                                }
                                            }}
                                        >
                                            {activeStep === steps.length - 1 ? 'Realizar pedido' : 'Siguiente'}
                                        </StyledButton>
                                    )}
                                </Box>
                            </React.Fragment>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </AppTheme>
    );
}