import React, { memo, useMemo } from 'react';
import {
    Box,
    Grid,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import ProductCard from './ProductCard';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";
// Eliminamos la importación que causa el error

const ProductGrid = memo(({
                              products,
                              isProductInWishlist,
                              loadingWishlist,
                              toggleFavorite,
                              isMobile,
                              isTablet
                          }) => {
    const theme = useTheme();

    // Breakpoints adicionales para mayor detalle
    const isExtraSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));

    // Configuración optimizada según dispositivo
    const gridConfig = useMemo(() => {
        if (isExtraSmall) return { xs: 12, spacing: 2, mb: 1 };
        if (isMobile) return { xs: 12, sm: 6, spacing: 2.5, mb: 1 };
        if (isTablet) return { xs: 12, sm: 6, md: 6, spacing: 3, mb: 1.5 };
        if (isLargeDesktop) return { xs: 12, sm: 6, md: 4, lg: 3, spacing: 3, mb: 2 };
        return { xs: 12, sm: 6, md: 6, spacing: 3, mb: 1.5 }; // Desktop por defecto
    }, [isExtraSmall, isMobile, isTablet, isLargeDesktop]);

    // Mensaje cuando no hay productos
    if (!products || products.length === 0) {
        return (
            <Box
                component="section"
                aria-label="Productos no disponibles"
                role="status"
                sx={{
                    textAlign: 'center',
                    py: 4,
                    px: 2,
                    backgroundColor: `${vistelicaColors.lightBackground}`,
                    borderRadius: '8px',
                    marginY: 3
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        color: vistelicaColors.textSecondary,
                        fontFamily: typography.fontFamily,
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                >
                    No hay productos disponibles para mostrar.
                </Typography>
            </Box>
        );
    }

    // Grid de productos optimizado
    return (
        <Grid
            container
            component="section"
            aria-label="Galería de productos"
            spacing={gridConfig.spacing}
            sx={{ mb: { xs: 4, sm: 5, md: 6 } }}
        >
            {products.map((product, index) => {
                const productId = product.product_id || product.id;

                if (!productId) return null;

                return (
                    <Grid
                        item
                        xs={gridConfig.xs}
                        sm={gridConfig.sm}
                        md={gridConfig.md}
                        lg={gridConfig.lg}
                        key={productId}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: gridConfig.mb
                        }}
                    >
                        <ProductCard
                            product={product}
                            isFavorite={isProductInWishlist(productId)}
                            isLoadingWishlist={loadingWishlist[productId] || false}
                            onToggleFavorite={() => toggleFavorite(productId, product)}
                            isMobile={isMobile}
                            isTablet={isTablet}
                            tabIndex={index + 1}
                            aria-posinset={index + 1}
                            aria-setsize={products.length}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
});

// Nombre explícito para herramientas de desarrollo
ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;