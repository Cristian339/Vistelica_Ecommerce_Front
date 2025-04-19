// page.js actualizado
"use client";
import React, { useEffect, useState } from 'react';
import ProductDetail from './components/ProductDetail';
import productService from "@/services/productService";

function App() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        const productId = '1'; // Cambia esto por el ID dinámico si es necesario

        const fetchProductData = async () => {
            try {
                // 1. Primero obtener el producto por ID
                const initialProduct = await productService.getProductById(productId);
                setProduct(initialProduct);

                // 2. Usar el nombre del producto para obtener tallas disponibles
                const sizes = await productService.getSizesByProductName(initialProduct.name);
                setAvailableSizes(sizes);

                // 3. Si hay tallas, obtener colores para la primera talla
                if (sizes.length > 0) {
                    const colors = await productService.getColorsByProductAndSize(
                        initialProduct.name,
                        sizes[0]
                    );
                    setAvailableColors(colors);
                    setSelectedSize(sizes[0]);

                    // 4. Si hay colores, seleccionar el primero
                    if (colors.length > 0) {
                        setSelectedColor(colors[0]);
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(err.message || "Error al cargar el producto");
                setLoading(false);
            }
        };

        fetchProductData();
    }, []);

    // Función para manejar cambio de talla
    const handleSizeChange = async (size) => {
        setSelectedSize(size);
        try {
            const colors = await productService.getColorsByProductAndSize(
                product.name,
                size
            );
            setAvailableColors(colors);

            if (colors.length > 0) {
                setSelectedColor(colors[0]);
                const productData = await productService.getProductByNameSizeAndColor(
                    product.name,
                    size,
                    colors[0]
                );
                setProduct(productData);
            } else {
                setSelectedColor(null);
            }
        } catch (error) {
            console.error("Error al cambiar talla:", error);
        }
    };

    // Función para manejar cambio de color
    const handleColorChange = async (color) => {
        setSelectedColor(color);
        try {
            const productData = await productService.getProductByNameSizeAndColor(
                product.name,
                selectedSize,
                color
            );
            setProduct(productData);
        } catch (error) {
            console.error("Error al cambiar color:", error);
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
            <ProductDetail
                product={product}
                availableSizes={availableSizes}
                availableColors={availableColors}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSizeChange={handleSizeChange}
                onColorChange={handleColorChange}
            />
        </div>
    );
}

export default App;