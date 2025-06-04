"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import ProductDetail from './components/ProductDetail';
import productService from "@/services/productService";
import cartService from '@/services/cartService';
import { getCurrentUser } from '@/services/authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "@/components/layout/HeaderComponent";
import Footer from "@/components/layout/FooterComponent";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Container,
    Paper
} from '@mui/material';
import { motion } from "framer-motion";
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ProductDetailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    // Optimizado para evitar re-renderizaciones innecesarias
    const fetchProductData = useCallback(async () => {
        try {
            setLoading(true);
            if (!id) {
                // En lugar de lanzar un error, manejarlo graciosamente
                setError("ID de producto no proporcionado");
                setProduct(null);
                setLoading(false);
                return; // Salir de la función sin intentar fetch
            }

            const productData = await productService.getById(id);

            if (!productData) {
                setError("Producto no encontrado");
                setProduct(null);
            } else {
                setProduct(productData);

                // Establecer valores por defecto solo si hay opciones disponibles
                if (productData.sizes?.length > 0) {
                    setSelectedSize(productData.sizes[0]);
                }
                if (productData.colors?.length > 0) {
                    setSelectedColor(productData.colors[0]);
                }

                setError(null);
            }
        } catch (err) {
            console.error("Error fetching product:", err);
            setError(err.message || "Error al cargar el producto");
            setProduct(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        // Obtener sessionId del localStorage si existe
        const storedSessionId = localStorage.getItem('sessionId');
        if (storedSessionId) {
            setSessionId(storedSessionId);
        }

        fetchProductData();
    }, [fetchProductData]);

    const handleSizeChange = (size) => {
        setSelectedSize(size);
        toast.dismiss();
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        toast.dismiss();
    };

    const handleAddToCart = async (quantity = 1) => {
        toast.dismiss();
        setAddingToCart(true);

        try {
            // Comprobación mejorada de propiedades
            const sizes = product.sizes || product.size || [];
            const colors = product.colors || [];

            const requiresSize = sizes.length > 0;
            const requiresColor = colors.length > 0;

            if ((requiresSize && !selectedSize) || (requiresColor && !selectedColor)) {
                throw new Error('Por favor selecciona talla y color');
            }

            // Obtenemos el usuario o creamos una sesión
            const user = await getCurrentUser();
            let currentSessionId = sessionId;

            if (!user && !currentSessionId) {
                currentSessionId = Math.random().toString(36).substring(2, 15);
                localStorage.setItem('sessionId', currentSessionId);
                setSessionId(currentSessionId);
            }

            // Gestión de carrito con mejor manejo de errores
            let cart = null;
            try {
                cart = await cartService.getCart(user?.user_id, currentSessionId);
            } catch (cartError) {
                console.warn("Error al obtener el carrito, intentando crear uno nuevo:", cartError);
            }

            if (!cart) {
                try {
                    cart = await cartService.createCart(user?.user_id, currentSessionId);
                } catch (createError) {
                    console.error("Error al crear el carrito:", createError);
                    throw new Error("No se pudo crear un carrito nuevo");
                }
            }

            if (!cart?.cart_id) {
                throw new Error('No se pudo obtener el ID del carrito');
            }

            // Imagen por defecto mejorada
            const productImage = product.image_url || product.img_url ||
                (product.images && product.images.length > 0 ? product.images[0].image_url : null);

            // Añadimos el producto al carrito
            await cartService.addToCart(
                cart.cart_id,
                product.product_id,
                /*1,*/
                quantity,
                parseFloat(product.price),
                selectedSize,
                selectedColor,
                product.discount_percentage,
                product.image_url || product.img_url || product.images?.[0]
            );

            toast.success('✅ Producto añadido al carrito', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: { fontFamily: typography.fontFamily }
            });

        } catch (error) {
            console.error('Error al añadir al carrito:', error);
            toast.error(`❌ ${error.message || 'Error al añadir al carrito'}`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: { fontFamily: typography.fontFamily }
            });
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#fafafa'
            }}>
                <Head>
                    <title>Cargando producto... | Vistelica</title>
                    <meta name="description" content="Cargando información del producto" />
                </Head>
                <Navbar />
                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 0.5 }}
                    >
                        <CircularProgress size={60} sx={{ color: vistelicaColors.primary }} />
                    </motion.div>
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: typography.fontFamily,
                            color: 'text.secondary',
                            mt: 2
                        }}
                    >
                        Cargando información del producto...
                    </Typography>
                </Box>
                <Footer />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#fafafa'
            }}>
                <Head>
                    <title>Error | Vistelica</title>
                    <meta name="description" content="Ha ocurrido un error al cargar el producto" />
                </Head>
                <Navbar />
                <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ width: '100%' }}
                    >
                        <Paper
                            elevation={2}
                            sx={{
                                p: { xs: 3, sm: 4 },
                                borderRadius: 2,
                                textAlign: 'center',
                                my: 4
                            }}
                        >
                            <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                            <Typography
                                variant="h5"
                                component="h1"
                                sx={{
                                    mb: 2,
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 600
                                }}
                            >
                                Error
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 3,
                                    fontFamily: typography.fontFamily
                                }}
                            >
                                {error}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => router.push('/')}
                                sx={{
                                    fontFamily: typography.fontFamily,
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1
                                }}
                            >
                                Volver a la página principal
                            </Button>
                        </Paper>
                    </motion.div>
                </Container>
                <Footer />
            </Box>
        );
    }

    if (!product) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#fafafa'
            }}>
                <Head>
                    <title>Producto no encontrado | Vistelica</title>
                    <meta name="description" content="El producto que buscas no está disponible" />
                </Head>
                <Navbar />
                <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ width: '100%' }}
                    >
                        <Paper
                            elevation={2}
                            sx={{
                                p: { xs: 3, sm: 4 },
                                borderRadius: 2,
                                textAlign: 'center',
                                my: 4
                            }}
                        >
                            <Typography
                                variant="h5"
                                component="h1"
                                sx={{
                                    mb: 2,
                                    fontFamily: typography.fontFamily,
                                    fontWeight: 600
                                }}
                            >
                                Producto no encontrado
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 3,
                                    fontFamily: typography.fontFamily
                                }}
                            >
                                El producto que buscas no está disponible.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => router.push('/')}
                                sx={{
                                    fontFamily: typography.fontFamily,
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1
                                }}
                            >
                                Volver a la página principal
                            </Button>
                        </Paper>
                    </motion.div>
                </Container>
                <Footer />
            </Box>
        );
    }

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#fafafa'
            }}
        >
            <Head>
                <title>{product.name || 'Producto'} | Vistelica</title>
                <meta name="description" content={product.description?.substring(0, 155) || 'Detalle de producto en Vistelica'} />
                <meta property="og:title" content={`${product.name || 'Producto'} | Vistelica`} />
                <meta property="og:description" content={product.description?.substring(0, 155) || 'Detalle de producto en Vistelica'} />
                {product.image_url && <meta property="og:image" content={product.image_url} />}
            </Head>

            <Navbar />
            <Box sx={{ flexGrow: 1 }}>
                <ProductDetail
                    product={product}
                    availableSizes={product.sizes || []}
                    availableColors={product.colors || []}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                    onSizeChange={handleSizeChange}
                    onColorChange={handleColorChange}
                    onAddToCart={handleAddToCart}
                    addingToCart={addingToCart}
                />
            </Box>
            <Footer />
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                toastStyle={{ fontFamily: typography.fontFamily }}
                closeButton={({ closeToast }) => (
                    <Button
                        onClick={closeToast}
                        size="small"
                        sx={{
                            minWidth: 'auto',
                            fontFamily: typography.fontFamily
                        }}
                    >
                        ✕
                    </Button>
                )}
            />
        </Box>
    );
}