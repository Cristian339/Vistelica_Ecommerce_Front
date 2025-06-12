'use client';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Typography, CircularProgress, Container, Divider } from "@mui/material";
import ProductCard from './ProductCard';
import { vistelicaColors } from '@/pages/shared-theme/vistelicaColors';
import { typography } from "@/pages/shared-theme/themePrimitives";

const SearchResults = memo(function SearchResults({ results, isLoading, searchQuery }) {
    // Contenido para lectores de pantalla
    const resultsCount = !isLoading ? `${results.length} productos encontrados` : '';
    const noResultsText = !isLoading && results.length === 0 ?
        `No se encontraron productos que coincidan con "${searchQuery}"` : '';

    return (
        <Container maxWidth="xl">
            <Box
                component="section"
                aria-label="Resultados de búsqueda"
                sx={{
                    py: { xs: 3, sm: 4, md: 5 },
                    px: { xs: 2, sm: 3 }
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        mb: 1,
                        color: vistelicaColors.primary,
                        fontFamily: typography.fontFamily,
                        fontWeight: 700,
                        fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
                        position: 'relative',
                        display: 'inline-block',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-8px',
                            left: 0,
                            width: '60%',
                            height: '4px',
                            backgroundColor: vistelicaColors.primary,
                            borderRadius: '2px'
                        }
                    }}
                >
                    Resultados de búsqueda
                </Typography>

                <Typography
                    variant="h6"
                    component="p"
                    sx={{
                        mb: 4,
                        mt: 2,
                        color: vistelicaColors.textSecondary,
                        fontFamily: typography.fontFamily,
                        fontStyle: 'italic',
                        fontSize: { xs: '1rem', sm: '1.1rem' }
                    }}
                >
                    Mostrando resultados para <Box component="span" sx={{ fontWeight: 600, color: vistelicaColors.secondary }}>&ldquo;{searchQuery}&rdquo;</Box>
                </Typography>

                <Divider sx={{
                    mb: 5,
                    borderColor: `${vistelicaColors.divider}80`,
                    '&::before, &::after': {
                        borderColor: `${vistelicaColors.divider}80`,
                    }
                }}/>

                {isLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mt: 8,
                            mb: 8,
                            gap: 3
                        }}
                        role="status"
                        aria-label="Cargando resultados"
                    >
                        <CircularProgress
                            size={60}
                            thickness={4}
                            sx={{ color: vistelicaColors.primary }}
                        />
                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: typography.fontFamily,
                                color: vistelicaColors.textSecondary,
                                fontWeight: 500
                            }}
                        >
                            Buscando productos...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Box
                            sx={{
                                mb: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                            role="status"
                            aria-live="polite"
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: typography.fontFamily,
                                    color: vistelicaColors.textSecondary,
                                    fontWeight: 500
                                }}
                            >
                                {resultsCount}
                            </Typography>
                        </Box>

                        <Grid
                            container
                            spacing={{ xs: 2, sm: 3 }}
                            role="feed"
                            aria-busy={isLoading}
                            aria-label="Lista de productos encontrados"
                        >
                            {results.map((product) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={product.product_id}>
                                    <ProductCard product={product} />
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

                {!isLoading && results.length === 0 && (
                    <Box
                        sx={{
                            textAlign: 'center',
                            mt: 6,
                            mb: 6,
                            py: 5,
                            px: 3,
                            border: `1px dashed ${vistelicaColors.divider}`,
                            borderRadius: '12px',
                            bgcolor: `${vistelicaColors.backgroundLight}50`
                        }}
                        role="status"
                        aria-live="polite"
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: vistelicaColors.textSecondary,
                                fontFamily: typography.fontFamily,
                                mb: 1
                            }}
                        >
                            No se encontraron resultados
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: vistelicaColors.textSecondary,
                                fontFamily: typography.fontFamily,
                                fontWeight: 400
                            }}
                        >
                            No se encontraron productos que coincidan con &ldquo;{searchQuery}&rdquo;
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
});

// Tipos de propiedades para validación
SearchResults.propTypes = {
    results: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    searchQuery: PropTypes.string.isRequired
};

export default SearchResults;