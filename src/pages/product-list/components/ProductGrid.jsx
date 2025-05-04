import React from 'react';
import { Box, Typography } from '@mui/material';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, gridView, onAddToWishlist, favoriteIds = [] }) => {
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
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: gridView === 'grid4' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                lg: gridView === 'grid4' ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
            },
            gap: { xs: 2, sm: 3 }
        }}>
            {products.map((product) => (
                <ProductCard
                    key={product.product_id || product.id}
                    product={product}
                    largeView={gridView === 'grid2'}
                    onAddToWishlist={onAddToWishlist}
                    favoriteIds={favoriteIds}
                />
            ))}
        </Box>
    );
};

export default ProductGrid;