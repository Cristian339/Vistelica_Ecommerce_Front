import React from 'react';
import {
    Grid
} from '@mui/material';
import ProductCard from './ProductCard';

const ProductGrid = ({
                         products,
                         isProductInWishlist,
                         loadingWishlist,
                         toggleFavorite,
                         isMobile,
                         isTablet
                     }) => {
    return (
        <Grid container spacing={{ xs: 1, sm: 1 }}>
            {products.map((product) => (
                <Grid
                    item
                    xs={6}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    key={product.product_id}
                >
                    <ProductCard
                        product={product}
                        isFavorite={isProductInWishlist(product.product_id)}
                        isLoadingWishlist={loadingWishlist[product.product_id] || false}
                        onToggleFavorite={() => toggleFavorite(product.product_id, product)}
                        isMobile={isMobile}
                        isTablet={isTablet}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductGrid;