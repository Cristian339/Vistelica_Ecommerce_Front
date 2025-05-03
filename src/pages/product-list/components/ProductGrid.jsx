import React from 'react';
import { Box, Typography } from '@mui/material';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, gridView }) => {
    // Define el padding según el tipo de vista
    const itemPadding = gridView === 'grid2' ? '12px' : '4px';

    // Verificar si hay productos para mostrar
    if (!Array.isArray(products) || products.length === 0) {
        return (
            <Box sx={{ py: 4, textAlign: 'center', width: '100%' }}>
                <Typography variant="h6" color="text.secondary">
                    No se encontraron productos para mostrar.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                width: '100%',
                margin: gridView === 'grid2' ? '-12px' : '-4px', // Compensar el padding
            }}
        >
            {products.map((product) => {
                // Asegurarse de que tenemos un ID único para cada producto
                const productId = product.product_id || product._id || `product-${Math.random()}`;

                return (
                    <Box
                        key={productId}
                        sx={{
                            width: {
                                xs: '100%',
                                sm: '50%',
                                md: gridView === 'grid4' ? '25%' : '50%'
                            },
                            padding: itemPadding,
                            boxSizing: 'border-box',
                        }}
                    >
                        <ProductCard
                            product={product}
                            largeView={gridView === 'grid2'}
                        />
                    </Box>
                );
            })}
        </Box>
    );
};

export default ProductGrid;