"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductDetail from './components/ProductDetail';
import productService from "@/services/productService";
import cartService from '@/services/cartService';
import { getCurrentUser } from '@/services/authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "@/components/layout/HeaderComponent";
import { CircularProgress } from '@mui/material';

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

    useEffect(() => {
        // Obtener sessionId del localStorage si existe
        const storedSessionId = localStorage.getItem('sessionId');
        if (storedSessionId) {
            setSessionId(storedSessionId);
        }

        const fetchProductData = async () => {
            try {
                setLoading(true);
                if (id) {
                    const productData = await productService.getById(id);

                    if (!productData) {
                        throw new Error("Producto no encontrado");
                    }

                    setProduct(productData);

                    // Establecer valores por defecto solo si hay opciones disponibles
                    if (productData.sizes?.length > 0) {
                        setSelectedSize(productData.sizes[0]);
                    }
                    if (productData.colors?.length > 0) {
                        setSelectedColor(productData.colors[0]);
                    }

                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(err.message || "Error al cargar el producto");
                setLoading(false);
                toast.error("Error al cargar los datos del producto");
            }
        };

        fetchProductData();
    }, [id]);

    const handleSizeChange = (size) => {
        setSelectedSize(size);
        toast.dismiss();
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        toast.dismiss();
    };

    const handleAddToCart = async () => {
        toast.dismiss();
        setAddingToCart(true);

        try {
            const user = await getCurrentUser();
            let currentSessionId = sessionId;

            // Si no hay usuario ni sesión, crear una nueva
            if (!user && !currentSessionId) {
                currentSessionId = Math.random().toString(36).substring(2, 15);
                localStorage.setItem('sessionId', currentSessionId);
                setSessionId(currentSessionId);
                toast.info("Se ha creado una nueva sesión para tu carrito");
            }

            // Obtener o crear el carrito
            let cart;
            try {
                cart = await cartService.getCart(user?.user_id, currentSessionId);
            } catch (error) {
                // Si no existe el carrito, crear uno nuevo
                cart = await cartService.createCart(user?.user_id, currentSessionId);
            }

            // Validar que tenemos un orderId
            if (!cart?.order_id) {
                throw new Error('No se pudo obtener el ID del carrito');
            }

            // Validar selección de talla y color si el producto los requiere
            const requiresSize = product.sizes?.length > 0;
            const requiresColor = product.colors?.length > 0;

            if ((requiresSize && !selectedSize) || (requiresColor && !selectedColor)) {
                throw new Error('Por favor selecciona talla y color');
            }

            // Añadir producto al carrito
            await cartService.addToCart(
                cart.order_id,
                product.product_id,
                1,
                parseFloat(product.price),
                selectedSize,
                selectedColor
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
            });
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <CircularProgress size={60} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Navbar />
                <div className="max-w-md text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
                    <p className="text-lg mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Volver a la página principal
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Navbar />
                <div className="max-w-md text-center">
                    <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
                    <p className="text-lg mb-6">El producto que buscas no está disponible.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Volver a la página principal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />
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
            />
        </div>
    );
}