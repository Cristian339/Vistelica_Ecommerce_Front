"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // o usa useParams si estás con React Router
import ProductDetail from './components/ProductDetail';
import productService from "@/services/productService";
import { Box, CircularProgress, Typography } from '@mui/material';

function ProductDetailPage() {
    const router = useRouter();
    const { productId } = router.query; // Obtiene el ID del producto de la URL

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!productId) return;

            try {
                setLoading(true);

                // 1. Obtener los detalles del producto
                const productData = await productService.getById(productId);

                // 2. Obtener la imagen principal del producto
                const imageData = await productService.getMainImageByProductId(productId);

                // 3. Combinar los datos y formatearlos para el componente ProductDetail
                const formattedProduct = {
                    ...productData,
                    images: imageData ? [imageData.image_url] : ['/images/placeholder-product.jpg']
                };

                console.log("Producto cargado:", formattedProduct);
                setProduct(formattedProduct);
            } catch (err) {
                console.error("Error al cargar el producto:", err);
                setError(err.message || "No se pudo cargar el producto");
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="error">{error}</Typography>
                <Typography sx={{ mt: 2 }}>
                    No se pudo cargar la información del producto.
                </Typography>
            </Box>
        );
    }

    if (!product) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography>Producto no encontrado</Typography>
            </Box>
        );
    }

    return (
        <div>
            <ProductDetail product={product} />
        </div>
    );
}

export default ProductDetailPage;