"use client";
import React, { useEffect, useState } from 'react';
import ProductDetail from './components/ProductDetail';
import productService from "@/services/productService";
import cartService from '@/services/cartService';
import { getCurrentUser } from '@/services/authService';
import { toast,ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "@/components/layout/HeaderComponent";

function App({ params }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);

    // Test: Verificar que toast funciona al cargar el componente
    useEffect(() => {
        toast.info("Componente cargado correctamente", { toastId: "load-test" });
    }, []);

    useEffect(() => {
        const productId = '4';

        const fetchProductData = async () => {
            try {
                const productData = await productService.getById(productId);
                setProduct(productData);

                if (productData.size?.length > 0) {
                    setSelectedSize(productData.size[0]);
                }
                if (productData.colors?.length > 0) {
                    setSelectedColor(productData.colors[0]);
                }
                console.log(productData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(err.message || "Error al cargar el producto");
                setLoading(false);
                toast.error("Error al cargar los datos del producto");
            }
        };

        fetchProductData();
    }, ['1']);

    const handleSizeChange = (size) => {
        setSelectedSize(size);
        toast.dismiss(); // Cierra toasts anteriores al cambiar tamaño
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        toast.dismiss(); // Cierra toasts anteriores al cambiar color
    };

    const handleAddToCart = async () => {
        toast.dismiss(); // Cierra toasts anteriores

        if (!selectedSize || !selectedColor) {
            toast.warning('Por favor selecciona talla y color', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        setAddingToCart(true);
        try {
            const user = await getCurrentUser();
            const sessionId = localStorage.getItem('sessionId');

            if (!user && !sessionId) {
                const newSessionId = Math.random().toString(36).substring(2);
                localStorage.setItem('sessionId', newSessionId);
                toast.info("Se ha creado una nueva sesión para tu carrito");
            }



            const cartResponse = await cartService.getCart(user?.user_id, sessionId || localStorage.getItem('sessionId'));
            console.log(cartResponse);
            let orderId = cartResponse.order_id;


            await cartService.addToCart(
                orderId,
                product.product_id,
                1,
                parseFloat(product.price)
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
            toast.error(`❌ ${error.response?.data?.message || 'Error al añadir al carrito'}`, {
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
        return <div>Cargando producto...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>No se encontró el producto</div>;
    }

    return (
        <div>
            <Navbar/>
            <ProductDetail
                product={product}
                availableSizes={product.size || []}
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

export default App;