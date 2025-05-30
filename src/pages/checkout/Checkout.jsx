"use client";

import * as React from 'react';
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
import SitemarkIcon from './components/SitemarkIcon';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import cartService from "@/services/cartService";
import { orderService } from '@/services/orderService';
import { useRouter } from 'next/navigation';
import UserOrdersPage from '../account/order-history/UserOrdersPage';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

// Configuración para PayPal
const paypalOptions = {
    "client-id": "test", // Usar "test" para sandbox o tu client-id real
    currency: "EUR",
    intent: "capture",
    components: "buttons"
};

export default function Checkout(props) {
    const paymentFormRef = React.useRef(null);
    const [activeStep, setActiveStep] = React.useState(0);
    const router = useRouter();
    const [paymentData, setPaymentData] = React.useState({
        type: 'creditCard',
        details: {}
    });
    const [cartData, setCartData] = React.useState(null);
    const [shippingData, setShippingData] = React.useState(null);
    const [isPaymentCompleted, setIsPaymentCompleted] = React.useState(false);

    const [orderData, setOrderData] = React.useState(null);
    const [isCartCleared, setIsCartCleared] = React.useState(false); // Nuevo estado para controlar si el carrito se limpió

    // Función para limpiar carrito eliminando productos uno por uno
    const clearCartByItems = async () => {
        try {
            // Si ya se limpió el carrito, no hacer nada
            if (isCartCleared) {
                console.log('El carrito ya fue limpiado previamente');
                return;
            }

            // Obtener los productos actuales del carrito
            const products = await cartService.getCurrentCartProducts();

            if (!products || products.length === 0) {
                console.log('El carrito ya está vacío');
                setIsCartCleared(true);
                return;
            }

            // Eliminar cada producto individualmente
            const deletePromises = products.map(item =>
                cartService.removeFromCart(item.cart_detail_id)
            );

            // Esperar a que se eliminen todos los productos
            await Promise.all(deletePromises);

            console.log('Carrito limpiado exitosamente');
            setIsCartCleared(true); // Marcar que el carrito fue limpiado
            setCartData({ products: [] }); // Limpiar el estado local del carrito

        } catch (error) {
            console.error('Error al limpiar el carrito:', error);
            throw new Error('No se pudo limpiar el carrito');
        }
    };

    // useEffect para obtener los datos del carrito
    React.useEffect(() => {
        const fetchCartData = async () => {
            try {
                // Solo obtener datos del carrito si no se ha limpiado
                if (!isCartCleared) {
                    const products = await cartService.getCurrentCartProducts();
                    setCartData({ products });
                }
            } catch (error) {
                console.error('Error fetching cart data:', error);
                // Si hay error 404, probablemente el carrito ya está vacío
                if (error.response?.status === 404) {
                    setCartData({ products: [] });
                    setIsCartCleared(true);
                }
            }
        };
        fetchCartData();
    }, [isCartCleared]);

    const calculateDiscountedPrice = (price, discountPercentage) => {
        const originalPrice = parseFloat(price);
        const discount = parseFloat(discountPercentage);
        return originalPrice * (1 - discount / 100);
    };

    // Función para crear el pedido cuando se hace clic en "Realizar pedido"
    const createOrder = async () => {
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
    };

    const getPaymentMethodName = () => {
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
    };

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    // Función para manejar los datos de envío desde AddressForm
    const handleShippingData = (data) => {
        setShippingData(data);
    };

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <AddressForm onDataChange={handleShippingData} />;
            case 1:
                return <PaymentForm
                    paymentData={paymentData}
                    setPaymentData={setPaymentData}
                    onPaymentSuccess={() => setIsPaymentCompleted(true)}
                    onPaymentMethodChange={() => setIsPaymentCompleted(false)}
                    ref={paymentFormRef}
                />;
            case 2:
                return <Review paymentData={paymentData} shippingData={shippingData} />;
            default:
                throw new Error('Unknown step');
        }
    }

    // Función para navegar a los pedidos sin intentar limpiar de nuevo
    const goToOrders = () => {
        router.push('/account/order-history/UserOrdersPage');
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ position: 'fixed', top: '1rem', right: '1rem' }}>
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
                    <SitemarkIcon />
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
                        maxWidth: '100%',
                        width: '100%',
                        backgroundColor: { xs: 'transparent', sm: 'background.default' },
                        alignItems: 'start',
                        pt: { xs: 0, sm: 16 },
                        px: { xs: 2, sm: 10 },
                        gap: { xs: 4, md: 8 },
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
                                sx={{ width: '100%', height: 40 }}
                            >
                                {steps.map((label) => (
                                    <Step
                                        sx={{ ':first-child': { pl: 0 }, ':last-child': { pr: 0 } }}
                                        key={label}
                                    >
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Box>
                    <Card sx={{ display: { xs: 'flex', md: 'none' }, width: '100%' }}>
                        <CardContent
                            sx={{
                                display: 'flex',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <Typography variant="subtitle2" gutterBottom>
                                    Selected products
                                </Typography>
                                <Typography variant="body1">
                                    {activeStep >= 2 ? '$144.97' : '$134.98'}
                                </Typography>
                            </div>
                            <InfoMobile totalPrice={activeStep >= 2 ? '$144.97' : '$134.98'} />
                        </CardContent>
                    </Card>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            width: '100%',
                            maxWidth: { sm: '100%', md: 600 },
                            maxHeight: '720px',
                            gap: { xs: 5, md: 'none' },
                        }}
                    >
                        <Stepper
                            id="mobile-stepper"
                            activeStep={activeStep}
                            alternativeLabel
                            sx={{ display: { sm: 'flex', md: 'none' } }}
                        >
                            {steps.map((label) => (
                                <Step
                                    sx={{
                                        ':first-child': { pl: 0 },
                                        ':last-child': { pr: 0 },
                                        '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
                                    }}
                                    key={label}
                                >
                                    <StepLabel
                                        sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}
                                    >
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <Stack spacing={2} useFlexGap>
                                <Typography variant="h1">📦</Typography>
                                <Typography variant="h5">¡Gracias por tu pedido!</Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    El número de tu pedido es
                                    <strong>&nbsp;#{orderData?.order?.order_number || 'N/A'}</strong>. Te hemos enviado un email con la
                                    confirmación del pedido y te actualizaremos cuando se envíe.
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ alignSelf: 'start', width: { xs: '100%', sm: 'auto' } }}
                                    onClick={goToOrders}
                                >
                                    Ir a mis pedidos
                                </Button>
                            </Stack>
                        ) : (
                            <React.Fragment>
                                {getStepContent(activeStep)}
                                <Box
                                    sx={[
                                        {
                                            display: 'flex',
                                            flexDirection: { xs: 'column-reverse', sm: 'row' },
                                            alignItems: 'end',
                                            flexGrow: 1,
                                            gap: 1,
                                            pb: { xs: 12, sm: 0 },
                                            mt: { xs: 2, sm: 0 },
                                            mb: '60px',
                                        },
                                        activeStep !== 0
                                            ? { justifyContent: 'space-between' }
                                            : { justifyContent: 'flex-end' },
                                    ]}
                                >
                                    {activeStep !== 0 && (
                                        <Button
                                            startIcon={<ChevronLeftRoundedIcon />}
                                            onClick={handleBack}
                                            variant="text"
                                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                    {activeStep !== 0 && (
                                        <Button
                                            startIcon={<ChevronLeftRoundedIcon />}
                                            onClick={handleBack}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ display: { xs: 'flex', sm: 'none' } }}
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        endIcon={<ChevronRightRoundedIcon />}
                                        onClick={activeStep === steps.length - 1 ? createOrder : handleNext}
                                        disabled={activeStep === 1 && !isPaymentCompleted} // Nuevo disabled
                                        sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                                    >
                                        {activeStep === steps.length - 1 ? 'Realizar pedido' : 'Siguiente'}
                                    </Button>

                                </Box>
                            </React.Fragment>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </AppTheme>
    );
}