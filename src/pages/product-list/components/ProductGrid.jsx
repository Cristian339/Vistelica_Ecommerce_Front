import React from 'react';
import { Box } from '@mui/material';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, gridView }) => {
    // Define el padding según el tipo de vista
    const itemPadding = gridView === 'grid2' ? '12px' : '4px';

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                width: '100%',
                margin: gridView === 'grid2' ? '-12px' : '-4px', // Compensar el padding
            }}
        >
            {Array.isArray(products) && products.map((product) => (
                <Box
                    key={product._id || `product-${Math.random()}`}
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
                    <ProductCard product={product} largeView={gridView === 'grid2'} />
                </Box>
            ))}
        </Box>
    );
};

export default ProductGrid;