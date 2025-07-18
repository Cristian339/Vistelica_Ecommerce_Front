'use client';
import { Grid, Box, Typography, CircularProgress } from "@mui/material";
import ProductCard from './ProductCard';

export default function SearchResults({ results = [], isLoading, searchQuery }) {
    const hasResults = Array.isArray(results) && results.length > 0;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
                Resultados para &#34;{searchQuery}&#34;
            </Typography>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : hasResults ? (
                <Grid container spacing={3}>
                    {results.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
                    No se encontraron resultados para &#34;{searchQuery}&#34;
                </Typography>
            )}
        </Box>
    );
}
