"use client";
import React, { useEffect, useState } from 'react';
import ProductDetail from './components/ProductDetail';
import productService from "@/services/productService";

function App({ params }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        const productId = '1';

        const fetchProductData = async () => {
            try {
                // Obtener el producto por ID
                const productData = await productService.getById(productId);
                setProduct(productData);

                // Seleccionar primera talla y color disponibles
                if (productData.size?.length > 0) {
                    setSelectedSize(productData.size[0]);
                }
                if (productData.colors?.length > 0) {
                    setSelectedColor(productData.colors[0]);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(err.message || "Error al cargar el producto");
                setLoading(false);
            }
        };

        fetchProductData();
    }, ['1']);

    // Función para manejar cambio de talla
    const handleSizeChange = (size) => {
        setSelectedSize(size);
    };

    // Función para manejar cambio de color
    const handleColorChange = (color) => {
        setSelectedColor(color);
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
                availableSizes={product.size || []}
                availableColors={product.colors || []}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSizeChange={handleSizeChange}
                onColorChange={handleColorChange}
            />
        </div>
    );
}

export default App;