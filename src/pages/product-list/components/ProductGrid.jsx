import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
    if (!products || products.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography>No se encontraron productos con los filtros seleccionados.</Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {products.map((product, index) => (
                // Usa una combinación de índice y ID para garantizar unicidad
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id || `product-${index}`}>
                    <ProductCard product={product} />
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductGrid;